import type { Metadata, Viewport } from "next";
import { StaffApp } from "@/components/rewards/staff-app";
import { isStaff } from "@/lib/auth";
import { REWARD_CATALOG } from "@/lib/rewards/config";

export const metadata: Metadata = {
  title: "Rewards Counter",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#000000" };

/** Counter iPad screen. Covers the site chrome so staff only see the tool. */
export default async function StaffPage() {
  return (
    <div className="fixed inset-0 z-40 overflow-auto bg-black">
      <StaffApp authed={await isStaff()} catalog={REWARD_CATALOG} />
    </div>
  );
}
