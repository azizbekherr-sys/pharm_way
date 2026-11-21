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

export default function ServicesView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="services">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">{t("Xizmatlar")}</div>
                <h1 data-split="" className="split-ready">{split(t("Xizmatlarimiz"))}</h1>
                <p className="lead">{t("O‘zbekiston va Markaziy Osiyo BFQ bozorida to‘liq xizmat spektri")}</p>
                <div className="btns">
                  <Link className="button" href={L("/contact")}>
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
      </div>
      <section className="section">
        <div className="container">
          <div className="service-grid reveal">
            <Link className="card service-card" href={L("/services/bfq-registration")}>
              <span className="arrow">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-arrow-up-right" />
                </svg>
              </span>
              <div className="service-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-check" />
                </svg>
              </div>
              <h3>{t("BFQ registratsiyasi")}</h3>
              <p className="text">{t("Biologik faol qo‘shimchalarni tez va qonuniy ro‘yxatdan o‘tkazish.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Batafsil")}</span>
                <span>{"01"}</span>
              </div>
            </Link>
            <Link className="card service-card" href={L("/services/import-logistics")}>
              <span className="arrow">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-arrow-up-right" />
                </svg>
              </span>
              <div className="service-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-exchange" />
                </svg>
              </div>
              <h3>{t("Import va logistika")}</h3>
              <p className="text">{t("Xorijdan BFQ mahsulotlarini import qilish va yetkazib berish.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Batafsil")}</span>
                <span>{"02"}</span>
              </div>
            </Link>
            <Link className="card service-card" href={L("/services/customs")}>
              <span className="arrow">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-arrow-up-right" />
                </svg>
              </span>
              <div className="service-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-circle" />
                </svg>
              </div>
              <h3>{t("Bojxona rasmiylashtiruvi")}</h3>
              <p className="text">{t("BFQ yuklari uchun bojxona hujjatlarini rasmiylashtirish.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Batafsil")}</span>
                <span>{"03"}</span>
              </div>
            </Link>
            <Link className="card service-card" href={L("/services/regulatory-consulting")}>
              <span className="arrow">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-arrow-up-right" />
                </svg>
              </span>
              <div className="service-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-spark" />
                </svg>
              </div>
              <h3>{t("Regulatory Consulting")}</h3>
              <p className="text">{t("BFQ sohasida regulatory masalalar bo‘yicha ekspert maslahat.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Batafsil")}</span>
                <span>{"04"}</span>
              </div>
            </Link>
            <Link className="card service-card" href={L("/services/distributor-search")}>
              <span className="arrow">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-arrow-up-right" />
                </svg>
              </span>
              <div className="service-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-target" />
                </svg>
              </div>
              <h3>{t("Distributor qidirish")}</h3>
              <p className="text">{t("O‘zbekiston va Markaziy Osiyo bozorida ishonchli distribyutorlarni topish.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Batafsil")}</span>
                <span>{"05"}</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Jarayon")}</div>
              <h2 data-split="" className="split-ready">{split(t("Biz bilan ishlash qanday?"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="feature-grid reveal">
            <article className="card feature-card">
              <span className="index">{"01"}</span>
              <h3>{t("Murojaat")}</h3>
              <p className="text">{t("Bepul konsultatsiya uchun bog‘laning")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"02"}</span>
              <h3>{t("Tahlil")}</h3>
              <p className="text">{t("Mahsulot va hujjatlarni ko‘rib chiqamiz")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"03"}</span>
              <h3>{t("Shartnoma")}</h3>
              <p className="text">{t("Xizmat shartlarini kelishib olamiz")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"04"}</span>
              <h3>{t("Jarayon")}</h3>
              <p className="text">{t("Barcha bosqichlarni biz amalga oshiramiz")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"05"}</span>
              <h3>{t("Natija")}</h3>
              <p className="text">{t("Mahsulotingiz bozorga chiqadi")}</p>
            </article>
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
