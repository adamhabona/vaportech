import { randomUUID } from "node:crypto";
import { body, fail, json } from "@/lib/api";
import { isStaff } from "@/lib/auth";
import { getClover, readMockOrders, writeMockOrders, type MockOrder } from "@/lib/clover";
import { processCloverOrder } from "@/lib/rewards/orders";
import { mocksAllowed } from "@/lib/test-mode";

/**
 * Register simulator for the mock Clover. Only in local dev or
 * REWARDS_TEST_MODE, and never when a real Clover merchant is configured.
 */
const CATALOG = [
  { name: "Raz TN9000", priceCents: 2499, category: "Disposable Vapes" },
  { name: "Geek Bar Pulse X", priceCents: 2299, category: "Disposable Vapes" },
  { name: "RAW Cones 6pk", priceCents: 599, category: "Rolling Papers" },
  { name: "Glass Spoon Pipe", priceCents: 1999, category: "Glass" },
  { name: "Delta-8 Gummies", priceCents: 2999, category: "Hemp" },
  { name: "Hookah Coals", priceCents: 899, category: "Hookah" },
  { name: "Kratom Capsules", priceCents: 2499, category: "Kratom" },
];

export async function POST(req: Request) {
  if (!mocksAllowed() || getClover().mode !== "mock") return fail("Not available.", 404);
  if (!(await isStaff())) return fail("Staff sign-in required.", 401);
  const b = await body<{ action: "create" | "pay"; orderId: string; items: number }>(req);
  const orders = await readMockOrders();

  if (b.action === "create") {
    const count = Math.max(1, Math.min(4, Number(b.items) || 2));
    const start = Math.floor(Math.random() * CATALOG.length);
    const lines = Array.from({ length: count }, (_, i) => CATALOG[(start + i) % CATALOG.length]);
    const order: MockOrder = { id: `MOCK${randomUUID().slice(0, 8).toUpperCase()}`, createdTime: Date.now(), lines, discounts: [], state: "open" };
    orders.push(order);
    await writeMockOrders(orders);
    return json({ order });
  }

  if (b.action === "pay") {
    const o = orders.find((x) => x.id === b.orderId);
    if (!o) return fail("No such order.", 404);
    o.state = "paid";
    await writeMockOrders(orders);
    return json({ result: await processCloverOrder(o.id) });
  }
  return fail("Unknown action.");
}
