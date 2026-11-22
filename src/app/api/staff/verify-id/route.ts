import { body, handle, json } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";
import { requireStaff, staffView } from "@/lib/staff/guard";

export const POST = handle(async (req: Request) => {
  const denied = await requireStaff();
  if (denied) return denied;
  const { memberId } = await body<{ memberId: string }>(req);
  await rewards().markIdVerified(String(memberId));
  return json({ member: await staffView(String(memberId)) });
});
