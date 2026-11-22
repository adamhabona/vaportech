import "server-only";
import { promises as fs } from "node:fs";
import http2 from "node:http2";
import path from "node:path";
import { PKPass } from "passkit-generator";
import { BUSINESS } from "@/lib/business";
import { getRepo } from "@/lib/rewards";
import { qrPayload, siteUrl, type PassData } from "./shared";

/**
 * Apple Wallet store card + PassKit web service push.
 *
 * Env (PEM strings; literal "\n" sequences are accepted):
 *   APPLE_PASS_TYPE_ID      e.g. pass.com.vaportechusa.rewards
 *   APPLE_TEAM_ID
 *   APPLE_PASS_CERT         signer certificate (PEM)
 *   APPLE_PASS_KEY          signer private key (PEM)
 *   APPLE_PASS_KEY_PASSPHRASE (optional)
 *   APPLE_WWDR_CERT         Apple WWDR G4 intermediate (PEM)
 */

const pem = (v?: string) => v?.replace(/\\n/g, "\n");

export function appleConfig() {
  const e = process.env;
  if (!e.APPLE_PASS_TYPE_ID || !e.APPLE_TEAM_ID || !e.APPLE_PASS_CERT || !e.APPLE_PASS_KEY || !e.APPLE_WWDR_CERT) return null;
  return {
    passTypeId: e.APPLE_PASS_TYPE_ID,
    teamId: e.APPLE_TEAM_ID,
    cert: pem(e.APPLE_PASS_CERT)!,
    key: pem(e.APPLE_PASS_KEY)!,
    passphrase: e.APPLE_PASS_KEY_PASSPHRASE,
    wwdr: pem(e.APPLE_WWDR_CERT)!,
  };
}

let images: Record<string, Buffer> | null = null;
async function loadImages() {
  if (images) return images;
  const dir = path.join(process.cwd(), "public", "wallet");
  const names = ["icon.png", "icon@2x.png", "icon@3x.png", "logo.png", "logo@2x.png", "logo@3x.png"];
  const entries = await Promise.all(names.map(async (n) => [n, await fs.readFile(path.join(dir, n))] as const));
  images = Object.fromEntries(entries);
  return images;
}

export async function buildApplePass(data: PassData): Promise<Buffer> {
  const cfg = appleConfig();
  if (!cfg) throw new Error("Apple Wallet is not configured");

  const passJson = {
    formatVersion: 1,
    passTypeIdentifier: cfg.passTypeId,
    teamIdentifier: cfg.teamId,
    serialNumber: data.memberId,
    organizationName: BUSINESS.name,
    description: "VaporTech Rewards card",
    logoText: "VaporTech Rewards",
    foregroundColor: "rgb(255, 255, 255)",
    labelColor: "rgb(161, 161, 170)",
    backgroundColor: "rgb(10, 10, 12)",
    webServiceURL: `${siteUrl()}/api/wallet/apple`,
    authenticationToken: data.walletAuthToken,
    sharingProhibited: true,
    locations: [
      {
        latitude: BUSINESS.geo.lat,
        longitude: BUSINESS.geo.lng,
        relevantText: "You're at VaporTech. Show this at the counter to check in and spin.",
      },
    ],
    maxDistance: 150,
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: qrPayload(data.qrToken),
        messageEncoding: "iso-8859-1",
        altText: data.referralCode,
      },
    ],
    storeCard: {
      headerFields: [{ key: "points", label: "POINTS", value: data.points, changeMessage: "You now have %@ points" }],
      primaryFields: [{ key: "tier", label: "TIER", value: data.tierName, changeMessage: "You reached %@ tier" }],
      secondaryFields: [
        { key: "name", label: "MEMBER", value: data.name },
        { key: "streak", label: "STREAK", value: `${data.streakWeeks} wk` },
      ],
      auxiliaryFields: [
        { key: "next", label: "NEXT", value: data.nextTierLine },
        { key: "coupons", label: "REWARDS READY", value: data.couponCount, changeMessage: "You have %@ rewards ready" },
      ],
      backFields: [
        { key: "code", label: "Your invite code", value: data.referralCode },
        {
          key: "invite",
          label: "Invite friends",
          value: `${siteUrl()}/r/${data.referralCode}\nWhen a friend joins with your link and makes their first $20+ purchase, you get 250 points and they get 100.`,
        },
        { key: "manage", label: "Your rewards", value: `${siteUrl()}/rewards/me` },
        { key: "store", label: "Store", value: `${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}\n${BUSINESS.telephone}` },
        { key: "terms", label: "Terms", value: `21+ only. Rewards are discounts on purchases or VaporTech merch and have no cash value. Full rules: ${siteUrl()}/rewards/rules` },
      ],
    },
  };

  const pass = new PKPass(
    { ...(await loadImages()), "pass.json": Buffer.from(JSON.stringify(passJson)) },
    { wwdr: cfg.wwdr, signerCert: cfg.cert, signerKey: cfg.key, signerKeyPassphrase: cfg.passphrase },
  );
  return pass.getAsBuffer();
}

/** Tells every device holding this member's pass to fetch a fresh copy. */
export async function pushAppleUpdate(memberId: string) {
  const cfg = appleConfig();
  if (!cfg) return;
  const regs = await getRepo().listWalletRegistrationsBySerial(memberId);
  if (regs.length === 0) return;

  const session = http2.connect("https://api.push.apple.com:443", { cert: cfg.cert, key: cfg.key, passphrase: cfg.passphrase });
  try {
    await Promise.all(
      [...new Set(regs.map((r) => r.pushToken))].map(
        (token) =>
          new Promise<void>((resolve) => {
            const req = session.request({
              ":method": "POST",
              ":path": `/3/device/${token}`,
              "apns-topic": cfg.passTypeId,
              "content-type": "application/json",
            });
            req.on("response", (headers) => {
              const status = Number(headers[":status"]);
              if (status !== 200) console.warn("[wallet] apns status", status);
            });
            req.on("error", (e) => {
              console.warn("[wallet] apns error", e);
              resolve();
            });
            req.on("close", () => resolve());
            req.end("{}");
          }),
      ),
    );
  } finally {
    session.close();
  }
}
