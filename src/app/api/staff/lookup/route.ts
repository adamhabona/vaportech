import { body, fail, handle, json } from "@/lib/api";
import { getRepo } from "@/lib/rewards";
import { normalizePhone } from "@/lib/rewards/engine";
import { requireStaff, staffView } from "@/lib/staff/guard";
import { parseQrPayload } from "@/lib/wallet/shared";

export const POST = handle(async (req: Request) => {
  const denied = await requireStaff();
  if (denied) return denied;
  const { qr, phone, memberId } = await body<{ qr: string; phone: string; memberId: string }>(req);
  const repo = getRepo();

  let member = null;
  if (memberId) member = await repo.getMember(memberId);
  else if (qr) {
    const token = parseQrPayload(qr);
    member = token ? await repo.getMemberByQrToken(token) : null;
  } else if (phone) {
    const p = normalizePhone(phone);
    member = p ? await repo.getMemberByPhone(p) : null;
  }
  if (!member) return fail("No member found. They can join at the rewards poster QR.", 404);
  return json(await staffView(member.id));
});
