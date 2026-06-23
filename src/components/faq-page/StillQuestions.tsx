"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function StillQuestions() {
  const t = useTranslations("faqPage.stillQuestions");

  return (
    <section className="section-pad bg-primary-50">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-slate-500">{t("subtitle")}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              <Phone size={16} />
              {t("consultBtn")}
            </Link>
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle size={16} />
              {t("telegramBtn")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
