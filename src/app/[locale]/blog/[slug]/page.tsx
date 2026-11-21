/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog";
import JsonLd from "@/components/seo/JsonLd";
import { BLOG_CATEGORY_LABEL } from "@/components/site/SiteBlocks";
import { siteContext } from "@/components/site/page-helpers";
import { split } from "@/components/site/split";
import { buildPageMetadata, buildBlogPostingJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

// ISR: maqola birinchi ochilganda statik HTML bo'lib keshlanadi va 5 daqiqada yangilanadi
// (admin saqlaganda darhol). Bo'sh generateStaticParams — barcha maqolalar talab bo'yicha
// statik generatsiya qilinadi (aks holda Next.js sahifani har so'rovda render qiladi).
export const revalidate = 300;
export const dynamicParams = true;
export async function generateStaticParams() {
  return [];
}

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

  const { t, L } = siteContext(locale);
  const allPosts = await getPublishedBlogPosts(locale);
  const related = [
    ...allPosts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...allPosts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 5);
  const category = t(BLOG_CATEGORY_LABEL[post.category] ?? post.category);

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
      { name: t("Bosh sahifa"), path: "" },
      { name: t("Blog"), path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <div className="site-view active" data-page="blog-post">
      <JsonLd data={jsonLd} />

      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">
                  <Link href={L("/blog")}>{t("Blog")}</Link> · {category}
                </div>
                <h1 data-split="" className="split-ready">
                  {split(post.title)}
                </h1>
                {post.excerpt && <p className="lead">{post.excerpt}</p>}
                <div className="article-meta">
                  <time dateTime={post.publishedAt}>{post.date}</time>
                  <span className="dot" aria-hidden="true" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="section">
        <div className="container article-wrap">
          <article className="reveal">
            {post.image && (
              <div className="article-cover">
                <img src={post.image} alt={post.title} width={900} height={506} decoding="async" />
              </div>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          <aside className="article-aside">
            {related.length > 0 && (
              <div className="card">
                <h3>{t("Boshqa maqolalar")}</h3>
                {related.map((p) => (
                  <Link key={p.slug} href={L(`/blog/${p.slug}`)}>
                    {p.title}
                  </Link>
                ))}
                <Link href={L("/blog")} className="text-link u-mt-12">
                  {t("Barcha maqolalar")}
                </Link>
              </div>
            )}
            <div className="card">
              <h3>{t("Bepul konsultatsiya")}</h3>
              <p className="text small">{t("Mutaxassislarimiz bilan bepul konsultatsiya olish uchun bog‘laning.")}</p>
              <Link className="button u-mt-12" href={L("/contact#assessment-form")}>
                <span>{t("Bog‘lanish")}</span>
                <span className="round">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-arrow-right" />
                  </svg>
                </span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-panel reveal">
            <div className="cta-body">
              <h2 data-split="" className="split-ready">
                {split(t("Maqolalarimiz haqida savollaringiz bormi?"))}
              </h2>
              <p>{t("Mutaxassislarimiz bilan bepul konsultatsiya olish uchun bog‘laning.")}</p>
              <Link className="button light" href={L("/contact#assessment-form")}>
                <span>{t("Bog‘lanish")}</span>
                <span className="round">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-arrow-right" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
