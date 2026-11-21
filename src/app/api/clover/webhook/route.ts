import { timingSafeEqual } from "node:crypto";
import { after } from "next/server";
import { json } from "@/lib/api";
import { processCloverOrder } from "@/lib/rewards/orders";

/**
 * Clover webhook. Setup in the Clover developer dashboard:
 *   URL https://<site>/api/clover/webhook, subscribe to Orders.
 *   Clover first POSTs a verificationCode: it is logged here so it can be
 *   pasted back into the dashboard. Then put the dashboard's auth code in
 *   CLOVER_WEBHOOK_AUTH; every delivery carries it in X-Clover-Auth.
 */

interface CloverWebhook {
  verificationCode?: string;
  appId?: string;
  merchants?: Record<string, { objectId: string; type: string; ts: number }[]>;
}

function authorized(req: Request) {
  const expected = process.env.CLOVER_WEBHOOK_AUTH;
  if (!expected) return process.env.NODE_ENV !== "production";
  const got = req.headers.get("x-clover-auth") ?? "";
  const a = Buffer.from(got);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  let payload: CloverWebhook;
  try {
    payload = (await req.json()) as CloverWebhook;
  } catch {
    return json({ error: "bad json" }, 400);
  }

  if (payload.verificationCode) {
    console.log(`[clover] webhook verification code: ${payload.verificationCode}`);
    return json({ ok: true });
  }
  if (!authorized(req)) return json({ error: "unauthorized" }, 401);

  const merchantId = process.env.CLOVER_MERCHANT_ID;
  const orderIds = new Set<string>();
  for (const [mId, events] of Object.entries(payload.merchants ?? {})) {
    if (merchantId && mId !== merchantId) continue;
    for (const ev of events) {
      if (ev.objectId?.startsWith("O:") && ev.type !== "DELETE") orderIds.add(ev.objectId.slice(2));
    }
  }

  // Ack fast; Clover retries slow endpoints.
  after(async () => {
    for (const id of orderIds) {
      try {
        const res = await processCloverOrder(id);
        if (res.status === "awarded") console.log(`[clover] order ${id}: +${res.points} pts`);
      } catch (e) {
        console.error(`[clover] order ${id} failed`, e);
      }
    }
  });
  return json({ ok: true, orders: orderIds.size });
}
