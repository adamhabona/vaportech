"use client";

import { motion } from "framer-motion";
import { LazyVideo } from "@/components/ui/lazy-video";

const PHILOSOPHY_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4";

export function PhilosophySection() {
  return (
    <section className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="font-serif-display text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24"
        >
          Selection <em className="italic text-white/40">x</em> Service
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <LazyVideo
              src={PHILOSOPHY_VIDEO_SRC}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            <div>
              <div className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Every brand, in stock
              </div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Raz, Lost Mary, Geek Bar, Yovo, HQD, Off-Stamp, and
                dozens more. Our shelves carry the brands South Florida actually
                wants, restocked the moment they drop.
              </p>
            </div>

            <div className="w-full h-px bg-white/10 my-10" />

            <div>
              <div className="text-white/40 text-xs tracking-widest uppercase mb-4">
                Walk in, walk out
              </div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Skip shipping delays and counterfeit risk. Every product is
                authenticated in store, every staff member can help you find
                the right fit, and you walk out the door with the real thing
                today.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
