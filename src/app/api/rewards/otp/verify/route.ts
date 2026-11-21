import { setMemberSession, setVerifiedPhone } from "@/lib/auth";
import { body, fail, handle, json, limited } from "@/lib/api";
import { getRepo } from "@/lib/rewards";
import { normalizePhone } from "@/lib/rewards/engine";
import { checkCode } from "@/lib/otp";

export const POST = handle(async (req: Request) => {
  const { phone: raw, code } = await body<{ phone: string; code: string }>(req);
  const phone = normalizePhone(raw ?? "");
  if (!phone) return fail("Enter a valid US mobile number.");
  if (limited(`otp-check:${phone}`, 8, 15 * 60 * 1000)) return fail("Too many tries. Request a new code in a few minutes.", 429);
  if (!(await checkCode(phone, String(code ?? "").trim()))) return fail("That code didn't match. Try again.", 401);

  const member = await getRepo().getMemberByPhone(phone);
  if (member) {
    await setMemberSession(member.id);
    return json({ status: "member" });
  }
  await setVerifiedPhone(phone);
  return json({ status: "new" });
});
