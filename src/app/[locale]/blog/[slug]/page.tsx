import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog";
import BlogDetailHeader from "@/components/blog-detail/BlogDetailHeader";
import BlogDetailContent from "@/components/blog-detail/BlogDetailContent";
import BlogDetailSidebar from "@/components/blog-detail/BlogDetailSidebar";
import RelatedPosts from "@/components/blog-detail/RelatedPosts";
import CTA from "@/components/home/CTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata, buildBlogPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

// ISR: maqola statik HTML sifatida keshlanadi (avval har so'rovda ~4 s render bo'lardi).
// Admin maqolani saqlasa /api/blog darhol revalidate qiladi. Ko'rishlar soni
// /api/track orqali (PageTracker) hisoblanadi.
export const revalidate = 300;

function wordCount(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);
  if (!post || !post.locales.includes(locale)) return {};

  const metadata = buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title} | Pharm Way Group`,
    description: post.excerpt || post.title,
    locales: post.locales,
    article: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt, section: post.category, tags: post.tags },
  });

  if (post.image) {
    metadata.openGraph = { ...metadata.openGraph, images: [{ url: post.image, width: 900, height: 506, alt: post.title }] };
    metadata.twitter = { ...metadata.twitter, images: [post.image] };
  }

  return metadata;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(locale, slug);
  if (!post) notFound();
  // Bu tilga tarjima qilinmagan maqola — aralash tilli takror sahifa o'rniga asl (uz) versiyaga.
  if (!post.locales.includes(locale)) permanentRedirect(`/uz/blog/${slug}`);
  const allPosts = await getPublishedBlogPosts(locale);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const fallbackRelated =
    relatedPosts.length > 0 ? relatedPosts : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const jsonLd = [
    buildBlogPostingJsonLd({
      locale,
      slug: post.slug,
      title: post.title,
      description: post.excerpt || post.title,
      image: post.image,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
      section: post.category,
      tags: post.tags,
      wordCount: wordCount(post.content),
    }),
    buildBreadcrumbJsonLd(locale, [
      { name: tNav("home"), path: "" },
      { name: tNav("blog"), path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      <BlogDetailHeader post={post} />

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
          <BlogDetailContent post={post} />
          <BlogDetailSidebar allPosts={allPosts} currentSlug={post.slug} />
        </div>
      </section>

      <RelatedPosts posts={fallbackRelated} />

      <CTA />
    </>
  );
}
