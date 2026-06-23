"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle } from "lucide-react";

export default function ServiceOverview({ slug }: { slug: string }) {
  const t = useTranslations("serviceDetail");
  const overview = t.raw(`items.${slug}.overview`) as string[];
  const benefits = t.raw(`items.${slug}.benefits`) as string[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("overviewHeading")}</h2>
          <div className="mt-5 space-y-4">
            {overview.map((para, i) => (
              <p key={i} className="text-base leading-relaxed text-slate-500">
                {para}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("benefitsHeading")}</h2>
          <ul className="mt-5 space-y-3">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
                <span className="text-base text-gray-900">{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
