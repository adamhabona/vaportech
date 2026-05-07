import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema";

export type Crumb = { label: string; href?: string };

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <>
      <BreadcrumbSchema crumbs={crumbs} />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center flex-wrap gap-1 text-xs text-white/40">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white/70" : "text-white/40"}>
                    {crumb.label}
                  </span>
                )}
                {!isLast ? (
                  <ChevronRight
                    size={12}
                    className="text-white/30"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
