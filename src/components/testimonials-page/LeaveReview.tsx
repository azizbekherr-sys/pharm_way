"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, CheckCircle2, ArrowRight } from "lucide-react";

export default function LeaveReview() {
  const t = useTranslations("testimonialsPage.leaveReview");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
    setRating(0);
  }

  return (
    <section className="bg-primary-50 py-16 sm:py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl rounded-[24px] border border-slate-200 bg-white p-7 shadow-premium sm:p-9"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("title")}</h2>
            <p className="mt-2 text-base text-slate-600">{t("subtitle")}</p>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 flex flex-col items-center rounded-2xl bg-secondary-50 px-6 py-10 text-center"
              >
                <CheckCircle2 className="h-12 w-12 text-secondary-600" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("successTitle")}</h3>
                <p className="mt-1 text-base text-slate-500">{t("successMessage")}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-semibold text-primary-700 hover:text-primary-800"
                >
                  {t("title")} →
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{t("ratingLabel")}</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const value = i + 1;
                      const filled = value <= (hovered || rating);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          onMouseEnter={() => setHovered(value)}
                          onMouseLeave={() => setHovered(0)}
                          aria-label={`${value}`}
                          className="p-0.5 transition-transform duration-150 hover:scale-110"
                        >
                          <Star
                            size={28}
                            className={filled ? "text-amber-500" : "text-slate-300"}
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label={t("name")} required>
                    <input type="text" name="name" required className="form-input" />
                  </Field>
                  <Field label={t("company")}>
                    <input type="text" name="company" className="form-input" />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label={t("role")}>
                    <input type="text" name="role" className="form-input" />
                  </Field>
                  <Field label={t("country")}>
                    <input type="text" name="country" className="form-input" />
                  </Field>
                </div>

                <Field label={t("message")} required>
                  <textarea name="message" rows={4} required className="form-input resize-none" />
                </Field>

                <button type="submit" className="btn-primary w-full !py-3.5">
                  {t("submit")}
                  <ArrowRight size={16} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-primary-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
