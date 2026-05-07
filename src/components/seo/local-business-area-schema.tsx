import { BUSINESS } from "@/lib/business";

export function LocalBusinessAreaSchema({ city }: { city: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TobaccoShop",
    "@id": `${BUSINESS.url}/locations/${city.toLowerCase().replace(/\s+/g, "-")}#localbusiness`,
    name: BUSINESS.name,
    image: `${BUSINESS.url}/og-storefront.jpg`,
    url: `${BUSINESS.url}/locations/${city.toLowerCase().replace(/\s+/g, "-")}`,
    telephone: BUSINESS.telephoneIntl,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.lat,
      longitude: BUSINESS.geo.lng,
    },
    areaServed: { "@type": "City", name: city },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
