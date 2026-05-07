import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  crumbs?: Crumb[];
}

export function PageHero({ eyebrow, title, intro, crumbs }: PageHeroProps) {
  return (
    <section className="relative bg-black pt-12 md:pt-20 pb-12 md:pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
      <div className="relative max-w-5xl mx-auto">
        {crumbs && crumbs.length > 0 ? (
          <div className="mb-8">
            <Breadcrumbs crumbs={crumbs} />
          </div>
        ) : null}

        {eyebrow ? (
          <div className="text-white/40 text-xs tracking-widest uppercase mb-5">
            {eyebrow}
          </div>
        ) : null}

        <h1 className="font-serif-display text-4xl md:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]">
          {title}
        </h1>

        {intro ? (
          <p className="mt-6 max-w-2xl text-white/70 text-base md:text-lg leading-relaxed">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
