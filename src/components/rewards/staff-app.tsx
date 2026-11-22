"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Camera, CameraOff, Delete, Flame, Link2, Loader2, LogOut, Receipt, RefreshCw, Search, ShieldAlert, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RewardDef } from "@/lib/rewards/config";
import type { StaffMemberView } from "@/lib/staff/guard";
import type { CloverOrderSummary } from "@/lib/clover";

async function api<T = Record<string, unknown>>(url: string, data?: unknown): Promise<{ ok: boolean; json: T & { error?: string } }> {
  const res = await fetch(url, data === undefined ? undefined : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json };
}

const money = (c: number) => `$${(c / 100).toFixed(2)}`;

/* ------------------------------ PIN ------------------------------ */

function PinPad({ onDone }: { onDone: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(value: string) {
    setBusy(true);
    const { ok, json } = await api("/api/staff/login", { pin: value });
    setBusy(false);
    if (ok) onDone();
    else {
      setError(json.error ?? "Wrong PIN");
      setPin("");
    }
  }

  function press(d: string) {
    setError(null);
    const next = (pin + d).slice(0, 8);
    setPin(next);
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <div className="text-white/40 text-xs tracking-widest uppercase">VaporTech Rewards</div>
        <h1 className="font-serif-display text-5xl mt-2">Counter</h1>
      </div>
      <div className="flex gap-3 h-4">
        {Array.from({ length: Math.max(4, pin.length) }, (_, i) => (
          <span key={i} className={`w-4 h-4 rounded-full ${i < pin.length ? "bg-white" : "bg-white/15"}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} onClick={() => press(d)} className="w-20 h-20 rounded-full liquid-glass text-2xl font-medium active:bg-white/10">
            {d}
          </button>
        ))}
        <button onClick={() => setPin(pin.slice(0, -1))} className="w-20 h-20 rounded-full text-white/60 flex items-center justify-center" aria-label="Delete">
          <Delete />
        </button>
        <button onClick={() => press("0")} className="w-20 h-20 rounded-full liquid-glass text-2xl font-medium active:bg-white/10">
          0
        </button>
        <button
          onClick={() => submit(pin)}
          disabled={pin.length < 4 || busy}
          className="w-20 h-20 rounded-full bg-white text-black font-semibold disabled:opacity-30 flex items-center justify-center"
        >
          {busy ? <Loader2 className="animate-spin" /> : "Go"}
        </button>
      </div>
      {error ? <p className="text-rose-300 text-sm">{error}</p> : null}
    </div>
  );
}

/* ------------------------------ Scanner ------------------------------ */

function Scanner({ onScan, paused }: { onScan: (text: string) => void; paused: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<{ start: () => Promise<void>; stop: () => void; destroy: () => void } | null>(null);
  const [on, setOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const last = useRef<{ text: string; at: number }>({ text: "", at: 0 });
  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  });

  useEffect(() => {
    if (!on) return;
    let cancelled = false;
    (async () => {
      const { default: QrScanner } = await import("qr-scanner");
      if (cancelled || !videoRef.current) return;
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          const now = Date.now();
          if (result.data === last.current.text && now - last.current.at < 4000) return;
          last.current = { text: result.data, at: now };
          onScanRef.current(result.data);
        },
        { preferredCamera: "environment", highlightScanRegion: true, highlightCodeOutline: true, maxScansPerSecond: 8 },
      );
      scannerRef.current = scanner;
      try {
        await scanner.start();
      } catch {
        setError("Camera blocked. Allow camera access for this site, or look up by phone.");
        setOn(false);
      }
    })();
    return () => {
      cancelled = true;
      scannerRef.current?.destroy();
      scannerRef.current = null;
    };
  }, [on]);

  useEffect(() => {
    if (!scannerRef.current) return;
    if (paused) scannerRef.current.stop();
    else void scannerRef.current.start().catch(() => undefined);
  }, [paused]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-900 border border-white/10">
        <video ref={videoRef} className={`w-full h-full object-cover ${on ? "" : "hidden"}`} muted playsInline />
        {!on ? (
          <button onClick={() => setOn(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70 hover:text-white">
            <Camera size={40} />
            <span className="text-sm">Tap to start the scanner</span>
          </button>
        ) : null}
      </div>
      {on ? (
        <button onClick={() => setOn(false)} className="text-xs text-white/50 inline-flex items-center gap-1.5">
          <CameraOff size={14} /> Stop camera
        </button>
      ) : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}

/* ------------------------------ Order picker ------------------------------ */

const fetchOrders = () => api<{ orders: CloverOrderSummary[]; mode: "live" | "mock" }>("/api/staff/orders");

function OrderPicker({
  title,
  onPick,
  onClose,
}: {
  title: string;
  onPick: (order: CloverOrderSummary) => Promise<void>;
  onClose: () => void;
}) {
  const [orders, setOrders] = useState<CloverOrderSummary[] | null>(null);
  const [mode, setMode] = useState<"live" | "mock">("live");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apply = useCallback((r: Awaited<ReturnType<typeof fetchOrders>>) => {
    if (!r.ok) return setError(r.json.error ?? "Couldn't load orders");
    setError(null);
    setOrders(r.json.orders);
    setMode(r.json.mode);
  }, []);

  const load = useCallback(async () => apply(await fetchOrders()), [apply]);

  useEffect(() => {
    let alive = true;
    fetchOrders().then((r) => {
      if (alive) apply(r);
    });
    return () => {
      alive = false;
    };
  }, [apply]);

  async function createMock() {
    await api("/api/dev/clover", { action: "create", items: 2 });
    await load();
  }

  return (
    <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-white/10 p-6" initial={{ y: 30 }} animate={{ y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-display text-3xl">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-white/50">
            <X />
          </button>
        </div>
        <p className="text-white/50 text-sm mb-4">Open orders on the Clover register, newest first.</p>
        {error ? <p className="text-rose-300 text-sm mb-3">{error}</p> : null}
        {orders === null ? (
          <Loader2 className="animate-spin text-white/50" />
        ) : orders.length === 0 ? (
          <p className="text-white/60 text-sm">No open orders. Ring the items up in Clover first, then refresh.</p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-auto">
            {orders.map((o) => (
              <li key={o.id}>
                <button
                  disabled={busy !== null}
                  onClick={async () => {
                    setBusy(o.id);
                    setError(null);
                    try {
                      await onPick(o);
                    } catch (e) {
                      setError((e as Error).message);
                    }
                    setBusy(null);
                  }}
                  className="w-full flex items-center justify-between gap-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] px-4 py-3 text-left"
                >
                  <span className="min-w-0">
                    <span className="block text-white truncate">{o.title}</span>
                    <span className="block text-white/40 text-xs">
                      {o.itemCount} item{o.itemCount === 1 ? "" : "s"} · {new Date(o.createdTime).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </span>
                  <span className="tabular-nums text-white/80 shrink-0">{busy === o.id ? <Loader2 size={16} className="animate-spin" /> : money(o.subtotalCents)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 mt-4">
          <button onClick={load} className="inline-flex items-center gap-1.5 text-sm text-white/60">
            <RefreshCw size={14} /> Refresh
          </button>
          {mode === "mock" ? (
            <button onClick={createMock} className="ml-auto text-xs rounded-full border border-amber-200/30 text-amber-100 px-3 py-1.5">
              Test mode: ring up a fake order
            </button>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------ Member panel ------------------------------ */

type Picker = { kind: "coupon"; couponId: string; name: string } | { kind: "link" };

function MemberPanel({
  member,
  catalog,
  onUpdate,
  onClose,
  toast,
}: {
  member: StaffMemberView;
  catalog: RewardDef[];
  onUpdate: (m: StaffMemberView) => void;
  onClose: () => void;
  toast: (msg: string) => void;
}) {
  const [picker, setPicker] = useState<Picker | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [linked, setLinked] = useState<CloverOrderSummary | null>(null);
  const [mockMode, setMockMode] = useState(false);
  const m = member.member;

  async function act(key: string, url: string, data: unknown, success: (json: Record<string, unknown>) => string) {
    setBusy(key);
    const { ok, json } = await api(url, data);
    setBusy(null);
    if (!ok) return toast(json.error ?? "Failed");
    if (json.member) onUpdate(json.member as StaffMemberView);
    toast(success(json));
  }

  async function applyCoupon(couponId: string, orderId: string | null) {
    const { ok, json } = await api<{ member: StaffMemberView }>("/api/staff/apply-coupon", { memberId: m.id, couponId, orderId });
    if (!ok) throw new Error(json.error ?? "Couldn't apply");
    onUpdate(json.member);
    toast("Reward applied");
  }

  async function payMock() {
    if (!linked) return;
    const { ok, json } = await api<{ result: { points?: number } }>("/api/dev/clover", { action: "pay", orderId: linked.id });
    if (!ok) return toast(json.error ?? "Failed");
    toast(`Test payment done: +${json.result.points ?? 0} pts`);
    setLinked(null);
    const r = await api<StaffMemberView>("/api/staff/lookup", { memberId: m.id });
    if (r.ok) onUpdate(r.json);
  }

  return (
    <div className="liquid-glass rounded-3xl p-6 bg-zinc-950/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-serif-display text-4xl leading-none">
            {m.firstName} {m.lastName}
          </div>
          <div className="text-white/50 text-sm mt-2">
            <span style={{ color: member.tier.tier.color }}>{member.tier.tier.name}</span> · {member.visitCount} visits · DOB {m.dob}
          </div>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white" aria-label="Done with member">
          <X />
        </button>
      </div>

      {member.isFirstVisit ? (
        <div className="mt-5 rounded-2xl bg-amber-300/10 border border-amber-300/30 p-4 flex items-center gap-4">
          <ShieldAlert className="text-amber-200 shrink-0" />
          <div className="flex-1 text-sm text-amber-50">First visit: check their ID. Name and birthday must match.</div>
          <button
            onClick={() => act("id", "/api/staff/verify-id", { memberId: m.id }, () => "ID verified")}
            className="rounded-full bg-amber-200 text-black px-4 py-2 text-sm font-semibold shrink-0"
          >
            {busy === "id" ? <Loader2 size={16} className="animate-spin" /> : "ID checked"}
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-3 gap-3 mt-5">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="font-serif-display text-4xl tabular-nums">{member.points.toLocaleString()}</div>
          <div className="text-white/50 text-xs">points</div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="font-serif-display text-4xl tabular-nums flex items-center gap-1">
            {member.streak.current}
            <Flame size={20} className="text-orange-300" />
          </div>
          <div className="text-white/50 text-xs">week streak</div>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <div className="font-serif-display text-4xl">{member.checkedInToday ? <BadgeCheck className="text-emerald-300" size={34} /> : <span className="text-white/30">No</span>}</div>
          <div className="text-white/50 text-xs">{member.checkedInToday ? (member.spunToday ? `spun: ${member.spunToday.label}` : "spin ready on phone") : "not checked in"}</div>
        </div>
      </div>

      {!member.checkedInToday ? (
        <button
          onClick={() => act("checkin", "/api/staff/checkin", { memberId: m.id }, () => "Checked in: +10 pts, spin unlocked")}
          className="mt-4 w-full rounded-full bg-white text-black py-3 font-semibold"
        >
          {busy === "checkin" ? <Loader2 className="animate-spin mx-auto" /> : "Check in"}
        </button>
      ) : null}

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm uppercase tracking-widest text-white/50">Points for this sale</h3>
        </div>
        {linked ? (
          <div className="rounded-2xl bg-emerald-300/10 border border-emerald-300/25 p-4 text-sm flex items-center gap-3">
            <Receipt size={18} className="text-emerald-200" />
            <span className="flex-1">
              Linked to {linked.title} ({money(linked.subtotalCents)}). Points post when it&apos;s paid.
            </span>
            {mockMode ? (
              <button onClick={payMock} className="text-xs rounded-full border border-amber-200/30 text-amber-100 px-3 py-1.5 shrink-0">
                Test: mark paid
              </button>
            ) : null}
          </div>
        ) : (
          <button onClick={() => setPicker({ kind: "link" })} className="w-full rounded-2xl border border-white/15 py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-white/[0.04]">
            <Link2 size={16} /> Link to the open Clover order
          </button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm uppercase tracking-widest text-white/50 mb-2">Rewards ready</h3>
        {member.coupons.length === 0 ? (
          <p className="text-white/40 text-sm">None right now.</p>
        ) : (
          <ul className="space-y-2">
            {member.coupons.map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-4 py-3">
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{c.name}</span>
                  <span className="block text-xs text-white/40 font-mono tracking-widest">{c.code}</span>
                </span>
                {c.kind === "merch" ? (
                  <button
                    onClick={() => applyCoupon(c.id, null).catch((e) => toast((e as Error).message))}
                    className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold"
                  >
                    Hand over
                  </button>
                ) : (
                  <button onClick={() => setPicker({ kind: "coupon", couponId: c.id, name: c.name })} className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold">
                    Apply
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-sm uppercase tracking-widest text-white/50 mb-2">Redeem points</h3>
        <div className="flex flex-wrap gap-2">
          {catalog.map((r) => (
            <button
              key={r.id}
              disabled={member.points < (r.cost ?? 0) || busy !== null}
              onClick={() => act(`redeem-${r.id}`, "/api/staff/redeem", { memberId: m.id, rewardId: r.id }, () => `Unlocked ${r.name}`)}
              className="rounded-full border border-white/15 px-3 py-2 text-xs disabled:opacity-30 hover:bg-white/[0.05]"
            >
              {r.name} · {r.cost}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {picker ? (
          <OrderPicker
            title={picker.kind === "coupon" ? "Apply to order" : "Link order"}
            onClose={() => setPicker(null)}
            onPick={async (order) => {
              if (picker.kind === "coupon") await applyCoupon(picker.couponId, order.id);
              else {
                const { ok, json } = await api("/api/staff/link-order", { memberId: m.id, orderId: order.id });
                if (!ok) throw new Error(json.error ?? "Couldn't link");
                toast("Order linked");
              }
              setLinked(order);
              setMockMode(order.id.startsWith("MOCK"));
              setPicker(null);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------ App ------------------------------ */

export function StaffApp({ authed, catalog }: { authed: boolean; catalog: RewardDef[] }) {
  const [signedIn, setSignedIn] = useState(authed);
  const [member, setMember] = useState<StaffMemberView | null>(null);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  const lookup = useCallback(
    async (query: { qr?: string; phone?: string }) => {
      setBusy(true);
      const { ok, json } = await api<StaffMemberView>("/api/staff/lookup", query);
      if (!ok) {
        setBusy(false);
        if ((json as { code?: string }).code === "staff_required") setSignedIn(false);
        return toast(json.error ?? "Not found");
      }
      // Scanning the member at the counter is the check-in.
      if (!json.checkedInToday) {
        const c = await api<{ member: StaffMemberView; result: { points: number } }>("/api/staff/checkin", { memberId: json.member.id });
        setBusy(false);
        if (c.ok) {
          setMember(c.json.member);
          return toast(`${json.member.firstName} checked in: +${c.json.result.points} pts, spin unlocked`);
        }
      }
      setBusy(false);
      setMember(json);
    },
    [toast],
  );

  if (!signedIn) return <PinPad onDone={() => setSignedIn(true)} />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-fuchsia-200" />
          <span className="font-serif-display text-3xl">Rewards counter</span>
        </div>
        <button
          onClick={async () => {
            await api("/api/staff/logout", {});
            setSignedIn(false);
            setMember(null);
          }}
          className="text-white/50 text-sm inline-flex items-center gap-1.5"
        >
          <LogOut size={15} /> Lock
        </button>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <Scanner onScan={(text) => lookup({ qr: text })} paused={busy} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void lookup({ phone });
            }}
            className="flex gap-2"
          >
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="Or look up by phone number"
              className="flex-1 rounded-full bg-white/[0.05] border border-white/15 px-5 py-3 outline-none focus:border-white/40"
            />
            <button className="rounded-full bg-white text-black px-5 font-semibold inline-flex items-center gap-2" disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </form>
          <p className="text-white/40 text-xs">
            Not a member yet? Point them to the QR poster on the counter. Joining takes 30 seconds and they get 50 points.
          </p>
        </div>

        <div>
          {member ? (
            <MemberPanel member={member} catalog={catalog} onUpdate={setMember} onClose={() => setMember(null)} toast={toast} />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-white/40">Scan a member QR or look them up to begin.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toastMsg ? (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] rounded-full bg-white text-black px-6 py-3 text-sm font-semibold shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toastMsg}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
