"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const t = useTranslations("blog.newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <section className="bg-primary-50 py-16 sm:py-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto flex max-w-2xl flex-col items-center text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("title")}</h2>
          <p className="mt-3 text-base text-slate-600">{t("subtitle")}</p>

          {submitted ? (
            <div className="mt-7 flex items-center gap-2 rounded-full bg-secondary-50 px-6 py-3.5 text-sm font-semibold text-secondary-700">
              <CheckCircle2 size={18} />
              {t("successMessage")}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  className="form-input pl-12"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-soft active:translate-y-0"
              >
                {t("button")}
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-slate-500">{t("disclaimer")}</p>
        </motion.div>
      </div>
    </section>
  );
}
