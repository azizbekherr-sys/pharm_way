"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Quote, Star } from "lucide-react";
import { initials } from "@/lib/initials";
import { testimonialCategories, TESTIMONIAL_AVATAR_GRADIENTS, type TestimonialCategory } from "@/config/site";

type CategoryKey = (typeof testimonialCategories)[number];

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  flag: string;
  country: string;
  category: TestimonialCategory;
};

export default function TestimonialsExplorer() {
  const t = useTranslations("testimonialsPage");
  const tCategories = useTranslations("testimonialsPage.categories");
  const testimonials = t.raw("testimonials") as Testimonial[];

  const [category, setCategory] = useState<CategoryKey>("all");

  const filtered = useMemo(
    () => testimonials.filter((item) => category === "all" || item.category === category),
    [testimonials, category]
  );

  return (
    <section className="section-pad bg-white pt-8">
      <div className="container-page">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {testimonialCategories.map((key) => {
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
            {filtered.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-premium"
              >
                <Quote className="h-8 w-8 text-primary-100" fill="currentColor" strokeWidth={0} />

                <div className="mt-3 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star key={starIdx} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{item.quote}</p>

                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${
                      TESTIMONIAL_AVATAR_GRADIENTS[i % TESTIMONIAL_AVATAR_GRADIENTS.length]
                    }`}
                  >
                    {initials(item.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.role}, {item.company}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.flag} {item.country}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
