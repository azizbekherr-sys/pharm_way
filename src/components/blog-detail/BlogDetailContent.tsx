"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Tag, Share2, ArrowLeft, Send, Linkedin, Link2, Check } from "lucide-react";
import type { BlogPostData } from "@/types/blog";

export default function BlogDetailContent({ post }: { post: BlogPostData }) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <article className="blog-article" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
          >
            <Tag size={12} />#{tag}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-6">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <Share2 size={15} />
          {t("shareLabel")}
        </span>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-700"
          aria-label="Telegram"
        >
          <Send size={15} />
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-700"
          aria-label="LinkedIn"
        >
          <Linkedin size={15} />
        </a>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary-200 hover:text-primary-700"
          aria-label={t("copyLink")}
        >
          {copied ? <Check size={15} /> : <Link2 size={15} />}
        </button>
        {copied && <span className="text-xs font-medium text-secondary-600">{t("copied")}</span>}
      </div>

      <Link
        href="/blog"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
      >
        <ArrowLeft size={16} />
        {t("backLink")}
      </Link>
    </motion.div>
  );
}
