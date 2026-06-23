"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText, SearchCheck, BadgeCheck, Rocket, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [FileText, SearchCheck, BadgeCheck, Rocket];

export default function ProcessTimeline() {
  const t = useTranslations("home.process");
  const steps = t.raw("steps") as { title: string; desc: string }[];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
      <p className="mt-4 max-w-md text-lg text-slate-500">{t("subtitle")}</p>

      <div className="relative mt-10">
        <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-primary-200" />

        <div className="space-y-8">
          {steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex gap-5 pl-0"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white shadow-soft ring-1 ring-primary-100">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="pt-1.5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <span className="mr-2 text-primary-400">0{i + 1}</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-base leading-relaxed text-slate-500">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
