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

export function buildOrganizationJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: "O'zbekistonda biologik faol qo'shimchalar (BFQ) importi va registratsiyasi",
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
