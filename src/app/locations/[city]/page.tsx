import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCATIONS, getLocationBySlug } from "@/lib/data/locations";
import { getBrandBySlug } from "@/lib/data/brands";
import { getCategoryBySlug } from "@/lib/data/categories";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { NapBlock } from "@/components/ui/nap-block";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FaqSchema } from "@/components/seo/faq-schema";
import { LocalBusinessAreaSchema } from "@/components/seo/local-business-area-schema";
import { BUSINESS } from "@/lib/business";

interface PageParams {
  params: Promise<{ city: string }>;
}

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ city: l.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) return {};
  const title = `Smoke Shop in ${location.name}, ${location.state}`;
  const description = `${BUSINESS.name} serves ${location.name} from 8005 W Sample Rd in Coral Springs. ${location.driveTimeMinutes > 0 ? `About ${location.driveTimeMinutes} minutes from ${location.name}.` : ""} Every major brand in stock.`;
  return {
    title,
    description,
    alternates: { canonical: `/locations/${location.slug}` },
    openGraph: { title, description },
  };
}

export default async function LocationPage({ params }: PageParams) {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) notFound();

  const topBrands = location.topBrandSlugs
    .map((slug) => getBrandBySlug(slug))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));
  const topCategories = location.topCategorySlugs
    .map((slug) => getCategoryBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <Navbar />
      <FaqSchema items={location.faqs} />
      <LocalBusinessAreaSchema city={location.name} />

      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Locations", href: "/locations" },
          { label: location.name },
        ]}
        eyebrow={`Serving ${location.name}, ${location.state}`}
        title={
          <>
            Smoke Shop in{" "}
            <em className="italic text-white/60">{location.name}</em>
          </>
        }
        intro={location.intro}
      />

      <section className="bg-black px-6 pb-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass rounded-2xl p-5 text-center">
            <div className="text-white/40 text-xs tracking-widest uppercase">
              Drive time
            </div>
            <div className="font-serif-display text-3xl text-white mt-2">
              {location.driveTimeMinutes > 0
                ? `${location.driveTimeMinutes} min`
                : "On site"}
            </div>
          </div>
          <div className="liquid-glass rounded-2xl p-5 text-center">
            <div className="text-white/40 text-xs tracking-widest uppercase">
              Distance
            </div>
            <div className="font-serif-display text-3xl text-white mt-2">
              {location.driveDistanceMiles > 0
                ? `${location.driveDistanceMiles} mi`
                : "Here"}
            </div>
          </div>
          <div className="liquid-glass rounded-2xl p-5 text-center">
            <div className="text-white/40 text-xs tracking-widest uppercase">
              Founded
            </div>
            <div className="font-serif-display text-3xl text-white mt-2">
              {BUSINESS.founded}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Why {location.name} chooses us
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              {location.whyLocalsChoose}
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Directions from {location.name}
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              {location.directions}
            </p>
            {location.landmarks.length > 0 ? (
              <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {location.landmarks.map((landmark) => (
                  <li
                    key={landmark}
                    className="liquid-glass rounded-xl px-4 py-3 text-white/70 text-sm"
                  >
                    {landmark}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {location.sections.map((section) => (
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

      {topBrands.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight">
                Top brands in stock
              </h2>
              <Link
                href="/brands"
                className="hidden md:inline-block text-white/60 hover:text-white text-sm transition-colors"
              >
                See all brands
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topBrands.map((brand) => (
                <LinkCard
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  eyebrow={brand.category.replace("-", " ")}
                  title={brand.name}
                  description={brand.intro}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {topCategories.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              Shop by category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategories.map((cat) => (
                <LinkCard
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  eyebrow="Category"
                  title={cat.name}
                  description={cat.intro.slice(0, 140) + "..."}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-black px-6 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
            FAQs from {location.name}
          </h2>
          <FaqAccordion items={location.faqs} />
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
