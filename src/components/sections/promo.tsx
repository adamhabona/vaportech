import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { BUSINESS } from "@/lib/business";

const POINTS = [
  "Authentic products",
  "Competitive prices",
  "Friendly customer service",
  "Wide selection",
];

export function PromoSection() {
  return (
    <section
      aria-labelledby="promo-heading"
      className="relative bg-black py-16 md:py-24 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Image
          src="/promo/vaportech-price-match.jpg"
          alt="VaporTech Smoke & Vape, Coral Springs, Florida. Great selection, great prices, great experience. We match or beat competitor prices."
          width={1206}
          height={1195}
          sizes="(max-width: 768px) 100vw, 560px"
          className="w-full h-auto rounded-3xl border border-white/10"
        />

        <div>
          <div className="text-white/40 text-xs tracking-widest uppercase mb-5">
            Price match
          </div>
          <h2
            id="promo-heading"
            className="font-serif-display text-4xl md:text-6xl text-white tracking-tight leading-[1.1]"
          >
            We match or beat{" "}
            <em className="italic text-white/60">competitor prices</em>.
          </h2>
          <p className="mt-6 text-white/70 text-base md:text-lg leading-relaxed">
            Great selection, great prices, great experience. Your satisfaction
            is our priority.
          </p>
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {POINTS.map((point) => (
              <li
                key={point}
                className="liquid-glass rounded-2xl px-4 py-3 text-white/90 text-sm"
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={BUSINESS.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black rounded-full px-8 py-3 text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <MapPin size={16} aria-hidden="true" />
              Stop by today
            </a>
            <a
              href={`tel:${BUSINESS.telephoneTel}`}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone size={16} aria-hidden="true" />
              Call {BUSINESS.telephone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
