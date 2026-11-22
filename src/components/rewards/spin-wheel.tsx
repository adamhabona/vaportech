"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface WheelSlice {
  id: string;
  label: string;
}

interface SpinWheelProps {
  slices: WheelSlice[];
  /** Resolves with the winning slice index (decided server-side). */
  onSpin: () => Promise<number>;
  disabled?: boolean;
  disabledLabel?: string;
  onDone?: (index: number) => void;
}

const COLORS = ["#18181b", "#27272a"];
const ACCENTS = ["#f0abfc", "#7dd3fc", "#c4b5fd", "#fda4af", "#86efac", "#fde68a", "#a5f3fc", "#f9a8d4"];
const SPIN_MS = 5200;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

export function SpinWheel({ slices, onSpin, disabled, disabledLabel = "Spin used", onDone }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draw = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const size = canvas.clientWidth;
      if (canvas.width !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = size / 2;
      const n = slices.length;
      const arc = (Math.PI * 2) / n;
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      ctx.translate(r, r);
      ctx.rotate(angle);
      for (let i = 0; i < n; i++) {
        // Slice i is centered at the top (−90°) when angle = −i * arc.
        const start = -Math.PI / 2 - arc / 2 + i * arc;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, r - 6, start, start + arc);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % 2];
        ctx.fill();
        // accent rim
        ctx.beginPath();
        ctx.arc(0, 0, r - 10, start + 0.02, start + arc - 0.02);
        ctx.strokeStyle = ACCENTS[i % ACCENTS.length];
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.save();
        ctx.rotate(start + arc / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fafafa";
        ctx.font = `600 ${Math.max(12, size / 22)}px Inter, system-ui, sans-serif`;
        ctx.fillText(slices[i].label, r - 26, 0);
        ctx.restore();
      }
      ctx.restore();

      // outer ring
      ctx.beginPath();
      ctx.arc(r, r, r - 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // hub
      const g = ctx.createRadialGradient(r, r, 4, r, r, r * 0.16);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(1, "#a1a1aa");
      ctx.beginPath();
      ctx.arc(r, r, r * 0.13, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    },
    [slices],
  );

  useEffect(() => {
    draw(angleRef.current);
    const onResize = () => draw(angleRef.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [draw]);

  async function spin() {
    if (spinning || disabled) return;
    setError(null);
    setSpinning(true);

    // Idle spin while waiting for the server.
    let idle = true;
    let last = performance.now();
    const idleLoop = (t: number) => {
      if (!idle) return;
      angleRef.current += ((t - last) / 1000) * Math.PI * 2;
      last = t;
      draw(angleRef.current);
      requestAnimationFrame(idleLoop);
    };
    requestAnimationFrame(idleLoop);

    let index: number;
    try {
      index = await onSpin();
    } catch (e) {
      idle = false;
      setSpinning(false);
      setError((e as Error).message);
      return;
    }
    idle = false;

    const n = slices.length;
    const arc = (Math.PI * 2) / n;
    const from = angleRef.current;
    const jitter = (Math.random() - 0.5) * arc * 0.6;
    const target = -index * arc + jitter;
    const base = from - (((from - target) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const to = base + Math.PI * 2 * 6;
    const t0 = performance.now();

    await new Promise<void>((resolve) => {
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / SPIN_MS);
        angleRef.current = from + (to - from) * easeOut(p);
        draw(angleRef.current);
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });

    setSpinning(false);
    onDone?.(index);
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-full max-w-[340px] aspect-square">
        <canvas ref={canvasRef} className="w-full h-full" aria-label="Prize wheel" role="img" />
        <div
          className="absolute left-1/2 -top-1 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[22px] border-l-transparent border-r-transparent border-t-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
          aria-hidden
        />
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={spinning || disabled}
        className="rounded-full bg-white text-black px-8 py-3 text-sm font-semibold tracking-wide disabled:bg-white/15 disabled:text-white/50 transition-colors"
      >
        {spinning ? "Spinning…" : disabled ? disabledLabel : "Spin the wheel"}
      </button>
      {error ? <p className="text-sm text-rose-300 text-center max-w-xs">{error}</p> : null}
    </div>
  );
}
