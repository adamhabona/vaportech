/**
 * Pure game logic. No I/O here so every rule is unit tested.
 */
import {
  BADGES,
  MIN_AGE,
  POINTS,
  SPIN_PRIZES,
  SPIN_WEIGHTS,
  STORE_TIME_ZONE,
  THRESHOLDS,
  TIERS,
  type BadgeId,
  type SpinPrize,
  type Tier,
} from "./config";
import type { LedgerEntry, Visit } from "./types";

const DAY_MS = 86_400_000;

/* ---------- time ---------- */

function zonedParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { y: get("year"), m: get("month"), d: get("day"), h: Number(get("hour")) };
}

/** Store-local calendar day, YYYY-MM-DD. */
export function localDay(date: Date = new Date()): string {
  const { y, m, d } = zonedParts(date);
  return `${y}-${m}-${d}`;
}

/** Store-local hour, 0 to 23. */
export function localHour(date: Date = new Date()): number {
  return zonedParts(date).h;
}

function dayToUtc(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Monday of the week containing `day`, as YYYY-MM-DD. */
export function weekKey(day: string): string {
  const t = dayToUtc(day);
  const dow = new Date(t).getUTCDay(); // 0 Sun
  const offset = (dow + 6) % 7; // days since Monday
  return new Date(t - offset * DAY_MS).toISOString().slice(0, 10);
}

function prevWeek(week: string): string {
  return new Date(dayToUtc(week) - 7 * DAY_MS).toISOString().slice(0, 10);
}

/* ---------- streaks ---------- */

export interface StreakInfo {
  /** Consecutive weeks with a visit, ending this week or last week. */
  current: number;
  best: number;
  /** True when this week already has a visit. */
  thisWeekDone: boolean;
  /** Week key where the current streak started (null when current is 0). */
  startedWeek: string | null;
}

export function computeStreak(visitDays: string[], today: string): StreakInfo {
  const weeks = new Set(visitDays.map(weekKey));
  const thisWeek = weekKey(today);
  const thisWeekDone = weeks.has(thisWeek);

  let cursor = thisWeekDone ? thisWeek : prevWeek(thisWeek);
  let current = 0;
  let startedWeek: string | null = null;
  while (weeks.has(cursor)) {
    current += 1;
    startedWeek = cursor;
    cursor = prevWeek(cursor);
  }

  const sorted = [...weeks].sort();
  let best = 0;
  let run = 0;
  let last: string | null = null;
  for (const w of sorted) {
    run = last !== null && prevWeek(w) === last ? run + 1 : 1;
    best = Math.max(best, run);
    last = w;
  }

  return { current, best: Math.max(best, current), thisWeekDone, startedWeek };
}

/** Streak milestones reached by `current` that still need awarding for this streak run. */
export function streakMilestonesDue(streak: StreakInfo, awardedRefs: Set<string>) {
  if (!streak.startedWeek) return [];
  return POINTS.streakMilestones
    .filter((m) => streak.current >= m.weeks)
    .map((m) => ({ ...m, ref: `streak:${m.weeks}:${streak.startedWeek}` }))
    .filter((m) => !awardedRefs.has(m.ref));
}

/* ---------- points + tiers ---------- */

export function balance(ledger: LedgerEntry[]): number {
  return ledger.reduce((sum, e) => sum + e.points, 0);
}

/** Points EARNED (not spent) over the trailing 365 days. Drives tier. */
export function earnedLast12Months(ledger: LedgerEntry[], now: Date = new Date()): number {
  const cutoff = now.getTime() - 365 * DAY_MS;
  return ledger
    .filter((e) => e.points > 0 && new Date(e.createdAt).getTime() >= cutoff)
    .reduce((sum, e) => sum + e.points, 0);
}

export function tierFor(earned: number): Tier {
  let tier = TIERS[0];
  for (const t of TIERS) if (earned >= t.threshold) tier = t;
  return tier;
}

export interface TierProgress {
  tier: Tier;
  next: Tier | null;
  earned: number;
  /** 0 to 1 progress toward next tier (1 at top tier). */
  progress: number;
  pointsToNext: number;
}

export function tierProgress(earned: number): TierProgress {
  const tier = tierFor(earned);
  const idx = TIERS.findIndex((t) => t.id === tier.id);
  const next = TIERS[idx + 1] ?? null;
  if (!next) return { tier, next, earned, progress: 1, pointsToNext: 0 };
  const span = next.threshold - tier.threshold;
  return {
    tier,
    next,
    earned,
    progress: Math.min(1, (earned - tier.threshold) / span),
    pointsToNext: next.threshold - earned,
  };
}

/** Points for a purchase. `spendCents` is the pre-tax amount. */
export function purchasePoints(spendCents: number, tier: Tier): number {
  if (spendCents <= 0) return 0;
  return Math.floor((spendCents / 100) * POINTS.perDollar * tier.multiplier);
}

/* ---------- badges ---------- */

export interface BadgeInput {
  visits: Visit[];
  completedReferrals: number;
  bestStreak: number;
  hitTopSpin: boolean;
  owned: Set<BadgeId>;
}

export function badgesEarned(input: BadgeInput): BadgeId[] {
  const { visits, completedReferrals, bestStreak, hitTopSpin, owned } = input;
  const purchases = visits.filter((v) => v.kind === "purchase");
  const visitDays = new Set(visits.map((v) => v.day));
  const categories = new Set(purchases.flatMap((v) => v.categories.map((c) => c.toLowerCase())));
  const nightOwl = visits.some((v) => localHour(new Date(v.at)) >= THRESHOLDS.nightOwlHour);

  const rules: Record<BadgeId, boolean> = {
    first_puff: purchases.length > 0,
    regular: visitDays.size >= THRESHOLDS.regularVisits,
    plug: completedReferrals >= THRESHOLDS.plugReferrals,
    connector: completedReferrals >= THRESHOLDS.connectorReferrals,
    streak_4: bestStreak >= 4,
    streak_8: bestStreak >= 8,
    streak_12: bestStreak >= 12,
    night_owl: nightOwl,
    explorer: categories.size >= THRESHOLDS.explorerCategories,
    lucky: hitTopSpin,
  };

  return BADGES.map((b) => b.id).filter((id) => rules[id] && !owned.has(id));
}

/* ---------- spin ---------- */

export const TOP_SPIN_PRIZES = new Set(["p100", "c10", "m1"]);

/** Weighted pick. `rand` returns [0, 1). */
export function pickSpinPrize(tier: Tier, rand: () => number): SpinPrize {
  const weights = SPIN_WEIGHTS[tier.id];
  const total = SPIN_PRIZES.reduce((s, p) => s + (weights[p.id] ?? 0), 0);
  let roll = rand() * total;
  for (const prize of SPIN_PRIZES) {
    roll -= weights[prize.id] ?? 0;
    if (roll < 0) return prize;
  }
  return SPIN_PRIZES[0];
}

/* ---------- identity helpers ---------- */

/** Normalizes a US phone number to E.164, or null if invalid. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const ten = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (ten.length !== 10) return null;
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(ten)) return null;
  return `+1${ten}`;
}

export function formatPhone(e164: string): string {
  const d = e164.replace(/\D/g, "").slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function ageOn(dob: string, today: string): number {
  const [by, bm, bd] = dob.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  let age = ty - by;
  if (tm < bm || (tm === bm && td < bd)) age -= 1;
  return age;
}

export function isOfAge(dob: string, today: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return false;
  const age = ageOn(dob, today);
  return age >= MIN_AGE && age < 120;
}

/** Unambiguous alphabet (no 0/O/1/I/L). */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function randomCode(length: number, rand: () => number = Math.random): string {
  let out = "";
  for (let i = 0; i < length; i++) out += CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)];
  return out;
}

export function displayName(firstName: string, lastName: string): string {
  const initial = lastName.trim().charAt(0).toUpperCase();
  return initial ? `${firstName.trim()} ${initial}.` : firstName.trim();
}
