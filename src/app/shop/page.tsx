import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { ItemListSchema } from "@/components/seo/item-list-schema";
import { CATEGORIES } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Shop All Categories",
  description:
    "Browse every category at VaporTech USA: disposables, Delta-8, Delta-9, THCA, hookah, glass, e-liquid, cigars, kratom, and CBD.",
  alternates: { canonical: "/shop" },
};

export default function ShopIndexPage() {
  return (
    <>
      <Navbar />
      <ItemListSchema
        name="VaporTech USA categories"
        items={CATEGORIES.map((c) => ({
          name: c.name,
          href: `/shop/${c.slug}`,
        }))}
      />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
        eyebrow="Shop the floor"
        title={
          <>
            Every <em className="italic text-white/60">category</em>, in stock.
          </>
        }
        intro="From disposables to glass, hemp-derivatives to kratom, our Coral Springs floor stocks the depth that brings customers in from across South Florida."
      />

      <section className="bg-black px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <LinkCard
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              eyebrow="Category"
              title={cat.name}
              description={cat.intro.slice(0, 140) + "..."}
            />
          ))}
        </div>
      </section>
    </>
  );
}
