import { ArrowUpRight, Star } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { GOOGLE_RATING, REVIEW_EXCERPTS } from "@/lib/data/reviews";

function Stars({ size = 16 }: { size?: number }) {
  return (
    <span className="inline-flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="fill-amber-300 text-amber-300" />
      ))}
    </span>
  );
}

// Large screens use a six-column grid: wide cards sit two per row, the rest
// three per row. This picks how many leading cards are wide so no row is
// left with a gap, whatever the number of reviews.
const REMAINDER = REVIEW_EXCERPTS.length % 3;
const WIDE_COUNT = REMAINDER === 0 ? 0 : REMAINDER === 1 ? 4 : 2;
const ODD_COUNT = REVIEW_EXCERPTS.length % 2 === 1;

export function ReviewsSection() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="relative bg-black py-20 md:py-32 px-6 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16">
          <div>
            <div className="text-white/40 text-xs tracking-widest uppercase mb-5">
              Google reviews
            </div>
            <h2
              id="reviews-heading"
              className="font-serif-display text-4xl md:text-6xl text-white tracking-tight leading-[1.1]"
            >
              Rated {GOOGLE_RATING.value}{" "}
              <em className="italic text-white/60">by our customers</em>
            </h2>
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/70">
              <Stars size={18} />
              <span>
                <span className="text-white font-medium">
                  {GOOGLE_RATING.value} out of 5
                </span>{" "}
                from {GOOGLE_RATING.count} reviews on Google
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={BUSINESS.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black rounded-full px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Read all reviews
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a
              href={BUSINESS.googleWriteReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass rounded-full px-6 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors inline-flex items-center justify-center"
            >
              Leave a review
            </a>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
          {REVIEW_EXCERPTS.map((review, i) => (
            <li
              key={review.quote}
              className={`liquid-glass rounded-3xl p-6 md:p-8 flex flex-col gap-5 ${
                i < WIDE_COUNT ? "lg:col-span-3" : "lg:col-span-2"
              } ${
                ODD_COUNT && i === REVIEW_EXCERPTS.length - 1
                  ? "sm:col-span-2"
                  : ""
              }`}
            >
              <blockquote
                className={`font-serif-display text-white leading-snug tracking-tight ${
                  i < WIDE_COUNT ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                }`}
              >
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <div className="mt-auto text-xs tracking-widest uppercase">
                {review.author ? (
                  <span className="block text-white/80 mb-1">
                    {review.author}
                  </span>
                ) : null}
                <span className="text-white/40">
                  {review.author ? "Google review" : "Customer review on Google"}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-white/30 text-xs">
          Rating as of {GOOGLE_RATING.asOf}. Excerpts from public reviews on the
          store&apos;s Google listing.
        </p>
      </div>
    </section>
  );
}
