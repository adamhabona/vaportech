import { NextResponse, type NextRequest } from "next/server";
import { REF_COOKIE } from "@/lib/auth";

/** Referral link: /r/SAMXYZ → remembers the code for 30 days, then the join page. */
export async function GET(req: NextRequest, ctx: RouteContext<"/r/[code]">) {
  const { code } = await ctx.params;
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
  const res = NextResponse.redirect(new URL(`/rewards/join?ref=${clean}`, req.url));
  if (clean) {
    res.cookies.set(REF_COOKIE, clean, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "production" });
  }
  return res;
}
