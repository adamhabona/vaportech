/**
 * Google rating and review excerpts for the Coral Springs store.
 *
 * Copied by hand from the store's Google Business Profile, so it does not
 * update on its own. Refresh the numbers and `asOf` when they change.
 */
export const GOOGLE_RATING = {
  value: 4.8,
  count: 240,
  asOf: "November 2026",
} as const;

export interface ReviewExcerpt {
  /** Customer's words, quoted from their public Google review. */
  quote: string;
  /** Reviewer's public Google display name, when known. */
  author?: string;
}

export const REVIEW_EXCERPTS: ReviewExcerpt[] = [
  {
    quote:
      "My favorite spot for THCA products. Sophia and Adam are super kind and welcoming.",
  },
  {
    quote:
      "Amazing store. Amazing service. Great prices and they have all that you need.",
  },
  {
    quote: "Great customer service and amazing prices. My go to store for sure.",
    author: "Marvin Bennedict",
  },
  {
    quote: "This place is good and very friendly people too.",
  },
  {
    quote: "Super kind to the customers and service, my go to place for sure.",
  },
];
