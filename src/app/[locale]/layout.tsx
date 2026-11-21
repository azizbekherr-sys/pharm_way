import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import SiteSprite from "@/components/site/SiteSprite";
import SiteEffects from "@/components/site/SiteEffects";
import RouteKey from "@/components/site/RouteKey";
import { getSiteT } from "@/i18n/site-t";
import Analytics from "@/components/analytics/Analytics";
import WebVitals from "@/components/analytics/WebVitals";
import PageTracker from "@/components/analytics/PageTracker";
import { siteConfig } from "@/config/site";
import {
  siteUrl,
  ogLocale,
  buildVerification,
  buildOrganizationJsonLd,
  buildLocalBusinessJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import "./site.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00143f",
};

// Dizayn shriftlari (Inter + Inter Tight) — next/font orqali o'z serverimizdan beriladi.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("title");
  const description = t("description");

  return {
    title: {
      default: title,
      template: `%s | Pharm Way Group`,
    },
    description,
    keywords: t("keywords"),
    authors: [{ name: "Pharm Way Group" }],
    creator: "Pharm Way Group",
    metadataBase: new URL(siteUrl),
    // Canonical + hreflang are set per-page via buildPageMetadata so that
    // not-found routes never inherit a self-referencing canonical.
    openGraph: {
      type: "website",
      locale: ogLocale[locale] ?? "uz_UZ",
      url: `${siteUrl}/${locale}`,
      siteName: "Pharm Way Group",
      title,
      description,
      images: [{ url: "/og-image", width: 1200, height: 630, alt: "Pharm Way Group" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: buildVerification(),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const organizationJsonLd = buildOrganizationJsonLd(locale);
  const localBusinessJsonLd = buildLocalBusinessJsonLd(locale);
  const webSiteJsonLd = buildWebSiteJsonLd(locale);
  const t = getSiteT(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${interTight.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://akqjbbrclrlblrpxlutc.supabase.co" />
        {/* JS o'chiq bo'lsa ham kontent ko'rinsin (dizayn animatsiyalari JS bilan yoqiladi). */}
        <noscript>
          <style>{`.reveal,.rise,.line-in,.stagger>*{opacity:1!important;transform:none!important;filter:none!important}.split-word{transform:none!important}`}</style>
        </noscript>
        <meta name="geo.region" content="UZ-TK" />
        <meta name="geo.placename" content="Toshkent" />
        <meta name="geo.position" content={`${siteConfig.geo.lat};${siteConfig.geo.lng}`} />
        <meta name="ICBM" content={`${siteConfig.geo.lat}, ${siteConfig.geo.lng}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#app">
            {t("Asosiy kontentga o‘tish")}
          </a>
          <SiteSprite />
          <SiteHeader
            locale={locale as "uz" | "ru" | "en"}
            labels={{
              home: t("Bosh sahifa"),
              services: t("Xizmatlar"),
              about: t("Biz haqimizda"),
              blog: t("Blog"),
              faq: t("Savol-javob"),
              contact: t("Aloqa"),
              cta: t("Bepul konsultatsiya"),
              menu: t("Menyuni ochish"),
              mainMenu: t("Asosiy menyu"),
            }}
          />
          <main id="app">
            <RouteKey>{children}</RouteKey>
          </main>
          <SiteFooter locale={locale} />
          <SiteEffects />
          <Analytics />
          <WebVitals />
          <PageTracker locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
