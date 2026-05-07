import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { NapBlock } from "@/components/ui/nap-block";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "About VaporTech USA",
  description:
    "Coral Springs' premier smoke and vape shop since 2014. Our story, our standards, and how we built South Florida's most trusted destination for vape, hemp-derivatives, glass, and hookah.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
        eyebrow={`Independent since ${BUSINESS.founded}`}
        title={
          <>
            A neighborhood institution{" "}
            <em className="italic text-white/60">on Sample Road</em>.
          </>
        }
        intro="VaporTech USA opened its doors in 2014 with a single conviction: South Florida deserved a smoke and vape shop where authenticity, brand depth, and product knowledge weren't compromises. Over a decade later, we still operate by that standard."
      />

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              How we started
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              We opened on Sample Road in Coral Springs in 2014 as a single
              storefront focused on doing one thing well: stocking the brands
              South Florida actually wanted, in stock, in person, every day of
              the week. We started with a tight selection of disposables, glass,
              and hookah accessories and grew the floor as the categories
              evolved.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              The standard we hold
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              Every product on our shelf comes from authorized distribution.
              Every hemp-derived item publishes a current third-party COA.
              Every staff member uses what we sell. We have dropped brands the
              moment quality slipped, and we still do. The standard is what
              built our reputation, and we won't compromise it for margin.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Why authenticity matters
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              The smoke and vape category has a counterfeit problem. Online
              marketplaces are flooded with fake Raz, Elf Bar, Lost Mary, and
              Geek Bar disposables. Some hemp-derivative brands cut corners on
              lab testing or label inaccurately. Buying from authorized retail
              is the only consistent way to avoid these risks, and that's
              exactly what we are. Our supply chain is verifiable, our products
              are fresh, and what's on the box is what's in the device.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              The community we serve
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              Coral Springs is home, and we serve customers from across South
              Florida: Parkland, Coconut Creek, Margate, Tamarac, Deerfield
              Beach, Pompano, Boca Raton, and beyond. Many of our regulars have
              been coming in for years. We know what they buy, what they like,
              and what they want us to track down for them. That's the model.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Our team
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              The people behind the counter use the products. They can compare
              flavor profiles across disposable lines from memory, walk you
              through the differences between Delta-8 and Delta-9, recommend
              kratom strains by use case, and pick a glass piece for your daily
              setup. That depth is what turns a quick stop into a real
              recommendation.
            </p>
          </div>
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
