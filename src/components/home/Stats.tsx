"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { Package, Handshake, Globe2, TrendingUp } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

export default function Stats() {
  const t = useTranslations("home.stats");
  const tHero = useTranslations("home.hero");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const items = [
    { icon: Package, value: tHero("stat1Value"), label: tHero("stat1Label") },
    { icon: Handshake, value: tHero("stat2Value"), label: tHero("stat2Label") },
    { icon: Globe2, value: tHero("stat3Value"), label: tHero("stat3Label") },
    { icon: TrendingUp, value: tHero("stat4Value"), label: tHero("stat4Label") },
  ];

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page" ref={ref}>
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
        <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {items.map((item, i) => (
            <StatCard key={item.label} item={item} inView={inView} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  item,
  inView,
  delay,
}: {
  item: { icon: typeof Package; value: string; label: string };
  inView: boolean;
  delay: number;
}) {
  const value = useCountUp(item.value, inView);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay }}
      className="glass-card flex flex-col items-center px-4 py-8 text-center"
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-[12px] text-white shadow-soft"
        style={{ background: "#1B3A6B" }}
      >
        <Icon size={22} />
      </div>
      <div className="mt-4 text-4xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-base text-slate-500">{item.label}</div>
    </motion.div>
  );
}
