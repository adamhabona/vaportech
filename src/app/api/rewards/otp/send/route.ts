import { body, clientIp, fail, handle, json, limited } from "@/lib/api";
import { normalizePhone } from "@/lib/rewards/engine";
import { sendCode } from "@/lib/otp";

export const POST = handle(async (req: Request) => {
  if (limited(`otp-ip:${clientIp(req)}`, 15, 60 * 60 * 1000)) return fail("Too many requests. Try again later.", 429);
  const { phone: raw } = await body<{ phone: string }>(req);
  const phone = normalizePhone(raw ?? "");
  if (!phone) return fail("Enter a valid US mobile number.");
  const res = await sendCode(phone);
  if (!res.ok) return fail(res.error, 429);
  return json({ ok: true, dev: res.dev });
});
