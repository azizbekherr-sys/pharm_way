"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function BecomePartner() {
  const t = useTranslations("partnersPage.becomePartner");
  const benefits = t.raw("benefits") as string[];
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
  }

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-slate-500">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.ul
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-soft">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-secondary-600" />
                <span className="text-base text-gray-900">{benefit}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-premium"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center px-2 py-8 text-center"
                >
                  <CheckCircle2 className="h-12 w-12 text-secondary-600" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("form.successTitle")}</h3>
                  <p className="mt-1 text-base text-slate-500">{t("form.successMessage")}</p>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-900">{t("form.company")}</span>
                    <input type="text" name="company" required className="form-input" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-900">{t("form.contactPerson")}</span>
                    <input type="text" name="contactPerson" required className="form-input" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-900">{t("form.phone")}</span>
                    <input type="tel" name="phone" required className="form-input" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-gray-900">{t("form.message")}</span>
                    <textarea name="message" rows={3} className="form-input resize-none" />
                  </label>
                  <button type="submit" className="btn-primary w-full !py-3.5">
                    {t("form.submit")}
                    <ArrowRight size={16} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
