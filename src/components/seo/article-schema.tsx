import { BUSINESS } from "@/lib/business";

export type ArticleSchemaInput = {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
};

export function ArticleSchema({ article }: { article: ArticleSchemaInput }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified ?? article.datePublished,
    author: {
      "@type": "Organization",
      name: article.author ?? BUSINESS.name,
    },
    publisher: {
      "@type": "Organization",
      name: BUSINESS.name,
      logo: {
        "@type": "ImageObject",
        url: `${BUSINESS.url}${BUSINESS.socialImagePath}`,
      },
    },
    image: article.image ?? `${BUSINESS.url}${BUSINESS.socialImagePath}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BUSINESS.url}/blog/${article.slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
