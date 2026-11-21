import type { Metadata } from "next";
import QRCode from "qrcode";
import { BUSINESS } from "@/lib/business";
import { POINTS } from "@/lib/rewards/config";
import { siteUrl } from "@/lib/wallet/shared";

export const metadata: Metadata = {
  title: "Rewards counter poster",
  robots: { index: false, follow: false },
};

/** Printable counter sign. Open and print (letter, portrait). */
export default async function PosterPage() {
  const url = `${siteUrl()}/rewards/join?src=counter`;
  const qr = await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "Q", color: { dark: "#000000", light: "#ffffff" } });

  return (
    <div className="fixed inset-0 z-[200] overflow-auto bg-white text-black print:static">
      <style>{`@page { size: letter portrait; margin: 0.4in; } @media print { body > *:not(.poster-root) { display: none !important; } }`}</style>
      <div className="poster-root mx-auto max-w-[7.7in] min-h-[10in] flex flex-col items-center text-center px-8 py-12">
        <div className="text-sm tracking-[0.35em] uppercase text-black/50">{BUSINESS.name}</div>
        <h1 className="font-serif-display text-[64px] leading-[0.95] tracking-tight mt-6">
          Scan. Join.
          <br />
          <span className="italic">Spin to win.</span>
        </h1>
        <p className="text-xl mt-6 max-w-md text-black/70">Join VaporTech Rewards in 30 seconds and get {POINTS.signupBonus} points right now.</p>
        <div className="w-[3.4in] h-[3.4in] mt-10 p-4 border-4 border-black rounded-3xl [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: qr }} />
        <div className="grid grid-cols-3 gap-6 mt-12 w-full">
          {[
            ["Every visit", "Check in at the counter, spin the prize wheel"],
            ["Every $1", "Earn points, up to 2x at Vapor tier"],
            ["Every friend", `+${POINTS.referral.referrerBonus} pts when they make a first purchase`],
          ].map(([a, b]) => (
            <div key={a}>
              <div className="font-serif-display text-3xl">{a}</div>
              <div className="text-sm text-black/60 mt-1">{b}</div>
            </div>
          ))}
        </div>
        <p className="mt-auto pt-12 text-xs text-black/50">
          21+ only. No purchase necessary to spin. Rules at {siteUrl().replace(/^https?:\/\//, "")}/rewards/rules
        </p>
      </div>
    </div>
  );
}
