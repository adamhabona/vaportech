import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FaqSchema } from "@/components/seo/faq-schema";
import { NapBlock } from "@/components/ui/nap-block";

export const metadata: Metadata = {
  title: "Smoke & Vape Shop FAQ in Coral Springs",
  description:
    "Common questions about VaporTech USA: hours, brands, hemp-derived legality, age requirements, and what we carry.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  {
    question: "What are your hours?",
    answer:
      "Monday through Saturday from 10:00 AM to 10:00 PM, and Sunday from 10:00 AM to 8:00 PM. Open every day of the year except major holidays.",
  },
  {
    question: "Where are you located?",
    answer:
      "8005 W Sample Rd, Coral Springs, FL 33065. We're on the south side of Sample Road, between University Drive and Coral Ridge Drive. Free parking on site.",
  },
  {
    question: "What's the phone number?",
    answer:
      "Call us at (754) 241-5367 during open hours.",
  },
  {
    question: "What's the minimum age to buy at VaporTech USA?",
    answer:
      "21 and over for all nicotine vape, tobacco, and most hemp-derived products. We card every customer who looks under 30. Bring a valid government-issued ID.",
  },
  {
    question: "Do you sell to customers under 21?",
    answer:
      "No. Federal and Florida law require age 21 or older for tobacco, nicotine vape, and most regulated hemp products. We do not make exceptions.",
  },
  {
    question: "Are your disposables authentic?",
    answer:
      "Yes. Every disposable on our shelf comes from authorized distribution with batch tracking. We do not stock counterfeit or gray-market product.",
  },
  {
    question: "What brands do you carry?",
    answer:
      "Across disposables: Raz, Lost Mary, Geek Bar, Yovo, HQD, Mr. Fog, Hyde, Esco Bar, and Breeze. Across hemp-derivatives: Mellow Fellow, Cake, Delta Extrax, 3CHI, Urb, TRĒ House, Hometown Hero, Torch, Flying Monkey, and Mood. Across pod systems and mods: SMOK, Vaporesso, GeekVape, Juul, and Vuse. Plus glass, hookah accessories, kratom, CBD, RAW, Zig-Zag, Backwoods, Storz and Bickel, and PAX.",
  },
  {
    question: "Is Delta-8 legal in Florida?",
    answer:
      "Yes, hemp-derived Delta-8 is legal in Florida for adults 21 and over under current state and federal law. We monitor regulatory changes and adjust inventory immediately if laws change.",
  },
  {
    question: "Is Delta-9 legal in Florida?",
    answer:
      "Hemp-derived Delta-9 that complies with the federal 2018 Farm Bill threshold of 0.3 percent Delta-9 THC by dry weight is legal in Florida.",
  },
  {
    question: "Is THCA legal in Florida?",
    answer:
      "Hemp-derived THCA flower meeting the federal 0.3 percent Delta-9 threshold by dry weight is legal under federal law and currently in Florida.",
  },
  {
    question: "Is kratom legal in Florida?",
    answer:
      "Yes for adults in most of Florida, including Coral Springs and Broward County. Sarasota County restricts kratom.",
  },
  {
    question: "Do you carry hookah supplies and accessories?",
    answer:
      "Yes. Complete hookahs, replacement parts, gaskets, hose washers, charcoal (natural coconut and quick-light), foil, tongs, screens, bowl tops, and mouth tips. Plus a wide shisha selection.",
  },
  {
    question: "Do you carry CBD?",
    answer:
      "Yes. Full-spectrum, broad-spectrum, and isolate CBD across tinctures, edibles, topicals, and pet products.",
  },
  {
    question: "Do you carry glass pipes and bongs?",
    answer:
      "Yes. American-made and import glass at multiple price points, plus dab rigs, bangers, accessories, and cleaning supplies.",
  },
  {
    question: "Do you ship products?",
    answer:
      "We sell at our retail location in Coral Springs only. Florida and federal regulations on nicotine and tobacco shipping make in-store purchase the right path.",
  },
  {
    question: "Do you offer discounts or a loyalty program?",
    answer:
      "Ask in store about current promotions. We run periodic promotions on specific brands and categories.",
  },
  {
    question: "Will Delta-8, Delta-9, or THCA show up on a drug test?",
    answer:
      "Yes, all three. Drug tests look for THC metabolites and don't distinguish source. If you're subject to drug testing, do not consume these products.",
  },
  {
    question: "What's the closest smoke shop to Parkland?",
    answer:
      "VaporTech USA at 8005 W Sample Rd in Coral Springs is the closest deeply stocked smoke and vape shop to Parkland, about 12 minutes via University Drive south.",
  },
  {
    question: "What's the closest smoke shop to Coconut Creek?",
    answer:
      "VaporTech USA at 8005 W Sample Rd is roughly 8 minutes west via Sample Road from central Coconut Creek.",
  },
  {
    question: "Is parking free?",
    answer:
      "Yes. Free parking right at the storefront on Sample Road.",
  },
  {
    question: "Is the store wheelchair accessible?",
    answer:
      "Yes. Our entrance is wheelchair accessible.",
  },
  {
    question: "Do you do special orders?",
    answer:
      "Often, yes. If you're looking for a specific brand or product we don't currently stock, ask. We have relationships with most major distributors and can usually source items in 1 to 2 weeks.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Cash, credit and debit cards. Specific card networks may vary. Ask in store for current payment options.",
  },
  {
    question: "How can I follow new arrivals?",
    answer:
      "Follow our Instagram for current arrivals, flavor drops, and new brand additions. We post regularly.",
  },
  {
    question: "Do you sell vape juice in different nicotine strengths?",
    answer:
      "Yes. Freebase 0 to 6mg for sub-ohm devices, and salt nic 25 to 50mg for pod systems. Multiple flavor lines across both formats.",
  },
  {
    question: "Are kratom products lab tested?",
    answer:
      "Every kratom batch we receive comes with a current third-party COA covering alkaloid content, heavy metals, and microbial contamination.",
  },
  {
    question: "Do you carry replacement coils for SMOK and Vaporesso devices?",
    answer:
      "Yes. We stock replacement coils for current Nord, RPM, Novo, XROS, Luxe, and major mod kits. If your specific coil isn't in stock, we can usually order within a week.",
  },
  {
    question: "What's the difference between freebase and salt nicotine?",
    answer:
      "Freebase is for sub-ohm vaping devices. Salt nic is for pod systems and low-wattage devices, and delivers nicotine more efficiently at higher strengths.",
  },
  {
    question: "Do you sell tobacco-free shisha?",
    answer:
      "Yes. Herbal and tea-leaf based shisha alongside traditional tobacco shisha.",
  },
  {
    question: "What's the most popular disposable vape right now?",
    answer:
      "Raz CA6000 and Lost Mary OS5000 lead our store by volume, with Geek Bar Pulse and HQD close behind. Specific flavor demand shifts monthly.",
  },
  {
    question: "Do you cash registers accept tap-to-pay?",
    answer:
      "Yes. Apple Pay, Google Pay, and contactless cards are all accepted.",
  },
];

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <FaqSchema items={FAQS} />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "FAQ" },
        ]}
        eyebrow="Frequently asked"
        title={
          <>
            The questions{" "}
            <em className="italic text-white/60">we hear most</em>.
          </>
        }
        intro="Hours, brands, legality, age requirements, and the practical details our customers ask before walking in."
      />

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={FAQS} />
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
