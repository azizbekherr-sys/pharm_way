import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BlogView from "@/components/site/views/blog";
import JsonLd from "@/components/seo/JsonLd";
import { BlogChips, BlogGrid } from "@/components/site/SiteBlocks";
import { siteContext } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";
import { getPublishedBlogPosts } from "@/lib/blog";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.blog" });
  return buildPageMetadata({ locale, path: "/blog", title: t("title"), description: t("description") });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ctx = siteContext(locale);
  const posts = await getPublishedBlogPosts(locale);
  const breadcrumb = await sectionBreadcrumb(locale, "blog", "/blog");
  return (
    <>
      <JsonLd data={breadcrumb} />
      <BlogView
        {...ctx}
        slots={{
          chips: <BlogChips posts={posts} t={ctx.t} />,
          posts: <BlogGrid posts={posts} t={ctx.t} L={ctx.L} />,
        }}
      />
    </>
  );
}
