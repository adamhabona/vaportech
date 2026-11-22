import "server-only";
import { isStaff } from "@/lib/auth";
import { fail } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";
import { publicMember } from "@/lib/rewards/types";

/** Returns a 401 Response when the counter device isn't signed in. */
export async function requireStaff(): Promise<Response | null> {
  return (await isStaff()) ? null : fail("Staff sign-in required.", 401, "staff_required");
}

/** Member summary safe to send to the counter screen (no secrets). */
export async function staffView(memberId: string) {
  const s = await rewards().summary(memberId);
  if (!s) return null;
  return { ...s, member: publicMember(s.member) };
}

export type StaffMemberView = NonNullable<Awaited<ReturnType<typeof staffView>>>;
