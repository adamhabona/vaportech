import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRANDS, getBrandBySlug } from "@/lib/data/brands";
import { getCategoryBySlug } from "@/lib/data/categories";
import { LOCATIONS } from "@/lib/data/locations";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { NapBlock } from "@/components/ui/nap-block";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FaqSchema } from "@/components/seo/faq-schema";
import { ProductSchema } from "@/components/seo/product-schema";
import { BUSINESS } from "@/lib/business";

interface PageParams {
  params: Promise<{ brand: string }>;
}

export function generateStaticParams() {
  return BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { brand } = await params;
  const data = getBrandBySlug(brand);
  if (!data) return {};
  const title = `${data.name} at ${BUSINESS.name} in Coral Springs`;
  const description = `${data.intro.slice(0, 150)}`;
  return {
    title,
    description,
    alternates: { canonical: `/brands/${data.slug}` },
    openGraph: { title, description },
  };
}

export default async function BrandPage({ params }: PageParams) {
  const { brand } = await params;
  const data = getBrandBySlug(brand);
  if (!data) notFound();

  const relatedBrands = data.relatedBrandSlugs
    .map((slug) => getBrandBySlug(slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  const relatedCategories = data.relatedCategorySlugs
    .map((slug) => getCategoryBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <Navbar />
      <FaqSchema items={data.faqs} />
      {data.productHighlights[0] ? (
        <ProductSchema
          product={{
            name: data.productHighlights[0],
            brand: data.name,
            description: data.intro,
            availability: "InStock",
          }}
        />
      ) : null}

      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: data.name },
        ]}
        eyebrow={data.category.replace("-", " ")}
        title={
          <>
            {data.name}{" "}
            <em className="italic text-white/60">at VaporTech USA</em>
          </>
        }
        intro={data.intro}
      />

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {data.photos?.map((photo) => (
            <figure key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 768px) 100vw, 768px"
                loading="eager"
                className="w-full h-auto rounded-3xl border border-white/10"
              />
              {photo.caption ? (
                <figcaption className="mt-3 text-white/50 text-sm">
                  {photo.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              About {data.name}
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              {data.history}
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              What makes {data.name} distinct
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              {data.distinct}
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Product highlights
            </h2>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.productHighlights.map((p) => (
                <li
                  key={p}
                  className="liquid-glass rounded-xl px-4 py-3 text-white text-sm"
                >
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-white/40 text-xs">
              Specific SKUs, flavors, and prices vary by current shipment. Visit our
              Coral Springs store to see what&apos;s on the shelf today, or check our
              social channels for new arrivals.
            </p>
          </div>

          {data.flavors && data.flavors.length > 0 ? (
            <div>
              <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
                {data.name} flavors in stock
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {data.flavors.map((flavor) => (
                  <li
                    key={flavor}
                    className="liquid-glass rounded-full px-4 py-2 text-white/90 text-sm"
                  >
                    {flavor}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Why buy {data.name} from {BUSINESS.name}
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              Authenticity is the difference. Every {data.name} product on our
              Coral Springs shelf comes from authorized distribution with batch
              tracking and current inventory dates. Counterfeit risk is the
              biggest hidden cost of buying online or from gray-market resellers,
              and our supply chain eliminates that variable. Our staff also uses
              the products and can speak to differences across the line in
              detail.
            </p>
          </div>
        </div>
      </section>

      {relatedCategories.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              Browse the category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedCategories.map((cat) => (
                <LinkCard
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  eyebrow="Shop"
                  title={cat.name}
                  description={cat.intro.slice(0, 140) + "..."}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedBrands.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              Related brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedBrands.map((b) => (
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
            Find {data.name} near you
          </h2>
          <p className="text-white/60 text-sm md:text-base mb-6 max-w-2xl">
            We carry {data.name} at our Coral Springs store and serve customers
            from across South Florida. Driving distances vary; pick your city.
          </p>
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
