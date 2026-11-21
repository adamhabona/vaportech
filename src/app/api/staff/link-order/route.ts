import { body, handle, json } from "@/lib/api";
import { linkOrder } from "@/lib/rewards/orders";
import { requireStaff } from "@/lib/staff/guard";

export const POST = handle(async (req: Request) => {
  const denied = await requireStaff();
  if (denied) return denied;
  const { memberId, orderId } = await body<{ memberId: string; orderId: string }>(req);
  await linkOrder(String(memberId), String(orderId));
  return json({ ok: true });
});
