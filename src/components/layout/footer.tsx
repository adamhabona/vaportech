import Link from "next/link";
import { BUSINESS } from "@/lib/business";

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/5 px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-serif-display text-3xl text-white tracking-tight"
          >
            VaporTech <span className="italic text-white/60">USA</span>
          </Link>
          <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-sm">
            Coral Springs&apos; premier smoke and vape destination since {BUSINESS.founded}.
            Every major brand in stock, in person, every day of the week.
          </p>

          <address className="not-italic mt-6 text-white/70 text-sm leading-relaxed">
            <div className="text-white font-medium">
              {BUSINESS.name}, {BUSINESS.tagline}
            </div>
            <div>{BUSINESS.streetAddress}</div>
            <div>
              {BUSINESS.city}, {BUSINESS.region} {BUSINESS.postalCode}
            </div>
            <a
              href={`tel:${BUSINESS.telephoneTel}`}
              className="block mt-2 hover:text-white transition-colors"
            >
              {BUSINESS.telephone}
            </a>
          </address>
        </div>

        <div>
          <div className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Hours
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            {BUSINESS.hoursLong.map((row) => (
              <li key={row.days}>
                <div className="text-white">{row.days}</div>
                <div className="text-white/50">{row.hours}</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-white/40 text-xs tracking-widest uppercase mb-4">
            Explore
          </div>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>
              <Link href="/brands" className="hover:text-white transition-colors">
                Brands
              </Link>
            </li>
            <li>
              <Link href="/locations" className="hover:text-white transition-colors">
                Locations
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-white transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-white/40 text-xs">
        <div>
          &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </div>
        <div>
          You must be 21+ to purchase nicotine and tobacco products. Please vape responsibly.
        </div>
      </div>
    </footer>
  );
}
