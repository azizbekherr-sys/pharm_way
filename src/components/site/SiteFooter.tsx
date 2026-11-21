/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { getSiteT, localePath, asSiteLocale } from "@/i18n/site-t";

export default function SiteFooter({ locale }: { locale: string }) {
  const t = getSiteT(locale);
  const L = localePath(locale);
  const address = siteConfig.address[asSiteLocale(locale)];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand brand--logo" href={L("")} aria-label="Pharm Way Group">
              <img className="brand-logo" src="/design/img/logo.webp" alt="Pharm Way Group" width={720} height={201} decoding="async" loading="lazy" />
            </Link>
            <p className="footer-about">{t("O‘zbekistonda BFQ bozoriga ishonchli kirish yo‘li.")}</p>
          </div>
          <div className="footer-col">
            <strong>{t("Tezkor havolalar")}</strong>
            <Link href={L("/about")}>{t("Biz haqimizda")}</Link>
            <Link href={L("/partners")}>{t("Hamkorlar")}</Link>
            <Link href={L("/blog")}>{t("Blog")}</Link>
            <Link href={L("/faq")}>{t("Savol-javob")}</Link>
            <Link href={L("/contact")}>{t("Aloqa")}</Link>
          </div>
          <div className="footer-col">
            <strong>{t("Xizmatlarimiz")}</strong>
            <Link href={L("/services/bfq-registration")}>{t("BFQ registratsiyasi")}</Link>
            <Link href={L("/services/certification")}>{t("Sertifikatlashtirish")}</Link>
            <Link href={L("/services/import-logistics")}>{t("Import va logistika")}</Link>
            <Link href={L("/services/customs")}>{t("Bojxona rasmiylashtiruvi")}</Link>
            <Link href={L("/services/regulatory-consulting")}>{t("Regulatory Consulting")}</Link>
            <Link href={L("/services/distributor-search")}>{t("Distributor qidirish")}</Link>
          </div>
          <div className="footer-col">
            <strong>{t("Aloqa ma’lumotlari")}</strong>
            <a href={siteConfig.maps.yandex} target="_blank" rel="noopener noreferrer">
              {address}
            </a>
            <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t("© 2026 Pharm Way Group. Barcha huquqlar himoyalangan.")}</span>
        </div>
      </div>
    </footer>
  );
}
