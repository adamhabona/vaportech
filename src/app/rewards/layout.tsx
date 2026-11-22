import { TestModeBanner } from "@/components/rewards/test-mode-banner";

export default function RewardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TestModeBanner />
      {children}
    </>
  );
}
