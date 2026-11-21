import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const siteUrl = "https://www.pharmway.uz";

export const ogLocale: Record<string, string> = {
  uz: "uz_UZ",
  ru: "ru_RU",
  en: "en_US",
};

const ALL_LOCALES = ["uz", "ru", "en"] as const;

/**
 * canonical + hreflang. `locales` — sahifa haqiqatda mavjud tillar (masalan,
 * tarjimasi yo'q blog maqolasi faqat "uz"); boshqa tillarga hreflang berilmaydi.
 */
export function buildAlternates(locale: string, path: string, locales: readonly string[] = ALL_LOCALES) {
  const languages: Record<string, string> = {};
  for (const l of ALL_LOCALES) {
    if (locales.includes(l)) languages[l] = `${siteUrl}/${l}${path}`;
  }
  languages["x-default"] = `${siteUrl}/${locales.includes("uz") ? "uz" : locales[0]}${path}`;
  return { canonical: `${siteUrl}/${locale}${path}`, languages };
}

/** Kompaniyaning rasmiy profillari (Organization.sameAs — AI va qidiruv tizimlari uchun "entity" bog'lanishi). */
export const SAME_AS = [
  siteConfig.telegram,
  "https://www.instagram.com/pharmway.uz",
  "https://linkedin.com/company/pharmwaygroup",
  siteConfig.maps.yandex,
];

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
  locales,
  article,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** Sahifa mavjud tillar (standart: uz/ru/en). */
  locales?: readonly string[];
  /** Blog maqolasi uchun og:type=article va sanalar. */
  article?: { publishedTime: string; modifiedTime?: string; section?: string; tags?: string[] };
}): Metadata {
  const available = locales ?? ALL_LOCALES;
  const og: NonNullable<Metadata["openGraph"]> = {
    locale: ogLocale[locale] ?? "uz_UZ",
    alternateLocale: available.filter((l) => l !== locale).map((l) => ogLocale[l]),
    url: `${siteUrl}/${locale}${path}`,
    siteName: siteConfig.name,
    title,
    description,
    images: [{ url: "/og-image", width: 1200, height: 630, alt: siteConfig.name }],
  };
  return {
    title: { absolute: title },
    description,
    alternates: buildAlternates(locale, path, available),
    openGraph: article
      ? {
          ...og,
          type: "article",
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          section: article.section,
          tags: article.tags,
          authors: [siteConfig.name],
        }
      : { ...og, type: "website" },
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
      postalCode: siteConfig.postalCode,
      addressCountry: "UZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneHref.replace("tel:", ""),
      contactType: "customer service",
      availableLanguage: ["Uzbek", "Russian", "English"],
      areaServed: ["UZ", "KZ", "KG", "TJ"],
    },
    email: siteConfig.email,
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    areaServed: ["UZ", "KZ", "KG", "TJ"],
    knowsAbout: KNOWS_ABOUT[locale] ?? KNOWS_ABOUT.uz,
    sameAs: SAME_AS,
  };
}

/** Kompaniya ixtisosligi — AI qidiruv tizimlari (ChatGPT, Perplexity, Google AI) uchun aniq "entity" signali. */
const KNOWS_ABOUT: Record<string, string[]> = {
  uz: [
    "Biologik faol qo'shimchalar (BFQ) registratsiyasi",
    "Dori vositalarini davlat ro'yxatidan o'tkazish",
    "Tibbiy buyumlar registratsiyasi",
    "Farmatsevtik mahsulotlar importi",
    "Bojxona rasmiylashtiruvi",
    "GMP sertifikatsiyasi",
    "O'zbekiston farmatsevtika bozori regulyatsiyasi",
  ],
  ru: [
    "Регистрация БАД в Узбекистане",
    "Государственная регистрация лекарственных средств",
    "Регистрация медицинских изделий",
    "Импорт фармацевтической продукции",
    "Таможенное оформление",
    "Сертификация GMP",
    "Фармацевтическое регулирование Узбекистана",
  ],
  en: [
    "Dietary supplement (BFQ) registration in Uzbekistan",
    "Medicine registration in Uzbekistan",
    "Medical device registration",
    "Pharmaceutical import",
    "Customs clearance",
    "GMP certification",
    "Uzbekistan pharmaceutical regulation",
  ],
};

export function buildLocalBusinessJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteUrl}/#localbusiness`,
    name: siteConfig.name,
    description: ORG_DESCRIPTION[locale] ?? ORG_DESCRIPTION.uz,
    parentOrganization: { "@id": `${siteUrl}/#organization` },
    sameAs: SAME_AS,
    areaServed: [
      { "@type": "City", name: "Tashkent" },
      { "@type": "Country", name: "Uzbekistan" },
    ],
    image: `${siteUrl}/og-image`,
    url: siteUrl,
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address[locale as "uz" | "ru" | "en"] ?? siteConfig.address.uz,
      addressLocality: "Toshkent",
      postalCode: siteConfig.postalCode,
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.geo.lat,
      longitude: siteConfig.geo.lng,
    },
    hasMap: siteConfig.maps.yandex,
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
  dateModified,
  section,
  tags,
  wordCount,
}: {
  locale: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  datePublished: string;
  dateModified?: string;
  section?: string;
  tags?: string[];
  wordCount?: number;
}) {
  const url = `${siteUrl}/${locale}/blog/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: title,
    description,
    image: image ? [image] : [`${siteUrl}/og-image`],
    inLanguage: locale,
    url,
    author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteConfig.name, url: siteUrl },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.png` },
    },
    datePublished,
    dateModified: dateModified ?? datePublished,
    articleSection: section,
    keywords: tags && tags.length ? tags.join(", ") : undefined,
    wordCount,
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}
