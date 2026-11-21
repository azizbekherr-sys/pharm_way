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

export default function ContactView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="contact">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero compact">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <div className="eyebrow eyebrow--on-gradient">{t("Aloqa")}</div>
                <h1 data-split="" className="split-ready">{split(t("Biz bilan bog‘laning — mutaxassislarimiz sizga yordam berishga tayyor"))}</h1>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="section" id="contact-info">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Aloqa")}</div>
              <h2 data-split="" className="split-ready">{split(t("Bog‘lanish ma’lumotlari"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="feature-grid feature-grid--3 reveal">
            <article className="card content-card u-p-28">
              <h3>{t("Manzil")}</h3>
              <p className="text">{address}</p>
            </article>
            <article className="card content-card u-p-28">
              <h3>{t("Telefon")}</h3>
              <p className="text">
                <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
              </p>
            </article>
            <article className="card content-card u-p-28">
              <h3>{"Email"}</h3>
              <p className="text">
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </p>
            </article>
            <article className="card content-card u-p-28">
              <h3>{t("Ish vaqti")}</h3>
              <p className="text">{t("Dushanba–Juma: 9:00–18:00")}</p>
            </article>
            <article className="card content-card u-p-28">
              <h3>{t("Telegram orqali yozing")}</h3>
              <p className="text">
                <a href={siteConfig.telegram} target="_blank" rel="noopener">{"@pharmwaygroup"}</a>
              </p>
            </article>
            <article className="card content-card u-p-28">
              <h3>{t("WhatsApp orqali yozing")}</h3>
              <p className="text">
                <a href={siteConfig.whatsapp} target="_blank" rel="noopener">{siteConfig.phone}</a>
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="section soft" id="assessment-form-section">
        <div className="container form-layout reveal">
          {slots.form}
          <div className="media-block tall">
            <img src="/design/img/contact-office.webp" alt="" aria-hidden="true" width="900" height="1200" loading="lazy" decoding="async" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Xarita")}</div>
              <h2 data-split="" className="split-ready">{split(t("Bizning joylashuvimiz"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          {slots.mapLinks}
          <div className="map-frame reveal">
            <iframe title={t("Bizning joylashuvimiz")} src={siteConfig.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
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
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"02"}</span>
                <span className="faq-title">{t("Registratsiya qancha vaqt oladi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Mahsulot turiga qarab 3 oydan 12 oygacha.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"03"}</span>
                <span className="faq-title">{t("Qanday hujjatlar kerak?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Ishlab chiqaruvchi sertifikatlari, mahsulot spesifikatsiyasi va boshqa hujjatlar. Batafsil konsultatsiyada aniqlaymiz.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"04"}</span>
                <span className="faq-title">{t("Xizmat narxi qanday hisoblanadi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Har bir loyiha individual baholanadi. Bepul konsultatsiyada narxni aniqlaymiz.")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="cta-panel reveal">
            <div className="cta-body">
              <h2 data-split="" className="split-ready">{split(t("Hamkorlikni boshlashga tayyormisiz?"))}</h2>
              <p>{t("Bugun bepul konsultatsiya oling")}</p>
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
