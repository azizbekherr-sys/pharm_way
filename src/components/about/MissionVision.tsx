"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  const tMission = useTranslations("about.mission");
  const tVision = useTranslations("about.vision");

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="rounded-[20px] bg-primary-700 p-8 text-white shadow-premium"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <Target size={24} />
          </div>
          <h3 className="mt-5 text-xl font-bold">{tMission("title")}</h3>
          <p className="mt-3 text-lg leading-relaxed text-white/80">{tMission("text")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[20px] border-2 border-primary-200 bg-white p-8 shadow-soft"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
            <Eye size={24} />
          </div>
          <h3 className="mt-5 text-xl font-bold text-gray-900">{tVision("title")}</h3>
          <p className="mt-3 text-lg leading-relaxed text-slate-500">{tVision("text")}</p>
        </motion.div>
      </div>
    </section>
  );
}
