"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export default function ServiceProcessSteps({ slug }: { slug: string }) {
  const t = useTranslations("serviceDetail");
  const steps = t.raw(`items.${slug}.process`) as string[];

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("processHeading")}</h2>

        <div className="relative mt-10">
          <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-primary-200" />
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex items-center gap-5"
              >
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-base font-bold text-white shadow-soft">
                  {i + 1}
                </div>
                <div className="flex flex-1 items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-soft">
                  <span className="text-base font-semibold text-gray-900">{step}</span>
                  {i < steps.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
