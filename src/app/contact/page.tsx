import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { NapBlock } from "@/components/ui/nap-block";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = {
  title: "Contact and Visit VaporTech USA",
  description:
    "Visit VaporTech USA at 8005 W Sample Rd, Coral Springs, FL. Hours, directions, phone, and what to expect when you walk in.",
  alternates: { canonical: "/contact" },
};

const MAP_QUERY = encodeURIComponent(
  `${BUSINESS.streetAddress}, ${BUSINESS.city}, ${BUSINESS.region} ${BUSINESS.postalCode}`,
);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        eyebrow="Visit"
        title={
          <>
            Come{" "}
            <em className="italic text-white/60">say hello</em>.
          </>
        }
        intro="Our Coral Springs storefront is open seven days a week, with extended evening hours Monday through Saturday. Easy parking, knowledgeable staff, and the brand depth South Florida customers drive in for."
      />

      <section className="bg-black px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NapBlock />

          <div className="liquid-glass rounded-2xl p-2 md:p-3 overflow-hidden">
            <iframe
              title="VaporTech USA on Google Maps"
              src={MAP_EMBED}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl block min-h-[320px]"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              How to reach us
            </h2>
            <ul className="mt-6 space-y-3 text-white/70 text-base">
              <li>
                <span className="text-white/40 mr-3">Phone</span>
                <a
                  href={`tel:${BUSINESS.telephoneTel}`}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {BUSINESS.telephone}
                </a>
              </li>
              <li>
                <span className="text-white/40 mr-3">Address</span>
                <span className="text-white">
                  {BUSINESS.streetAddress}, {BUSINESS.city}, {BUSINESS.region}{" "}
                  {BUSINESS.postalCode}
                </span>
              </li>
              <li>
                <span className="text-white/40 mr-3">Hours</span>
                <span className="text-white">
                  Monday to Saturday 10 AM to 10 PM, Sunday 10 AM to 8 PM
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              What to expect when you walk in
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              ID check at the door for anyone under 30. Walk the floor at your
              own pace, or ask a staff member to walk it with you. Tell us what
              you're looking for and we'll point you to the right tier and
              brand. Most visits take under five minutes if you know what you
              want, longer if you want to chat through options.
            </p>
          </div>

          <div>
            <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
              Parking and access
            </h2>
            <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
              Free parking right at the storefront. Wheelchair accessible
              entrance. Our location is on the south side of Sample Road,
              between University Drive and Coral Ridge Drive.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
