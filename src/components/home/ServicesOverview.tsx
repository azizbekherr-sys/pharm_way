"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/config/site";
import { SERVICE_ICONS } from "@/config/service-icons";

export default function ServicesOverview() {
  const t = useTranslations("home.services");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-slate-500">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            const item = items[i];
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-[20px] border border-slate-200 bg-white p-7 transition-all duration-200 hover:-translate-y-1.5 hover:border-transparent hover:shadow-premium"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-[16px] text-white shadow-soft transition-transform duration-200 group-hover:scale-110"
                    style={{ background: "#1B3A6B" }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900">{item?.title}</h3>
                  <p className="mt-2 flex-1 text-base leading-relaxed text-slate-500">{item?.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-secondary-600 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
