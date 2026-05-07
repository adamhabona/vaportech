import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { BLOG_POSTS } from "@/lib/data/blog";

export const metadata: Metadata = {
  title: "Vape and Smoke Blog",
  description:
    "Guides, product breakdowns, and Coral Springs perspective on vape, hemp-derivatives, kratom, glass, and hookah from the team at VaporTech USA.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const sorted = [...BLOG_POSTS].sort((a, b) =>
    a.datePublished < b.datePublished ? 1 : -1,
  );
  return (
    <>
      <Navbar />
      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
        eyebrow="Field notes"
        title={
          <>
            From the <em className="italic text-white/60">counter</em>.
          </>
        }
        intro="Practical guides, product breakdowns, and South Florida perspective from the team behind the Coral Springs floor."
      />

      <section className="bg-black px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((post) => (
            <LinkCard
              key={post.slug}
              href={`/blog/${post.slug}`}
              eyebrow={new Date(post.datePublished).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              title={post.title}
              description={post.description}
            />
          ))}
        </div>
      </section>
    </>
  );
}
