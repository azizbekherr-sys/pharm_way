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

export default function ServiceDistributorSearchView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="service-distributor-search">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">{t("Xizmatlar")}</div>
                <h1 data-split="" className="split-ready">{split(t("Distributor qidirish"))}</h1>
                <p className="lead">{t("O‘zbekiston va Markaziy Osiyo bozorida ishonchli distribyutorlarni topish.")}</p>
                <div className="btns">
                  <Link className="button" href={L("/contact")}>
                    <span>{t("Bepul konsultatsiya")}</span>
                    <span className="round">
                      <svg className="icn" aria-hidden="true" focusable="false">
                        <use href="#icon-arrow-right" />
                      </svg>
                    </span>
                  </Link>
                  <Link className="button secondary" href={L("/services")}>
                    <span>{t("Barcha xizmatlar")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="dual-grid reveal">
            <div>
              <div className="eyebrow">{t("Xizmat haqida")}</div>
              <p className="lead u-mt-12">{t("Distributor qidirish xizmati orqali mahsulotingiz uchun O‘zbekiston va Markaziy Osiyo bozorida ishonchli sotuv hamkorlarini topamiz.")}</p>
              <p className="lead u-mt-12">{t("Keng hamkorlar tarmog‘imiz orqali mahsulotingiz to‘g‘ri kanallar orqali maqsadli auditoriyaga yetib boradi.")}</p>
              <p className="lead u-mt-12">{t("Muzokaralardan shartnoma imzolanishigacha jarayonni to‘liq boshqaramiz.")}</p>
            </div>
            <article className="card content-card">
              <h3>{t("Asosiy afzalliklar")}</h3>
              <ul className="clean-list">
                <li>{t("Keng distribyutorlar tarmog‘i")}</li>
                <li>{t("Bozor tahlili asosida tanlov")}</li>
                <li>{t("Muzokaralarda professional vositachilik")}</li>
                <li>{t("Shartnoma shartlarini himoya qilish")}</li>
                <li>{t("Hamkorlik monitoringi")}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Jarayon")}</div>
              <h2 data-split="" className="split-ready">{split(t("Jarayon bosqichlari"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="steps-grid cols-5 reveal">
            <article className="card step-card">
              <div className="step-number">{"1"}</div>
              <h3>{t("Bozor tahlili")}</h3>
            </article>
            <article className="card step-card">
              <div className="step-number">{"2"}</div>
              <h3>{t("Potensial hamkorlar ro‘yxati")}</h3>
            </article>
            <article className="card step-card">
              <div className="step-number">{"3"}</div>
              <h3>{t("Muzokaralar")}</h3>
            </article>
            <article className="card step-card">
              <div className="step-number">{"4"}</div>
              <h3>{t("Shartnoma")}</h3>
            </article>
            <article className="card step-card">
              <div className="step-number">{"5"}</div>
              <h3>{t("Monitoring")}</h3>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="feature-grid feature-grid--3 reveal">
            <article className="card content-card">
              <h3>{t("Kerakli hujjatlar")}</h3>
              <ul className="clean-list">
                <li>{t("Kompaniya profili")}</li>
                <li>{t("Mahsulot katalogi")}</li>
                <li>{t("Narx ro‘yxati")}</li>
              </ul>
            </article>
            <article className="card content-card">
              <h3>{t("Muddat")}</h3>
              <p className="fact">{"1–3 oy"}</p>
            </article>
            <article className="card content-card">
              <h3>{t("Narx")}</h3>
              <p className="fact fact--sm">{t("Individual, bepul konsultatsiyada aniqlanadi")}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container faq-layout">
          <div className="reveal">
            <div className="eyebrow">{"FAQ"}</div>
            <h2>{t("Tez-tez so‘raladigan savollar")}</h2>
          </div>
          <div className="faq-list faq-cards rise">
            <div className="faq-item faq-card open">
              <button className="faq-button">
                <span className="faq-number">{"01"}</span>
                <span className="faq-title">{t("Distributor qanday tanlanadi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Bozor ulushi, obro‘-e’tibor va mahsulot mosligi asosida eng mos nomzodlar tanlanadi.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"02"}</span>
                <span className="faq-title">{t("Bir nechta distributor bilan ishlash mumkinmi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Ha, mahsulot turiga qarab bir nechta hududiy distributor bilan hamkorlik tashkil etish mumkin.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"03"}</span>
                <span className="faq-title">{t("Shartnoma shartlarini kim belgilaydi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Shartnoma shartlari ikki tomon manfaatlarini hisobga olib birgalikda kelishiladi.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"04"}</span>
                <span className="faq-title">{t("Konsultatsiya pullikmi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Yo‘q, dastlabki konsultatsiya mutlaqo bepul.")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="cta-panel reveal">
            <div className="cta-body">
              <h2 data-split="" className="split-ready">{split(t("Xizmat haqida batafsil ma’lumot olmoqchimisiz?"))}</h2>
              <p>{t("Mutaxassislarimiz bilan bepul konsultatsiya olish uchun bog‘laning.")}</p>
              <Link className="button light" href={L("/contact")}>
                <span>{t("Bepul konsultatsiya")}</span>
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
