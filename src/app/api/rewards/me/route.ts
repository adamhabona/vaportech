import { getMemberId } from "@/lib/auth";
import { fail, handle, json } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";
import { publicMember } from "@/lib/rewards/types";

export const GET = handle(async () => {
  const memberId = await getMemberId();
  if (!memberId) return fail("Sign in first.", 401);
  const summary = await rewards().summary(memberId);
  if (!summary) return fail("Member not found.", 404);
  return json({ ...summary, member: publicMember(summary.member) });
});
