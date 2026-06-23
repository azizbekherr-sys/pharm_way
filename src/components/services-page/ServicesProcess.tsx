"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PhoneCall, SearchCheck, FileSignature, Cog, Trophy, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [PhoneCall, SearchCheck, FileSignature, Cog, Trophy];

export default function ServicesProcess() {
  const t = useTranslations("servicesPage.process");
  const steps = t.raw("steps") as { title: string; desc: string }[];

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page">
        <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>

        <div className="relative mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-primary-200 lg:block" />
          {steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-soft">
                  <Icon size={24} />
                </div>
                <div className="mt-2 text-xs font-bold text-primary-600">0{i + 1}</div>
                <h3 className="mt-1 text-base font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
