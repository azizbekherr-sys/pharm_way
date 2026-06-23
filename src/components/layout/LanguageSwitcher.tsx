"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-secondary-700 transition-colors hover:bg-secondary-50"
        aria-label="Change language"
      >
        <Globe size={16} />
        <span className="uppercase">{locale}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-premium">
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: l });
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-secondary-50 ${
                l === locale ? "font-semibold text-secondary-700" : "text-slate-600"
              }`}
            >
              {LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
