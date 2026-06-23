"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/config/site";
import { SERVICE_ICONS } from "@/config/service-icons";

export default function ServicesGrid() {
  const t = useTranslations("home.services");
  const tPage = useTranslations("servicesPage");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            const item = items[i];
            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.07 }}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col rounded-[20px] border border-slate-200 bg-white p-8 transition-all duration-200 hover:-translate-y-1.5 hover:border-transparent hover:shadow-premium"
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-[16px] text-white shadow-soft transition-transform duration-200 group-hover:scale-110"
                    style={{ background: "#1B3A6B" }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{item?.title}</h3>
                  <p className="mt-2 flex-1 text-base leading-relaxed text-slate-500">{item?.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-all duration-200 group-hover:translate-x-1">
                    {tPage("detailLabel")}
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
