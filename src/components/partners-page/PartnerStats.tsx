"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function PartnerStats() {
  const t = useTranslations("partnersPage");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="bg-white pb-4 pt-16 sm:pt-20">
      <div className="container-page grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft"
          >
            <div className="text-3xl font-bold text-primary-700 sm:text-4xl">{stat.value}</div>
            <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
