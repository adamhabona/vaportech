import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { POINTS } from "@/lib/rewards/config";
import { localDay } from "@/lib/rewards/engine";
import { rewards } from "@/lib/rewards/server";

export const metadata: Metadata = {
  title: "Rewards Leaderboard",
  description: "This month's top VaporTech Rewards referrers in Coral Springs. Bring friends in, climb the board, win merch.",
  alternates: { canonical: "/rewards/leaderboard" },
};

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const rows = await rewards().leaderboard(new Date(), 20);
  const month = new Date(`${localDay().slice(0, 7)}-15T12:00:00Z`).toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <>
      <Navbar />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Rewards", href: "/rewards" }, { label: "Leaderboard" }]}
        eyebrow={`${month} leaderboard`}
        title={
          <>
            Who&apos;s bringing <em className="italic text-white/60">the crew.</em>
          </>
        }
        intro={`Every friend who joins with your link and makes a first $20+ purchase moves you up and earns you ${POINTS.referral.referrerBonus} points. #1 at the end of the month wins VaporTech merch.`}
      />
      <section className="bg-black px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          {rows.length === 0 ? (
            <div className="liquid-glass rounded-3xl p-8 text-center">
              <p className="text-white/70">Nobody&apos;s on the board yet this month. One friend puts you at #1.</p>
              <Link href="/rewards/me" className="inline-block mt-5 rounded-full bg-white text-black px-6 py-3 text-sm font-semibold">
                Get my invite link
              </Link>
            </div>
          ) : (
            <ol className="space-y-2">
              {rows.map((r, i) => (
                <li
                  key={r.memberId}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 ${i === 0 ? "bg-gradient-to-r from-fuchsia-300/20 to-sky-300/10 border border-fuchsia-200/30" : "bg-white/[0.03]"}`}
                >
                  <span className="font-serif-display text-3xl w-10 text-white/60 tabular-nums">{i + 1}</span>
                  <span className="flex-1 text-white text-lg">{r.displayName}</span>
                  <span className="text-white/70 tabular-nums">
                    {r.referrals} friend{r.referrals === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}
