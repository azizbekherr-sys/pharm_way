"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, MessageCircle, Handshake, CheckCircle2, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Star, MessageCircle, Handshake, CheckCircle2];

export default function TestimonialsStats() {
  const t = useTranslations("testimonialsPage");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="bg-white pb-4 pt-16 sm:pt-20">
      <div className="container-page grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft"
            >
              <Icon className="mx-auto h-7 w-7 text-amber-500" />
              <div className="mt-2 text-3xl font-bold text-primary-700 sm:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
