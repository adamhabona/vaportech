import { isTestMode, TEST_OTP_CODE } from "@/lib/test-mode";

/** Shown on every rewards screen while REWARDS_TEST_MODE is on. */
export function TestModeBanner() {
  if (!isTestMode()) return null;
  return (
    <div className="relative z-30 bg-amber-300 text-black text-center text-xs sm:text-sm font-medium px-4 py-2">
      Rewards test mode: no texts are sent, use code <span className="font-mono font-bold">{TEST_OTP_CODE}</span>. Points and rewards aren&apos;t live yet.
    </div>
  );
}
