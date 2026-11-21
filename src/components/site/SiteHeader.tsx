"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Locale = "uz" | "ru" | "en";

export type HeaderLabels = {
  home: string;
  services: string;
  about: string;
  blog: string;
  faq: string;
  contact: string;
  cta: string;
  menu: string;
  mainMenu: string;
};

const LANGS: { code: Locale; label: string }[] = [
  { code: "uz", label: "O‘zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

const NAV: { key: keyof HeaderLabels; path: string }[] = [
  { key: "home", path: "" },
  { key: "services", path: "/services" },
  { key: "about", path: "/about" },
  { key: "blog", path: "/blog" },
  { key: "faq", path: "/faq" },
  { key: "contact", path: "/contact" },
];

function ArrowIcon() {
  return (
    <span className="round">
      <svg className="icn" aria-hidden="true" focusable="false">
        <use href="#icon-arrow-right" />
      </svg>
    </span>
  );
}

/** Dizayndagi header: menyu, til almashtirgich va scroll holati (sayt dizaynidagi JS'ning React varianti). */
export default function SiteHeader({ locale, labels }: { locale: Locale; labels: HeaderLabels }) {
  const pathname = usePathname() || `/${locale}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const rest = pathname.replace(/^\/(uz|ru|en)(?=\/|$)/, "");
  const L = (p: string) => `/${locale}${p}`;
  const active = (path: string) => (path === "" ? rest === "" : rest === path || rest.startsWith(`${path}/`));

  // Header scroll state
  useEffect(() => {
    let ticking = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobil menyu: body.menu-open (dizayn CSS shunga tayanadi); sahifa almashganda yopiladi.
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);
  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Til menyusi: tashqariga bosilganda yoki Escape bilan yopiladi.
  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLangOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="container nav">
        <Link className="brand brand--logo" href={L("")} aria-label="Pharm Way Group">
          <img className="brand-logo" src="/design/img/logo.webp" alt="Pharm Way Group" width={720} height={201} decoding="async" />
        </Link>
        <nav className="nav-links" id="primary-nav" aria-label={labels.mainMenu}>
          {NAV.map((item) => (
            <Link
              key={item.key}
              data-nav={item.key}
              href={L(item.path)}
              className={active(item.path) ? "active" : undefined}
              aria-current={active(item.path) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {labels[item.key]}
            </Link>
          ))}
          <div className="nav-links-cta">
            <Link className="button" href={L("/contact")} onClick={() => setMenuOpen(false)}>
              <span>{labels.cta}</span>
              <ArrowIcon />
            </Link>
          </div>
        </nav>
        <div className={`lang-switch${langOpen ? " open" : ""}`} id="lang-switch" ref={langRef}>
          <button
            type="button"
            className="lang-trigger"
            aria-haspopup="true"
            aria-expanded={langOpen}
            aria-controls="lang-menu"
            aria-label="Til / Язык / Language"
            onClick={() => setLangOpen((v) => !v)}
          >
            <svg className="flag" aria-hidden="true" focusable="false">
              <use href={`#flag-${locale}`} />
            </svg>
            <span className="lang-current">{locale.toUpperCase()}</span>
            <svg className="lang-caret" aria-hidden="true" focusable="false">
              <use href="#icon-chevron-down" />
            </svg>
          </button>
          <div className="lang-menu" id="lang-menu" role="menu" aria-label="Til / Язык / Language">
            {LANGS.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}${rest}`}
                hrefLang={l.code}
                className="lang-item"
                role="menuitemradio"
                aria-checked={l.code === locale}
              >
                <svg className="flag" aria-hidden="true" focusable="false">
                  <use href={`#flag-${l.code}`} />
                </svg>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="header-actions">
          <Link className="button" href={L("/contact")}>
            <span>{labels.cta}</span>
            <ArrowIcon />
          </Link>
        </div>
        <button
          type="button"
          className="menu-toggle"
          aria-label={labels.menu}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
        </button>
      </div>
    </header>
  );
}
