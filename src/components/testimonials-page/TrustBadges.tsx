"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Award, CheckCircle2, ShieldCheck, Globe2, BadgeCheck, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Award, CheckCircle2, ShieldCheck, Globe2, BadgeCheck];

export default function TrustBadges() {
  const t = useTranslations("testimonialsPage.trust");
  const badges = t.raw("badges") as string[];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl font-bold text-gray-900 sm:text-3xl"
        >
          {t("title")}
        </motion.h2>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {badges.map((badge, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 px-4 py-6 text-center shadow-soft"
              >
                <Icon className="h-8 w-8 text-primary-600" strokeWidth={1.5} />
                <span className="text-sm font-medium text-gray-800">{badge}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
