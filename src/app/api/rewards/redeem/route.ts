import { getMemberId } from "@/lib/auth";
import { body, fail, handle, json } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";

export const POST = handle(async (req: Request) => {
  const memberId = await getMemberId();
  if (!memberId) return fail("Sign in first.", 401);
  const { rewardId } = await body<{ rewardId: string }>(req);
  const coupon = await rewards().redeem(memberId, String(rewardId ?? ""));
  return json({ coupon });
});
