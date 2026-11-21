import dictionary from "./site-dict.json";

/**
 * Sayt dizayni (pharm-way-site) tarjimasi: matnlar o'zbekcha manba, `site-dict.json`
 * har bir o'zbekcha iborani ru/en tarjimasiga moslaydi (dizayndagi i18n.js bilan bir xil).
 * Topilmasa — o'zbekcha matn qaytadi. Faqat server komponentlarida ishlatiladi,
 * shuning uchun lug'at brauzerga yuborilmaydi.
 */
export type SiteLocale = "uz" | "ru" | "en";
export type SiteT = (uz: string) => string;

type Dict = { dict: Record<"ru" | "en", Record<string, string>>; ui: Record<string, Record<string, unknown>> };
const DATA = dictionary as unknown as Dict;

// Dizayn lug'atida yo'q, lekin sahifalarda uchraydigan qisqa iboralar.
const EXTRA: Record<"ru" | "en", Record<string, string>> = {
  ru: {
    "1–3 oy": "1–3 мес.",
    "3–6 oy": "3–6 мес.",
    "Barcha": "Все",
    "Xaritada ochish": "Открыть на карте",
    "Tez orada yangi maqolalar e’lon qilinadi.": "Скоро здесь появятся новые статьи.",
    "Yuborib bo‘lmadi. Iltimos, qaytadan urinib ko‘ring yoki telefon orqali bog‘laning.":
      "Не удалось отправить. Попробуйте ещё раз или свяжитесь с нами по телефону.",
    "Boshqa maqolalar": "Другие статьи",
    "Barcha maqolalar": "Все статьи",
    "Sahifa topilmadi": "Страница не найдена",
    "Kechirasiz, siz qidirgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.":
      "К сожалению, запрашиваемая страница не существует или была перемещена.",
    "Bosh sahifaga qaytish": "Вернуться на главную",
  },
  en: {
    "1–3 oy": "1–3 months",
    "3–6 oy": "3–6 months",
    "Barcha": "All",
    "Xaritada ochish": "Open in maps",
    "Tez orada yangi maqolalar e’lon qilinadi.": "New articles are coming soon.",
    "Yuborib bo‘lmadi. Iltimos, qaytadan urinib ko‘ring yoki telefon orqali bog‘laning.":
      "Could not send. Please try again or contact us by phone.",
    "Boshqa maqolalar": "More articles",
    "Barcha maqolalar": "All articles",
    "Sahifa topilmadi": "Page not found",
    "Kechirasiz, siz qidirgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.":
      "Sorry, the page you are looking for doesn't exist or has been moved.",
    "Bosh sahifaga qaytish": "Back to home",
  },
};

export function asSiteLocale(locale: string): SiteLocale {
  return locale === "ru" || locale === "en" ? locale : "uz";
}

export function getSiteT(locale: string): SiteT {
  const l = asSiteLocale(locale);
  if (l === "uz") return (s) => s;
  const dict = DATA.dict[l] ?? {};
  const extra = EXTRA[l];
  return (s) => dict[s] ?? extra[s] ?? s;
}

/** Forma xatolari kabi UI matnlari (dizayndagi I18N.ui). */
export function getSiteUi(locale: string): { required: string; format: string; check: string } {
  const ui = (DATA.ui[asSiteLocale(locale)] ?? DATA.ui.uz) as Record<string, string>;
  return { required: ui.required, format: ui.format, check: ui.check };
}

/** Sahifa title/description (dizayndagi ui.meta). */
export function getSiteMeta(locale: string, page: string): { title: string; desc: string } | null {
  const ui = (DATA.ui[asSiteLocale(locale)] ?? DATA.ui.uz) as { meta?: Record<string, { title: string; desc: string }> };
  return ui.meta?.[page] ?? null;
}

export function localePath(locale: string) {
  return (path: string) => `/${asSiteLocale(locale)}${path}`;
}
