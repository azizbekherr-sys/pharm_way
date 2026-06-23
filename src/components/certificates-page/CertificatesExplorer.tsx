"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Award, BadgeCheck, ShieldCheck, FileCheck, X, ArrowRight } from "lucide-react";
import {
  certificateCategories,
  CERTIFICATE_CATEGORY_STYLES,
  type CertificateCategory,
} from "@/config/site";

type CategoryKey = (typeof certificateCategories)[number];

type Certificate = {
  title: string;
  issuer: string;
  category: CertificateCategory;
  date: string;
  description: string;
  details: string;
};

const CATEGORY_ICONS: Record<CertificateCategory, typeof Award> = {
  gmp: ShieldCheck,
  iso: BadgeCheck,
  registration: FileCheck,
  license: Award,
};

export default function CertificatesExplorer({ onRequest }: { onRequest: (title: string) => void }) {
  const t = useTranslations("certificatesPage");
  const tCategories = useTranslations("certificatesPage.categories");
  const tModal = useTranslations("certificatesPage.modal");
  const certificates = t.raw("items") as Certificate[];

  const [category, setCategory] = useState<CategoryKey>("all");
  const [selected, setSelected] = useState<Certificate | null>(null);

  const filtered = useMemo(
    () => certificates.filter((item) => category === "all" || item.category === category),
    [certificates, category]
  );

  return (
    <section className="section-pad bg-white pt-8">
      <div className="container-page">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {certificateCategories.map((key) => {
            const isActive = category === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-soft"
                    : "border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-700"
                }`}
              >
                {tCategories(key)}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((item, i) => {
              const Icon = CATEGORY_ICONS[item.category];
              return (
                <motion.button
                  key={item.title}
                  type="button"
                  onClick={() => setSelected(item)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-premium"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${CERTIFICATE_CATEGORY_STYLES[item.category]}`}
                    >
                      {tCategories(item.category)}
                    </span>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.issuer}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.description}</p>

                  <span className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary-700">
                    {tModal("issuedBy")} · {item.date}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-[24px] bg-white p-7 shadow-premium sm:p-9"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label={tModal("close")}
                className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={20} />
              </button>

              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                {(() => {
                  const Icon = CATEGORY_ICONS[selected.category];
                  return <Icon size={26} strokeWidth={1.75} />;
                })()}
              </span>

              <h3 className="mt-5 text-2xl font-bold text-gray-900">{selected.title}</h3>

              <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-sm">
                <div>
                  <dt className="text-slate-500">{tModal("issuedBy")}</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">{selected.issuer}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{tModal("categoryLabel")}</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">{tCategories(selected.category)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{tModal("dateLabel")}</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">{selected.date}</dd>
                </div>
              </dl>

              <p className="mt-5 text-sm leading-relaxed text-slate-600">{selected.details}</p>

              <button
                type="button"
                onClick={() => {
                  const title = selected.title;
                  setSelected(null);
                  onRequest(title);
                }}
                className="btn-primary mt-7 w-full !py-3.5"
              >
                {tModal("requestButton")}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
