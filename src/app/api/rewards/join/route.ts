import { cookies } from "next/headers";
import { clearVerifiedPhone, getVerifiedPhone, REF_COOKIE, setMemberSession } from "@/lib/auth";
import { body, fail, handle, json } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";

interface JoinBody {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  emailOptIn: boolean;
  agree: boolean;
  ref: string;
}

export const POST = handle(async (req: Request) => {
  const phone = await getVerifiedPhone();
  if (!phone) return fail("Your phone verification expired. Start again.", 401, "phone_expired");
  const b = await body<JoinBody>(req);
  if (!b.agree) return fail("Please accept the program rules to join.");
  const email = (b.email ?? "").trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("That email doesn't look right.");

  const jar = await cookies();
  const referralCode = (b.ref || jar.get(REF_COOKIE)?.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "") || null;

  const { member, referred } = await rewards().join({
    phone,
    firstName: b.firstName ?? "",
    lastName: b.lastName ?? "",
    dob: b.dob ?? "",
    email: email || null,
    emailOptIn: Boolean(b.emailOptIn),
    referralCode,
  });
  await clearVerifiedPhone();
  jar.delete(REF_COOKIE);
  await setMemberSession(member.id);
  return json({ ok: true, referred });
});
