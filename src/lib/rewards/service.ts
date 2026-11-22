/**
 * Rewards use cases. Every write that awards points goes through the ledger
 * with an idempotency ref, so retries (webhook redelivery, double taps) are safe.
 */
import { randomBytes, randomUUID } from "node:crypto";
import {
  BADGES,
  POINTS,
  REWARD_CATALOG,
  SPIN_PRIZES,
  type RewardDef,
  type SpinPrize,
} from "./config";
import {
  badgesEarned,
  balance,
  computeStreak,
  displayName,
  earnedLast12Months,
  isOfAge,
  localDay,
  pickSpinPrize,
  purchasePoints,
  randomCode,
  streakMilestonesDue,
  tierFor,
  tierProgress,
  TOP_SPIN_PRIZES,
} from "./engine";
import type { Repo } from "./repo";
import type { Coupon, LedgerEntry, LedgerReason, Member } from "./types";

export class RewardsError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

const token = (bytes = 24) => randomBytes(bytes).toString("base64url");
const secureRand = () => randomBytes(4).readUInt32BE() / 0x1_0000_0000;
const nowIso = (now: Date) => now.toISOString();

type Notify = (member: Member) => void | Promise<void>;

export interface ServiceDeps {
  repo: Repo;
  /** Called after any change that should refresh wallet passes. */
  notify?: Notify;
  rand?: () => number;
}

/** Per-member in-process lock so double taps can't overspend points. */
const locks = new Map<string, Promise<unknown>>();
function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const run = prev.then(fn, fn);
  const tail = run.catch(() => undefined);
  locks.set(key, tail);
  tail.then(() => {
    if (locks.get(key) === tail) locks.delete(key);
  });
  return run;
}

