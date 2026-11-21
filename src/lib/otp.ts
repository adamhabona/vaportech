import "server-only";

/**
 * One-time login codes via Twilio Verify. The SMS body is Twilio's standard
 * "Your verification code is ..." template, with no product content, which
 * keeps it clear of carrier tobacco/vape content filtering.
 *
 * Without TWILIO_* env in development, code 123456 is accepted and logged.
 */

const DEV_CODE = "123456";

const attempts = new Map<string, number[]>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_SENDS = 5;

function rateLimited(phone: string) {
  const now = Date.now();
  const recent = (attempts.get(phone) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_SENDS) return true;
  recent.push(now);
  attempts.set(phone, recent);
  return false;
}

function twilio() {
  const { TWILIO_ACCOUNT_SID: sid, TWILIO_AUTH_TOKEN: tokenValue, TWILIO_VERIFY_SERVICE_SID: service } = process.env;
  if (sid && tokenValue && service) return { sid, token: tokenValue, service };
  if (process.env.NODE_ENV === "production" && !process.env.REWARDS_ALLOW_MOCKS) {
    throw new Error("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_VERIFY_SERVICE_SID are required in production");
  }
  return null;
}

async function call(path: string, body: Record<string, string>) {
  const t = twilio()!;
  const res = await fetch(`https://verify.twilio.com/v2/Services/${t.service}/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${t.sid}:${t.token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(body),
  });
  const json = (await res.json()) as { status?: string; message?: string };
  if (!res.ok) throw new Error(json.message || `twilio ${res.status}`);
  return json;
}

export type SendResult = { ok: true; dev: boolean } | { ok: false; error: string };

export async function sendCode(phone: string): Promise<SendResult> {
  if (rateLimited(phone)) return { ok: false, error: "Too many codes requested. Try again in an hour." };
  if (!twilio()) {
    console.log(`[otp] dev mode: code for ${phone} is ${DEV_CODE}`);
    return { ok: true, dev: true };
  }
  try {
    await call("Verifications", { To: phone, Channel: "sms" });
    return { ok: true, dev: false };
  } catch (e) {
    console.error("[otp] send failed", e);
    return { ok: false, error: "We couldn't text that number. Check it and try again." };
  }
}

export async function checkCode(phone: string, code: string): Promise<boolean> {
  if (!/^\d{4,10}$/.test(code)) return false;
  if (!twilio()) return code === DEV_CODE;
  try {
    const res = await call("VerificationCheck", { To: phone, Code: code });
    return res.status === "approved";
  } catch {
    return false;
  }
}
