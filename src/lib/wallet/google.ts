import "server-only";
import { importPKCS8, SignJWT } from "jose";
import { BUSINESS } from "@/lib/business";
import { qrPayload, siteUrl, type PassData } from "./shared";

/**
 * Google Wallet loyalty card.
 *
 * Env:
 *   GOOGLE_WALLET_ISSUER_ID
 *   GOOGLE_WALLET_SA_EMAIL        service account client_email
 *   GOOGLE_WALLET_SA_PRIVATE_KEY  service account private_key (PEM, "\n" escapes ok)
 */

export function googleConfig() {
  const e = process.env;
  if (!e.GOOGLE_WALLET_ISSUER_ID || !e.GOOGLE_WALLET_SA_EMAIL || !e.GOOGLE_WALLET_SA_PRIVATE_KEY) return null;
  return {
    issuerId: e.GOOGLE_WALLET_ISSUER_ID,
    email: e.GOOGLE_WALLET_SA_EMAIL,
    privateKey: e.GOOGLE_WALLET_SA_PRIVATE_KEY.replace(/\\n/g, "\n"),
  };
}

type Cfg = NonNullable<ReturnType<typeof googleConfig>>;

const classId = (cfg: Cfg) => `${cfg.issuerId}.vaportech_rewards`;
const objectId = (cfg: Cfg, memberId: string) => `${cfg.issuerId}.${memberId.replace(/[^\w.-]/g, "_")}`;

function loyaltyClass(cfg: Cfg) {
  return {
    id: classId(cfg),
    issuerName: BUSINESS.name,
    programName: "VaporTech Rewards",
    programLogo: { sourceUri: { uri: `${siteUrl()}/wallet/google-logo.png` }, contentDescription: { defaultValue: { language: "en-US", value: "VaporTech" } } },
    hexBackgroundColor: "#0a0a0c",
    reviewStatus: "UNDER_REVIEW",
    countryCode: "US",
    locations: [{ latitude: BUSINESS.geo.lat, longitude: BUSINESS.geo.lng }],
  };
}

function loyaltyObject(cfg: Cfg, d: PassData) {
  return {
    id: objectId(cfg, d.memberId),
    classId: classId(cfg),
    state: "ACTIVE",
    accountId: d.referralCode,
    accountName: d.name,
    loyaltyPoints: { label: "Points", balance: { int: d.points } },
    secondaryLoyaltyPoints: { label: "Tier", balance: { string: d.tierName } },
    barcode: { type: "QR_CODE", value: qrPayload(d.qrToken), alternateText: d.referralCode },
    textModulesData: [
      { id: "streak", header: "Visit streak", body: `${d.streakWeeks} week${d.streakWeeks === 1 ? "" : "s"}` },
      { id: "next", header: "Next tier", body: d.nextTierLine },
      { id: "invite", header: "Invite friends", body: `${siteUrl()}/r/${d.referralCode}: they get 100 pts, you get 250 when they buy.` },
    ],
    linksModuleData: { uris: [{ id: "me", uri: `${siteUrl()}/rewards/me`, description: "Open your rewards" }] },
  };
}

async function key(cfg: Cfg) {
  return importPKCS8(cfg.privateKey, "RS256");
}

/** "Add to Google Wallet" link. Creates the class + object on first save. */
export async function googleSaveUrl(d: PassData): Promise<string> {
  const cfg = googleConfig();
  if (!cfg) throw new Error("Google Wallet is not configured");
  const jwt = await new SignJWT({
    typ: "savetowallet",
    origins: [siteUrl()],
    payload: { loyaltyClasses: [loyaltyClass(cfg)], loyaltyObjects: [loyaltyObject(cfg, d)] },
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(cfg.email)
    .setAudience("google")
    .setIssuedAt()
    .sign(await key(cfg));
  return `https://pay.google.com/gp/v/save/${jwt}`;
}

let cachedToken: { value: string; exp: number } | null = null;

async function accessToken(cfg: Cfg) {
  if (cachedToken && cachedToken.exp > Date.now() + 60_000) return cachedToken.value;
  const assertion = await new SignJWT({ scope: "https://www.googleapis.com/auth/wallet_object.issuer" })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(cfg.email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(await key(cfg));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`google token ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { value: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return json.access_token;
}

/** Pushes fresh points/tier to the saved card. No-op if never saved. */
export async function pushGoogleUpdate(d: PassData) {
  const cfg = googleConfig();
  if (!cfg) return;
  const obj = loyaltyObject(cfg, d);
  const res = await fetch(`https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${encodeURIComponent(obj.id)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${await accessToken(cfg)}`, "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  if (!res.ok && res.status !== 404) console.warn("[wallet] google patch", res.status, await res.text());
}