export function createRewardsService({ repo, notify, rand = secureRand }: ServiceDeps) {
  async function award(memberId: string, points: number, reason: LedgerReason, ref: string, note: string, now: Date) {
    const entry: LedgerEntry = { id: randomUUID(), memberId, points, reason, ref, note, createdAt: nowIso(now) };
    return repo.addLedger(entry);
  }

  async function touch(memberId: string, now: Date) {
    const m = await repo.updateMember(memberId, { updatedAt: nowIso(now) });
    if (notify) await Promise.resolve(notify(m)).catch((e) => console.error("[rewards] notify failed", e));
    return m;
  }

  async function issueCoupon(memberId: string, reward: RewardDef, source: Coupon["source"], now: Date): Promise<Coupon> {
    const coupon: Coupon = {
      id: randomUUID(),
      memberId,
      rewardId: reward.id,
      name: reward.name,
      kind: reward.kind,
      amountCents: reward.amountCents ?? null,
      minSpendCents: reward.minSpendCents ?? null,
      source,
      status: "active",
      code: randomCode(6, secureRand),
      createdAt: nowIso(now),
      expiresAt: new Date(now.getTime() + reward.expiresInDays * 86_400_000).toISOString(),
      usedAt: null,
      orderId: null,
    };
    await repo.addCoupon(coupon);
    return coupon;
  }

  /** Streak milestones + badges. Safe to call any time. */
  async function progress(memberId: string, now: Date) {
    const [visits, ledger, owned, referrals, spins] = await Promise.all([
      repo.listVisits(memberId),
      repo.listLedger(memberId),
      repo.listBadges(memberId),
      repo.listReferralsByReferrer(memberId),
      repo.listSpins(memberId),
    ]);
    const today = localDay(now);
    const streak = computeStreak(visits.map((v) => v.day), today);
    const awardedRefs = new Set(ledger.map((e) => e.ref));
    for (const m of streakMilestonesDue(streak, awardedRefs)) {
      await award(memberId, m.bonus, "streak", m.ref, `${m.weeks} week streak`, now);
    }
    const newBadges = badgesEarned({
      visits,
      completedReferrals: referrals.filter((r) => r.status === "completed").length,
      bestStreak: streak.best,
      hitTopSpin: spins.some((s) => TOP_SPIN_PRIZES.has(s.prizeId)),
      owned: new Set(owned.map((b) => b.badgeId)),
    });
    for (const badgeId of newBadges) await repo.addBadge({ memberId, badgeId, earnedAt: nowIso(now) });
    return newBadges;
  }

  return {
    async join(input: {
      phone: string;
      firstName: string;
      lastName: string;
      dob: string;
      email?: string | null;
      emailOptIn?: boolean;
      referralCode?: string | null;
      now?: Date;
    }): Promise<{ member: Member; referred: boolean }> {
      const now = input.now ?? new Date();
      const firstName = input.firstName.trim().slice(0, 40);
      const lastName = input.lastName.trim().slice(0, 40);
      if (!firstName || !lastName) throw new RewardsError("name_required", "First and last name are required.");
      if (!isOfAge(input.dob, localDay(now))) {
        throw new RewardsError("underage", "VaporTech Rewards is for adults 21 and over.", 403);
      }
      const existing = await repo.getMemberByPhone(input.phone);
      if (existing) return { member: existing, referred: false };

      let member: Member | null = null;
      for (let attempt = 0; attempt < 5 && !member; attempt++) {
        const candidate: Member = {
          id: randomUUID(),
          phone: input.phone,
          firstName,
          lastName,
          email: input.email?.trim() || null,
          dob: input.dob,
          referralCode: `${firstName.replace(/[^a-z]/gi, "").slice(0, 5).toUpperCase() || "VAPOR"}${randomCode(3, secureRand)}`,
          qrToken: token(),
          walletAuthToken: token(),
          cloverCustomerId: null,
          idVerifiedAt: null,
          emailOptIn: Boolean(input.emailOptIn),
          createdAt: nowIso(now),
          updatedAt: nowIso(now),
        };
        try {
          member = await repo.createMember(candidate);
        } catch (e) {
          if ((e as Error).message === "phone_taken") return { member: (await repo.getMemberByPhone(input.phone))!, referred: false };
          if ((e as Error).message !== "code_taken") throw e;
        }
      }
      if (!member) throw new RewardsError("join_failed", "Could not create your account. Try again.", 500);

      await award(member.id, POINTS.signupBonus, "signup", `signup:${member.id}`, "Welcome bonus", now);

      let referred = false;
      if (input.referralCode) {
        const referrer = await repo.getMemberByReferralCode(input.referralCode);
        if (referrer && referrer.id !== member.id && referrer.phone !== member.phone) {
          await repo.createReferral({
            id: randomUUID(),
            referrerId: referrer.id,
            refereeId: member.id,
            status: "pending",
            createdAt: nowIso(now),
            completedAt: null,
            orderId: null,
          });
          referred = true;
        }
      }
      return { member, referred };
    },

    async checkIn(memberId: string, now = new Date()) {
      return withLock(memberId, async () => {
        const member = await repo.getMember(memberId);
        if (!member) throw new RewardsError("not_found", "Member not found.", 404);
        const day = localDay(now);
        const visits = await repo.listVisits(memberId);
        if (visits.some((v) => v.kind === "checkin" && v.day === day)) {
          return { alreadyCheckedIn: true, points: 0, newBadges: [] as string[] };
        }
        await repo.addVisit({ id: randomUUID(), memberId, kind: "checkin", day, at: nowIso(now), orderId: null, spendCents: null, categories: [] });
        await award(memberId, POINTS.checkInBonus, "checkin", `checkin:${memberId}:${day}`, "Store check-in", now);
        const newBadges = await progress(memberId, now);
        await touch(memberId, now);
        return { alreadyCheckedIn: false, points: POINTS.checkInBonus, newBadges };
      });
    },

    async spin(memberId: string, now = new Date()): Promise<{ prize: SpinPrize; index: number; coupon: Coupon | null }> {
      return withLock(memberId, async () => {
        const day = localDay(now);
        const [visits, ledger] = await Promise.all([repo.listVisits(memberId), repo.listLedger(memberId)]);
        if (!visits.some((v) => v.day === day)) {
          throw new RewardsError("no_checkin", "Check in at the counter today to unlock your spin.", 403);
        }
        const tier = tierFor(earnedLast12Months(ledger, now));
        const prize = pickSpinPrize(tier, rand);
        const ok = await repo.addSpin({ id: randomUUID(), memberId, day, prizeId: prize.id, createdAt: nowIso(now) });
        if (!ok) throw new RewardsError("already_spun", "You already spun today. Come back tomorrow.", 409);

        let coupon: Coupon | null = null;
        if (prize.type === "points") {
          await award(memberId, prize.points, "spin", `spin:${memberId}:${day}`, `Spin: ${prize.label}`, now);
        } else {
          coupon = await issueCoupon(memberId, prize.reward, "spin", now);
        }
        await progress(memberId, now);
        await touch(memberId, now);
        return { prize, index: SPIN_PRIZES.findIndex((p) => p.id === prize.id), coupon };
      });
    },

    async redeem(memberId: string, rewardId: string, now = new Date()) {
      return withLock(memberId, async () => {
        const reward = REWARD_CATALOG.find((r) => r.id === rewardId);
        if (!reward || !reward.cost) throw new RewardsError("bad_reward", "That reward isn't available.");
        const pts = balance(await repo.listLedger(memberId));
        if (pts < reward.cost) throw new RewardsError("insufficient", `You need ${reward.cost - pts} more points.`, 409);
        const coupon = await issueCoupon(memberId, reward, "redeem", now);
        await award(memberId, -reward.cost, "redeem", `redeem:${coupon.id}`, reward.name, now);
        await touch(memberId, now);
        return coupon;
      });
    },

    /** Called once per paid Clover order. Idempotent on orderId. */
    async recordPurchase(input: { orderId: string; memberId: string; spendCents: number; categories: string[]; at: Date; now?: Date }) {
      const now = input.now ?? new Date();
      const { memberId, orderId } = input;
      return withLock(memberId, async () => {
        const ledger = await repo.listLedger(memberId);
        if (ledger.some((e) => e.ref === `purchase:${orderId}`)) return { duplicate: true, points: 0, referralCompleted: false };

        const tier = tierFor(earnedLast12Months(ledger, now));
        const points = purchasePoints(input.spendCents, tier);
        await award(memberId, points, "purchase", `purchase:${orderId}`, `Purchase $${(input.spendCents / 100).toFixed(2)}${tier.multiplier > 1 ? ` (${tier.multiplier}x ${tier.name})` : ""}`, now);
        await repo.addVisit({
          id: randomUUID(),
          memberId,
          kind: "purchase",
          day: localDay(input.at),
          at: nowIso(input.at),
          orderId,
          spendCents: input.spendCents,
          categories: input.categories,
        });

        let referralCompleted = false;
        const referral = await repo.getReferralByReferee(memberId);
        if (referral && referral.status === "pending" && input.spendCents >= POINTS.referral.qualifyingSpendCents) {
          const monthStart = `${localDay(now).slice(0, 7)}-01T00:00:00.000Z`;
          const counts = await repo.referralCountsSince(monthStart);
          const referrerCount = counts.find((c) => c.referrerId === referral.referrerId)?.count ?? 0;
          const capped = referrerCount >= POINTS.referral.monthlyCap;
          await repo.updateReferral(referral.id, { status: capped ? "capped" : "completed", completedAt: nowIso(now), orderId });
          await award(memberId, POINTS.referral.refereeBonus, "referral_referee", `referral:${referral.id}:referee`, "Joined through a friend", now);
          if (!capped) {
            const friend = await repo.getMember(memberId);
            await award(
              referral.referrerId,
              POINTS.referral.referrerBonus,
              "referral_referrer",
              `referral:${referral.id}:referrer`,
              `${friend ? displayName(friend.firstName, friend.lastName) : "A friend"} made their first purchase`,
              now,
            );
            await progress(referral.referrerId, now);
            await touch(referral.referrerId, now);
          }
          referralCompleted = !capped;
        }

        await progress(memberId, now);
        await touch(memberId, now);
        return { duplicate: false, points, referralCompleted };
      });
    },

    async summary(memberId: string, now = new Date()) {
      const member = await repo.getMember(memberId);
      if (!member) return null;
      const [ledger, visits, owned, coupons, referrals, spins] = await Promise.all([
        repo.listLedger(memberId),
        repo.listVisits(memberId),
        repo.listBadges(memberId),
        repo.listCoupons(memberId),
        repo.listReferralsByReferrer(memberId),
        repo.listSpins(memberId),
      ]);
      const today = localDay(now);
      const earned = earnedLast12Months(ledger, now);
      const ownedMap = new Map(owned.map((b) => [b.badgeId, b.earnedAt]));
      const spunToday = spins.find((s) => s.day === today) ?? null;
      const nowMs = now.getTime();
      return {
        member,
        points: balance(ledger),
        tier: tierProgress(earned),
        streak: computeStreak(visits.map((v) => v.day), today),
        visitCount: new Set(visits.map((v) => v.day)).size,
        isFirstVisit: !member.idVerifiedAt,
        checkedInToday: visits.some((v) => v.kind === "checkin" && v.day === today),
        visitedToday: visits.some((v) => v.day === today),
        spunToday: spunToday ? SPIN_PRIZES.find((p) => p.id === spunToday.prizeId) ?? null : null,
        badges: BADGES.map((b) => ({ ...b, earnedAt: ownedMap.get(b.id) ?? null })),
        coupons: coupons
          .filter((c) => c.status === "active" && new Date(c.expiresAt).getTime() > nowMs)
          .sort((a, b) => a.expiresAt.localeCompare(b.expiresAt)),
        referrals: {
          pending: referrals.filter((r) => r.status === "pending").length,
          completed: referrals.filter((r) => r.status === "completed").length,
        },
        history: [...ledger].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 25),
      };
    },

    async leaderboard(now = new Date(), limit = 10) {
      const monthStart = `${localDay(now).slice(0, 7)}-01T00:00:00.000Z`;
      const counts = (await repo.referralCountsSince(monthStart)).sort((a, b) => b.count - a.count).slice(0, limit);
      const rows = await Promise.all(
        counts.map(async (c) => {
          const m = await repo.getMember(c.referrerId);
          return { memberId: c.referrerId, displayName: m ? displayName(m.firstName, m.lastName) : "Member", referrals: c.count };
        }),
      );
      return rows;
    },

    async markIdVerified(memberId: string, now = new Date()) {
      return repo.updateMember(memberId, { idVerifiedAt: nowIso(now) });
    },

    progress,
  };
}

export type RewardsService = ReturnType<typeof createRewardsService>;
export type MemberSummary = NonNullable<Awaited<ReturnType<RewardsService["summary"]>>>;
