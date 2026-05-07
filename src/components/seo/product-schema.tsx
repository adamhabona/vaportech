import { BUSINESS } from "@/lib/business";

export type ProductSchemaInput = {
  name: string;
  brand: string;
  description?: string;
  image?: string;
  sku?: string;
  priceUSD?: number;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
};

export function ProductSchema({ product }: { product: ProductSchemaInput }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: product.priceUSD
      ? {
          "@type": "Offer",
          priceCurrency: "USD",
          price: product.priceUSD.toFixed(2),
          availability: `https://schema.org/${product.availability ?? "InStock"}`,
          seller: {
            "@type": "Organization",
            name: BUSINESS.name,
          },
        }
      : undefined,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
