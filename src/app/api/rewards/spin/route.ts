import { getMemberId } from "@/lib/auth";
import { fail, handle, json } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";

export const POST = handle(async () => {
  const memberId = await getMemberId();
  if (!memberId) return fail("Sign in first.", 401);
  const { prize, index, coupon } = await rewards().spin(memberId);
  return json({ prize, index, coupon });
});
