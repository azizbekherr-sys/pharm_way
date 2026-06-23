"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/config/site";

export default function MapSection() {
  const t = useTranslations("contact.map");

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("heading")}</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-8 overflow-hidden rounded-[24px] shadow-premium"
        >
          <iframe
            src={siteConfig.mapEmbedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("heading")}
          />
        </motion.div>
      </div>
    </section>
  );
}
