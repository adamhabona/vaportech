"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    tag: "Vape",
    title: "Disposables & devices",
    description:
      "Every flagship disposable, refillable pods, mods, coils, and e-liquid. Authentic stock, fresh dates, daily restocks.",
    href: "/shop/disposable-vapes",
    videoSrc:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4",
  },
  {
    tag: "Smoke",
    title: "Glass, hookah & craft",
    description:
      "Pipes, bongs, hookahs, shisha, papers, wraps, and craft tobacco. Curated for quality, not quantity.",
    href: "/shop/glass-pipes",
    videoSrc:
      "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  },
] as const;

export function ServicesSection() {
  return (
    <section className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight">
            What we <em className="italic text-white/60">carry</em>
          </h2>
          <div className="hidden md:block text-white/40 text-sm">
            Across the floor
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.tag}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="liquid-glass rounded-3xl overflow-hidden group"
            >
              <Link href={card.href} className="block">
                <div className="relative aspect-video overflow-hidden">
                  <video
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  >
                    <source src={card.videoSrc} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-white/40 text-xs tracking-widest uppercase">
                      {card.tag}
                    </div>
                    <span className="liquid-glass rounded-full p-2 text-white">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                  <h3 className="font-serif-display mt-4 text-white text-xl md:text-2xl tracking-tight">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-white/50 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
