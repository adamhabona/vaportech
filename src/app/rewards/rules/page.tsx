import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { BUSINESS } from "@/lib/business";
import { POINTS, REWARD_CATALOG, SPIN_PRIZES, SPIN_WEIGHTS, TIERS } from "@/lib/rewards/config";

export const metadata: Metadata = {
  title: "VaporTech Rewards Program Rules",
  description: "Official rules for VaporTech Rewards, including points, tiers, the daily prize wheel, referrals and the monthly leaderboard.",
  alternates: { canonical: "/rewards/rules" },
};

function odds(tierId: keyof typeof SPIN_WEIGHTS) {
  const w = SPIN_WEIGHTS[tierId];
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  return SPIN_PRIZES.map((p) => ({ label: p.type === "points" ? p.label : p.reward.name, pct: ((w[p.id] ?? 0) / total) * 100 }));
}

export default function RulesPage() {
  const address = `${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`;
  return (
    <>
      <Navbar />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Rewards", href: "/rewards" }, { label: "Rules" }]}
        eyebrow="Official rules"
        title="VaporTech Rewards program rules"
        intro="Last updated November 21, 2026."
      />
      <section className="bg-black px-6 pb-24">
        <div className="max-w-3xl mx-auto space-y-10 text-white/75 leading-relaxed [&_h2]:font-serif-display [&_h2]:text-3xl [&_h2]:text-white [&_h2]:mb-3">
          <div>
            <h2>1. Sponsor and eligibility</h2>
            <p>
              VaporTech Rewards is run by {BUSINESS.name}, {address} (&quot;VaporTech&quot;). Membership is free and open only to legal residents of the United States who
              are 21 or older. One account per person and per mobile number. VaporTech may check government ID before honoring any reward. Employees may join but
              are not eligible for leaderboard prizes.
            </p>
          </div>
          <div>
            <h2>2. Earning points</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Signup bonus: {POINTS.signupBonus} points, once.</li>
              <li>
                Purchases: {POINTS.perDollar} point per whole dollar spent before tax and tips, multiplied by your tier ({TIERS.map((t) => `${t.name} ${t.multiplier}x`).join(", ")}).
                Points post after payment. VaporTech may remove points earned on purchases that are later returned or refunded.
              </li>
              <li>Check-in: {POINTS.checkInBonus} points once per calendar day when a cashier scans your member QR. No purchase is required.</li>
              <li>
                Streaks: visiting (check-in or purchase) in consecutive calendar weeks (Monday to Sunday, Eastern time) earns{" "}
                {POINTS.streakMilestones.map((m) => `${m.bonus} points at ${m.weeks} weeks`).join(", ")}, once per streak.
              </li>
              <li>
                Referrals: when someone new joins using your invite link or code and their first purchase as a member is ${(POINTS.referral.qualifyingSpendCents / 100).toFixed(0)}{" "}
                or more before tax, you earn {POINTS.referral.referrerBonus} points and they earn {POINTS.referral.refereeBonus} points. Referral points are limited to{" "}
                {POINTS.referral.monthlyCap} friends per calendar month. Self-referrals, duplicate accounts and paid or incentivized sign-ups are not allowed.
              </li>
            </ul>
          </div>
          <div>
            <h2>3. Tiers</h2>
            <p>
              Your tier is set by points earned (not spent) over the trailing 12 months:{" "}
              {TIERS.map((t) => `${t.name} ${t.threshold.toLocaleString()}+`).join(", ")}. Tiers update automatically.
            </p>
          </div>
          <div>
            <h2>4. Redeeming</h2>
            <p>Points can be exchanged for the rewards below. Redeemed rewards expire 60 days after they are issued.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              {REWARD_CATALOG.map((r) => (
                <li key={r.id}>
                  {r.name}: {r.cost} points
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Money-off rewards require the stated minimum purchase before tax, apply to one transaction, have no cash value and cannot be combined with other
              rewards on the same transaction. In line with federal law (21 CFR 1140.16(d)), no reward will be applied so that a tobacco or nicotine product is
              given away free. Merch rewards are VaporTech-branded, non-tobacco accessories, while supplies last; VaporTech may substitute an item of equal or
              greater value.
            </p>
          </div>
          <div>
            <h2>5. Daily prize wheel</h2>
            <p>
              NO PURCHASE NECESSARY. A purchase does not improve your chances of winning. Each member may spin once per calendar day after checking in at the store,
              which does not require a purchase. Alternate free method of entry: mail a postcard with your name, mobile number and the words &quot;Prize Wheel&quot;
              to {address}; each postcard received grants one spin, limit one per day. The wheel runs from November 21, 2026 until VaporTech ends it with notice
              on this page. Prizes and odds by tier:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              {TIERS.map((t) => (
                <div key={t.id} className="rounded-2xl bg-white/[0.03] p-4 text-sm">
                  <div className="text-white font-medium mb-2">{t.name}</div>
                  <ul className="space-y-1">
                    {odds(t.id).map((o) => (
                      <li key={o.label} className="flex justify-between gap-3">
                        <span>{o.label}</span>
                        <span className="tabular-nums text-white/60">{o.pct.toFixed(1)}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-3">
              Spin coupons expire 14 days after they are won (merch: 30 days). Approximate retail values: lighter $3; money-off prizes as stated. Winners are
              responsible for any taxes.
            </p>
          </div>
          <div>
            <h2>6. Monthly referral leaderboard</h2>
            <p>
              The member with the most completed referrals in a calendar month wins a VaporTech merch pack (approximate retail value $40). Ties are broken by
              whoever reached the count first. Leaderboards show first name and last initial only.
            </p>
          </div>
          <div>
            <h2>7. Messages and privacy</h2>
            <p>
              We text your mobile number only to send one-time sign-in codes you request. If you opt in, we email offers and reward reminders; every email has an
              unsubscribe link. We never sell your information.
            </p>
          </div>
          <div>
            <h2>8. Changes and fraud</h2>
            <p>
              VaporTech may change or end the program, adjust point values or remove points earned by mistake or fraud, with notice on this page. Points have no
              cash value and are not transferable. Questions: call {BUSINESS.telephone} or ask at the counter.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
