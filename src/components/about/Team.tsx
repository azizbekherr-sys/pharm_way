"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p.replace(".", "")[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Team() {
  const t = useTranslations("about.team");
  const members = t.raw("members") as { name: string; role: string; desc: string }[];

  return (
    <section className="section-pad bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">{t("title")}</h2>
          <p className="mt-4 text-lg text-slate-500">{t("subtitle")}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-soft"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                {initials(member.name)}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{member.name}</h3>
              <div className="mt-1 text-base font-medium text-secondary-700">{member.role}</div>
              <p className="mt-3 text-base leading-relaxed text-slate-500">{member.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
