/* eslint-disable @next/next/no-img-element */
// Generated from the Pharm Way design (pharm-way-site/index.html) by convert_design.py,
// then wired to real data. Text goes through t() (Uzbek source -> ru/en dictionary).
import type { ReactNode } from "react";
import type React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import type { SiteT } from "@/i18n/site-t";
import { split } from "@/components/site/split";

type Props = {
  t: SiteT;
  L: (path: string) => string;
  locale: "uz" | "ru" | "en";
  slots?: Record<string, ReactNode>;
};

export default function FaqView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="faq">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">{t("Savol-javoblar")}</div>
                <h1 data-split="" className="split-ready">{split(t("Eng ko‘p so‘raladigan savollarga javoblar"))}</h1>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="chip-row" data-filter-group="faq" role="group" aria-label={t("Kategoriyalar")}>
            <button className="chip active" type="button" data-filter="all" aria-pressed="true">{t("Barcha savollar")}</button>
            <button className="chip" type="button" data-filter="registratsiya" aria-pressed="false">{t("Registratsiya")}</button>
            <button className="chip" type="button" data-filter="hujjatlar" aria-pressed="false">{t("Hujjatlar")}</button>
            <button className="chip" type="button" data-filter="narx" aria-pressed="false">{t("Narx va muddat")}</button>
            <button className="chip" type="button" data-filter="import" aria-pressed="false">{t("Import va logistika")}</button>
            <button className="chip" type="button" data-filter="umumiy" aria-pressed="false">{t("Umumiy")}</button>
          </div>
          <div className="faq-wide" data-filter-target="faq">
            <div className="faq-list faq-cards rise">
              <div className="faq-item faq-card open" data-cat="registratsiya">
                <button className="faq-button">
                  <span className="faq-number">{"01"}</span>
                  <span className="faq-title">{t("BFQ registratsiyasi qancha vaqt oladi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("BFQ (biologik faol qo‘shimchalar) registratsiyasi odatda 3-6 oy vaqt oladi. Jarayon davomida biz barcha bosqichlarni nazorat qilib boramiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="registratsiya">
                <button className="faq-button">
                  <span className="faq-number">{"02"}</span>
                  <span className="faq-title">{t("Registratsiya guvohnomasi necha yilga beriladi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("O‘zbekistonda BFQ registratsiya guvohnomasi odatda 5 yilga beriladi. Muddati tugashidan 6 oy oldin qayta registratsiya jarayonini boshlash tavsiya etiladi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="registratsiya">
                <button className="faq-button">
                  <span className="faq-number">{"03"}</span>
                  <span className="faq-title">{t("GMP sertifikati majburiymi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Ha, importga mo‘ljallangan mahsulotlar uchun GMP sertifikati talab etiladi. Biz BFQ registratsiyasi va sertifikatlashtirish jarayonida barcha talablarga mos kelishingizga yordam beramiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="registratsiya">
                <button className="faq-button">
                  <span className="faq-number">{"04"}</span>
                  <span className="faq-title">{t("Qayta registratsiya qanday amalga oshiriladi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Qayta registratsiya dastlabki registratsiyaga o‘xshash jarayon bo‘lib, ammo ko‘pincha tezroq kechadi. Hujjatlar to‘plami yangilanadi va ekspertizadan o‘tkaziladi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="registratsiya">
                <button className="faq-button">
                  <span className="faq-number">{"05"}</span>
                  <span className="faq-title">{t("Bir vaqtda bir nechta mahsulotni ro‘yxatdan o‘tkazish mumkinmi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Ha, bir vaqtda bir nechta mahsulot bo‘yicha ariza berilishi mumkin. Bu ko‘pincha vaqt va xarajatlarni tejash imkonini beradi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="registratsiya">
                <button className="faq-button">
                  <span className="faq-number">{"06"}</span>
                  <span className="faq-title">{t("Xorijiy kompaniya o‘zi registratsiya qila oladimi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("O‘zbekistonda farmatsevtik mahsulotlarni ro‘yxatdan o‘tkazish uchun mahalliy vakillik yoki hamkor kompaniya orqali ariza berish talab etiladi. Pharm Way Group aynan shu vazifani bajaradi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="hujjatlar">
                <button className="faq-button">
                  <span className="faq-number">{"07"}</span>
                  <span className="faq-title">{t("Registratsiya uchun qanday asosiy hujjatlar kerak?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Asosiy hujjatlar: ishlab chiqaruvchi litsenziyasi, GMP sertifikati, mahsulot spesifikatsiyasi, klinik tadqiqot ma’lumotlari (agar talab qilinsa), qadoqlash va yorliq namunalari, kelib chiqish sertifikati.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="hujjatlar">
                <button className="faq-button">
                  <span className="faq-number">{"08"}</span>
                  <span className="faq-title">{t("Hujjatlar qaysi tilda taqdim etilishi kerak?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Hujjatlar o‘zbek yoki rus tilida taqdim etilishi kerak. Xorijiy tillardagi hujjatlar notarial tasdiqlangan tarjimasi bilan birga topshiriladi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="hujjatlar">
                <button className="faq-button">
                  <span className="faq-number">{"09"}</span>
                  <span className="faq-title">{t("Hujjatlarni notarial tasdiqlash kerakmi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Ha, ko‘pchilik hujjatlar notarial tasdiqlangan tarjimasi bilan birga taqdim etilishi talab qilinadi. Biz bu jarayonni ham to‘liq amalga oshirishda yordam beramiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="hujjatlar">
                <button className="faq-button">
                  <span className="faq-number">{"10"}</span>
                  <span className="faq-title">{t("Hujjatlar amal qilish muddati bormi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Ha, ko‘pchilik sertifikatlar va hujjatlarning amal qilish muddati bor. Masalan, GMP sertifikati odatda 3 yilga beriladi. Hujjatlaringiz yangiligini tekshirib chiqamiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="hujjatlar">
                <button className="faq-button">
                  <span className="faq-number">{"11"}</span>
                  <span className="faq-title">{t("Elektron hujjatlar qabul qilinadimi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Dastlabki bosqichda elektron nusxalar ko‘rib chiqilishi mumkin, ammo rasmiy jarayon uchun asl nusxa yoki notarial tasdiqlangan nusxalar talab etiladi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="narx">
                <button className="faq-button">
                  <span className="faq-number">{"12"}</span>
                  <span className="faq-title">{t("Xizmatlar narxi qanday?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Narxlar loyiha murakkabligi, mahsulot turi va xizmat hajmiga qarab individual belgilanadi. Bepul konsultatsiyada aniq narxni bilib olishingiz mumkin.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="narx">
                <button className="faq-button">
                  <span className="faq-number">{"13"}</span>
                  <span className="faq-title">{t("To‘lov qanday amalga oshiriladi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("To‘lov shartnoma asosida bosqichma-bosqich amalga oshiriladi. Odatda dastlabki to‘lov va jarayon yakunida qolgan summa to‘lanadi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="narx">
                <button className="faq-button">
                  <span className="faq-number">{"14"}</span>
                  <span className="faq-title">{t("Konsultatsiya pullikmi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Yo‘q, dastlabki konsultatsiya mutlaqo bepul. Biz sizning mahsulotingiz va ehtiyojlaringizni tushunib, keyin xizmat taklifini taqdim etamiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="narx">
                <button className="faq-button">
                  <span className="faq-number">{"15"}</span>
                  <span className="faq-title">{t("Muddatdan oldin tugatish mumkinmi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Biz har doim belgilangan muddatdan oldin ishni yakunlashga harakat qilamiz. Davlat organlarining ish tezligi ham muhim rol o‘ynaydi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="import">
                <button className="faq-button">
                  <span className="faq-number">{"16"}</span>
                  <span className="faq-title">{t("Import uchun qanday ruxsatnomalar kerak?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Farmatsevtik mahsulotlarni import qilish uchun registratsiya guvohnomasi, import litsenziyasi va bojxona hujjatlari talab etiladi. Biz barcha ruxsatnomalarni olishda yordam beramiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="import">
                <button className="faq-button">
                  <span className="faq-number">{"17"}</span>
                  <span className="faq-title">{t("Mahsulotlar qaysi mamlakatlardan import qilinishi mumkin?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("O‘zbekiston farmatsevtik mahsulotlarni dunyoning har qanday mamlakatidan import qilish imkoniyatiga ega. Asosiy shart — mahsulot kelib chiqqan mamlakatda ruxsat etilgan va tegishli sertifikatlarga ega bo‘lishi.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="import">
                <button className="faq-button">
                  <span className="faq-number">{"18"}</span>
                  <span className="faq-title">{t("Sovuq zanjir (cold chain) mahsulotlar uchun alohida talablar bormi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Ha, biologik preparatlar va ba’zi dori vositalari uchun sovuq zanjir talablari mavjud. Biz ixtisoslashgan logistika hamkorlarimiz orqali bu talablarni to‘liq bajaramiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="import">
                <button className="faq-button">
                  <span className="faq-number">{"19"}</span>
                  <span className="faq-title">{t("Bojxonada muammo chiqsa nima qilish kerak?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Bizning tajribali mutaxassislarimiz bojxona jarayonlarini boshidan oxirigacha nazorat qiladi. Har qanday muammo yuzaga kelsa, darhol hal etamiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="umumiy">
                <button className="faq-button">
                  <span className="faq-number">{"20"}</span>
                  <span className="faq-title">{t("Pharm Way Group qaysi davlatlar bilan ishlaydi?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Biz asosan O‘zbekiston bozori uchun xizmat ko‘rsatamiz, shuningdek Qozog‘iston, Qirg‘iziston, Tojikiston, Turkmaniston va Ozarbayjon bozorlarida ham ishlaymiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="umumiy">
                <button className="faq-button">
                  <span className="faq-number">{"21"}</span>
                  <span className="faq-title">{t("Hamkor bo‘lish uchun nima qilish kerak?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Biz bilan bog‘laning — telefon, email yoki Telegram orqali. Bepul konsultatsiyada hamkorlik imkoniyatlarini muhokama qilamiz.")}</div>
                </div>
              </div>
              <div className="faq-item faq-card" data-cat="umumiy">
                <button className="faq-button">
                  <span className="faq-number">{"22"}</span>
                  <span className="faq-title">{t("Sizning kompaniyangizning tajribasi qancha?")}</span>
                  <span className="faq-plus">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-plus" />
                    </svg>
                  </span>
                </button>
                <div className="faq-answer">
                  <div>{t("Pharm Way Group 2019 yildan beri faoliyat yuritib kelmoqda. 5+ yillik tajribamiz davomida 50+ mahsulotni muvaffaqiyatli ro‘yxatdan o‘tkazdik va 20+ xalqaro hamkor bilan ishlaymiz.")}</div>
                </div>
              </div>
            </div>
          </div>
          <article className="card content-card notice-card reveal">
            <div>
              <h3>{t("Savolingiz javobini topmadingizmi?")}</h3>
              <p className="text">{t("Mutaxassislarimiz sizga yordam berishga tayyor")}</p>
            </div>
            <div className="btns">
              <Link className="button" href={L("/contact")}>
                <span>{t("Bepul konsultatsiya")}</span>
                <span className="round">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-arrow-right" />
                  </svg>
                </span>
              </Link>
              <a className="button secondary" href={siteConfig.telegram} target="_blank" rel="noopener">
                <span>{t("Telegram orqali yozing")}</span>
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="cta-panel reveal">
            <div className="cta-body">
              <h2 data-split="" className="split-ready">{split(t("Hamkorlikni boshlashga tayyormisiz?"))}</h2>
              <p>{t("Mutaxassislarimiz bilan bepul konsultatsiya olish uchun bog‘laning.")}</p>
              <Link className="button light" href={L("/contact#assessment-form")}>
                <span>{t("Bog‘lanish")}</span>
                <span className="round">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-arrow-right" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
