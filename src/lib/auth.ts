import "server-only";
import { timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export const MEMBER_COOKIE = "vt_member";
export const PHONE_COOKIE = "vt_phone";
export const STAFF_COOKIE = "vt_staff";
export const REF_COOKIE = "vt_ref";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    if (process.env.NODE_ENV === "production") throw new Error("SESSION_SECRET is required in production");
    return new TextEncoder().encode("dev-only-session-secret-change-me-please");
  }
  return new TextEncoder().encode(s);
}

type Kind = "member" | "phone" | "staff";

async function sign(kind: Kind, sub: string, maxAgeSec: number) {
  return new SignJWT({ k: kind })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(secret());
}

async function verify(kind: Kind, jwt: string | undefined): Promise<string | null> {
  if (!jwt) return null;
  try {
    const { payload } = await jwtVerify(jwt, secret(), { algorithms: ["HS256"] });
    return payload.k === kind && typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

const MEMBER_MAX_AGE = 60 * 60 * 24 * 90;
const PHONE_MAX_AGE = 60 * 15;
const STAFF_MAX_AGE = 60 * 60 * 14;

export async function setMemberSession(memberId: string) {
  (await cookies()).set(MEMBER_COOKIE, await sign("member", memberId, MEMBER_MAX_AGE), { ...base, maxAge: MEMBER_MAX_AGE });
}

export async function getMemberId() {
  return verify("member", (await cookies()).get(MEMBER_COOKIE)?.value);
}

export async function clearMemberSession() {
  (await cookies()).delete(MEMBER_COOKIE);
}

/** Proof that the visitor just verified this phone by SMS code. */
export async function setVerifiedPhone(phone: string) {
  (await cookies()).set(PHONE_COOKIE, await sign("phone", phone, PHONE_MAX_AGE), { ...base, maxAge: PHONE_MAX_AGE });
}

export async function getVerifiedPhone() {
  return verify("phone", (await cookies()).get(PHONE_COOKIE)?.value);
}

export async function clearVerifiedPhone() {
  (await cookies()).delete(PHONE_COOKIE);
}

export function checkStaffPin(pin: string) {
  const expected = process.env.STAFF_PIN || (process.env.NODE_ENV === "production" ? "" : "2468");
  if (!expected) return false;
  const a = Buffer.from(pin.padEnd(32).slice(0, 32));
  const b = Buffer.from(expected.padEnd(32).slice(0, 32));
  return pin.length === expected.length && timingSafeEqual(a, b);
}

export async function setStaffSession() {
  (await cookies()).set(STAFF_COOKIE, await sign("staff", "counter", STAFF_MAX_AGE), { ...base, maxAge: STAFF_MAX_AGE });
}

export async function isStaff() {
  return (await verify("staff", (await cookies()).get(STAFF_COOKIE)?.value)) !== null;
}

export async function clearStaffSession() {
  (await cookies()).delete(STAFF_COOKIE);
}
