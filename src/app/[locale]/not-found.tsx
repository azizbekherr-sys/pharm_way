import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";

// Applied to every not-found response under /[locale] — including notFound()
// calls from dynamic routes. 404 status + noindex; canonical is intentionally
// absent (the locale layout no longer emits one).
export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

const TEXT: Record<string, { title: string; body: string; cta: string }> = {
  uz: {
    title: "Sahifa topilmadi",
    body: "Kechirasiz, siz qidirgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.",
    cta: "Bosh sahifaga qaytish",
  },
  ru: {
    title: "Страница не найдена",
    body: "К сожалению, запрашиваемая страница не существует или была перемещена.",
    cta: "Вернуться на главную",
  },
  en: {
    title: "Page not found",
    body: "Sorry, the page you are looking for doesn't exist or has been moved.",
    cta: "Back to home",
  },
};

export default async function LocaleNotFound() {
  let locale = "uz";
  try {
    locale = await getLocale();
  } catch {
    // Fall back to the default locale if the i18n context is unavailable.
  }
  const t = TEXT[locale] ?? TEXT.uz;

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-7xl font-extrabold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{t.title}</h1>
      <p className="mt-3 max-w-md text-slate-500">{t.body}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
      >
        {t.cta}
      </Link>
    </section>
  );
}
