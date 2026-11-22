import { describe, expect, it } from "vitest";
import { SPIN_PRIZES, SPIN_WEIGHTS, TIERS } from "@/lib/rewards/config";
import {
  ageOn,
  badgesEarned,
  computeStreak,
  isOfAge,
  localDay,
  normalizePhone,
  pickSpinPrize,
  purchasePoints,
  streakMilestonesDue,
  tierFor,
  tierProgress,
  weekKey,
} from "@/lib/rewards/engine";
import type { Visit } from "@/lib/rewards/types";

describe("time", () => {
  it("uses the store's time zone for the day", () => {
    // 2026-11-21 03:00 UTC is still Nov 20 in Coral Springs
    expect(localDay(new Date("2026-11-21T03:00:00Z"))).toBe("2026-11-20");
  });
  it("weeks start on Monday", () => {
    expect(weekKey("2026-11-23")).toBe("2026-11-23"); // Monday
    expect(weekKey("2026-11-29")).toBe("2026-11-23"); // Sunday
    expect(weekKey("2026-11-22")).toBe("2026-11-16");
  });
});

describe("streaks", () => {
  it("counts consecutive weeks and survives an unvisited current week", () => {
    const days = ["2026-11-02", "2026-11-10", "2026-11-17"];
    const s = computeStreak(days, "2026-11-24");
    expect(s.current).toBe(3);
    expect(s.thisWeekDone).toBe(false);
    expect(s.startedWeek).toBe("2026-11-02");
  });
  it("breaks on a missed week and tracks best", () => {
    const days = ["2026-10-05", "2026-10-12", "2026-10-19", "2026-11-09", "2026-11-17"];
    const s = computeStreak(days, "2026-11-18");
    expect(s.current).toBe(2);
    expect(s.best).toBe(3);
  });
  it("is zero with no recent visit", () => {
    expect(computeStreak(["2026-01-05"], "2026-11-18").current).toBe(0);
  });
  it("milestones are due once per streak run", () => {
    const days = ["2026-10-26", "2026-11-02", "2026-11-09", "2026-11-16"];
    const s = computeStreak(days, "2026-11-18");
    const due = streakMilestonesDue(s, new Set());
    expect(due.map((d) => d.weeks)).toEqual([4]);
    expect(streakMilestonesDue(s, new Set(due.map((d) => d.ref)))).toEqual([]);
  });
});

describe("tiers + points", () => {
  it("maps thresholds", () => {
    expect(tierFor(0).id).toBe("cloud");
    expect(tierFor(499).id).toBe("cloud");
    expect(tierFor(500).id).toBe("haze");
    expect(tierFor(4000).id).toBe("vapor");
  });
  it("progress toward next tier", () => {
    const p = tierProgress(1000);
    expect(p.tier.id).toBe("haze");
    expect(p.next?.id).toBe("fog");
    expect(p.pointsToNext).toBe(500);
    expect(p.progress).toBeCloseTo(0.5);
    expect(tierProgress(9999).progress).toBe(1);
  });
  it("applies tier multipliers and floors", () => {
    expect(purchasePoints(2599, TIERS[0])).toBe(25);
    expect(purchasePoints(2000, TIERS[3])).toBe(40);
    expect(purchasePoints(-100, TIERS[0])).toBe(0);
  });
});

describe("badges", () => {
  const visit = (day: string, kind: Visit["kind"], at = `${day}T16:00:00Z`, categories: string[] = []): Visit => ({
    id: day + kind,
    memberId: "m",
    kind,
    day,
    at,
    orderId: null,
    spendCents: null,
    categories,
  });
  it("awards first purchase, night owl and explorer", () => {
    const visits = [
      visit("2026-11-01", "purchase", "2026-11-02T02:30:00Z", ["Disposables", "Glass", "Hookah", "Kratom", "CBD"]),
    ];
    const got = badgesEarned({ visits, completedReferrals: 3, bestStreak: 1, hitTopSpin: false, owned: new Set() });
    expect(got).toEqual(expect.arrayContaining(["first_puff", "night_owl", "explorer", "plug"]));
    expect(got).not.toContain("connector");
  });
  it("skips owned badges", () => {
    const got = badgesEarned({ visits: [visit("2026-11-01", "purchase")], completedReferrals: 0, bestStreak: 0, hitTopSpin: false, owned: new Set(["first_puff"]) });
    expect(got).toEqual([]);
  });
});

describe("spin", () => {
  it("returns every prize across the roll range", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) seen.add(pickSpinPrize(TIERS[0], () => i / 1000).id);
    expect(seen.size).toBe(SPIN_PRIZES.length);
  });
  it("weights cover every slice for every tier", () => {
    for (const t of TIERS) for (const p of SPIN_PRIZES) expect(SPIN_WEIGHTS[t.id][p.id]).toBeGreaterThan(0);
  });
  it("higher tiers get better expected value", () => {
    const ev = (tierIdx: number) => {
      let v = 0;
      for (let i = 0; i < 10000; i++) {
        const p = pickSpinPrize(TIERS[tierIdx], () => i / 10000);
        v += p.type === "points" ? p.points : (p.reward.amountCents ?? 500) / 10;
      }
      return v;
    };
    expect(ev(3)).toBeGreaterThan(ev(0));
  });
});

describe("identity", () => {
  it("normalizes US phones", () => {
    expect(normalizePhone("(754) 241-5367")).toBe("+17542415367");
    expect(normalizePhone("1 754 241 5367")).toBe("+17542415367");
    expect(normalizePhone("123")).toBeNull();
    expect(normalizePhone("(054) 241-5367")).toBeNull();
  });
  it("enforces 21+", () => {
    expect(ageOn("2005-11-21", "2026-11-21")).toBe(21);
    expect(isOfAge("2005-11-21", "2026-11-21")).toBe(true);
    expect(isOfAge("2005-11-22", "2026-11-21")).toBe(false);
    expect(isOfAge("garbage", "2026-11-21")).toBe(false);
  });
});
