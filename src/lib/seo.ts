import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const siteUrl = "https://www.pharmway.uz";

export const ogLocale: Record<string, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

export function buildAlternates(locale: string, path: string) {
  return {
    canonical: `${siteUrl}/${locale}${path}`,
    languages: {
      uz: `${siteUrl}/uz${path}`,
      ru: `${siteUrl}/ru${path}`,
      en: `${siteUrl}/en${path}`,
      "x-default": `${siteUrl}/uz${path}`,
    },
  };
}

/**
 * Search-engine ownership verification, driven entirely by env vars.
 * Returns `undefined` (no tags rendered) unless a real value is present.
 */
export function buildVerification(): Metadata["verification"] | undefined {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  const yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim();
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

  const verification: NonNullable<Metadata["verification"]> = {};
  if (google) verification.google = google;
  if (yandex) verification.yandex = yandex;
  if (bing) verification.other = { "msvalidate.01": bing };

  return Object.keys(verification).length > 0 ? verification : undefined;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type: "website",
      locale: ogLocale[locale] ?? "uz_UZ",
      url: `${siteUrl}/${locale}${path}`,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: "/og-image", width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image"],
    },
  };
}

const ORG_DESCRIPTION: Record<string, string> = {
  uz: "O'zbekistonda biologik faol qo'shimchalar (BFQ), dori vositalari va tibbiy buyumlarni import qilish va ro'yxatdan o'tkazish bo'yicha regulatory xizmatlar.",
  ru: "Регуляторные услуги по импорту и регистрации биологически активных добавок (БАД), лекарственных средств и медицинских изделий в Узбекистане.",
  en: "Regulatory services for importing and registering dietary supplements (BFQ), medicines and medical devices in Uzbekistan.",
};

export function buildOrganizationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: ORG_DESCRIPTION[locale] ?? ORG_DESCRIPTION.uz,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale as "uz" | "ru" | "en"] ?? siteConfig.address.uz,
      addressLocality: "Toshkent",
      addressCountry: "UZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneHref.replace("tel:", ""),
      contactType: "customer service",
      availableLanguage: ["Uzbek", "Russian", "English"],
      areaServed: ["UZ", "KZ", "KG", "TJ"],
    },
    sameAs: [siteConfig.telegram],
  };
}

export function buildLocalBusinessJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: siteConfig.name,
    image: `${siteUrl}/og-image`,
    url: siteUrl,
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale as "uz" | "ru" | "en"] ?? siteConfig.address.uz,
      addressLocality: "Toshkent",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.2995,
      longitude: 69.2836,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "$$",
  };
}

export function buildWebSiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteConfig.name,
    inLanguage: locale,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function buildBreadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}/${locale}${item.path}`,
    })),
  };
}

export function buildServiceJsonLd({
  locale,
  slug,
  name,
  description,
}: {
  locale: string;
  slug: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/${locale}/services/${slug}#service`,
    name,
    description,
    serviceType: name,
    url: `${siteUrl}/${locale}/services/${slug}`,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: [
      { "@type": "Country", name: "Uzbekistan" },
      { "@type": "Country", name: "Kazakhstan" },
      { "@type": "Country", name: "Kyrgyzstan" },
      { "@type": "Country", name: "Tajikistan" },
    ],
    availableLanguage: ["uz", "ru", "en"],
  };
}

export function buildFaqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function buildBlogPostingJsonLd({
  locale,
  slug,
  title,
  description,
  image,
  datePublished,
}: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image ? [image] : undefined,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.png` },
    },
    datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/${locale}/blog/${slug}` },
  };
}
