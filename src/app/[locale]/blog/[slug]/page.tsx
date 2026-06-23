import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug, getPublishedBlogPosts, incrementBlogPostViews } from "@/lib/blog";
import BlogDetailHeader from "@/components/blog-detail/BlogDetailHeader";
import BlogDetailContent from "@/components/blog-detail/BlogDetailContent";
import BlogDetailSidebar from "@/components/blog-detail/BlogDetailSidebar";
import RelatedPosts from "@/components/blog-detail/RelatedPosts";
import CTA from "@/components/home/CTA";
import { buildPageMetadata, buildBlogPostingJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);
  if (!post) return {};

  const metadata = buildPageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: `${post.title} | Pharm Way Group`,
    description: post.excerpt || post.title,
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
  await incrementBlogPostViews(slug);
  post.views += 1;
  const allPosts = await getPublishedBlogPosts(locale);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const fallbackRelated =
    relatedPosts.length > 0 ? relatedPosts : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = buildBlogPostingJsonLd({
    locale,
    slug: post.slug,
    title: post.title,
    description: post.excerpt || post.title,
    image: post.image,
    datePublished: post.publishedAt,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
