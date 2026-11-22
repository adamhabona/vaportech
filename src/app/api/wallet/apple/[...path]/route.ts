import { timingSafeEqual } from "node:crypto";
import { getRepo } from "@/lib/rewards";
import { rewards } from "@/lib/rewards/server";
import { appleConfig, buildApplePass } from "@/lib/wallet/apple";
import { toPassData } from "@/lib/wallet/shared";

/**
 * Apple PassKit web service (webServiceURL = /api/wallet/apple).
 *   POST   v1/devices/{device}/registrations/{passType}/{serial}
 *   DELETE v1/devices/{device}/registrations/{passType}/{serial}
 *   GET    v1/devices/{device}/registrations/{passType}?passesUpdatedSince=tag
 *   GET    v1/passes/{passType}/{serial}
 *   POST   v1/log
 * Serial number = member id. Auth header: "ApplePass <walletAuthToken>".
 */

type Ctx = RouteContext<"/api/wallet/apple/[...path]">;

const empty = (status: number) => new Response(null, { status });

function safeEq(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function authedMember(req: Request, serial: string) {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("ApplePass ") ? header.slice(10) : "";
  const member = await getRepo().getMember(serial);
  if (!member || !token || !safeEq(token, member.walletAuthToken)) return null;
  return member;
}

function parse(path: string[]) {
  const cfg = appleConfig();
  if (!cfg || path[0] !== "v1") return null;
  return { cfg, rest: path.slice(1) };
}

export async function POST(req: Request, ctx: Ctx) {
  const p = parse((await ctx.params).path);
  if (!p) return empty(404);
  const { cfg, rest } = p;

  if (rest[0] === "log") {
    const b = (await req.json().catch(() => ({}))) as { logs?: string[] };
    for (const line of b.logs ?? []) console.warn("[wallet] apple log:", line);
    return empty(200);
  }

  // devices/{device}/registrations/{passType}/{serial}
  if (rest[0] === "devices" && rest[2] === "registrations" && rest.length === 5) {
    const [, device, , passType, serial] = rest;
    if (passType !== cfg.passTypeId) return empty(404);
    if (!(await authedMember(req, serial))) return empty(401);
    const b = (await req.json().catch(() => ({}))) as { pushToken?: string };
    if (!b.pushToken) return empty(400);
    const created = await getRepo().addWalletRegistration({
      deviceId: device,
      pushToken: b.pushToken,
      serial,
      passTypeId: passType,
      createdAt: new Date().toISOString(),
    });
    return empty(created ? 201 : 200);
  }
  return empty(404);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const p = parse((await ctx.params).path);
  if (!p) return empty(404);
  const { cfg, rest } = p;
  if (rest[0] === "devices" && rest[2] === "registrations" && rest.length === 5) {
    const [, device, , passType, serial] = rest;
    if (passType !== cfg.passTypeId) return empty(404);
    if (!(await authedMember(req, serial))) return empty(401);
    await getRepo().removeWalletRegistration(device, serial);
    return empty(200);
  }
  return empty(404);
}

export async function GET(req: Request, ctx: Ctx) {
  const p = parse((await ctx.params).path);
  if (!p) return empty(404);
  const { cfg, rest } = p;
  const repo = getRepo();

  // devices/{device}/registrations/{passType}?passesUpdatedSince=
  if (rest[0] === "devices" && rest[2] === "registrations" && rest.length === 4) {
    const [, device, , passType] = rest;
    if (passType !== cfg.passTypeId) return empty(404);
    const since = new URL(req.url).searchParams.get("passesUpdatedSince");
    const serials = await repo.listWalletSerialsForDevice(device, passType);
    const members = (await Promise.all(serials.map((s) => repo.getMember(s)))).filter((m) => m !== null);
    const updated = members.filter((m) => !since || m.updatedAt > since);
    if (updated.length === 0) return empty(204);
    const lastUpdated = updated.map((m) => m.updatedAt).sort().at(-1)!;
    return Response.json({ serialNumbers: updated.map((m) => m.id), lastUpdated });
  }

  // passes/{passType}/{serial}
  if (rest[0] === "passes" && rest.length === 3) {
    const [, passType, serial] = rest;
    if (passType !== cfg.passTypeId) return empty(404);
    const member = await authedMember(req, serial);
    if (!member) return empty(401);
    const ims = req.headers.get("if-modified-since");
    const lastModified = new Date(member.updatedAt);
    if (ims && new Date(ims).getTime() >= Math.floor(lastModified.getTime() / 1000) * 1000) return empty(304);
    const summary = await rewards().summary(member.id);
    if (!summary) return empty(404);
    const buf = await buildApplePass(toPassData(summary));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": "application/vnd.apple.pkpass", "Last-Modified": lastModified.toUTCString() },
    });
  }
  return empty(404);
}
