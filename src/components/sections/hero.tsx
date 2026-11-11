"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Globe, MapPin, Phone } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { InstagramIcon, XIcon } from "@/components/icons/brand-icons";
import { OpenStatus } from "@/components/ui/open-status";
import { BUSINESS } from "@/lib/business";

const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4";

function fadeOpacity(
  el: HTMLElement,
  from: number,
  to: number,
  durationMs: number,
  done?: () => void,
) {
  const start = performance.now();
  const tick = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    const eased = t;
    const value = from + (to - from) * eased;
    el.style.opacity = String(value);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      done?.();
    }
  };
  requestAnimationFrame(tick);
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let canceled = false;
    let fadingOut = false;

    const handleCanPlay = () => {
      if (canceled) return;
      video.play().catch(() => {});
      fadeOpacity(video, 0, 1, 500);
    };

    const handleTimeUpdate = () => {
      if (canceled || fadingOut) return;
      const remaining = video.duration - video.currentTime;
      if (Number.isFinite(remaining) && remaining <= 0.55 && remaining > 0) {
        fadingOut = true;
        const current = parseFloat(video.style.opacity || "1");
        fadeOpacity(video, current, 0, 500);
      }
    };

    const handleEnded = () => {
      if (canceled) return;
      video.style.opacity = "0";
      window.setTimeout(() => {
        if (canceled) return;
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOut = false;
        fadeOpacity(video, 0, 1, 500);
      }, 100);
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      canceled = true;
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
        style={{ opacity: 0 }}
      >
        <source src={HERO_VIDEO_SRC} type="video/mp4" />
      </video>

      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none" />

      <Navbar />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center ">
        <h1 className="text-white">
          <span className="block text-white/70 text-xs sm:text-sm font-medium tracking-widest uppercase mb-6">
            Smoke &amp; Vape Shop in Coral Springs, FL
          </span>
          <span className="block font-serif-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight whitespace-nowrap leading-[1]">
            Find it <em className="italic text-white/90">all</em>.
          </span>
        </h1>

        <p className="mt-8 text-white/70 text-base md:text-lg leading-relaxed max-w-xl px-4">
          Coral Springs&apos; premier smoke and vape destination since{" "}
          {BUSINESS.founded}. Every major brand, in stock, in person.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={BUSINESS.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
          >
            <MapPin size={16} aria-hidden="true" />
            Get directions
          </a>
          <a
            href={`tel:${BUSINESS.telephoneTel}`}
            className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors inline-flex items-center gap-2"
          >
            <Phone size={16} aria-hidden="true" />
            Call {BUSINESS.telephone}
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-sm text-white/80">
          <OpenStatus className="text-white font-medium" />
          <address className="not-italic">
            {BUSINESS.streetAddress}, {BUSINESS.city}, {BUSINESS.region}{" "}
            {BUSINESS.postalCode}
          </address>
          <div className="text-white/60">
            Mon to Sat 10 AM to 10 PM · Sun 10 AM to 8 PM
          </div>
        </div>

        <Link
          href="/about"
          className="mt-6 text-white/70 text-sm underline underline-offset-4 decoration-white/30 hover:text-white transition-colors"
        >
          Read the story
        </Link>
      </div>

      <div className="relative z-10 flex justify-center gap-4 pb-10">
        <a
          href="https://www.instagram.com/vaportechusa"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <InstagramIcon width={20} height={20} />
        </a>
        <a
          href="https://x.com/vaportechusa"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <XIcon width={20} height={20} />
        </a>
        <a
          href={BUSINESS.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on Google Maps"
          className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
        >
          <Globe size={20} />
        </a>
      </div>
    </section>
  );
}
