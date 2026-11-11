"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";

/**
 * Live open/closed indicator. Renders nothing until mounted so the server
 * HTML and the first client render always match.
 */
export function OpenStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getOpenStatus());
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return null;

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${
          status.isOpen ? "bg-emerald-400" : "bg-white/40"
        }`}
      />
      {status.label}
    </span>
  );
}
