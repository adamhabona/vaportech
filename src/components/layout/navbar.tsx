import Link from "next/link";
import { Globe } from "lucide-react";

const NAV_LINKS = [
  { href: "/brands", label: "Brands" },
  { href: "/locations", label: "Locations" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  return (
    <nav className="relative z-20 px-6 py-6">
      <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-white"
            aria-label="VaporTech USA home"
          >
            <Globe size={20} className="text-white" />
            <span className="font-serif-display text-lg tracking-tight">
              VaporTech
            </span>
          </Link>
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-block text-white text-sm font-medium hover:text-white/80 transition-colors"
          >
            Directions
          </Link>
          <Link
            href="/contact"
            className="liquid-glass rounded-full px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors"
          >
            Visit Store
          </Link>
        </div>
      </div>
    </nav>
  );
}
