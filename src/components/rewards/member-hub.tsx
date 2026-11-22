"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Gift, LogOut, Sparkles, Trophy, Wallet, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { RewardDef, SpinPrize } from "@/lib/rewards/config";
import type { MemberSummary } from "@/lib/rewards/service";
import type { PublicMember } from "@/lib/rewards/types";
import { BadgeIcon, ShareInvite, TierRing } from "./bits";
import { SpinWheel } from "./spin-wheel";

export type HubData = Omit<MemberSummary, "member"> & { member: PublicMember };

interface Props {
  data: HubData;
  qrSvg: string;
  inviteUrl: string;
  catalog: RewardDef[];
  slices: { id: string; label: string }[];
  wallet: { apple: boolean; google: boolean };
  streakMilestones: { weeks: number; bonus: number }[];
}

const money = (cents: number | null) => (cents ? `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}` : "");

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`liquid-glass rounded-3xl p-5 md:p-6 ${className}`}>{children}</section>;
}

function CardTitle({ icon, children, aside }: { icon: React.ReactNode; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-white/90 text-sm font-semibold tracking-wide uppercase">
        {icon}
        {children}
      </h2>
      {aside}
    </div>
  );
}

export function MemberHub({ data, qrSvg, inviteUrl, catalog, slices, wallet, streakMilestones }: Props) {
  const router = useRouter();
  const [prize, setPrize] = useState<{ prize: SpinPrize; code: string | null } | null>(null);
  const pending = useRef<{ prize: SpinPrize; code: string | null } | null>(null);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { member, tier, streak } = data;
  const nextMilestone = streakMilestones.find((m) => m.weeks > streak.current) ?? null;
  const dotCount = nextMilestone?.weeks ?? Math.max(12, streak.current);

  async function doSpin() {
    const res = await fetch("/api/rewards/spin", { method: "POST" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Spin failed");
    pending.current = { prize: json.prize, code: json.coupon?.code ?? null };
    return json.index as number;
  }

  async function redeem(r: RewardDef) {
    if (!confirm(`Redeem ${r.cost} points for "${r.name}"?`)) return;
    setRedeeming(r.id);
    setMessage(null);
    const res = await fetch("/api/rewards/redeem", { method: "POST", body: JSON.stringify({ rewardId: r.id }) });
    const json = await res.json();
    setRedeeming(null);
    if (!res.ok) setMessage(json.error);
    else {
      setMessage(`Unlocked: ${r.name}. Show your QR at the counter to use it.`);
      router.refresh();
    }
  }

  async function signOut() {
    await fetch("/api/rewards/logout", { method: "POST" });
    router.push("/rewards");
    router.refresh();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pb-24">
      <header className="flex items-end justify-between gap-4 pt-6 pb-8">
        <div>
          <div className="text-white/40 text-xs tracking-widest uppercase mb-2">VaporTech Rewards</div>
          <h1 className="font-serif-display text-4xl md:text-6xl tracking-tight leading-none">
            Hey {member.firstName}<span className="italic text-white/60">.</span>
          </h1>
        </div>
        <button onClick={signOut} className="text-white/50 hover:text-white text-sm inline-flex items-center gap-1.5">
          <LogOut size={15} /> Sign out
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-5">
        {/* Member card */}
        <Card className="md:col-span-3">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="bg-white rounded-2xl p-3 w-48 shrink-0" aria-label="Your member QR code">
              <div className="w-full aspect-square [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: qrSvg }} />
              <div className="text-center text-[11px] font-mono tracking-[0.2em] text-black/60 pt-1">{member.referralCode}</div>
            </div>
            <div className="flex-1 w-full flex items-center gap-5">
              <TierRing progress={tier.progress} color={tier.tier.color}>
                <div className="text-[10px] uppercase tracking-widest text-white/50">Tier</div>
                <div className="font-serif-display text-2xl" style={{ color: tier.tier.color }}>
                  {tier.tier.name}
                </div>
              </TierRing>
              <div className="min-w-0">
                <div className="font-serif-display text-5xl leading-none tabular-nums">{data.points.toLocaleString()}</div>
                <div className="text-white/50 text-sm mt-1">points to spend</div>
                <div className="text-white/70 text-sm mt-3">
                  {tier.next ? (
                    <>
                      <span className="text-white">{tier.pointsToNext.toLocaleString()}</span> pts to{" "}
                      <span style={{ color: tier.next.color }}>{tier.next.name}</span>
                    </>
                  ) : (
                    "You're at the top tier."
                  )}
                </div>
                <div className="text-white/40 text-xs mt-1">{tier.tier.multiplier}x points on purchases</div>
              </div>
            </div>
          </div>
          <p className="text-white/50 text-sm mt-5">Show this code at the counter to check in, earn points and use rewards.</p>
          {wallet.apple || wallet.google ? (
            <div className="flex flex-wrap gap-2 mt-4">
              {wallet.apple ? (
                <a href="/api/wallet/apple-pass" className="inline-flex items-center gap-2 rounded-full bg-black border border-white/25 px-4 py-2.5 text-sm font-medium hover:border-white/50">
                  <Wallet size={16} /> Add to Apple Wallet
                </a>
              ) : null}
              {wallet.google ? (
                <a href="/api/wallet/google-save" className="inline-flex items-center gap-2 rounded-full bg-black border border-white/25 px-4 py-2.5 text-sm font-medium hover:border-white/50">
                  <Wallet size={16} /> Add to Google Wallet
                </a>
              ) : null}
            </div>
          ) : null}
        </Card>

        {/* Streak */}
        <Card className="md:col-span-2">
          <CardTitle icon={<Flame size={16} className="text-orange-300" />}>Visit streak</CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-6xl leading-none tabular-nums">{streak.current}</span>
            <span className="text-white/60">week{streak.current === 1 ? "" : "s"}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-5" aria-hidden>
            {Array.from({ length: dotCount }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 flex-1 min-w-3 rounded-full ${i < streak.current ? "bg-gradient-to-r from-orange-300 to-rose-400" : "bg-white/10"}`}
              />
            ))}
          </div>
          <p className="text-white/60 text-sm mt-4">
            {streak.thisWeekDone ? "This week is locked in. " : streak.current > 0 ? "Visit this week to keep it alive. " : "Visit once a week to start a streak. "}
            {nextMilestone ? `${nextMilestone.weeks} weeks earns +${nextMilestone.bonus} pts.` : "You've hit every milestone."}
          </p>
          <p className="text-white/35 text-xs mt-2">Best: {streak.best} weeks · {data.visitCount} total visits</p>
        </Card>

        {/* Daily spin */}
        <Card className="md:col-span-3">
          <CardTitle icon={<Sparkles size={16} className="text-fuchsia-300" />} aside={<span className="text-xs text-white/40">1 per day</span>}>
            Daily spin
          </CardTitle>
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <SpinWheel
              slices={slices}
              onSpin={doSpin}
              disabled={!data.visitedToday || data.spunToday !== null}
              disabledLabel={data.spunToday ? "Come back tomorrow" : "Check in to unlock"}
              onDone={() => {
                setPrize(pending.current);
                router.refresh();
              }}
            />
            <div className="text-white/70 text-sm leading-relaxed space-y-3">
              {data.spunToday ? (
                <p>
                  Today you won <span className="text-white font-semibold">{data.spunToday.label}</span>. A new spin unlocks next time you check in.
                </p>
              ) : data.visitedToday ? (
                <p className="text-white">You&apos;re checked in. Your spin is ready.</p>
              ) : (
                <p>Show your QR at the counter to check in. That earns {"+"}10 points and unlocks today&apos;s spin. No purchase needed.</p>
              )}
              <p className="text-white/40 text-xs">
                Higher tiers get better odds. Prizes are points, money off a purchase, or VaporTech merch.{" "}
                <Link href="/rewards/rules" className="underline">
                  Rules
                </Link>
              </p>
            </div>
          </div>
        </Card>

        {/* Invite */}
        <Card className="md:col-span-2">
          <CardTitle
            icon={<Gift size={16} className="text-emerald-300" />}
            aside={
              <Link href="/rewards/leaderboard" className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1">
                <Trophy size={13} /> Leaderboard
              </Link>
            }
          >
            Bring a friend
          </CardTitle>
          <p className="text-white/70 text-sm mb-4">
            When a friend joins with your link and makes their first $20+ purchase, <span className="text-white">you get 250 points</span> and they get 100.
          </p>
          <ShareInvite url={inviteUrl} code={member.referralCode} firstName={member.firstName} />
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl bg-white/[0.03] p-3">
              <div className="font-serif-display text-3xl tabular-nums">{data.referrals.completed}</div>
              <div className="text-white/50 text-xs">friends who bought</div>
            </div>
            <div className="rounded-2xl bg-white/[0.03] p-3">
              <div className="font-serif-display text-3xl tabular-nums">{data.referrals.pending}</div>
              <div className="text-white/50 text-xs">joined, not bought yet</div>
            </div>
          </div>
        </Card>

        {/* Ready to use */}
        {data.coupons.length > 0 ? (
          <Card className="md:col-span-5">
            <CardTitle icon={<Gift size={16} className="text-amber-200" />}>Ready to use</CardTitle>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.coupons.map((c) => (
                <li key={c.id} className="rounded-2xl border border-dashed border-white/20 p-4">
                  <div className="text-white font-medium">{c.name}</div>
                  <div className="text-white/50 text-xs mt-1">
                    Code <span className="font-mono tracking-widest text-white/80">{c.code}</span> · expires {new Date(c.expiresAt).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-xs mt-3">Show your QR at checkout and the cashier applies it.</p>
          </Card>
        ) : null}

        {/* Redeem */}
        <Card className="md:col-span-5">
          <CardTitle icon={<Sparkles size={16} className="text-sky-300" />}>Spend your points</CardTitle>
          {message ? <p className="text-sm text-white/80 mb-4">{message}</p> : null}
          <ul className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {catalog.map((r) => {
              const cost = r.cost ?? 0;
              const pct = Math.min(1, data.points / cost);
              const can = data.points >= cost;
              return (
                <li key={r.id} className="rounded-2xl bg-white/[0.03] p-4 flex flex-col">
                  <div className="font-serif-display text-3xl">{r.kind === "merch" ? "Merch" : money(r.amountCents ?? null) + " off"}</div>
                  <div className="text-white/60 text-sm mt-1 flex-1">{r.name}</div>
                  <div className="h-1.5 rounded-full bg-white/10 mt-4 overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${pct * 100}%` }} />
                  </div>
                  <button
                    onClick={() => redeem(r)}
                    disabled={!can || redeeming !== null}
                    className="mt-3 rounded-full py-2 text-sm font-semibold bg-white text-black disabled:bg-white/10 disabled:text-white/40"
                  >
                    {redeeming === r.id ? "Unlocking…" : `${cost.toLocaleString()} pts`}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* Badges */}
        <Card className="md:col-span-3">
          <CardTitle icon={<Trophy size={16} className="text-yellow-200" />} aside={<span className="text-xs text-white/40">{data.badges.filter((b) => b.earnedAt).length}/{data.badges.length}</span>}>
            Badges
          </CardTitle>
          <ul className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {data.badges.map((b) => (
              <li key={b.id} className="flex flex-col items-center text-center gap-2" title={b.description}>
                <span
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    b.earnedAt ? "bg-gradient-to-br from-fuchsia-300/30 to-sky-300/20 text-white shadow-[0_0_24px_rgba(240,171,252,0.25)]" : "bg-white/[0.04] text-white/20"
                  }`}
                >
                  <BadgeIcon icon={b.icon} />
                </span>
                <span className={`text-[11px] leading-tight ${b.earnedAt ? "text-white/90" : "text-white/35"}`}>{b.name}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* History */}
        <Card className="md:col-span-2">
          <CardTitle icon={<Sparkles size={16} className="text-white/60" />}>Activity</CardTitle>
          <ul className="divide-y divide-white/5 max-h-80 overflow-auto -mx-1 px-1">
            {data.history.map((h) => (
              <li key={h.id} className="flex items-center justify-between py-2.5 text-sm gap-3">
                <span className="text-white/70 truncate">{h.note}</span>
                <span className={`tabular-nums shrink-0 ${h.points >= 0 ? "text-emerald-300" : "text-white/50"}`}>
                  {h.points >= 0 ? "+" : ""}
                  {h.points}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <AnimatePresence>
        {prize ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPrize(null)}
          >
            <motion.div
              className="liquid-glass rounded-3xl p-8 text-center max-w-sm w-full bg-zinc-950/80"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 14 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute right-4 top-4 text-white/50" onClick={() => setPrize(null)} aria-label="Close">
                <X size={18} />
              </button>
              <div className="text-white/50 text-xs uppercase tracking-widest">You won</div>
              <div className="font-serif-display text-6xl my-4">{prize.prize.label}</div>
              {prize.prize.type === "coupon" ? (
                <p className="text-white/70 text-sm">
                  {prize.prize.reward.name}. Code <span className="font-mono tracking-widest text-white">{prize.code}</span>. It&apos;s saved to your rewards.
                </p>
              ) : (
                <p className="text-white/70 text-sm">Added to your points.</p>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
