import { beforeEach, describe, expect, it } from "vitest";
import { FileRepo } from "@/lib/rewards/file-repo";
import { createRewardsService, RewardsError } from "@/lib/rewards/service";

const NOW = new Date("2026-11-20T18:00:00Z");

function setup(rand = () => 0) {
  const repo = new FileRepo(null);
  const notified: string[] = [];
  const svc = createRewardsService({ repo, rand, notify: (m) => void notified.push(m.id) });
  return { repo, svc, notified };
}

const join = (svc: ReturnType<typeof setup>["svc"], phone: string, referralCode?: string) =>
  svc.join({ phone, firstName: "Sam", lastName: "Rivera", dob: "1995-04-02", referralCode, now: NOW });

describe("rewards service", () => {
  let ctx: ReturnType<typeof setup>;
  beforeEach(() => {
    ctx = setup();
  });

  it("blocks under 21", async () => {
    await expect(ctx.svc.join({ phone: "+15555550100", firstName: "A", lastName: "B", dob: "2008-01-01", now: NOW })).rejects.toBeInstanceOf(RewardsError);
  });

  it("gives a signup bonus once and returns the existing member on rejoin", async () => {
    const { member } = await join(ctx.svc, "+15555550101");
    const again = await join(ctx.svc, "+15555550101");
    expect(again.member.id).toBe(member.id);
    const s = await ctx.svc.summary(member.id, NOW);
    expect(s?.points).toBe(50);
  });

  it("check-in is once per day and unlocks one spin", async () => {
    const { member } = await join(ctx.svc, "+15555550102");
    await expect(ctx.svc.spin(member.id, NOW)).rejects.toMatchObject({ code: "no_checkin" });
    const first = await ctx.svc.checkIn(member.id, NOW);
    const second = await ctx.svc.checkIn(member.id, NOW);
    expect(first.points).toBe(10);
    expect(second.alreadyCheckedIn).toBe(true);
    const spin = await ctx.svc.spin(member.id, NOW);
    expect(spin.prize.id).toBe("p10"); // rand() = 0 picks the first slice
    await expect(ctx.svc.spin(member.id, NOW)).rejects.toMatchObject({ code: "already_spun" });
    const s = await ctx.svc.summary(member.id, NOW);
    expect(s?.points).toBe(50 + 10 + 10);
    expect(ctx.notified.length).toBeGreaterThan(0);
  });

  it("completes a referral on the friend's qualifying first purchase, once", async () => {
    const { member: referrer } = await join(ctx.svc, "+15555550103");
    const { member: friend, referred } = await join(ctx.svc, "+15555550104", referrer.referralCode);
    expect(referred).toBe(true);

    const small = await ctx.svc.recordPurchase({ orderId: "O1", memberId: friend.id, spendCents: 900, categories: [], at: NOW, now: NOW });
    expect(small.referralCompleted).toBe(false);

    const big = await ctx.svc.recordPurchase({ orderId: "O2", memberId: friend.id, spendCents: 3000, categories: ["Disposables"], at: NOW, now: NOW });
    expect(big.referralCompleted).toBe(true);

    const dup = await ctx.svc.recordPurchase({ orderId: "O2", memberId: friend.id, spendCents: 3000, categories: [], at: NOW, now: NOW });
    expect(dup.duplicate).toBe(true);

    const r = await ctx.svc.summary(referrer.id, NOW);
    expect(r?.points).toBe(50 + 250);
    expect(r?.referrals.completed).toBe(1);
    const f = await ctx.svc.summary(friend.id, NOW);
    expect(f?.points).toBe(50 + 9 + 30 + 100);
    expect(f?.badges.find((b) => b.id === "first_puff")?.earnedAt).toBeTruthy();

    const board = await ctx.svc.leaderboard(NOW);
    expect(board[0]).toMatchObject({ memberId: referrer.id, displayName: "Sam R.", referrals: 1 });
  });

  it("ignores self referral codes", async () => {
    const { member } = await join(ctx.svc, "+15555550105");
    const again = await ctx.svc.join({ phone: "+15555550105", firstName: "Sam", lastName: "R", dob: "1995-04-02", referralCode: member.referralCode, now: NOW });
    expect(again.referred).toBe(false);
  });

  it("redeems points for a coupon and refuses overspend, even on double tap", async () => {
    const { member } = await join(ctx.svc, "+15555550106");
    await ctx.svc.recordPurchase({ orderId: "O3", memberId: member.id, spendCents: 25000, categories: [], at: NOW, now: NOW });
    // balance: 50 + 250 = 300 → only one $5 (250) fits
    const results = await Promise.allSettled([ctx.svc.redeem(member.id, "off5", NOW), ctx.svc.redeem(member.id, "off5", NOW)]);
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    const s = await ctx.svc.summary(member.id, NOW);
    expect(s?.points).toBe(50);
    expect(s?.coupons).toHaveLength(1);
    expect(s?.coupons[0].minSpendCents).toBe(2500);
  });

  it("awards a 4 week streak bonus once", async () => {
    const { member } = await join(ctx.svc, "+15555550107");
    for (const d of ["2026-10-27", "2026-11-03", "2026-11-10", "2026-11-17"]) {
      await ctx.svc.checkIn(member.id, new Date(`${d}T18:00:00Z`));
    }
    await ctx.svc.checkIn(member.id, new Date("2026-11-18T18:00:00Z"));
    const s = await ctx.svc.summary(member.id, new Date("2026-11-18T19:00:00Z"));
    expect(s?.streak.current).toBe(4);
    expect(s?.history.filter((h) => h.reason === "streak")).toHaveLength(1);
    expect(s?.badges.find((b) => b.id === "streak_4")?.earnedAt).toBeTruthy();
  });
});
