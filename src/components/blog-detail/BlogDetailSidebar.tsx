"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Tag } from "lucide-react";
import { blogCategories, BLOG_CATEGORY_STYLES, type BlogCategory } from "@/config/site";
import type { BlogPostData } from "@/types/blog";

export default function BlogDetailSidebar({ allPosts, currentSlug }: { allPosts: BlogPostData[]; currentSlug: string }) {
  const tSidebar = useTranslations("blog.sidebar");
  const tCategories = useTranslations("blog.categories");

  const recentPosts = useMemo(
    () => allPosts.filter((p) => p.slug !== currentSlug).slice(0, 3),
    [allPosts, currentSlug]
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of allPosts) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return counts;
  }, [allPosts]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const post of allPosts) {
      post.tags.forEach((tag) => tags.add(tag));
    }
    return Array.from(tags);
  }, [allPosts]);

  return (
    <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6">
        <h3 className="text-lg font-bold text-gray-900">{tSidebar("ctaTitle")}</h3>
        <p className="mt-2 text-sm text-slate-600">{tSidebar("ctaSubtitle")}</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-soft active:translate-y-0"
        >
          {tSidebar("ctaButton")}
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-gray-900">{tSidebar("recentTitle")}</h3>
        <div className="mt-4 flex flex-col gap-4">
          {recentPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex gap-3">
              <span
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${BLOG_CATEGORY_STYLES[post.category as BlogCategory].split(" ")[0]}`}
              />
              <div>
                <p className="line-clamp-2 text-sm font-medium text-gray-800 transition-colors group-hover:text-primary-700">
                  {post.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-gray-900">{tSidebar("categoriesTitle")}</h3>
        <ul className="mt-4 flex flex-col gap-2.5">
          {blogCategories
            .filter((key): key is BlogCategory => key !== "all")
            .map((key) => (
              <li key={key}>
                <Link
                  href="/blog"
                  className="flex items-center justify-between text-sm text-slate-600 transition-colors hover:text-primary-700"
                >
                  <span>{tCategories(key)}</span>
                  <span className="text-xs text-slate-400">{categoryCounts.get(key) ?? 0}</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-200 p-6">
        <h3 className="text-base font-bold text-gray-900">{tSidebar("tagsTitle")}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              <Tag size={11} />#{tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
