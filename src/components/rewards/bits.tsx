"use client";

import { Check, Clover, Compass, Copy, Crown, Flame, IdCard, Moon, Network, Plug, Share2, Wind, Zap, type LucideIcon } from "lucide-react";
import { useState } from "react";

const BADGE_ICONS: Record<string, LucideIcon> = {
  wind: Wind,
  "id-card": IdCard,
  plug: Plug,
  network: Network,
  flame: Flame,
  zap: Zap,
  crown: Crown,
  moon: Moon,
  compass: Compass,
  clover: Clover,
};

export function BadgeIcon({ icon, size = 22, className }: { icon: string; size?: number; className?: string }) {
  const Icon = BADGE_ICONS[icon] ?? Wind;
  return <Icon size={size} className={className} />;
}

/** Circular progress ring toward the next tier. */
export function TierRing({ progress, color, size = 132, children }: { progress: number; color: string; size?: number; children?: React.ReactNode }) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0.02, progress))}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.8,.2,1)", filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function ShareInvite({ url, code, firstName }: { url: string; code: string; firstName: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${firstName} invited you to VaporTech Rewards in Coral Springs. Join with my link and get 100 bonus points on your first $20+ purchase (21+).`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "VaporTech Rewards", text, url });
        return;
      } catch {
        /* cancelled: fall through to copy */
      }
    }
    await copy();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3">
        <span className="truncate text-white/80 text-sm flex-1">{url.replace(/^https?:\/\//, "")}</span>
        <button type="button" onClick={copy} className="shrink-0 text-white/70 hover:text-white" aria-label="Copy invite link">
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={share} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black py-3 text-sm font-semibold">
          <Share2 size={16} /> Share invite
        </button>
        <a
          href={`sms:?&body=${encodeURIComponent(`${text} ${url}`)}`}
          className="inline-flex items-center justify-center rounded-full liquid-glass px-5 py-3 text-sm font-medium"
        >
          Text it
        </a>
      </div>
      <p className="text-xs text-white/40">
        Your code: <span className="font-mono tracking-widest text-white/70">{code}</span>
      </p>
    </div>
  );
}
