"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Building2, Truck, FlaskConical, Globe, type LucideIcon } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  country: string | null;
  country_flag: string | null;
  category: string | null;
  description: string | null;
  description_ru: string | null;
  description_en: string | null;
  logo_url: string | null;
  website: string | null;
};

type TabMeta = { label: string; category: string; icon: LucideIcon };

const TAB_META: TabMeta[] = [
  { label: "Ishlab chiqaruvchilar", category: "manufacturer", icon: Building2 },
  { label: "Distributorlar", category: "distributor", icon: Truck },
  { label: "Laboratoriyalar", category: "laboratory", icon: FlaskConical },
  { label: "Farmatsevtik kompaniyalar", category: "pharma", icon: Globe },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PartnersTabs() {
  const t = useTranslations("partnersPage");
  const locale = useLocale() as "uz" | "ru" | "en";
  const tabsMeta = t.raw("tabs") as { label: string }[];
  const [active, setActive] = useState(0);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/partners?active=true")
      .then((res) => res.json())
      .then((data) => setPartners(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  function description(p: Partner) {
    if (locale === "ru") return p.description_ru || p.description || "";
    if (locale === "en") return p.description_en || p.description || "";
    return p.description || "";
  }

  const activeCategory = TAB_META[active].category;
  const items = partners.filter((p) => p.category === activeCategory);

  return (
    <section className="section-pad bg-white pt-8">
      <div className="container-page">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {TAB_META.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = active === i;
            const label = tabsMeta[i]?.label ?? tab.label;
            return (
              <button
                key={tab.category}
                type="button"
                onClick={() => setActive(i)}
                className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-soft"
                    : "border border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-700"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((partner, i) => {
              const Card = partner.website ? motion.a : motion.div;
              const linkProps = partner.website
                ? { href: partner.website, target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <Card
                  key={partner.id}
                  {...linkProps}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-premium ${
                    partner.website ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl text-base font-bold text-white ${
                        partner.logo_url ? "border border-slate-200 bg-white" : i % 2 === 0 ? "bg-primary-600" : "bg-secondary-600"
                      }`}
                    >
                      {partner.logo_url ? (
                        <Image
                          src={partner.logo_url}
                          alt={partner.name}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        initials(partner.name)
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{partner.name}</h3>
                      <div className="text-sm text-slate-500">
                        {partner.country_flag} {partner.country}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-slate-500">{description(partner)}</p>
                </Card>
              );
            })}
            {!loading && items.length === 0 && (
              <p className="col-span-full py-10 text-center text-slate-400">Hozircha hamkorlar yo&apos;q</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
