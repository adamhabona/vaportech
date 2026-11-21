import "server-only";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Clover REST client (v3). Uses a merchant API token from a private Clover app.
 * When CLOVER_* env vars are missing in development, a file-backed mock with
 * the same shape is used so the whole counter flow can be exercised locally.
 */

export interface CloverOrderSummary {
  id: string;
  createdTime: number;
  /** Pre-tax subtotal of line items minus discounts, cents. */
  subtotalCents: number;
  totalCents: number;
  itemCount: number;
  title: string;
  state: string;
}

export interface CloverPaidOrder {
  id: string;
  paid: boolean;
  /** Pre-tax amount paid, cents (tips excluded). */
  spendCents: number;
  createdTime: number;
  categories: string[];
  customerIds: string[];
  customerPhones: string[];
}

export interface CloverClient {
  mode: "live" | "mock";
  listOpenOrders(): Promise<CloverOrderSummary[]>;
  getOrderSummary(orderId: string): Promise<CloverOrderSummary | null>;
  getPaidOrder(orderId: string): Promise<CloverPaidOrder | null>;
  addDiscount(orderId: string, name: string, amountCents: number): Promise<void>;
}

/* ---------------- live ---------------- */

interface RawLineItem {
  price?: number;
  unitQty?: number;
  isRevenue?: boolean;
  refunded?: boolean;
  item?: { id?: string };
  name?: string;
}

interface RawOrder {
  id: string;
  total?: number;
  state?: string;
  title?: string;
  paymentState?: string;
  createdTime?: number;
  lineItems?: { elements?: RawLineItem[] };
  discounts?: { elements?: { amount?: number; percentage?: number }[] };
  payments?: { elements?: { amount?: number; taxAmount?: number; result?: string }[] };
  customers?: { elements?: { id: string; phoneNumbers?: { elements?: { phoneNumber?: string }[] } }[] };
}

function lineSubtotal(order: RawOrder): number {
  const lines = order.lineItems?.elements ?? [];
  let sum = 0;
  for (const li of lines) {
    if (li.refunded) continue;
    const qty = li.unitQty ? li.unitQty / 1000 : 1;
    sum += Math.round((li.price ?? 0) * qty);
  }
  for (const d of order.discounts?.elements ?? []) {
    if (d.amount) sum += d.amount; // Clover discount amounts are negative
    else if (d.percentage) sum -= Math.round((sum * d.percentage) / 100);
  }
  return Math.max(0, sum);
}

function summarize(order: RawOrder): CloverOrderSummary {
  const lines = order.lineItems?.elements ?? [];
  return {
    id: order.id,
    createdTime: order.createdTime ?? 0,
    subtotalCents: lineSubtotal(order),
    totalCents: order.total ?? 0,
    itemCount: lines.length,
    title: order.title || lines.slice(0, 2).map((l) => l.name).filter(Boolean).join(", ") || "Order",
    state: order.state ?? "",
  };
}

class LiveClover implements CloverClient {
  mode = "live" as const;

  constructor(
    private base: string,
    private merchantId: string,
    private token: string,
  ) {}

  private async req<T>(pathname: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}/v3/merchants/${this.merchantId}${pathname}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`clover ${res.status} ${pathname}: ${await res.text()}`);
    return (await res.json()) as T;
  }

  async listOpenOrders() {
    const qs = new URLSearchParams({ filter: "state=open", orderBy: "createdTime DESC", limit: "8", expand: "lineItems,discounts" });
    const data = await this.req<{ elements?: RawOrder[] }>(`/orders?${qs}`);
    return (data.elements ?? []).map(summarize);
  }

  async getOrderSummary(orderId: string) {
    try {
      return summarize(await this.req<RawOrder>(`/orders/${orderId}?expand=lineItems,discounts`));
    } catch {
      return null;
    }
  }

  async getPaidOrder(orderId: string): Promise<CloverPaidOrder | null> {
    const order = await this.req<RawOrder>(
      `/orders/${orderId}?expand=lineItems,discounts,payments,customers,customers.phoneNumbers`,
    );
    const payments = (order.payments?.elements ?? []).filter((p) => !p.result || p.result === "SUCCESS");
    const paid = order.paymentState === "PAID" || order.state === "locked";
    const spendCents = payments.length
      ? payments.reduce((s, p) => s + (p.amount ?? 0) - (p.taxAmount ?? 0), 0)
      : lineSubtotal(order);

    const itemIds = [...new Set((order.lineItems?.elements ?? []).map((l) => l.item?.id).filter(Boolean))].slice(0, 12) as string[];
    const categories = new Set<string>();
    await Promise.all(
      itemIds.map(async (id) => {
        try {
          const item = await this.req<{ categories?: { elements?: { name?: string }[] } }>(`/items/${id}?expand=categories`);
          for (const c of item.categories?.elements ?? []) if (c.name) categories.add(c.name);
        } catch {
          /* item deleted or no access: skip */
        }
      }),
    );

    const customers = order.customers?.elements ?? [];
    return {
      id: order.id,
      paid,
      spendCents: Math.max(0, spendCents),
      createdTime: order.createdTime ?? Date.now(),
      categories: [...categories],
      customerIds: customers.map((c) => c.id),
      customerPhones: customers.flatMap((c) => (c.phoneNumbers?.elements ?? []).map((p) => p.phoneNumber ?? "").filter(Boolean)),
    };
  }

  async addDiscount(orderId: string, name: string, amountCents: number) {
    await this.req(`/orders/${orderId}/discounts`, {
      method: "POST",
      body: JSON.stringify({ name, amount: -Math.abs(amountCents) }),
    });
  }
}

