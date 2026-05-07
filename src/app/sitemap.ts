import type { MetadataRoute } from "next";
import { LOCATIONS } from "@/lib/data/locations";
import { BRANDS } from "@/lib/data/brands";
import { CATEGORIES } from "@/lib/data/categories";
import { BLOG_POSTS } from "@/lib/data/blog";
import { BUSINESS } from "@/lib/business";

const STATIC_ROUTES = [
  "",
  "/about",
  "/contact",
  "/faq",
  "/shop",
  "/brands",
  "/locations",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BUSINESS.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.8,
  }));

  const locationEntries: MetadataRoute.Sitemap = LOCATIONS.map((l) => ({
    url: `${BUSINESS.url}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const brandEntries: MetadataRoute.Sitemap = BRANDS.map((b) => ({
    url: `${BUSINESS.url}/brands/${b.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BUSINESS.url}/shop/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BUSINESS.url}/blog/${p.slug}`,
    lastModified: new Date(p.datePublished),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...locationEntries,
    ...categoryEntries,
    ...brandEntries,
    ...blogEntries,
  ];
}
