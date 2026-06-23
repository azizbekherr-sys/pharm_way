"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Handshake, Zap, Globe2, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Handshake, Zap, Globe2];

export default function WhyPartner() {
  const t = useTranslations("partnersPage.whyPartner");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-premium"
              >
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-[12px] text-white transition-transform duration-200 group-hover:scale-110"
                  style={{ background: "#1B3A6B" }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
