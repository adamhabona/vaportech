import type { BadgeId, CouponKind } from "./config";

export interface Member {
  id: string;
  /** E.164, e.g. +17542415367. Unique. */
  phone: string;
  firstName: string;
  lastName: string;
  email: string | null;
  /** YYYY-MM-DD */
  dob: string;
  referralCode: string;
  /** Opaque token encoded in the member QR. Rotatable. */
  qrToken: string;
  /** Secret for Apple Wallet web service auth. */
  walletAuthToken: string;
  cloverCustomerId: string | null;
  idVerifiedAt: string | null;
  emailOptIn: boolean;
  createdAt: string;
  /** Bumped on any change that should refresh wallet passes. */
  updatedAt: string;
}

export type LedgerReason =
  | "signup"
  | "purchase"
  | "checkin"
  | "referral_referrer"
  | "referral_referee"
  | "streak"
  | "spin"
  | "redeem"
  | "adjust";

export interface LedgerEntry {
  id: string;
  memberId: string;
  points: number;
  reason: LedgerReason;
  /** Idempotency key. Unique across the ledger. */
  ref: string;
  note: string;
  createdAt: string;
}

export interface Visit {
  id: string;
  memberId: string;
  kind: "checkin" | "purchase";
  /** Store-local day, YYYY-MM-DD */
  day: string;
  at: string;
  orderId: string | null;
  spendCents: number | null;
  categories: string[];
}

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  status: "pending" | "completed" | "capped";
  createdAt: string;
  completedAt: string | null;
  orderId: string | null;
}

export interface MemberBadge {
  memberId: string;
  badgeId: BadgeId;
  earnedAt: string;
}

export interface Spin {
  id: string;
  memberId: string;
  day: string;
  prizeId: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  memberId: string;
  rewardId: string;
  name: string;
  kind: CouponKind;
  amountCents: number | null;
  minSpendCents: number | null;
  source: "spin" | "redeem";
  status: "active" | "used" | "expired";
  /** Short human code the cashier can key in. */
  code: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  orderId: string | null;
}

export interface OrderLink {
  orderId: string;
  memberId: string;
  createdAt: string;
  processedAt: string | null;
}

export interface WalletRegistration {
  deviceId: string;
  pushToken: string;
  serial: string;
  passTypeId: string;
  createdAt: string;
}

export interface LeaderboardRow {
  memberId: string;
  displayName: string;
  referrals: number;
}

export type PublicMember = Omit<Member, "walletAuthToken" | "qrToken">;

/** Member without secrets, safe to send to a browser. */
export function publicMember(m: Member): PublicMember {
  const { walletAuthToken, qrToken, ...rest } = m;
  void walletAuthToken;
  void qrToken;
  return rest;
}
