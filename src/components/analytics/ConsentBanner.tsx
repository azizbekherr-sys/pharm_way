"use client";

import { useLocale } from "next-intl";

const TEXT: Record<string, { body: string; accept: string; decline: string }> = {
  uz: {
    body: "Saytdan foydalanishni yaxshilash uchun analitik cookie'lardan foydalanamiz. Roziligingizsiz analitika yuklanmaydi.",
    accept: "Qabul qilish",
    decline: "Rad etish",
  },
  ru: {
    body: "Мы используем аналитические файлы cookie для улучшения сайта. Без вашего согласия аналитика не загружается.",
    accept: "Принять",
    decline: "Отклонить",
  },
  en: {
    body: "We use analytics cookies to improve the site. Analytics does not load without your consent.",
    accept: "Accept",
    decline: "Decline",
  },
};

function setConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem("pw_consent", value);
  } catch {
    // storage unavailable — still update runtime consent below
  }
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      ad_storage: value,
      analytics_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    });
  }
  window.dispatchEvent(new CustomEvent("pw-consent-change", { detail: value }));
}

export default function ConsentBanner() {
  const locale = useLocale();
  const t = TEXT[locale] ?? TEXT.uz;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] backdrop-blur">
      <div className="container-page flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-slate-600">{t.body}</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
