import { checkStaffPin, setStaffSession } from "@/lib/auth";
import { body, clientIp, fail, handle, json, limited } from "@/lib/api";

export const POST = handle(async (req: Request) => {
  if (limited(`staff-pin:${clientIp(req)}`, 8, 15 * 60 * 1000)) return fail("Too many attempts. Wait 15 minutes.", 429);
  const { pin } = await body<{ pin: string }>(req);
  if (!checkStaffPin(String(pin ?? ""))) return fail("Wrong PIN.", 401);
  await setStaffSession();
  return json({ ok: true });
});
