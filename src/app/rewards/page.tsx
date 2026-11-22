import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { BadgeIcon } from "@/components/rewards/bits";
import { FaqSchema } from "@/components/seo/faq-schema";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { BADGES, POINTS, REWARD_CATALOG, TIERS } from "@/lib/rewards/config";

export const metadata: Metadata = {
  title: "VaporTech Rewards: Coral Springs Smoke Shop Loyalty Program",
  description:
    "Earn points on every purchase at VaporTech USA in Coral Springs, spin the prize wheel when you visit, keep a weekly streak, and get 250 points for every friend you bring in. Free to join, 21+.",
  alternates: { canonical: "/rewards" },
};

const FAQS = [
  {
    question: "How do I join VaporTech Rewards?",
    answer:
      "Scan the QR code at the counter or tap Join on this page. Enter your mobile number, confirm the one-time code we text you, and add your name and birthday. You get 50 points the moment you join. You must be 21 or older.",
  },
  {
    question: "How do I earn points?",
    answer: `You earn ${POINTS.perDollar} point for every dollar you spend before tax, multiplied by your tier (up to 2x at Vapor). You also get ${POINTS.checkInBonus} points every day you check in at the counter, bonus points for weekly visit streaks, and ${POINTS.referral.referrerBonus} points for every friend who joins with your link and makes a first purchase of $20 or more.`,
  },
  {
    question: "How does the daily spin work?",
    answer:
      "Show your member QR at the counter to check in. That unlocks one spin on the prize wheel for the day, right on your phone. No purchase is needed to check in or spin. Prizes are bonus points, money off a future purchase, or VaporTech merch. Higher tiers get better odds.",
  },
  {
    question: "How does Bring a Friend work?",
    answer: `Share your personal invite link from your rewards page. When your friend joins with it and makes their first purchase of $20 or more, you get ${POINTS.referral.referrerBonus} points and they get ${POINTS.referral.refereeBonus}. Your friend must be 21 or older and new to the program. The top referrer each month wins VaporTech merch.`,
  },
  {
    question: "Can I use rewards on any product?",
    answer:
      "Money-off rewards apply to a purchase that meets the minimum shown on the reward, before tax. Rewards are never cash and can't bring a nicotine or tobacco product to zero dollars, because free samples of those products aren't allowed under federal law. Merch rewards are VaporTech-branded accessories.",
  },
  {
    question: "Can I add my card to Apple Wallet or Google Wallet?",
    answer:
      "Yes. Open your rewards page and tap Add to Apple Wallet or Add to Google Wallet. Your card updates itself when your points or tier change, and it pops up on your lock screen when you're at the store.",
  },
  {
    question: "Do you send marketing texts?",
    answer:
      "No. We only text you a one-time sign-in code when you ask for it. If you give us your email and opt in, we'll send drops, double points days and reward reminders there. You can unsubscribe any time.",
  },
];

// Static for speed. /rewards/join forwards signed-in members to their hub.
const cta = { href: "/rewards/join", label: "Join free, get 50 points" };

export default function RewardsPage() {

  return (
    <>
      <Navbar />
      <FaqSchema items={FAQS} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Rewards" }]}
        eyebrow="VaporTech Rewards"
        title={
          <>
            Shop. Spin. <em className="italic text-white/60">Level up.</em>
          </>
        }
        intro="The loyalty program for Coral Springs' smoke and vape regulars. Points on every purchase, a prize wheel every day you visit, streak bonuses, and real rewards for bringing your friends."
      />

      <section className="bg-black px-6 pb-12">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3">
          <Link href={cta.href} className="inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-3.5 font-semibold">
            {cta.label} <ArrowRight size={18} />
          </Link>
          <Link href="/rewards/leaderboard" className="liquid-glass inline-flex items-center rounded-full px-6 py-3.5 text-sm font-medium">
            This month&apos;s top referrers
          </Link>
        </div>
      </section>

      {/* Ways to earn */}
      <section className="bg-black px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl tracking-tight mb-8">Ways to earn</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { big: `${POINTS.perDollar} pt`, small: "per $1 spent", body: "Before tax, multiplied by your tier. Vapor members earn 2x." },
              { big: "Spin", small: "every visit", body: `Check in at the counter for +${POINTS.checkInBonus} points and a spin at the prize wheel. No purchase needed.` },
              { big: `+${POINTS.referral.referrerBonus}`, small: "per friend", body: `Your friend gets +${POINTS.referral.refereeBonus} when they make a first $20+ purchase with your link.` },
              { big: "+500", small: "streak bonus", body: "Visit every week. Hit 4, 8 and 12 weeks for +100, +250 and +500 points." },
            ].map((c) => (
              <div key={c.small} className="liquid-glass rounded-3xl p-6">
                <div className="font-serif-display text-5xl">{c.big}</div>
                <div className="text-white/50 text-sm uppercase tracking-widest mt-1">{c.small}</div>
                <p className="text-white/70 text-sm mt-4 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="bg-black px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl tracking-tight mb-3">Four tiers</h2>
          <p className="text-white/60 mb-8 max-w-2xl">Your tier is based on points earned over the last 12 months. Spending points never drops your tier.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t) => (
              <div key={t.id} className="rounded-3xl p-6 border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent">
                <div className="font-serif-display text-4xl" style={{ color: t.color }}>
                  {t.name}
                </div>
                <div className="text-white/50 text-sm mt-1">{t.threshold === 0 ? "Where everyone starts" : `${t.threshold.toLocaleString()}+ pts a year`}</div>
                <ul className="mt-5 space-y-2 text-sm text-white/75">
                  {t.perks.map((p) => (
                    <li key={p} className="flex gap-2">
                      <span style={{ color: t.color }}>•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards */}
      <section className="bg-black px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl tracking-tight mb-8">What points get you</h2>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {REWARD_CATALOG.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-4">
                <span className="text-white text-lg">{r.name}</span>
                <span className="font-serif-display text-2xl text-white/70 tabular-nums">{r.cost?.toLocaleString()} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Badges */}
      <section className="bg-black px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl tracking-tight mb-8">Collect badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {BADGES.map((b) => (
              <div key={b.id} className="liquid-glass rounded-3xl p-5">
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-fuchsia-300/25 to-sky-300/15">
                  <BadgeIcon icon={b.icon} />
                </span>
                <div className="text-white font-medium mt-4">{b.name}</div>
                <div className="text-white/50 text-xs mt-1 leading-relaxed">{b.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl tracking-tight mb-8">Questions</h2>
          <FaqAccordion items={FAQS} />
          <p className="text-white/40 text-sm mt-8">
            21+ only. See the full{" "}
            <Link href="/rewards/rules" className="underline">
              program rules
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="bg-black px-6 pt-8 pb-24">
        <div className="max-w-5xl mx-auto liquid-glass rounded-3xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="font-serif-display text-4xl md:text-5xl tracking-tight">Your first 50 points are waiting.</div>
            <p className="text-white/60 mt-2">Takes 30 seconds. Use them on your next visit.</p>
          </div>
          <Link href={cta.href} className="inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-3.5 font-semibold shrink-0">
            {cta.label} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
