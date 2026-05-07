import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { ItemListSchema } from "@/components/seo/item-list-schema";
import { LOCATIONS } from "@/lib/data/locations";

export const metadata: Metadata = {
  title: "Areas We Serve",
  description:
    "VaporTech USA serves customers from across South Florida. Driving directions, distances, and dedicated pages for Coral Springs, Parkland, Coconut Creek, Margate, and beyond.",
  alternates: { canonical: "/locations" },
};

export default function LocationsIndexPage() {
  return (
    <>
      <Navbar />
      <ItemListSchema
        name="VaporTech USA service area"
        items={LOCATIONS.map((l) => ({
          name: l.name,
          href: `/locations/${l.slug}`,
        }))}
      />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Locations" },
        ]}
        eyebrow="Areas we serve"
        title={
          <>
            Driving in from{" "}
            <em className="italic text-white/60">across South Florida</em>.
          </>
        }
        intro="One Coral Springs storefront, customers from a dozen surrounding cities. Pick yours for directions, drive time, and what we stock for the area."
      />

      <section className="bg-black px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LOCATIONS.map((loc) => (
            <LinkCard
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              eyebrow={
                loc.driveTimeMinutes > 0
                  ? `${loc.driveTimeMinutes} min drive`
                  : "Our home"
              }
              title={`${loc.name}, ${loc.state}`}
              description={loc.intro.slice(0, 140) + "..."}
            />
          ))}
        </div>
      </section>
    </>
  );
}
