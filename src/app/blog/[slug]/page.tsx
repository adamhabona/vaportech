import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/data/blog";
import { getCategoryBySlug } from "@/lib/data/categories";
import { Navbar } from "@/components/layout/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { LinkCard } from "@/components/ui/link-card";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { FaqSchema } from "@/components/seo/faq-schema";
import { ArticleSchema } from "@/components/seo/article-schema";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.datePublished,
    },
  };
}

export default async function BlogPostPage({ params }: PageParams) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const related = post.relatedPostSlugs
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const relatedCats = post.relatedCategorySlugs
    .map((s) => getCategoryBySlug(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <Navbar />
      {post.faqs ? <FaqSchema items={post.faqs} /> : null}
      <ArticleSchema
        article={{
          headline: post.title,
          description: post.description,
          slug: post.slug,
          datePublished: post.datePublished,
        }}
      />

      <PageHero
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.title },
        ]}
        eyebrow={new Date(post.datePublished).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        title={post.title}
        intro={post.intro}
      />

      <article className="bg-black px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {post.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-serif-display text-2xl md:text-4xl text-white tracking-tight">
                {section.heading}
              </h2>
              <p className="mt-4 text-white/70 text-base md:text-lg leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </article>

      {post.faqs && post.faqs.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              FAQs
            </h2>
            <FaqAccordion items={post.faqs} />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              Related reading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {related.map((p) => (
                <LinkCard
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  eyebrow="Article"
                  title={p.title}
                  description={p.description}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedCats.length > 0 ? (
        <section className="bg-black px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif-display text-3xl md:text-5xl text-white tracking-tight mb-8">
              Shop the category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedCats.map((cat) => (
                <LinkCard
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  eyebrow="Category"
                  title={cat.name}
                  description={cat.intro.slice(0, 140) + "..."}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
