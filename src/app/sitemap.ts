import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/config/site";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { siteUrl } from "@/lib/seo";

// Stable "last significant revision" for static marketing pages. Using a fixed
// constant (not request time) keeps <lastmod> honest across crawls — bump this
// when the static pages' content is meaningfully updated.
const STATIC_LAST_MODIFIED = new Date("2026-08-01T00:00:00Z");

const STATIC_PAGES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "monthly", priority: 0.6 },
];

// Reciprocal hreflang alternates (uz/ru/en + x-default) for a given path.
function alternatesFor(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${siteUrl}/${locale}${path}`;
  }
  languages["x-default"] = `${siteUrl}/${routing.defaultLocale}${path}`;
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    ...STATIC_PAGES,
    ...services.map((s) => ({
      path: `/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPaths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}/${locale}${page.path}`,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: alternatesFor(page.path),
      });
    }
  }

  // Published blog posts use their real modification/publication dates.
  const { data: posts } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, updated_at, published_at, created_at")
    .eq("published", true);

  for (const post of posts ?? []) {
    const path = `/blog/${post.slug}`;
    const lastModified = new Date(post.updated_at ?? post.published_at ?? post.created_at);
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: alternatesFor(path),
      });
    }
  }

  return entries;
}
