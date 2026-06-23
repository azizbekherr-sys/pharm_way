"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, Clock, ChevronRight, Eye } from "lucide-react";
import { BLOG_CATEGORY_STYLES, type BlogCategory } from "@/config/site";
import type { BlogPostData } from "@/types/blog";

export default function BlogDetailHeader({ post }: { post: BlogPostData }) {
  const tNav = useTranslations("nav");
  const tBlog = useTranslations("blog");
  const tCategories = useTranslations("blog.categories");
  const category = post.category as BlogCategory;

  return (
    <section className="relative overflow-hidden bg-primary-700 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id="pharma-pattern-blog-detail" width="84" height="84" patternUnits="userSpaceOnUse">
            <path d="M14 4v12M8 10h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="50" r="3" fill="white" />
            <circle cx="72" cy="42" r="3" fill="white" />
            <circle cx="72" cy="58" r="3" fill="white" />
            <path d="M60 50 72 42M60 50 72 58" stroke="white" strokeWidth="1.5" />
            <path d="M40 76v12M34 82h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pharma-pattern-blog-detail)" />
      </svg>

      <div className="container-page relative">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-1.5 text-sm text-white/60"
        >
          <Link href="/" className="transition-colors hover:text-white">
            {tNav("home")}
          </Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="transition-colors hover:text-white">
            {tBlog("hero.breadcrumb")}
          </Link>
          <ChevronRight size={14} />
          <span className="line-clamp-1 text-white">{post.title}</span>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${BLOG_CATEGORY_STYLES[category]}`}>
            {tCategories(category)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-white/70">
            <Calendar size={14} />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-white/70">
            <Clock size={14} />
            {post.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-white/70">
            <Eye size={14} />
            {post.views}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          {post.title}
        </motion.h1>

      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="container-page relative mt-10"
      >
        <div className="relative aspect-[16/7] overflow-hidden rounded-[20px]">
          {post.image && (
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
