import type { Metadata } from "next";
import Link from "next/link";
import { getSiteT } from "@/i18n/site-t";
import { getLocale } from "next-intl/server";

// Applied to every not-found response under /[locale] — including notFound()
// calls from dynamic routes. 404 status + noindex; canonical is intentionally
// absent (the locale layout no longer emits one).
export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default async function LocaleNotFound() {
  let locale = "uz";
  try {
    locale = await getLocale();
  } catch {
    // Fall back to the default locale if the i18n context is unavailable.
  }
  const t = getSiteT(locale);

  return (
    <div className="site-view active" data-page="not-found">
      <section className="not-found">
        <div>
          <div className="code">404</div>
          <h1>{t("Sahifa topilmadi")}</h1>
          <p className="lead" style={{ margin: "0 auto 28px" }}>
            {t("Kechirasiz, siz qidirgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.")}
          </p>
          <Link className="button" href={`/${locale}`}>
            <span>{t("Bosh sahifaga qaytish")}</span>
            <span className="round">
              <svg className="icn" aria-hidden="true" focusable="false">
                <use href="#icon-arrow-right" />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
