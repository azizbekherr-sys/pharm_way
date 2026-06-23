"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

export default function Geography() {
  const t = useTranslations("about.geography");
  const countries = t.raw("countries") as string[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-slate-500">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {countries.map((country, i) => (
            <motion.div
              key={country}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center shadow-soft"
            >
              <MapPin size={20} className="text-primary-600" />
              <span className="text-base font-semibold text-gray-900">{country}</span>
              {i === 0 && (
                <span className="rounded-full bg-secondary-50 px-2.5 py-0.5 text-xs font-medium text-secondary-700">
                  {t("mainMarket")}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