/* ---------------- mock ---------------- */

export interface MockOrder {
  id: string;
  createdTime: number;
  lines: { name: string; priceCents: number; category: string }[];
  discounts: { name: string; amountCents: number }[];
  state: "open" | "paid";
}

const MOCK_FILE = path.join(process.env.REWARDS_DATA_DIR || path.join(os.tmpdir(), "vaportech-rewards"), "clover-mock.json");

export async function readMockOrders(): Promise<MockOrder[]> {
  try {
    return JSON.parse(await fs.readFile(MOCK_FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function writeMockOrders(orders: MockOrder[]) {
  await fs.mkdir(path.dirname(MOCK_FILE), { recursive: true });
  await fs.writeFile(MOCK_FILE, JSON.stringify(orders, null, 2));
}

function mockSubtotal(o: MockOrder) {
  const gross = o.lines.reduce((s, l) => s + l.priceCents, 0);
  return Math.max(0, gross - o.discounts.reduce((s, d) => s + d.amountCents, 0));
}

function mockSummary(o: MockOrder): CloverOrderSummary {
  const sub = mockSubtotal(o);
  return {
    id: o.id,
    createdTime: o.createdTime,
    subtotalCents: sub,
    totalCents: Math.round(sub * 1.07),
    itemCount: o.lines.length,
    title: o.lines.map((l) => l.name).slice(0, 2).join(", ") || "Order",
    state: o.state,
  };
}

class MockClover implements CloverClient {
  mode = "mock" as const;

  async listOpenOrders() {
    return (await readMockOrders()).filter((o) => o.state === "open").sort((a, b) => b.createdTime - a.createdTime).map(mockSummary);
  }
  async getOrderSummary(orderId: string) {
    const o = (await readMockOrders()).find((x) => x.id === orderId);
    return o ? mockSummary(o) : null;
  }
  async getPaidOrder(orderId: string) {
    const o = (await readMockOrders()).find((x) => x.id === orderId);
    if (!o) return null;
    return {
      id: o.id,
      paid: o.state === "paid",
      spendCents: mockSubtotal(o),
      createdTime: o.createdTime,
      categories: [...new Set(o.lines.map((l) => l.category))],
      customerIds: [],
      customerPhones: [],
    };
  }
  async addDiscount(orderId: string, name: string, amountCents: number) {
    const orders = await readMockOrders();
    const o = orders.find((x) => x.id === orderId);
    if (!o) throw new Error("mock order not found");
    o.discounts.push({ name, amountCents: Math.abs(amountCents) });
    await writeMockOrders(orders);
  }
}

let client: CloverClient | null = null;

export function getClover(): CloverClient {
  if (client) return client;
  const { CLOVER_API_BASE, CLOVER_MERCHANT_ID, CLOVER_API_TOKEN } = process.env;
  if (CLOVER_MERCHANT_ID && CLOVER_API_TOKEN) {
    client = new LiveClover(CLOVER_API_BASE || "https://api.clover.com", CLOVER_MERCHANT_ID, CLOVER_API_TOKEN);
  } else {
    if (process.env.NODE_ENV === "production" && !process.env.REWARDS_ALLOW_MOCKS) {
      throw new Error("Clover: CLOVER_MERCHANT_ID and CLOVER_API_TOKEN are required in production");
    }
    client = new MockClover();
  }
  return client;
}
