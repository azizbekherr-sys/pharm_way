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

export default function HomeView({ t, L, locale, slots = {} }: Props) {
  const address = siteConfig.address[locale] ?? siteConfig.address.uz;
  void address; void slots;
  return (
    <div className="site-view active" data-page="home">
      <div className="hero-wrap">
        <div className="container">
          <section className="hero">
            <div className="hero-content">
              <div className="hero-copy reveal">
                <h1 data-split="" className="split-ready">{split(t("Mahsulotingizni O‘zbekiston bozoriga bitta mahalliy hamkor bilan olib kiring"))}</h1>
                <p className="lead">{t("Pharm Way xorijiy ishlab chiqaruvchilarga mahsulot hujjatlarini tahlil qilish, registratsiya va import jarayonlarini muvofiqlashtirish hamda mahalliy distribyutor topishda yordam beradi.")}</p>
                <div className="btns">
                  <Link className="button" href={L("/contact#assessment-form")}>
                    <span>{t("Mahsulotni dastlabki baholashga yuborish")}</span>
                    <span className="round">
                      <svg className="icn" aria-hidden="true" focusable="false">
                        <use href="#icon-arrow-right" />
                      </svg>
                    </span>
                  </Link>
                  <Link className="button secondary" href={L("#process")}>
                    <span>{t("Bozorga chiqish jarayonini ko‘rish")}</span>
                  </Link>
                </div>
                <p className="micro">{t("Mahsulot kategoriyasi, mavjud hujjatlar va maqsadli bozor dastlabki tahlil qilinadi.")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <section className="section logo-strip">
        <div className="container">
          <div className="marquee-wrap reveal">
            <div className="marquee-track">
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-check" />
                </svg>
                <span>{t("Registratsiya")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-spark" />
                </svg>
                <span>{t("Regulatory consulting")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-exchange" />
                </svg>
                <span>{t("Import koordinatsiyasi")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-circle" />
                </svg>
                <span>{t("Logistika")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-target" />
                </svg>
                <span>{t("Distribyutor qidirish")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-plus" />
                </svg>
                <span>{t("Laboratoriya jarayonlari")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-arrow-up-right" />
                </svg>
                <span>{t("Bozor tayyorgarligi")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-check" />
                </svg>
                <span>{t("Registratsiya")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-spark" />
                </svg>
                <span>{t("Regulatory consulting")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-exchange" />
                </svg>
                <span>{t("Import koordinatsiyasi")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-circle" />
                </svg>
                <span>{t("Logistika")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-target" />
                </svg>
                <span>{t("Distribyutor qidirish")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-plus" />
                </svg>
                <span>{t("Laboratoriya jarayonlari")}</span>
              </div>
              <div className="strip-item">
                <svg className="icn" aria-hidden="true">
                  <use href="#icon-arrow-up-right" />
                </svg>
                <span>{t("Bozor tayyorgarligi")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Kimlar uchun?")}</div>
              <h2 data-split="" className="split-ready">{split(t("O‘zbekiston bozoriga kirishni rejalashtirayotgan ishlab chiqaruvchilar uchun"))}</h2>
            </div>
            <p className="lead">{t("Pharm Way xalqaro ishlab chiqaruvchilar, eksport kompaniyalari va yangi bozor izlayotgan brendlarga mahalliy regulatory va biznes jarayonlarini boshqarishda yordam beradi.")}</p>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="feature-grid feature-grid--3 reveal">
            <article className="card feature-card">
              <span className="index">{"01"}</span>
              <h3>{t("Oziq-ovqat va biologik faol qo‘shimchalar")}</h3>
              <p className="text">{t("Mahsulot tasnifi, hujjatlar tahlili va registratsiya jarayonlari.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"02"}</span>
              <h3>{t("Kosmetik mahsulotlar")}</h3>
              <p className="text">{t("Mahsulot hujjatlarini tekshirish, mahalliy talablarni aniqlash va registratsiya jarayonini boshqarish.")}</p>
            </article>
            <article className="card feature-card">
              <span className="index">{"03"}</span>
              <h3>{t("Farmatsevtika mahsulotlari")}</h3>
              <p className="text">{t("Mahsulot turi va mavjud hujjatlar bo‘yicha dastlabki imkoniyat baholashi.")}</p>
            </article>
          </div>
          <div className="btns">
            <Link className="button secondary" href={L("/contact#assessment-form")}>
              <span>{t("Mahsulot kategoriyangizni tekshirish")}</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container problem-layout reveal">
          <div className="problem-copy">
            <div className="eyebrow">{t("Mijoz muammosi")}</div>
            <h2>{t("Mahalliy talablarni bilmaslik bozorga chiqish jarayonini sekinlashtiradi")}</h2>
            <p className="lead">{t("Noto‘g‘ri mahsulot klassifikatsiyasi, to‘liq bo‘lmagan hujjatlar yoki bosqichlar orasidagi uzilish qo‘shimcha xarajat va vaqt yo‘qotishiga olib kelishi mumkin.")}</p>
          </div>
          <div className="problem-items">
            <div className="problem-item">
              <b>{"01"}</b>
              <span>{t("Qaysi hujjatlar kerakligi aniq emas.")}</span>
            </div>
            <div className="problem-item">
              <b>{"02"}</b>
              <span>{t("Mahsulot qaysi kategoriya bo‘yicha registratsiya qilinishi noma’lum.")}</span>
            </div>
            <div className="problem-item">
              <b>{"03"}</b>
              <span>{t("Hujjatlar mahalliy talablarga moslashtirilmagan.")}</span>
            </div>
            <div className="problem-item">
              <b>{"04"}</b>
              <span>{t("Laboratoriya yoki ekspertiza talablari aniqlanmagan.")}</span>
            </div>
            <div className="problem-item">
              <b>{"05"}</b>
              <span>{t("Import va bojxona jarayonlari oldindan rejalashtirilmagan.")}</span>
            </div>
            <div className="problem-item">
              <b>{"06"}</b>
              <span>{t("Ishonchli mahalliy distribyutor topilmagan.")}</span>
            </div>
            <div className="problem-item">
              <b>{"07"}</b>
              <span>{t("Bir nechta pudratchi orasida javobgarlik bo‘linib ketgan.")}</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Pharm Way yechimi")}</div>
              <h2 data-split="" className="split-ready">{split(t("Bir nechta pudratchi o‘rniga bitta loyiha hamkori"))}</h2>
            </div>
            <p className="lead">{t("Pharm Way registratsiya, import, logistika va distribyutor qidirish bosqichlarini yagona market-entry loyihasi sifatida boshqaradi.")}</p>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="compare-grid reveal">
            <article className="card compare-card">
              <div className="compare-badge">{t("Alohida pudratchilar bilan")}</div>
              <h3>{t("Alohida pudratchilar bilan")}</h3>
              <ul className="clean-list muted-dot">
                <li>{t("bir nechta shartnoma;")}</li>
                <li>{t("bo‘lingan javobgarlik;")}</li>
                <li>{t("takroriy ma’lumot almashinuvi;")}</li>
                <li>{t("jarayonlar orasida uzilish;")}</li>
                <li>{t("umumiy statusni nazorat qilish qiyin.")}</li>
              </ul>
            </article>
            <article className="card compare-card preferred">
              <div className="compare-badge">{t("Pharm Way bilan")}</div>
              <h3>{t("Pharm Way bilan")}</h3>
              <ul className="clean-list on-dark">
                <li>{t("bitta loyiha rejasi;")}</li>
                <li>{t("bitta mas’ul aloqa nuqtasi;")}</li>
                <li>{t("yagona status hisoboti;")}</li>
                <li>{t("bosqichlar o‘rtasida muvofiqlashtirish;")}</li>
                <li>{t("keyingi bosqichni oldindan rejalashtirish.")}</li>
              </ul>
            </article>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="center-head rise">
            <div className="eyebrow">{t("Asosiy xizmatlar")}</div>
            <h2 data-split="" className="split-ready">{split(t("Bozorga kirish uchun kerakli xizmatlar"))}</h2>
            <p className="lead">{t("Mahsulot turiga qarab xizmatlar alohida yoki kompleks market-entry loyihasi sifatida tashkil etiladi.")}</p>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="service-grid reveal">
            <article className="card service-card">
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
              <h3>{t("Registratsiya")}</h3>
              <p className="text">{t("Mahsulot klassifikatsiyasi, hujjatlar tayyorlash, topshirish va ekspertiza jarayonlarini boshqarish.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Regulatory")}</span>
                <span>{"01"}</span>
              </div>
            </article>
            <article className="card service-card">
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
              <h3>{t("Import va logistika koordinatsiyasi")}</h3>
              <p className="text">{t("Import modeli, yuk hujjatlari, logistika va bojxona jarayonlari bo‘yicha yagona koordinatsiya.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Import")}</span>
                <span>{"02"}</span>
              </div>
            </article>
            <article className="card service-card">
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
              <h3>{t("Distribyutor qidirish va bozor tayyorgarligi")}</h3>
              <p className="text">{t("Mahsulot kategoriyasi va savdo modeliga mos mahalliy hamkorlarni aniqlash va aloqani tashkil etish.")}</p>
              <div className="service-meta">
                <span className="pill">{t("Market entry")}</span>
                <span>{"03"}</span>
              </div>
            </article>
          </div>
          <div className="btns">
            <Link className="button secondary" href={L("/services")}>
              <span>{t("Barcha xizmatlarni ko‘rish")}</span>
            </Link>
          </div>
        </div>
      </section>
      <section className="section" id="process">
        <div className="container">
          <div className="process-layout">
            <div className="process-copy rise">
              <div className="eyebrow">{t("Jarayon")}</div>
              <h2 data-split="" className="split-ready">{split(t("Dastlabki baholashdan bozorga chiqishgacha"))}</h2>
              <p className="lead">{t("Har bir bosqich yagona loyiha rejasida boshqariladi. Bosqichni ochib, unda nima bajarilishini ko‘ring.")}</p>
              <div className="btns">
                <Link className="button" href={L("/contact#assessment-form")}>
                  <span>{t("Jarayonni boshlash")}</span>
                  <span className="round">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
            <div className="process-stack rise">
              <article className="process-item open">
                <button className="process-head" type="button">
                  <h3>{t("Mahsulot ma’lumotlarini yuborish")}</h3>
                  <span className="process-chev">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </button>
                <div className="process-body">
                  <div>
                    <div className="process-inner">
                      <div>
                        <p className="text">{t("Mahsulot kategoriyasi, tarkibi, ishlab chiqaruvchi va mavjud hujjatlar haqida ma’lumot yuborasiz.")}</p>
                        <div className="process-num">{"01"}</div>
                      </div>
                      <div className="process-media">
                        <img src="/design/img/case-approval.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="process-item">
                <button className="process-head" type="button">
                  <h3>{t("Dastlabki tahlil")}</h3>
                  <span className="process-chev">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </button>
                <div className="process-body">
                  <div>
                    <div className="process-inner">
                      <div>
                        <p className="text">{t("Pharm Way mahsulot va hujjatlarni ko‘rib chiqib, asosiy talablarni aniqlaydi.")}</p>
                        <div className="process-num">{"02"}</div>
                      </div>
                      <div className="process-media">
                        <img src="/design/img/results-status.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="process-item">
                <button className="process-head" type="button">
                  <h3>{t("Strategiya va tijorat taklifi")}</h3>
                  <span className="process-chev">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </button>
                <div className="process-body">
                  <div>
                    <div className="process-inner">
                      <div>
                        <p className="text">{t("Xizmat scope’i, bosqichlar, muddat va xarajatlar bo‘yicha individual taklif tayyorlanadi.")}</p>
                        <div className="process-num">{"03"}</div>
                      </div>
                      <div className="process-media">
                        <img src="/design/img/partners-network.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="process-item">
                <button className="process-head" type="button">
                  <h3>{t("Hujjatlarni tayyorlash")}</h3>
                  <span className="process-chev">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </button>
                <div className="process-body">
                  <div>
                    <div className="process-inner">
                      <div>
                        <p className="text">{t("Yetishmayotgan hujjatlar, tarjimalar, sertifikatlar va boshqa talablar bo‘yicha ish olib boriladi.")}</p>
                        <div className="process-num">{"04"}</div>
                      </div>
                      <div className="process-media">
                        <img src="/design/img/mission-abstract.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="process-item">
                <button className="process-head" type="button">
                  <h3>{t("Registratsiya")}</h3>
                  <span className="process-chev">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </button>
                <div className="process-body">
                  <div>
                    <div className="process-inner">
                      <div>
                        <p className="text">{t("Hujjatlarni topshirish, ekspertiza va zarur laboratoriya jarayonlari boshqariladi.")}</p>
                        <div className="process-num">{"05"}</div>
                      </div>
                      <div className="process-media">
                        <img src="/design/img/process-panel.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
              <article className="process-item">
                <button className="process-head" type="button">
                  <h3>{t("Import va distribyutor")}</h3>
                  <span className="process-chev">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </button>
                <div className="process-body">
                  <div>
                    <div className="process-inner">
                      <div>
                        <p className="text">{t("Import jarayoni muvofiqlashtiriladi va potensial savdo hamkorlari izlanadi.")}</p>
                        <div className="process-num">{"06"}</div>
                      </div>
                      <div className="process-media">
                        <img src="/design/img/logistics-routes.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container status-grid reveal">
          <div className="status-copy">
            <div className="eyebrow">{t("Muddat va status")}</div>
            <h2>{t("Har bir bosqich bo‘yicha aniq status oling")}</h2>
            <p className="lead">{t("Dastlabki hujjatlar tahlili odatda bir ish kuni davom etadi. Zarur ma’lumotlar olingandan keyin tijorat taklifi odatda bir–ikki ish kuni ichida tayyorlanadi.")}</p>
            <p className="lead">{t("Registratsiya jarayoni mahsulot turi, hujjatlar holati, laboratoriya talablari va davlat ekspertizasiga qarab o‘rtacha ikki–to‘rt oy davom etishi mumkin.")}</p>
          </div>
          <div className="card dashboard">
            <div className="dash-head">
              <div className="dash-title">{t("Loyiha statusi")}</div>
              <div className="dash-chip">{t("Status")}</div>
            </div>
            <div className="dash-progress">
              <div className="dash-row">
                <div className="dash-top">
                  <span>{t("Dastlabki hujjatlar tahlili")}</span>
                  <strong>{t("1 ish kuni")}</strong>
                </div>
                <div className="track">
                  <div className="fill" style={{ width: "100%" } as React.CSSProperties} />
                </div>
              </div>
              <div className="dash-row">
                <div className="dash-top">
                  <span>{t("Tijorat taklifi")}</span>
                  <strong>{t("1–2 ish kuni")}</strong>
                </div>
                <div className="track">
                  <div className="fill" style={{ width: "78%" } as React.CSSProperties} />
                </div>
              </div>
              <div className="dash-row">
                <div className="dash-top">
                  <span>{t("Registratsiya jarayoni")}</span>
                  <strong>{t("3–6 oy")}</strong>
                </div>
                <div className="track">
                  <div className="fill" style={{ width: "48%" } as React.CSSProperties} />
                </div>
              </div>
            </div>
            <div className="notice">{t("Loyiha statusi elektron pochta, WhatsApp yoki Telegram orqali taqdim etiladi.")}</div>
            <div className="notice muted-notice">{t("Ko‘rsatilgan muddatlar taxminiy hisoblanadi. Hujjatlarning to‘liqligi va ekspertiza jarayonlari umumiy muddatga ta’sir qilishi mumkin.")}</div>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container faq-layout">
          <div className="reveal">
            <div className="eyebrow">{"FAQ"}</div>
            <h2>{t("Asosiy savollarga javoblar")}</h2>
            <p className="lead">{t("Dastlabki assessment va bozorga kirish jarayoni haqida qisqa ma’lumot.")}</p>
            <a className="button secondary" href={`mailto:${siteConfig.email}`}>
              <span>{t("Savol yuborish")}</span>
            </a>
          </div>
          <div className="faq-list faq-cards rise">
            <div className="faq-item faq-card open">
              <button className="faq-button">
                <span className="faq-number">{"01"}</span>
                <span className="faq-title">{t("Pharm Way qaysi mahsulotlar bilan ishlaydi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Asosiy xizmatlar biologik faol va oziq-ovqat qo‘shimchalari, kosmetik mahsulotlar va regulatory consulting yo‘nalishlarini qamrab oladi. Boshqa mahsulot kategoriyalari bo‘yicha imkoniyat dastlabki tahlildan keyin aniqlanadi.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"02"}</span>
                <span className="faq-title">{t("Jarayon qanday boshlanadi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Mahsulot haqida qisqacha ma’lumot va mavjud hujjatlar yuboriladi. Shundan keyin mahsulot kategoriyasi, hujjatlar holati va kerakli xizmatlar dastlabki tahlil qilinadi.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"03"}</span>
                <span className="faq-title">{t("Registratsiya qancha vaqt oladi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Mahsulot turiga qarab jarayon o‘rtacha ikki–to‘rt oy davom etishi mumkin. Aniqroq muddat hujjatlar tekshirilgandan keyin belgilanadi.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"04"}</span>
                <span className="faq-title">{t("Xizmat narxi qancha?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Narx mahsulot kategoriyasi, hujjatlar holati, laboratoriya talablari va tanlangan xizmatlar scope’iga qarab individual hisoblanadi.")}</div>
              </div>
            </div>
            <div className="faq-item faq-card">
              <button className="faq-button">
                <span className="faq-number">{"05"}</span>
                <span className="faq-title">{t("Pharm Way barcha xizmatlarni o‘zi bajaradimi?")}</span>
                <span className="faq-plus">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <div>{t("Hujjatlar, regulatory consulting, loyiha boshqaruvi va biznesni rivojlantirish ishlari Pharm Way tomonidan boshqariladi. Laboratoriya, logistika va bojxona xizmatlari maxsus hamkorlar orqali bajarilishi mumkin.")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="contact-card reveal">
            <div className="contact-copy">
              <div className="eyebrow eyebrow--on-contact-card">{t("Bog‘lanish")}</div>
              <h2>{t("Mahsulotingiz uchun bozorga kirish yo‘lini aniqlang")}</h2>
              <p className="lead">{t("Mahsulot kategoriyasi, mavjud hujjatlar va maqsadli bozor haqida ma’lumot yuboring. Pharm Way jamoasi keyingi qadamlarni dastlabki baholaydi.")}</p>
              <Link className="button" href={L("/contact#assessment-form")}>
                <span>{t("Mahsulotni dastlabki baholashga yuborish")}</span>
                <span className="round">
                  <svg className="icn" aria-hidden="true" focusable="false">
                    <use href="#icon-arrow-right" />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="contact-media">
              <img src="/design/img/contact-pricing.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Nega Pharm Way?")}</div>
              <h2 data-split="" className="split-ready">{split(t("Bitta hamkor bilan ishlashning afzalliklari"))}</h2>
            </div>
            <p className="lead">{t("Bir nechta mustaqil pudratchi o‘rniga jarayonlar yagona loyiha rejasida boshqariladi.")}</p>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="benefit-grid reveal">
            <article className="card benefit-card">
              <div className="benefit-num">{"01"}</div>
              <div className="benefit-icon">{"1"}</div>
              <h3>{t("Bitta aloqa nuqtasi")}</h3>
              <p className="text">{t("Barcha savollar va statuslar bitta mas’ul loyiha koordinatori orqali yuritiladi.")}</p>
            </article>
            <article className="card benefit-card">
              <div className="benefit-num">{"02"}</div>
              <div className="benefit-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-arrow-up-right" />
                </svg>
              </div>
              <h3>{t("Oldindan rejalashtirish")}</h3>
              <p className="text">{t("Keyingi bosqich uchun zarur hujjat va qarorlar oldindan ko‘rsatiladi.")}</p>
            </article>
            <article className="card benefit-card">
              <div className="benefit-num">{"03"}</div>
              <div className="benefit-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-check" />
                </svg>
              </div>
              <h3>{t("Yagona status hisoboti")}</h3>
              <p className="text">{t("Jarayon holati elektron pochta yoki messenjer orqali tushunarli formatda beriladi.")}</p>
            </article>
            <article className="card benefit-card">
              <div className="benefit-num">{"04"}</div>
              <div className="benefit-icon">
                <svg className="icn" aria-hidden="true" focusable="false">
                  <use href="#icon-target" />
                </svg>
              </div>
              <h3>{t("Bozor tayyorgarligi")}</h3>
              <p className="text">{t("Regulatory jarayon import va distribyutor bosqichlari bilan bog‘lanadi.")}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Loyiha natijalari")}</div>
              <h2 data-split="" className="split-ready">{split(t("Har bir bosqichda nimaga ega bo‘lasiz?"))}</h2>
            </div>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="result-grid reveal">
            <div className="result-visual">
              <img src="/design/img/results-status.webp" alt="" aria-hidden="true" width="1200" height="900" loading="lazy" decoding="async" />
            </div>
            <div className="result-copy">
              <div className="result-item">
                <strong>{"01"}</strong>
                <h3>{t("Assessment xulosasi")}</h3>
                <p className="text">{t("Mahsulot kategoriyasi, hujjatlar holati va asosiy talablar bo‘yicha qisqa xulosa.")}</p>
              </div>
              <div className="result-item">
                <strong>{"02"}</strong>
                <h3>{t("Scope va vaqt xaritasi")}</h3>
                <p className="text">{t("Ish bosqichlari, zarur materiallar va realistik muddat diapazoni.")}</p>
              </div>
              <div className="result-item">
                <strong>{"03"}</strong>
                <h3>{t("Status va keyingi qadam")}</h3>
                <p className="text">{t("Qaysi ish bajarilgani va keyin nima qilish kerakligi aniq ko‘rsatiladi.")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="float-stage">
            <div className="float-cards float-cards--3" aria-hidden="true">
              <article className="float-card fc1">
                <div className="icon">
                  <svg className="icn" focusable="false">
                    <use href="#icon-spark" />
                  </svg>
                </div>
                <b>{t("BAA va oziq-ovqat")}</b>
                <span>{t("Tasnif, sertifikat va hujjatlar.")}</span>
              </article>
              <article className="float-card fc2">
                <b>{t("Kosmetik mahsulotlar")}</b>
                <span>{t("Mahalliy talablar va registratsiya.")}</span>
                <div className="icon">
                  <svg className="icn" focusable="false">
                    <use href="#icon-circle" />
                  </svg>
                </div>
              </article>
              <article className="float-card fc3">
                <b>{t("Farmatsevtika")}</b>
                <span>{t("Dastlabki imkoniyat assessment’i.")}</span>
                <div className="icon">
                  <svg className="icn" focusable="false">
                    <use href="#icon-plus" />
                  </svg>
                </div>
              </article>
            </div>
            <div className="float-copy rise">
              <div className="eyebrow">{t("Mahsulot yo‘nalishlari")}</div>
              <h2 data-split="" className="split-ready">{split(t("Qaysi kategoriyalar bilan ishlaymiz?"))}</h2>
              <p className="lead u-mx-auto">{t("Har bir kategoriya uchun klassifikatsiya, hujjatlar va ekspertiza talablari alohida aniqlanadi.")}</p>
              <div className="btns u-center">
                <Link className="button" href={L("/contact#assessment-form")}>
                  <span>{t("Kategoriyangizni tekshirish")}</span>
                  <span className="round">
                    <svg className="icn" aria-hidden="true" focusable="false">
                      <use href="#icon-arrow-right" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head rise">
            <div>
              <div className="eyebrow">{t("Geografiya")}</div>
              <h2 data-split="" className="split-ready">{split(t("O‘zbekiston orqali Markaziy Osiyo bozorlariga yo‘l"))}</h2>
            </div>
            <p className="lead">{t("Asosiy fokus — O‘zbekiston bozori. Registratsiyadan keyingi bosqichda mahsulotni mintaqadagi qo‘shni bozorlarga kengaytirish imkoniyati ham rejalashtirilishi mumkin.")}</p>
          </div>
          <div className="head-rule line-in" aria-hidden="true" />
          <div className="geo-grid reveal">
            <div className="geo-visual media-block">
              <img src="/design/img/map-region.webp" alt="" aria-hidden="true" width="1200" height="675" loading="lazy" decoding="async" />
            </div>
            <div className="geo-list">
              <div className="geo-item">
                <b>{"UZ"}</b>
                <div>
                  <h3>{t("O‘zbekiston")}</h3>
                  <p className="text">{t("Asosiy bozor: registratsiya, import va distribyutor qidirish to‘liq qamrab olinadi.")}</p>
                </div>
              </div>
              <div className="geo-item">
                <b>{"KZ"}</b>
                <div>
                  <h3>{t("Qozog‘iston")}</h3>
                  <p className="text">{t("Mintaqaviy kengayish bosqichida hamkorlar tarmog‘i orqali muvofiqlashtirilishi mumkin.")}</p>
                </div>
              </div>
              <div className="geo-item">
                <b>{"KG"}</b>
                <div>
                  <h3>{t("Qirg‘iziston")}</h3>
                  <p className="text">{t("Mahsulot kategoriyasi va talablarga qarab imkoniyat alohida baholanadi.")}</p>
                </div>
              </div>
              <div className="geo-item">
                <b>{"TJ"}</b>
                <div>
                  <h3>{t("Tojikiston")}</h3>
                  <p className="text">{t("Talabga qarab keyingi bosqich sifatida rejalashtirilishi mumkin.")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
