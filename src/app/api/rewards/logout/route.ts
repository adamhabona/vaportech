import { clearMemberSession } from "@/lib/auth";
import { json } from "@/lib/api";

export async function POST() {
  await clearMemberSession();
  return json({ ok: true });
}
