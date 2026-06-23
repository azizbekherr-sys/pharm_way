import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/config/site";
import { supabaseAdmin } from "@/lib/supabase-admin";

const PAGES = [
  "",
  "/about",
  "/services",
  "/contact",
  "/partners",
  "/blog",
  "/faq",
  "/testimonials",
  "/certificates",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = "https://pharmwaygroup.uz";
  const slugs = services.map((s) => `/services/${s.slug}`);
  const paths = [...PAGES, ...slugs];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of paths) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])
          ),
        },
      });
    }
  }

  const { data: posts } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, updated_at, published_at, created_at")
    .eq("published", true);

  for (const post of posts ?? []) {
    const path = `/blog/${post.slug}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(post.updated_at ?? post.published_at ?? post.created_at),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
