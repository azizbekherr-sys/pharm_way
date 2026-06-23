"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";

export default function ServiceDocuments({ slug }: { slug: string }) {
  const t = useTranslations("serviceDetail");
  const documents = t.raw(`items.${slug}.documents`) as string[];

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{t("documentsHeading")}</h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc, i) => (
            <motion.div
              key={doc}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-soft"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <FileText size={18} />
              </div>
              <span className="text-base font-medium text-gray-900">{doc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
