"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Flag } from "lucide-react";

export default function HistoryTimeline() {
  const t = useTranslations("about.history");
  const milestones = t.raw("milestones") as { year: string; text: string }[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-primary-200" />
          <div className="space-y-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex gap-5"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-primary-100">
                  <Flag className="h-5 w-5 text-primary-600" />
                </div>
                <div className="pt-1.5">
                  <div className="text-base font-bold text-primary-700">{m.year}</div>
                  <p className="mt-1 text-lg leading-relaxed text-slate-600">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
