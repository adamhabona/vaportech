import { body, handle, json } from "@/lib/api";
import { applyCoupon } from "@/lib/rewards/orders";
import { requireStaff, staffView } from "@/lib/staff/guard";

export const POST = handle(async (req: Request) => {
  const denied = await requireStaff();
  if (denied) return denied;
  const { memberId, couponId, orderId } = await body<{ memberId: string; couponId: string; orderId: string | null }>(req);
  const coupon = await applyCoupon(String(memberId), String(couponId), orderId ? String(orderId) : null);
  return json({ coupon, member: await staffView(String(memberId)) });
});
