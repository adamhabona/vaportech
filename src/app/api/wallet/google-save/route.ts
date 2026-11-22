import { NextResponse } from "next/server";
import { getMemberId } from "@/lib/auth";
import { fail } from "@/lib/api";
import { rewards } from "@/lib/rewards/server";
import { googleConfig, googleSaveUrl } from "@/lib/wallet/google";
import { toPassData } from "@/lib/wallet/shared";

export async function GET() {
  if (!googleConfig()) return fail("Google Wallet isn't set up yet. Show the QR on your rewards page instead.", 503);
  const memberId = await getMemberId();
  if (!memberId) return fail("Sign in first.", 401);
  const summary = await rewards().summary(memberId);
  if (!summary) return fail("Member not found.", 404);
  return NextResponse.redirect(await googleSaveUrl(toPassData(summary)));
}
