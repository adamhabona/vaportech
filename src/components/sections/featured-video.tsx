"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LazyVideo } from "@/components/ui/lazy-video";

const FEATURED_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4";

export function FeaturedVideoSection() {
  return (
    <section className="relative bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video"
        >
          <LazyVideo
            src={FEATURED_VIDEO_SRC}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <div className="text-white/50 text-xs tracking-widest uppercase mb-3">
                Inside the shop
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed">
                Step into our Coral Springs storefront. Every major brand on the
                shelf, knowledgeable staff who actually use the products, and a
                curated selection of glass, hookah, and accessories you won&apos;t
                find online.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-start md:self-auto"
            >
              <Link
                href="/contact"
                className="inline-block liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Visit us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
