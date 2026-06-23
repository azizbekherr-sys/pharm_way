"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { services } from "@/config/site";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const tServices = useTranslations("home.services");
  const serviceItems = tServices.raw("items") as { title: string }[];
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email") || undefined,
      company: data.get("company") || undefined,
      serviceType: data.get("serviceType") || undefined,
      message: data.get("message") || undefined,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("request failed");
      setSubmitted(true);
      form.reset();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-7 shadow-premium sm:p-9">
      <h2 className="text-2xl font-bold text-gray-900">{t("heading")}</h2>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex flex-col items-center rounded-2xl bg-secondary-50 px-6 py-10 text-center"
          >
            <CheckCircle2 className="h-12 w-12 text-secondary-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t("successTitle")}</h3>
            <p className="mt-1 text-base text-slate-500">{t("successMessage")}</p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-semibold text-primary-700 hover:text-primary-800"
            >
              {t("heading")} →
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("name")} required>
                <input type="text" name="name" required className="form-input" />
              </Field>
              <Field label={t("phone")} required>
                <input type="tel" name="phone" required className="form-input" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label={t("email")}>
                <input type="email" name="email" className="form-input" />
              </Field>
              <Field label={t("company")}>
                <input type="text" name="company" className="form-input" />
              </Field>
            </div>

            <Field label={t("serviceType")}>
              <select name="serviceType" defaultValue="" className="form-input">
                <option value="" disabled>
                  {t("selectPlaceholder")}
                </option>
                {serviceItems.map((item) => (
                  <option key={item.title} value={item.title}>
                    {item.title}
                  </option>
                ))}
                <option value="other">{t("otherOption")}</option>
              </select>
            </Field>

            <Field label={t("message")}>
              <textarea name="message" rows={4} className="form-input resize-none" />
            </Field>

            {error && (
              <p className="text-center text-sm text-red-600">
                Xatolik yuz berdi. Iltimos, qayta urinib ko&apos;ring.
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full !py-3.5 disabled:opacity-60">
              {submitting ? "Yuborilmoqda..." : t("submit")}
              <ArrowRight size={16} />
            </button>
            <p className="text-center text-sm text-slate-500">{t("responseTime")}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
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
