"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";
import { initials } from "@/lib/initials";

export default function FeaturedTestimonial() {
  const t = useTranslations("testimonialsPage.featured");

  return (
    <section className="bg-white pb-4 pt-10">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-primary-50 via-primary-50 to-secondary-50 p-8 shadow-premium sm:p-12"
        >
          <Quote className="absolute right-8 top-8 h-20 w-20 text-primary-200" strokeWidth={1.5} />

          <div className="relative flex items-center gap-1 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
            ))}
          </div>

          <p className="relative mt-6 max-w-3xl text-xl font-medium leading-relaxed text-gray-900 sm:text-2xl">
            {t("quote")}
          </p>

          <div className="relative mt-8 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-lg font-bold text-white">
              {initials(t("name"))}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{t("name")}</p>
              <p className="text-sm text-slate-500">{t("role")}</p>
              <p className="mt-0.5 text-sm text-slate-500">
                {t("flag")} {t("country")}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
