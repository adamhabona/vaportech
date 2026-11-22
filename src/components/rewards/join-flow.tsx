"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "phone" | "code" | "details";

interface Props {
  referrerName: string | null;
  refCode: string | null;
}

const input =
  "w-full rounded-2xl bg-white/[0.04] border border-white/15 px-4 py-3.5 text-white placeholder:text-white/30 outline-none focus:border-white/50 transition-colors";

async function post(url: string, data: unknown) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json };
}

function formatPhoneInput(v: string) {
  const d = v.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function JoinFlow({ referrerName, refCode }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [devHint, setDevHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", dob: "", email: "", emailOptIn: true, agree: false });

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    const { ok, json } = await post("/api/rewards/otp/send", { phone });
    setBusy(false);
    if (!ok) return setError(json.error);
    setDevHint(Boolean(json.dev));
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { ok, json } = await post("/api/rewards/otp/verify", { phone, code });
    setBusy(false);
    if (!ok) return setError(json.error);
    if (json.status === "member") {
      router.push("/rewards/me");
      router.refresh();
    } else setStep("details");
  }

  async function join(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { ok, json } = await post("/api/rewards/join", { ...form, ref: refCode });
    setBusy(false);
    if (!ok) {
      if (json.code === "phone_expired") setStep("phone");
      return setError(json.error);
    }
    router.push("/rewards/me");
    router.refresh();
  }

  const button = (label: string, disabled = false) => (
    <button
      type="submit"
      disabled={busy || disabled}
      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black py-3.5 font-semibold disabled:opacity-40"
    >
      {busy ? <Loader2 size={18} className="animate-spin" /> : null}
      {label}
      {!busy ? <ArrowRight size={18} /> : null}
    </button>
  );

  return (
    <div className="liquid-glass rounded-3xl p-6 md:p-8 bg-zinc-950/40">
      {referrerName ? (
        <div className="mb-6 rounded-2xl bg-emerald-300/10 border border-emerald-300/20 px-4 py-3 text-sm text-emerald-100">
          {referrerName} invited you. Make your first $20+ purchase as a member and you both get bonus points.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
          {step === "phone" ? (
            <form onSubmit={sendCode} className="space-y-4">
              <label className="block">
                <span className="block text-sm text-white/60 mb-2">Mobile number</span>
                <input
                  className={input}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(954) 555-0123"
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
                  required
                />
              </label>
              <p className="text-xs text-white/40">We text you a one-time code to sign in. No marketing texts, ever.</p>
              {button("Text me a code", phone.replace(/\D/g, "").length < 10)}
            </form>
          ) : null}

          {step === "code" ? (
            <form onSubmit={verify} className="space-y-4">
              <label className="block">
                <span className="block text-sm text-white/60 mb-2">Enter the code sent to {phone}</span>
                <input
                  className={`${input} text-center text-2xl tracking-[0.5em] font-mono`}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                  required
                />
              </label>
              {devHint ? <p className="text-xs text-amber-200/80">Dev mode: SMS is not configured. Use 123456.</p> : null}
              {button("Verify", code.length < 4)}
              <button type="button" onClick={() => sendCode()} className="w-full text-sm text-white/50 hover:text-white">
                Send a new code
              </button>
            </form>
          ) : null}

          {step === "details" ? (
            <form onSubmit={join} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-sm text-white/60 mb-2">First name</span>
                  <input className={input} autoComplete="given-name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                </label>
                <label className="block">
                  <span className="block text-sm text-white/60 mb-2">Last name</span>
                  <input className={input} autoComplete="family-name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                </label>
              </div>
              <label className="block">
                <span className="block text-sm text-white/60 mb-2">Date of birth</span>
                <input className={input} type="date" autoComplete="bday" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} required />
                <span className="block text-xs text-white/40 mt-2">You must be 21 or older. We check ID at the counter on your first visit.</span>
              </label>
              <label className="block">
                <span className="block text-sm text-white/60 mb-2">Email (optional)</span>
                <input className={input} type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              {form.email ? (
                <label className="flex items-start gap-3 text-sm text-white/70">
                  <input type="checkbox" className="mt-1" checked={form.emailOptIn} onChange={(e) => setForm({ ...form, emailOptIn: e.target.checked })} />
                  Email me about drops, double points days and my rewards.
                </label>
              ) : null}
              <label className="flex items-start gap-3 text-sm text-white/70">
                <input type="checkbox" className="mt-1" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} required />
                <span>
                  I&apos;m 21+ and agree to the{" "}
                  <Link href="/rewards/rules" className="underline" target="_blank">
                    program rules
                  </Link>
                  .
                </span>
              </label>
              {button("Join and get 50 points", !form.agree)}
            </form>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
