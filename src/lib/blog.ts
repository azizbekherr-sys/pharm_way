import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { BlogPostData } from "@/types/blog";

type BlogPostRow = {
  title: string;
  title_ru: string | null;
  title_en: string | null;
  slug: string;
  excerpt: string | null;
  excerpt_ru: string | null;
  excerpt_en: string | null;
  content: string;
  content_ru: string | null;
  content_en: string | null;
  category: string;
  read_time: number | null;
  tags: string[] | null;
  cover_image: string | null;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  views: number | null;
};

const READ_TIME_UNIT: Record<string, string> = { uz: "daqiqa", ru: "минут", en: "min" };
const DATE_LOCALE: Record<string, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };

function localize(row: BlogPostRow, base: string, ru: string | null, en: string | null, locale: string) {
  if (locale === "ru") return ru || base;
  if (locale === "en") return en || base;
  return base;
}

function mapRow(row: BlogPostRow, locale: string): BlogPostData {
  return {
    slug: row.slug,
    category: row.category,
    title: localize(row, row.title, row.title_ru, row.title_en, locale),
    excerpt: localize(row, row.excerpt ?? "", row.excerpt_ru, row.excerpt_en, locale),
    content: localize(row, row.content, row.content_ru, row.content_en, locale),
    date: new Date(row.published_at ?? row.created_at).toLocaleDateString(DATE_LOCALE[locale] ?? "uz-UZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    publishedAt: new Date(row.published_at ?? row.created_at).toISOString(),
    readTime: `${row.read_time ?? 5} ${READ_TIME_UNIT[locale] ?? READ_TIME_UNIT.uz}`,
    tags: row.tags ?? [],
    image: row.cover_image,
    views: row.views ?? 0,
  };
}

export async function getPublishedBlogPosts(locale: string): Promise<BlogPostData[]> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data.map((row) => mapRow(row as BlogPostRow, locale));
}

export async function getBlogPostBySlug(locale: string, slug: string): Promise<BlogPostData | null> {
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error || !data) return null;
  return mapRow(data as BlogPostRow, locale);
}

export async function incrementBlogPostViews(slug: string): Promise<void> {
  const { data } = await supabaseAdmin.from("blog_posts").select("views").eq("slug", slug).single();
  const current = (data as { views: number | null } | null)?.views ?? 0;
  await supabaseAdmin.from("blog_posts").update({ views: current + 1 }).eq("slug", slug);
}
