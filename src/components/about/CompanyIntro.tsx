"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function CompanyIntro() {
  const t = useTranslations("about.intro");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">{t("heading")}</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-500">{t("text")}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
            >
              <div className="text-3xl font-bold text-primary-700 sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-base text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
