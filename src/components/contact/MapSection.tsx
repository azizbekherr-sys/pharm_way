"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Navigation } from "lucide-react";
import { siteConfig } from "@/config/site";

type Locale = "uz" | "ru" | "en";

const MAP_LINKS: { key: string; label: Record<Locale, string>; href: string; dot: string }[] = [
  {
    key: "yandex",
    label: { uz: "Yandex Xarita", ru: "Яндекс Карты", en: "Yandex Maps" },
    href: siteConfig.maps.yandex,
    dot: "bg-[#FC3F1D]",
  },
  {
    key: "google",
    label: { uz: "Google Maps", ru: "Google Карты", en: "Google Maps" },
    href: siteConfig.maps.google,
    dot: "bg-[#34A853]",
  },
  { key: "2gis", label: { uz: "2GIS", ru: "2ГИС", en: "2GIS" }, href: siteConfig.maps.twoGis, dot: "bg-[#19AA1E]" },
];

export default function MapSection() {
  const t = useTranslations("contact.map");
  const locale = useLocale() as Locale;
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("heading")}</h2>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a
            href={siteConfig.maps.yandex}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 text-base font-medium text-slate-700 transition-colors hover:text-primary-700"
          >
            <MapPin size={20} className="mt-0.5 shrink-0 text-primary-600" />
            <span>{address}</span>
          </a>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Navigation size={15} />
              {t("openIn")}:
            </span>
            {MAP_LINKS.map((m) => (
              <a
                key={m.key}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700"
              >
                <span className={`h-2.5 w-2.5 rounded-full ${m.dot}`} aria-hidden />
                {m.label[locale] ?? m.label.uz}
              </a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-6 overflow-hidden rounded-[24px] shadow-premium"
        >
          <iframe
            src={siteConfig.mapEmbedUrl}
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={t("heading")}
          />
        </motion.div>
        <p className="mt-3 text-sm text-slate-500">{t("route")}</p>
      </div>
    </section>
  );
}
