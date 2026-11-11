"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "vt-age-verified";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readVerified() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "yes";
  } catch {
    // Storage unavailable (private mode, blocked): ask every visit.
    return false;
  }
}

/**
 * 21+ confirmation shown once per browser. It mounts on the client only, so
 * page content stays in the server HTML for search engines.
 */
export function AgeGate() {
  // Server snapshot is "verified" so the overlay is never in the server HTML.
  const stored = useSyncExternalStore(subscribe, readVerified, () => true);
  const [confirmed, setConfirmed] = useState(false);
  const [denied, setDenied] = useState(false);

  const state = stored || confirmed ? "hidden" : denied ? "denied" : "asking";

  useEffect(() => {
    if (state === "hidden") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [state]);

  if (state === "hidden") return null;

  const confirm = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "yes");
    } catch {
      // Ignore: the gate will simply show again next visit.
    }
    setConfirmed(true);
    listeners.forEach((listener) => listener());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-6"
    >
      <div className="liquid-glass rounded-3xl max-w-md w-full p-8 md:p-10 text-center">
        <div className="text-white/40 text-xs tracking-widest uppercase">
          VaporTech USA
        </div>
        {state === "asking" ? (
          <>
            <h2
              id="age-gate-title"
              className="font-serif-display mt-4 text-3xl md:text-4xl text-white tracking-tight"
            >
              Are you 21 or older?
            </h2>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              This site contains information about nicotine and tobacco
              products. You must be of legal age to enter.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={confirm}
                className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Yes, I am 21+
              </button>
              <button
                type="button"
                onClick={() => setDenied(true)}
                className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            <h2
              id="age-gate-title"
              className="font-serif-display mt-4 text-3xl md:text-4xl text-white tracking-tight"
            >
              Sorry, come back later.
            </h2>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              You must be 21 or older to view this site.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
