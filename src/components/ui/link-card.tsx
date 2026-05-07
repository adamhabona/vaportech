import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface LinkCardProps {
  href: string;
  eyebrow?: string;
  title: string;
  description?: string;
}

export function LinkCard({ href, eyebrow, title, description }: LinkCardProps) {
  return (
    <Link
      href={href}
      className="liquid-glass rounded-2xl p-6 md:p-7 block group hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        {eyebrow ? (
          <div className="text-white/40 text-xs tracking-widest uppercase">
            {eyebrow}
          </div>
        ) : (
          <span aria-hidden />
        )}
        <span className="liquid-glass rounded-full p-2 text-white shrink-0">
          <ArrowUpRight size={14} />
        </span>
      </div>
      <h3 className="font-serif-display mt-3 text-white text-xl md:text-2xl tracking-tight leading-tight">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 text-white/50 text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
    </Link>
  );
}
