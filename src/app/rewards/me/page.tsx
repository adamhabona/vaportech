import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { Navbar } from "@/components/layout/navbar";
import { MemberHub, type HubData } from "@/components/rewards/member-hub";
import { getMemberId } from "@/lib/auth";
import { POINTS, REWARD_CATALOG, SPIN_PRIZES } from "@/lib/rewards/config";
import { rewards } from "@/lib/rewards/server";
import { publicMember } from "@/lib/rewards/types";
import { appleConfig } from "@/lib/wallet/apple";
import { googleConfig } from "@/lib/wallet/google";
import { qrPayload, siteUrl } from "@/lib/wallet/shared";

export const metadata: Metadata = {
  title: "My Rewards",
  robots: { index: false, follow: false },
};

export default async function MyRewardsPage() {
  const memberId = await getMemberId();
  if (!memberId) redirect("/rewards/join");
  const summary = await rewards().summary(memberId);
  if (!summary) redirect("/rewards/join");

  const qrSvg = await QRCode.toString(qrPayload(summary.member.qrToken), {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });

  const data: HubData = { ...summary, member: publicMember(summary.member) };

  return (
    <main className="min-h-screen bg-black">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(240,171,252,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(125,211,252,0.06),transparent_50%)]" />
      <div className="relative">
        <Navbar />
        <MemberHub
          data={data}
          qrSvg={qrSvg}
          inviteUrl={`${siteUrl()}/r/${summary.member.referralCode}`}
          catalog={REWARD_CATALOG}
          slices={SPIN_PRIZES.map((p) => ({ id: p.id, label: p.label }))}
          wallet={{ apple: appleConfig() !== null, google: googleConfig() !== null }}
          streakMilestones={[...POINTS.streakMilestones]}
        />
      </div>
    </main>
  );
}
