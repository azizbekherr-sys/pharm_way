"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";

const GRADIENTS = ["from-slate-800 to-primary-900", "from-primary-900 to-slate-800", "from-slate-900 to-primary-800"];

export default function VideoTestimonials() {
  const t = useTranslations("testimonialsPage.video");
  const items = t.raw("items") as { title: string; duration: string }[];

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-xl text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("title")}</h2>
          <p className="mt-3 text-base text-slate-600">{t("subtitle")}</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-premium ${GRADIENTS[i % GRADIENTS.length]}`}
            >
              <span className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium text-white">
                {item.duration}
              </span>

              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                <Play className="h-7 w-7 text-white" fill="currentColor" strokeWidth={0} />
              </span>

              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10 text-sm font-medium text-white">
                {item.title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
