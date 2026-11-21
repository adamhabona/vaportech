import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { JoinFlow } from "@/components/rewards/join-flow";
import { getMemberId, REF_COOKIE } from "@/lib/auth";
import { getRepo } from "@/lib/rewards";

export const metadata: Metadata = {
  title: "Join VaporTech Rewards",
  description: "Join VaporTech Rewards in Coral Springs. 50 points to start, a daily spin when you visit, and 250 points for every friend you bring in. 21+.",
  alternates: { canonical: "/rewards/join" },
  robots: { index: false, follow: true },
};

export default async function JoinPage({ searchParams }: PageProps<"/rewards/join">) {
  const memberId = await getMemberId();
  if (memberId && (await getRepo().getMember(memberId))) redirect("/rewards/me");
  const sp = await searchParams;
  const fromQuery = typeof sp.ref === "string" ? sp.ref : null;
  const refCode = (fromQuery || (await cookies()).get(REF_COOKIE)?.value || "").toUpperCase().replace(/[^A-Z0-9]/g, "") || null;
  const referrer = refCode ? await getRepo().getMemberByReferralCode(refCode) : null;

  return (
    <main className="min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(240,171,252,0.1),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(125,211,252,0.08),transparent_50%)]" />
      <div className="relative">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-6 pb-24 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="md:pt-10">
            <div className="text-white/40 text-xs tracking-widest uppercase mb-4">VaporTech Rewards</div>
            <h1 className="font-serif-display text-5xl md:text-7xl tracking-tight leading-[1.02]">
              Every visit <span className="italic text-white/60">levels you up.</span>
            </h1>
            <ul className="mt-8 space-y-4 text-white/75">
              <li className="flex gap-3">
                <span className="font-serif-display text-2xl text-fuchsia-200 w-8">01</span>
                <span>Join in 30 seconds and get <strong className="text-white">50 points</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif-display text-2xl text-sky-200 w-8">02</span>
                <span>Check in at the counter to <strong className="text-white">spin the wheel</strong> every day you visit.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif-display text-2xl text-violet-200 w-8">03</span>
                <span>Bring a friend: <strong className="text-white">250 points</strong> for you, 100 for them.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif-display text-2xl text-rose-200 w-8">04</span>
                <span>Climb from Cloud to <strong className="text-white">Vapor</strong> for up to 2x points.</span>
              </li>
            </ul>
          </div>
          <JoinFlow referrerName={referrer ? referrer.firstName : null} refCode={referrer ? refCode : null} />
        </div>
      </div>
    </main>
  );
}
