import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Analytics from "@/components/analytics/Analytics";
import WebVitals from "@/components/analytics/WebVitals";
import {
  siteUrl,
  ogLocale,
  buildVerification,
  buildOrganizationJsonLd,
  buildLocalBusinessJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo";
import "../globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B3A6B",
};

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
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

  return (
    <html lang={locale} className={`${manrope.variable} h-full antialiased`}>
      <head>
        {/* Manrope is self-hosted by next/font — no Google Fonts preconnect needed. */}
        <link rel="dns-prefetch" href="https://akqjbbrclrlblrpxlutc.supabase.co" />
        <meta name="geo.region" content="UZ-TK" />
        <meta name="geo.placename" content="Toshkent" />
        <meta name="geo.position" content="41.2995;69.2836" />
        <meta name="ICBM" content="41.2995, 69.2836" />
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
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            {locale === "ru"
              ? "Перейти к содержимому"
              : locale === "en"
                ? "Skip to content"
                : "Asosiy qismga o'tish"}
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />
          <WebVitals />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
