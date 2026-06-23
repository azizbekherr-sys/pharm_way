"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Stethoscope } from "lucide-react";

type CTAProps = {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  href?: string;
};

export default function CTA({ title, subtitle, buttonLabel, href = "/contact" }: CTAProps) {
  const t = useTranslations("home.cta");

  return (
    <section className="section-pad relative overflow-hidden bg-primary-700">
      <Stethoscope className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-white/10" strokeWidth={1} />

      <div className="container-page relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">{title ?? t("title")}</h2>
          <p className="mt-4 text-lg text-white/80">{subtitle ?? t("subtitle")}</p>
          <Link
            href={href}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-primary-700 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-premium active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
          >
            {buttonLabel ?? t("button")}
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
