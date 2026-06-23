import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { siteConfig, services } from "@/config/site";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tServices = useTranslations("home.services");
  const locale = useLocale() as "uz" | "ru" | "en";
  const serviceItems = tServices.raw("items") as { title: string }[];
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-800 text-white">
      <div className="container-page grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Image src="/images/logo.png" alt="Pharm Way Group" width={2031} height={598} className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-base leading-relaxed text-white/60">{t("tagline")}</p>
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-secondary-600 hover:text-white"
              aria-label="Telegram"
            >
              <Send size={16} />
            </a>
            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/70 ring-1 ring-white/10 transition-colors hover:bg-[#25D366] hover:text-white"
              aria-label="WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary-400">
            {t("quickLinks")}
          </h4>
          <ul className="space-y-2.5 text-base text-white/65">
            <li><Link href="/about" className="transition-colors hover:text-secondary-300">{tNav("about")}</Link></li>
            <li><Link href="/partners" className="transition-colors hover:text-secondary-300">{tNav("partners")}</Link></li>
            <li><Link href="/blog" className="transition-colors hover:text-secondary-300">{tNav("blog")}</Link></li>
            <li><Link href="/faq" className="transition-colors hover:text-secondary-300">{tNav("faq")}</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-secondary-300">{tNav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary-400">
            {t("ourServices")}
          </h4>
          <ul className="space-y-2.5 text-base text-white/65">
            {services.slice(0, 6).map((s, i) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="transition-colors hover:text-secondary-300">
                  {serviceItems[i]?.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-secondary-400">
            {t("contactInfo")}
          </h4>
          <ul className="space-y-3 text-base text-white/65">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-secondary-400" />
              <span>{siteConfig.address[locale]}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-secondary-400" />
              <a href={siteConfig.phoneHref} className="transition-colors hover:text-secondary-300">{siteConfig.phone}</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-secondary-400" />
              <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-secondary-300">{siteConfig.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <span>© {year} Pharm Way Group. {t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
