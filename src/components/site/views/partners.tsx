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

export default function PartnersView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="partners">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">{t("Hamkorlar")}</div>
                <h1 data-split="" className="split-ready">{split(t("Hamkorlarimiz"))}</h1>
                <p className="lead">{t("Dunyo bo‘ylab yetakchi BFQ kompaniyalari bilan ishonchli hamkorlik")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="stat-grid reveal">
            <article className="card stat-card">
              <strong data-count="20" data-suffix="+">{"0"}</strong>
              <span>{t("Xalqaro hamkor")}</span>
            </article>
            <article className="card stat-card">
              <strong data-count="10" data-suffix="+">{"0"}</strong>
              <span>{t("Davlat")}</span>
            </article>
            <article className="card stat-card">
              <strong data-count="50" data-suffix="+">{"0"}</strong>
              <span>{t("Ro‘yxatdan o‘tgan mahsulot")}</span>
            </article>
            <article className="card stat-card">
              <strong data-count="5" data-suffix="+">{"0"}</strong>
              <span>{t("Yil hamkorlik tajribasi")}</span>
            </article>
          </div>
          <div className="result-mini-grid u-mt-18 reveal">
            <article className="card result-mini-card">
              <p>{t("Ishlab chiqaruvchilar")}</p>
            </article>
            <article className="card result-mini-card">
              <p>{t("Distributorlar")}</p>
            </article>
            <article className="card result-mini-card">
              <p>{t("Laboratoriyalar")}</p>
            </article>
            <article className="card result-mini-card">
              <p>{t("BFQ kompaniyalari")}</p>
            </article>
          </div>
        </div>
      </section>
      {slots.logos}
      <section className="section soft">
        <div className="container">
          <div className="panel-dark reveal">
            <div className="dual-grid dual-grid--top">
              <div>
                <h2>{t("Hamkor bo‘lishni xohlaysizmi?")}</h2>
                <p className="lead">{t("Xalqaro ishlab chiqaruvchilar, distributorlar va laboratoriyalar bilan hamkorlik qilamiz")}</p>
                <ul className="clean-list on-dark">
                  <li>{t("O‘zbekiston va Markaziy Osiyo bozorlariga kirish")}</li>
                  <li>{t("To‘liq regulatory qo‘llab-quvvatlash")}</li>
                  <li>{t("Professional hujjatlashtirish xizmati")}</li>
                  <li>{t("Tez va samarali registratsiya jarayoni")}</li>
                  <li>{t("Mahalliy bozorni chuqur bilish")}</li>
                </ul>
              </div>
              <div>
                {slots.form}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Hamkorlik")}</div>
              <h2 data-split="" className="split-ready">{split(t("Nega aynan biz bilan hamkorlik?"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="feature-grid feature-grid--3 reveal">
            <article className="card feature-card">
              <span className="index">{"01"}</span>
              <h3>{t("Ishonchli vositachi")}</h3>
              <p className="text">{t("O‘zbekiston va xalqaro bozorlar o‘rtasida ko‘p yillik tajribaga ega ko‘prik.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"02"}</span>
              <h3>{t("Tezkor jarayon")}</h3>
              <p className="text">{t("Hujjatlashtirish va registratsiyaning eng qisqa muddatda bajarilishi.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"03"}</span>
              <h3>{t("Keng tarmoq")}</h3>
              <p className="text">{t("10+ davlat va 20+ xalqaro hamkor bilan kuchli aloqa tarmog‘i.")}</p>
            </article>
          </div>
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
