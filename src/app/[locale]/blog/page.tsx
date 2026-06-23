import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BlogHero from "@/components/blog-page/BlogHero";
import FeaturedPost from "@/components/blog-page/FeaturedPost";
import BlogExplorer from "@/components/blog-page/BlogExplorer";
import Newsletter from "@/components/blog-page/Newsletter";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";
import { getPublishedBlogPosts } from "@/lib/blog";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.blog" });
  return buildPageMetadata({ locale, path: "/blog", title: t("title"), description: t("description") });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog.cta" });
  const posts = await getPublishedBlogPosts(locale);
  const [featured, ...rest] = posts;

  return (
    <>
      <BlogHero />
      {featured && <FeaturedPost post={featured} />}
      <BlogExplorer posts={rest} />
      <Newsletter />
      <CTA title={t("title")} buttonLabel={t("button")} />
    </>
  );
}
