import "server-only";
import { BUSINESS } from "@/lib/business";
import type { MemberSummary } from "@/lib/rewards/service";

export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || BUSINESS.url).replace(/\/$/, "");

/** What the member QR encodes. The staff scanner accepts this or a raw token. */
export const qrPayload = (qrToken: string) => `VT1:${qrToken}`;

export function parseQrPayload(text: string): string | null {
  const t = text.trim();
  if (t.startsWith("VT1:")) return t.slice(4);
  return /^[A-Za-z0-9_-]{20,64}$/.test(t) ? t : null;
}

export interface PassData {
  memberId: string;
  name: string;
  points: number;
  tierName: string;
  tierColor: string;
  nextTierLine: string;
  streakWeeks: number;
  referralCode: string;
  qrToken: string;
  walletAuthToken: string;
  couponCount: number;
  updatedAt: string;
}

export function toPassData(s: MemberSummary): PassData {
  const { member, tier } = s;
  return {
    memberId: member.id,
    name: `${member.firstName} ${member.lastName}`,
    points: s.points,
    tierName: tier.tier.name,
    tierColor: tier.tier.color,
    nextTierLine: tier.next ? `${tier.pointsToNext} pts to ${tier.next.name}` : "Top tier",
    streakWeeks: s.streak.current,
    referralCode: member.referralCode,
    qrToken: member.qrToken,
    walletAuthToken: member.walletAuthToken,
    couponCount: s.coupons.length,
    updatedAt: member.updatedAt,
  };
}
