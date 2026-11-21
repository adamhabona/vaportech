/**
 * Every tunable number in VaporTech Rewards lives here.
 *
 * Compliance notes that shape these values:
 * - 21 CFR 1140.16(d) bans free samples of tobacco products (e-cigs included),
 *   so every reward is money off WITH a purchase (minSpendCents) or
 *   non-tobacco merch. No reward may take a nicotine product to $0.
 * - Spins are earned by checking in, never by buying (Fla. Stat. 849.094
 *   game promotion rules). Keep total prize value well under $5,000.
 */

export const STORE_TIME_ZONE = "America/New_York";

export const MIN_AGE = 21;

export const POINTS = {
  /** Points per whole dollar of pre-tax spend, before tier multiplier. */
  perDollar: 1,
  signupBonus: 50,
  checkInBonus: 10,
  referral: {
    referrerBonus: 250,
    refereeBonus: 100,
    /** Friend's first purchase must reach this (pre-tax) to count. */
    qualifyingSpendCents: 2000,
    /** Completed referrals that earn points per calendar month (anti-abuse). */
    monthlyCap: 20,
  },
  streakMilestones: [
    { weeks: 4, bonus: 100 },
    { weeks: 8, bonus: 250 },
    { weeks: 12, bonus: 500 },
  ],
} as const;

export type TierId = "cloud" | "haze" | "fog" | "vapor";

export interface Tier {
  id: TierId;
  name: string;
  /** Points earned over the trailing 12 months needed to hold this tier. */
  threshold: number;
  multiplier: number;
  perks: string[];
  color: string;
}

export const TIERS: Tier[] = [
  {
    id: "cloud",
    name: "Cloud",
    threshold: 0,
    multiplier: 1,
    perks: ["1 point per $1", "A spin every day you visit", "Streak and friend bonuses"],
    color: "#cbd5e1",
  },
  {
    id: "haze",
    name: "Haze",
    threshold: 500,
    multiplier: 1.25,
    perks: ["1.25 points per $1", "Better spin odds"],
    color: "#7dd3fc",
  },
  {
    id: "fog",
    name: "Fog",
    threshold: 1500,
    multiplier: 1.5,
    perks: ["1.5 points per $1", "Even better spin odds"],
    color: "#c4b5fd",
  },
  {
    id: "vapor",
    name: "Vapor",
    threshold: 4000,
    multiplier: 2,
    perks: ["2 points per $1", "Best spin odds"],
    color: "#f0abfc",
  },
];

export type CouponKind = "amount_off" | "merch";

export interface RewardDef {
  id: string;
  name: string;
  kind: CouponKind;
  /** For amount_off: cents taken off the order. */
  amountCents?: number;
  /** Order pre-tax subtotal needed before the discount applies. */
  minSpendCents?: number;
  /** Points cost when redeemed from the catalog. */
  cost?: number;
  /** Days until an issued coupon expires. */
  expiresInDays: number;
}

/** Catalog of rewards members can buy with points. */
export const REWARD_CATALOG: RewardDef[] = [
  { id: "off5", name: "$5 off a $25+ purchase", kind: "amount_off", amountCents: 500, minSpendCents: 2500, cost: 250, expiresInDays: 60 },
  { id: "merch_lighter", name: "VaporTech lighter", kind: "merch", cost: 300, expiresInDays: 60 },
  { id: "off10", name: "$10 off a $40+ purchase", kind: "amount_off", amountCents: 1000, minSpendCents: 4000, cost: 500, expiresInDays: 60 },
  { id: "merch_hat", name: "VaporTech hat", kind: "merch", cost: 900, expiresInDays: 60 },
  { id: "off25", name: "$25 off a $75+ purchase", kind: "amount_off", amountCents: 2500, minSpendCents: 7500, cost: 1000, expiresInDays: 60 },
];

export type SpinPrize =
  | { id: string; label: string; type: "points"; points: number }
  | { id: string; label: string; type: "coupon"; reward: RewardDef };

/** Wheel slices in display order. Weights per tier are below. */
export const SPIN_PRIZES: SpinPrize[] = [
  { id: "p10", label: "+10 pts", type: "points", points: 10 },
  { id: "c2", label: "$2 off", type: "coupon", reward: { id: "spin_off2", name: "$2 off a $15+ purchase", kind: "amount_off", amountCents: 200, minSpendCents: 1500, expiresInDays: 14 } },
  { id: "p25", label: "+25 pts", type: "points", points: 25 },
  { id: "c5", label: "$5 off", type: "coupon", reward: { id: "spin_off5", name: "$5 off a $30+ purchase", kind: "amount_off", amountCents: 500, minSpendCents: 3000, expiresInDays: 14 } },
  { id: "p50", label: "+50 pts", type: "points", points: 50 },
  { id: "m1", label: "Lighter", type: "coupon", reward: { id: "spin_lighter", name: "Free VaporTech lighter", kind: "merch", expiresInDays: 30 } },
  { id: "p100", label: "+100 pts", type: "points", points: 100 },
  { id: "c10", label: "$10 off", type: "coupon", reward: { id: "spin_off10", name: "$10 off a $50+ purchase", kind: "amount_off", amountCents: 1000, minSpendCents: 5000, expiresInDays: 14 } },
];

/** Relative weights per slice id, per tier. Higher tiers shift toward bigger prizes. */
export const SPIN_WEIGHTS: Record<TierId, Record<string, number>> = {
  cloud: { p10: 40, c2: 20, p25: 20, c5: 6, p50: 8, m1: 3, p100: 2, c10: 1 },
  haze: { p10: 32, c2: 20, p25: 22, c5: 8, p50: 10, m1: 4, p100: 3, c10: 1 },
  fog: { p10: 24, c2: 20, p25: 22, c5: 10, p50: 12, m1: 5, p100: 5, c10: 2 },
  vapor: { p10: 16, c2: 18, p25: 22, c5: 12, p50: 15, m1: 6, p100: 8, c10: 3 },
};

export type BadgeId =
  | "first_puff"
  | "regular"
  | "plug"
  | "connector"
  | "streak_4"
  | "streak_8"
  | "streak_12"
  | "night_owl"
  | "explorer"
  | "lucky";

export interface BadgeDef {
  id: BadgeId;
  name: string;
  description: string;
  /** Key into the badge icon map in the UI. */
  icon: string;
}

export const BADGES: BadgeDef[] = [
  { id: "first_puff", name: "First Puff", description: "Made your first purchase as a member", icon: "wind" },
  { id: "regular", name: "Regular", description: "Visited 10 times", icon: "id-card" },
  { id: "plug", name: "The Plug", description: "Brought in 3 friends who bought", icon: "plug" },
  { id: "connector", name: "Connector", description: "Brought in 10 friends who bought", icon: "network" },
  { id: "streak_4", name: "Month Strong", description: "4 week visit streak", icon: "flame" },
  { id: "streak_8", name: "Locked In", description: "8 week visit streak", icon: "zap" },
  { id: "streak_12", name: "Season Pass", description: "12 week visit streak", icon: "crown" },
  { id: "night_owl", name: "Night Owl", description: "Visited after 9 PM", icon: "moon" },
  { id: "explorer", name: "Explorer", description: "Bought from 5 different categories", icon: "compass" },
  { id: "lucky", name: "Lucky Spin", description: "Hit a top prize on the wheel", icon: "clover" },
];

export const THRESHOLDS = {
  regularVisits: 10,
  plugReferrals: 3,
  connectorReferrals: 10,
  nightOwlHour: 21,
  explorerCategories: 5,
} as const;
