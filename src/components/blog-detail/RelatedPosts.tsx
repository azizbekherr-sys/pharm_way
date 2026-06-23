"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, Clock, Newspaper, Eye } from "lucide-react";
import { BLOG_CATEGORY_STYLES, type BlogCategory } from "@/config/site";
import type { BlogPostData } from "@/types/blog";

export default function RelatedPosts({ posts }: { posts: BlogPostData[] }) {
  const t = useTranslations("blog");
  const tCategories = useTranslations("blog.categories");

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-slate-200 bg-slate-50 py-16 sm:py-20">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          {t("relatedTitle")}
        </motion.h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => {
            const category = post.category as BlogCategory;
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
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
                    <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${BLOG_CATEGORY_STYLES[category]}`}>
                      {tCategories(category)}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-primary-700">
                      {post.title}
                    </h3>
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
        </div>
      </div>
    </section>
  );
}
