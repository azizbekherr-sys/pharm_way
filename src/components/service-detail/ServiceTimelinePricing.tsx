"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Clock, Tag } from "lucide-react";

export default function ServiceTimelinePricing({ slug }: { slug: string }) {
  const t = useTranslations("serviceDetail");
  const timeline = t(`items.${slug}.timeline`);

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-soft"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-white"
            style={{ background: "#1B3A6B" }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">{t("timelineLabel")}</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{timeline}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-7 shadow-soft"
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] text-white"
            style={{ background: "#1B3A6B" }}
          >
            <Tag size={22} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">{t("priceLabel")}</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{t("priceValue")}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
