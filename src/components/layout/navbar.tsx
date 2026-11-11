"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, Phone, X } from "lucide-react";
import { BUSINESS } from "@/lib/business";

const NAV_LINKS = [
  { href: "/brands", label: "Brands" },
  { href: "/locations", label: "Locations" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Blog" },
];

const MOBILE_LINKS = [
  ...NAV_LINKS,
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative z-20 px-4 sm:px-6 py-6">
      <div className="liquid-glass rounded-full max-w-5xl mx-auto pl-5 pr-2 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
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
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={BUSINESS.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block text-white text-sm font-medium hover:text-white/80 transition-colors"
          >
            Directions
          </a>
          <a
            href={`tel:${BUSINESS.telephoneTel}`}
            aria-label={`Call ${BUSINESS.name} at ${BUSINESS.telephone}`}
            className="liquid-glass rounded-full px-4 sm:px-5 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors inline-flex items-center gap-2"
          >
            <Phone size={14} aria-hidden="true" />
            Call
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden rounded-full p-2 text-white hover:bg-white/5 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="md:hidden absolute left-4 right-4 sm:left-6 sm:right-6 top-full -mt-2 rounded-3xl bg-black/90 backdrop-blur-md border border-white/10 p-3"
        >
          <ul className="text-base font-medium">
            {MOBILE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={BUSINESS.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl px-4 py-3 text-white/90 hover:bg-white/5 transition-colors"
              >
                Get directions
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
