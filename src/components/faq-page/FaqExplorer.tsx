"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Search, ChevronDown, MessageCircle } from "lucide-react";

type FaqItem = { category: string; q: string; a: string };

const CATEGORY_KEYS = ["all", "registration", "documents", "pricing", "logistics", "general"] as const;
type CategoryKey = (typeof CATEGORY_KEYS)[number];

export default function FaqExplorer() {
  const t = useTranslations("faqPage");
  const items = t.raw("items") as FaqItem[];
  const categories = t.raw("categories") as Record<CategoryKey, string>;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "all" || item.category === category;
      const matchesQuery = !q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, query, category]);

  const isSearching = query.trim().length > 0;

  return (
    <>
      <section className="bg-white pb-4">
        <div className="container-page">
          <div className="-mt-10 rounded-2xl border border-slate-200 bg-white p-3 shadow-premium sm:-mt-12">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpenIndex(0);
                }}
                placeholder={t("search.placeholder")}
                className="w-full rounded-xl border-0 bg-transparent py-3.5 pl-12 pr-4 text-base text-gray-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-white pt-8">
        <div className="container-page">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {CATEGORY_KEYS.map((key) => {
              const isActive = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCategory(key);
                    setOpenIndex(0);
                  }}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary-600 text-white shadow-soft"
                      : "border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-700"
                  }`}
                >
                  {categories[key]}
                </button>
              );
            })}
          </div>

          {isSearching && (
            <p className="mt-6 text-sm text-slate-500">
              {t("search.resultsFound", { count: filtered.length })}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center">
              <MessageCircle className="h-10 w-10 text-slate-400" />
              <p className="mt-4 max-w-sm text-base text-slate-500">{t("search.noResults")}</p>
            </div>
          ) : (
            <div className="mt-8 space-y-3">
              {filtered.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={`${item.q}-${i}`}
                    className={`overflow-hidden rounded-2xl border bg-white shadow-soft transition-colors duration-200 ${
                      isOpen ? "border-l-4 border-l-primary-600 border-y-slate-200 border-r-slate-200" : "border-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-semibold text-gray-900">{item.q}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-primary-600"
                      >
                        <ChevronDown size={20} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 text-base leading-relaxed text-slate-500">{item.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
