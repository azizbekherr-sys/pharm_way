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

export default function AboutView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="about">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">{t("Biz haqimizda")}</div>
                <h1 data-split="" className="split-ready">{split(t("O‘zbekiston va Markaziy Osiyo BFQ bozorida ishonchli hamkor"))}</h1>
                <p className="lead">{t("Pharm Way Group — Global Pharma, Local Success")}</p>
                <p className="lead">{t("Pharm Way Group — O‘zbekiston va Markaziy Osiyo bozorlarida BFQ mahsulotlarini import qilish, ro‘yxatdan o‘tkazish va normativ-huquqiy qo‘llab-quvvatlash bo‘yicha ixtisoslashgan kompaniya. Biz xalqaro ishlab chiqaruvchilarga mahalliy bozorga ishonchli, qonuniy va samarali kirish imkonini beramiz.")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="stat-grid reveal">
            <article className="card stat-card">
              <strong data-count="5" data-suffix="+">{"0"}</strong>
              <span>{t("yil tajriba")}</span>
            </article>
            <article className="card stat-card">
              <strong data-count="50" data-suffix="+">{"0"}</strong>
              <span>{t("ro‘yxatdan o‘tgan mahsulot")}</span>
            </article>
            <article className="card stat-card">
              <strong data-count="20" data-suffix="+">{"0"}</strong>
              <span>{t("xalqaro hamkor")}</span>
            </article>
            <article className="card stat-card">
              <strong data-count="10" data-suffix="+">{"0"}</strong>
              <span>{t("davlat bilan hamkorlik")}</span>
            </article>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="dual-grid reveal">
            <article className="card content-card">
              <div className="eyebrow">{t("Missiyamiz")}</div>
              <p className="lead">{t("Xalqaro sifat standartlariga javob beradigan BFQ mahsulotlarini O‘zbekiston va Markaziy Osiyo bozorlariga tez, qonuniy va samarali olib kirishga ko‘maklashish.")}</p>
            </article>
            <article className="card content-card">
              <div className="eyebrow">{t("Vizionimiz")}</div>
              <p className="lead">{t("Markaziy Osiyoning yetakchi BFQ regulatory va import xizmatlari kompaniyasiga aylanish.")}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Tarix")}</div>
              <h2 data-split="" className="split-ready">{split(t("Kompaniya tarixi"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="feature-grid reveal">
            <article className="card feature-card">
              <span className="index">{"2019"}</span>
              <h3>{t("Kompaniya tashkil etildi")}</h3>
            </article>
            <article className="card feature-card">
              <span className="index">{"2020"}</span>
              <h3>{t("Birinchi xalqaro hamkorlik shartnomasi imzolandi")}</h3>
            </article>
            <article className="card feature-card">
              <span className="index">{"2021"}</span>
              <h3>{t("10+ mahsulot muvaffaqiyatli ro‘yxatdan o‘tkazildi")}</h3>
            </article>
            <article className="card feature-card">
              <span className="index">{"2022"}</span>
              <h3>{t("Markaziy Osiyo bozorlariga kengayish boshlandi")}</h3>
            </article>
            <article className="card feature-card">
              <span className="index">{"2024"}</span>
              <h3>{t("50+ mahsulot va 20+ xalqaro hamkor")}</h3>
            </article>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Qadriyatlar")}</div>
              <h2 data-split="" className="split-ready">{split(t("Bizning qadriyatlarimiz"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="feature-grid reveal">
            <article className="card feature-card">
              <span className="index">{"01"}</span>
              <h3>{t("Shaffoflik")}</h3>
              <p className="text">{t("Har bir bosqichda ochiq va tushunarli muloqot olib boramiz.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"02"}</span>
              <h3>{t("Professionallik")}</h3>
              <p className="text">{t("Yuqori malakali va tajribali mutaxassislar jamoasi.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"03"}</span>
              <h3>{t("Tezkorlik")}</h3>
              <p className="text">{t("Ro‘yxatdan o‘tkazish muddatlarini sezilarli qisqartiramiz.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"04"}</span>
              <h3>{t("Ishonchlilik")}</h3>
              <p className="text">{t("Hamkorlarimiz uchun barqaror va uzoq muddatli aloqalar.")}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Faoliyat geografiyasi")}</div>
              <h2 data-split="" className="split-ready">{split(t("Biz ishlayotgan bozorlar"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="geo-list geo-list--cols reveal">
            <div className="geo-item">
              <b>{"UZ"}</b>
              <div>
                <h3>{t("O‘zbekiston")}</h3>
                <p className="text">{t("Asosiy bozor")}</p>
              </div>
            </div>
            <div className="geo-item">
              <b>{"KZ"}</b>
              <div>
                <h3>{t("Qozog‘iston")}</h3>
              </div>
            </div>
            <div className="geo-item">
              <b>{"KG"}</b>
              <div>
                <h3>{t("Qirg‘iziston")}</h3>
              </div>
            </div>
            <div className="geo-item">
              <b>{"TJ"}</b>
              <div>
                <h3>{t("Tojikiston")}</h3>
              </div>
            </div>
            <div className="geo-item">
              <b>{"TM"}</b>
              <div>
                <h3>{t("Turkmaniston")}</h3>
              </div>
            </div>
            <div className="geo-item">
              <b>{"AZ"}</b>
              <div>
                <h3>{t("Ozarbayjon")}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="cta-panel reveal">
            <div className="cta-body">
              <h2 data-split="" className="split-ready">{split(t("Mahsulotingizni O‘zbekiston bozoriga olib chiqishga tayyormisiz?"))}</h2>
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
