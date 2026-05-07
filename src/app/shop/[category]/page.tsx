import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/lib/data/categories";
import { getBrandBySlug } from "@/lib/data/brands";
import { LOCATIONS } from "@/lib/data/locations";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { NapBlock } from "@/components/ui/nap-block";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FaqSchema } from "@/components/seo/faq-schema";
import { ItemListSchema } from "@/components/seo/item-list-schema";

interface PageParams {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { category } = await params;
  const data = getCategoryBySlug(category);
  if (!data) return {};
  return {
    title: data.h1,
    description: data.intro.slice(0, 150),
    alternates: { canonical: `/shop/${data.slug}` },
    openGraph: { title: data.h1, description: data.intro.slice(0, 150) },
  };
}

export default async function CategoryPage({ params }: PageParams) {
  const { category } = await params;
  const data = getCategoryBySlug(category);
  if (!data) notFound();

  const brands = data.brandSlugs
    .map((slug) => getBrandBySlug(slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  return (
    <>
      <Navbar />
      <FaqSchema items={data.faqs} />
      {brands.length > 0 ? (
        <ItemListSchema
          name={`${data.name} brands at VaporTech USA`}
          items={brands.map((b) => ({
            name: b.name,
            href: `/brands/${b.slug}`,
          }))}
        />
      ) : null}

      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: data.name },
        ]}
        eyebrow="Category"
        title={data.h1}
        intro={data.intro}
      />

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            {data.body}
          </p>

          {data.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
                {section.heading}
              </h2>
              <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {brands.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              Brands in this category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((b) => (
                <LinkCard
                  key={b.slug}
                  href={`/brands/${b.slug}`}
                  eyebrow={b.category.replace("-", " ")}
                  title={b.name}
                  description={b.intro.slice(0, 140) + "..."}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-black px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
            FAQs
          </h2>
          <FaqAccordion items={data.faqs} />
        </div>
      </section>

      <section className="bg-black px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight mb-6">
            {data.name} near you
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {LOCATIONS.map((loc) => (
              <li key={loc.slug}>
                <Link
                  href={`/locations/${loc.slug}`}
                  className="block liquid-glass rounded-xl px-4 py-3 text-white/80 hover:text-white hover:bg-white/[0.02] transition-all"
                >
                  {loc.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-black px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <NapBlock />
        </div>
      </section>
    </>
  );
}
