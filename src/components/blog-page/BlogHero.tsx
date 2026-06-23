"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export default function BlogHero() {
  const t = useTranslations("blog.hero");
  const tNav = useTranslations("nav");

  return (
    <section className="relative overflow-hidden bg-primary-700 pb-16 pt-32 sm:pb-20 sm:pt-40">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]" aria-hidden="true">
        <defs>
          <pattern id="pharma-pattern-blog" width="84" height="84" patternUnits="userSpaceOnUse">
            <path d="M14 4v12M8 10h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <circle cx="60" cy="50" r="3" fill="white" />
            <circle cx="72" cy="42" r="3" fill="white" />
            <circle cx="72" cy="58" r="3" fill="white" />
            <path d="M60 50 72 42M60 50 72 58" stroke="white" strokeWidth="1.5" />
            <path d="M40 76v12M34 82h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pharma-pattern-blog)" />
      </svg>

      <div className="container-page relative">
        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-1.5 text-sm text-white/60"
        >
          <Link href="/" className="transition-colors hover:text-white">
            {tNav("home")}
          </Link>
          <ChevronRight size={14} />
          <span className="text-white">{t("breadcrumb")}</span>
        </motion.nav>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-xl text-lg text-white/75"
        >
          {t("subtitle")}
        </motion.p>
      </div>
    </section>
  );
}
