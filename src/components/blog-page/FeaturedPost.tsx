"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, Clock, ArrowRight, Eye } from "lucide-react";
import { BLOG_CATEGORY_STYLES, type BlogCategory } from "@/config/site";
import type { BlogPostData } from "@/types/blog";

export default function FeaturedPost({ post }: { post: BlogPostData }) {
  const t = useTranslations("blog");
  const tCategories = useTranslations("blog.categories");
  const category = post.category as BlogCategory;

  return (
    <section className="bg-white pb-4 pt-16 sm:pt-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-premium lg:grid-cols-2"
        >
          <div className="relative aspect-video lg:aspect-auto">
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col p-7 sm:p-9">
            <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${BLOG_CATEGORY_STYLES[category]}`}>
              {tCategories(category)}
            </span>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">{post.title}</h2>
            <p className="mt-3 flex-1 text-base leading-relaxed text-slate-500">{post.excerpt}</p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={15} />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye size={15} />
                {post.views}
              </span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-soft active:translate-y-0"
            >
              {t("readMore")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
