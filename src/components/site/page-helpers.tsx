import faqData from "./faq-data.json";
import { buildFaqJsonLd } from "@/lib/seo";
import { getSiteT, getSiteUi, localePath, asSiteLocale, type SiteT } from "@/i18n/site-t";
import type { ContactFormLabels, PartnerFormLabels } from "./SiteForms";

/** Har bir sahifa uchun: tarjima, havola va til. */
export function siteContext(locale: string) {
  return { t: getSiteT(locale), L: localePath(locale), locale: asSiteLocale(locale) };
}

/** Sahifadagi ko'rinadigan FAQ savol-javoblaridan FAQPage schema (dizayn matni, tarjima bilan). */
export function siteFaqJsonLd(page: string, t: SiteT) {
  const items = (faqData as Record<string, { q: string; a: string }[]>)[page];
  if (!items?.length) return null;
  return buildFaqJsonLd(items.map((i) => ({ q: t(i.q), a: t(i.a) })));
}

export function formUi(locale: string) {
  const t = getSiteT(locale);
  return {
    ...getSiteUi(locale),
    failed: t("Yuborib bo‘lmadi. Iltimos, qaytadan urinib ko‘ring yoki telefon orqali bog‘laning."),
  };
}

export function contactFormLabels(t: SiteT): ContactFormLabels {
  return {
    section: t("Xabar qoldiring"),
    name: t("Ism va familiya *"),
    phone: t("Telefon raqam *"),
    email: t("Email"),
    company: t("Kompaniya nomi"),
    service: t("Xizmat turi"),
    choose: t("Tanlang"),
    services: [
      "BFQ registratsiyasi",
      "Import va logistika",
      "Bojxona rasmiylashtiruvi",
      "Regulatory Consulting",
      "Distributor qidirish",
      "Boshqa",
    ].map(t),
    message: t("Xabar"),
    submit: t("Xabar yuborish"),
    note: t("Biz 24 soat ichida javob beramiz"),
    successTitle: t("So‘rovingiz qabul qilindi"),
    successText: t("Pharm Way jamoasi 24 soat ichida siz bilan bog‘lanadi."),
    again: t("Yangi so‘rov yuborish"),
  };
}

export function partnerFormLabels(t: SiteT): PartnerFormLabels {
  return {
    company: t("Kompaniya nomi"),
    contact: t("Aloqa shaxsi"),
    phone: t("Telefon"),
    message: t("Xabar"),
    submit: t("Ariza yuborish"),
    successTitle: t("So‘rovingiz qabul qilindi"),
    successText: t("Pharm Way jamoasi 24 soat ichida siz bilan bog‘lanadi."),
    again: t("Yangi so‘rov yuborish"),
  };
}

/** Xizmat slug -> dizayndagi nom (o'zbekcha manba). */
export const SERVICE_NAMES: Record<string, string> = {
  "bfq-registration": "BFQ registratsiyasi",
  "import-logistics": "Import va logistika",
  customs: "Bojxona rasmiylashtiruvi",
  "regulatory-consulting": "Regulatory Consulting",
  "distributor-search": "Distributor qidirish",
};
