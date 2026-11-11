export type Faq = { question: string; answer: string };
export type Section = { heading: string; body: string };

export interface Location {
  slug: string;
  name: string;
  state: string;
  driveTimeMinutes: number;
  driveDistanceMiles: number;
  intro: string;
  whyLocalsChoose: string;
  directions: string;
  landmarks: string[];
  sections: Section[];
  faqs: Faq[];
  topBrandSlugs: string[];
  topCategorySlugs: string[];
}

export type BrandCategory =
  | "disposable"
  | "device"
  | "liquid"
  | "thc-derivative"
  | "kratom"
  | "paper"
  | "tobacco"
  | "glass"
  | "cbd";

export interface BrandPhoto {
  /** Path under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Brand {
  slug: string;
  name: string;
  category: BrandCategory;
  intro: string;
  history: string;
  distinct: string;
  productHighlights: string[];
  /** Flavors the store carries, shown as a list on the brand page. */
  flavors?: string[];
  /** Photos taken in the store, shown on the brand page. */
  photos?: BrandPhoto[];
  faqs: Faq[];
  relatedBrandSlugs: string[];
  relatedCategorySlugs: string[];
}

export interface Category {
  slug: string;
  name: string;
  h1: string;
  intro: string;
  body: string;
  sections: Section[];
  faqs: Faq[];
  brandSlugs: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  intro: string;
  sections: Section[];
  faqs?: Faq[];
  relatedPostSlugs: string[];
  relatedCategorySlugs: string[];
}
