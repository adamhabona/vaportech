import "server-only";
import { RewardsError } from "@/lib/rewards/service";

export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export const fail = (message: string, status = 400, code = "error") => json({ error: message, code }, status);

/** Wraps a handler so RewardsError becomes a clean JSON error. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A) => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof RewardsError) return fail(e.message, e.status, e.code);
      console.error("[api]", e);
      return fail("Something went wrong. Try again.", 500);
    }
  };
}

export async function body<T>(req: Request): Promise<Partial<T>> {
  try {
    return (await req.json()) as Partial<T>;
  } catch {
    return {};
  }
}

/** Simple in-memory limiter, per key. Good enough for a single-store counter. */
const hits = new Map<string, number[]>();
export function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > max;
}

export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
