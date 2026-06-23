"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Search, Calendar, Clock, ChevronLeft, ChevronRight, Newspaper, Eye } from "lucide-react";
import { blogCategories, BLOG_CATEGORY_STYLES, type BlogCategory } from "@/config/site";
import type { BlogPostData } from "@/types/blog";

type CategoryKey = (typeof blogCategories)[number];

export default function BlogExplorer({ posts }: { posts: BlogPostData[] }) {
  const t = useTranslations("blog");
  const tCategories = useTranslations("blog.categories");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory = category === "all" || post.category === category;
      const matchesQuery = !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  return (
    <section className="section-pad bg-white pt-8">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="form-input pl-12"
            />
          </div>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:justify-end sm:px-0">
            {blogCategories.map((key) => {
              const isActive = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-soft"
                      : "border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-700"
                  }`}
                >
                  {tCategories(key)}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
            <Newspaper className="h-10 w-10 text-slate-400" />
            <p className="mt-4 max-w-sm text-base text-slate-500">{t("search.noResults")}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((post, i) => {
                const cat = post.category as BlogCategory;
                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-premium"
                    >
                      <div className="relative aspect-video">
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <Newspaper className="absolute bottom-4 right-4 h-10 w-10 text-slate-300" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${BLOG_CATEGORY_STYLES[cat]}`}>
                          {tCategories(cat)}
                        </span>
                        <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
                          {post.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{post.excerpt}</p>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={13} />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={13} />
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Eye size={13} />
                            {post.views}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">{t("pagination.showing")}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
              aria-label={t("pagination.prev")}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
              1
            </span>
            <button
              type="button"
              disabled
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 disabled:cursor-not-allowed"
              aria-label={t("pagination.next")}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
