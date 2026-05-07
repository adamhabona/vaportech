import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { ItemListSchema } from "@/components/seo/item-list-schema";
import { BRANDS } from "@/lib/data/brands";

export const metadata: Metadata = {
  title: "All Brands We Carry",
  description:
    "Every brand stocked at VaporTech USA in Coral Springs. Disposables, hemp-derivatives, pod systems, mods, glass, papers, and premium vaporizers.",
  alternates: { canonical: "/brands" },
};

const CATEGORY_LABELS: Record<string, string> = {
  disposable: "Disposables",
  device: "Pod systems and mods",
  liquid: "E-liquid",
  "thc-derivative": "Hemp-derived THC",
  kratom: "Kratom",
  paper: "Papers and wraps",
  tobacco: "Tobacco and cigars",
  glass: "Glass and accessories",
  cbd: "CBD",
};

export default function BrandsIndexPage() {
  const grouped: Record<string, typeof BRANDS> = {};
  for (const b of BRANDS) {
    if (!grouped[b.category]) grouped[b.category] = [];
    grouped[b.category].push(b);
  }

  return (
    <>
      <Navbar />
      <ItemListSchema
        name="VaporTech USA brands"
        items={BRANDS.map((b) => ({
          name: b.name,
          href: `/brands/${b.slug}`,
        }))}
      />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Brands" },
        ]}
        eyebrow="Every brand we carry"
        title={
          <>
            The <em className="italic text-white/60">full lineup</em>.
          </>
        }
        intro={`${BRANDS.length} brands across disposables, hemp-derivatives, pod systems, glass, papers, and premium vaporizers. Each one earned its shelf space.`}
      />

      <section className="bg-black px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat}>
              <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight mb-6">
                {CATEGORY_LABELS[cat] ?? cat}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((b) => (
                  <LinkCard
                    key={b.slug}
                    href={`/brands/${b.slug}`}
                    eyebrow={CATEGORY_LABELS[b.category] ?? b.category}
                    title={b.name}
                    description={b.intro.slice(0, 140) + "..."}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
