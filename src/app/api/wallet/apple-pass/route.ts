import { getMemberId } from "@/lib/auth";
import { fail } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";
import { appleConfig, buildApplePass } from "@/lib/wallet/apple";
import { toPassData } from "@/lib/wallet/shared";

export async function GET() {
  if (!appleConfig()) return fail("Apple Wallet isn't set up yet. Show the QR on your rewards page instead.", 503);
  const memberId = await getMemberId();
  if (!memberId) return fail("Sign in first.", 401);
  const summary = await rewards().summary(memberId);
  if (!summary) return fail("Member not found.", 404);
  const buf = await buildApplePass(toPassData(summary));
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.apple.pkpass",
      "Content-Disposition": 'attachment; filename="vaportech-rewards.pkpass"',
      "Cache-Control": "no-store",
    },
  });
}
