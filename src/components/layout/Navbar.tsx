"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Leaf,
  Award,
  Truck,
  FileCheck,
  BarChart3,
  Search,
  Phone,
  type LucideIcon,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { siteConfig, services } from "@/config/site";

const SERVICE_ICONS = ["🌿", "📋", "🚚", "📦", "📊", "🔍"];

const SERVICE_DROPDOWN_ICONS: LucideIcon[] = [
  Leaf,
  Award,
  Truck,
  FileCheck,
  BarChart3,
  Search,
];

type MenuKey = "services" | null;

function MenuIcon({ emoji }: { emoji: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-800 text-sm">
      {emoji}
    </span>
  );
}

function IconBox({ icon: Icon, size = 36 }: { icon: LucideIcon; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[10px]"
      style={{ width: size, height: size, background: "#1B3A6B" }}
    >
      <Icon size={size === 36 ? 18 : 16} color="#FFFFFF" strokeWidth={1.75} />
    </span>
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  const tServices = useTranslations("home.services");
  const locale = useLocale();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [pathname]);

  const serviceItems = tServices.raw("items") as { title: string }[];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
    <header
      className={`fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <nav
        ref={navRef}
        className={`container-page flex items-center justify-between transition-all duration-300 ${
          scrolled ? "h-[60px]" : "h-[72px]"
        }`}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <Link href="/" className="flex items-center" onClick={() => setOpenMenu(null)}>
          <Image
            src="/images/logo.png"
            alt="Pharm Way Group"
            width={2031}
            height={598}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <DesktopMenuTrigger
            label={t("services")}
            isOpen={openMenu === "services"}
            isActive={isActive("/services")}
            onToggle={() => setOpenMenu((v) => (v === "services" ? null : "services"))}
            onHover={() => setOpenMenu("services")}
          >
            <AnimatePresence>
              {openMenu === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                >
                  <div
                    className="rounded-[14px] bg-white p-1.5"
                    style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.10)" }}
                  >
                    <div
                      className="flex items-center justify-between rounded-[10px] px-3.5 py-2.5"
                      style={{ backgroundColor: "#F8F9FC" }}
                    >
                      <span className="text-xs font-medium" style={{ color: "#64748b" }}>
                        {t("menu.servicesHeader")}
                      </span>
                      <Link
                        href="/services"
                        onClick={() => setOpenMenu(null)}
                        className="flex items-center gap-1 text-xs font-medium hover:opacity-80"
                        style={{ color: "#1B4FD8" }}
                      >
                        {t("menu.viewAllServices")}
                        <ArrowRight size={12} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1 p-1 pt-2">
                      {services.map((s, i) => {
                        const Icon = SERVICE_DROPDOWN_ICONS[i];
                        return (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            onClick={() => setOpenMenu(null)}
                            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 transition-colors duration-150 hover:bg-[#F8F9FC]"
                          >
                            <IconBox icon={Icon} />
                            <span className="min-w-0">
                              <span className="block truncate text-[13px] font-semibold" style={{ color: "#1E293B" }}>
                                {serviceItems[i]?.title}
                              </span>
                              <span className="mt-[1px] block truncate text-[11px]" style={{ color: "#94A3B8" }}>
                                {t(`menu.serviceSubtitles.${i}`)}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>

                    <Link
                      href="/contact"
                      onClick={() => setOpenMenu(null)}
                      className="mt-1 flex items-center justify-between rounded-[8px] px-4 py-[11px]"
                      style={{ backgroundColor: "#1B3A6B" }}
                    >
                      <span>
                        <span className="block text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {t("menu.helpEyebrow")}
                        </span>
                        <span className="block text-[13px] font-semibold text-white">{t("menu.helpTitle")}</span>
                      </span>
                      <ArrowRight size={20} className="text-white" strokeWidth={1.75} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DesktopMenuTrigger>

          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary-700 ${
              isActive("/about") ? "text-primary-700" : "text-slate-700"
            }`}
          >
            {t("about")}
          </Link>

          <Link
            href="/blog"
            className={`text-sm font-medium transition-colors hover:text-primary-700 ${
              isActive("/blog") ? "text-primary-700" : "text-slate-700"
            }`}
          >
            {t("blog")}
          </Link>

          <Link
            href="/faq"
            className={`text-sm font-medium transition-colors hover:text-primary-700 ${
              isActive("/faq") ? "text-primary-700" : "text-slate-700"
            }`}
          >
            {t("faq")}
          </Link>

          <Link
            href="/certificates"
            className={`text-sm font-medium transition-colors hover:text-primary-700 ${
              isActive("/certificates") ? "text-primary-700" : "text-slate-700"
            }`}
          >
            {t("certificates")}
          </Link>

          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors hover:text-primary-700 ${
              isActive("/contact") ? "text-primary-700" : "text-slate-700"
            }`}
          >
            {t("contact")}
          </Link>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              title="Telegram"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#229ED9",
                color: "white",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.967l-2.96-.924c-.64-.203-.654-.64.136-.954l11.57-4.461c.537-.194 1.006.131.978.593z" />
              </svg>
            </a>

            <a
              href={siteConfig.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            <a
              href={siteConfig.phoneHref}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: "#1B3A6B",
                color: "white",
                padding: "8px 14px",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Phone size={14} color="white" />
              {siteConfig.phone}
            </a>
          </div>
        </div>

        <button
          type="button"
          className="text-slate-700 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={26} />
        </button>
      </nav>
    </header>

    <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-white lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <Image src="/images/logo.png" alt="Pharm Way Group" width={2031} height={598} className="h-10 w-auto" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-4 py-4">
              <MobileSection title={t("services")}>
                {services.map((s, i) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-primary-50"
                  >
                    <MenuIcon emoji={SERVICE_ICONS[i]} />
                    {serviceItems[i]?.title}
                  </Link>
                ))}
              </MobileSection>

              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-primary-50"
              >
                {t("about")}
              </Link>

              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-primary-50"
              >
                {t("blog")}
              </Link>

              <Link
                href="/faq"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-primary-50"
              >
                {t("faq")}
              </Link>

              <Link
                href="/certificates"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-primary-50"
              >
                {t("certificates")}
              </Link>

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-primary-50"
              >
                {t("contact")}
              </Link>
            </div>

            <div className="border-t border-slate-100 px-4 py-4">
              <div className="mb-3">
                <LanguageSwitcher />
              </div>

              <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                <a
                  href={siteConfig.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "#229ED9",
                    color: "white",
                    padding: "12px 14px",
                    borderRadius: "50px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.967l-2.96-.924c-.64-.203-.654-.64.136-.954l11.57-4.461c.537-.194 1.006.131.978.593z" />
                  </svg>
                  Telegram
                </a>

                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    background: "#25D366",
                    color: "white",
                    padding: "12px 14px",
                    borderRadius: "50px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              <a
                href={siteConfig.phoneHref}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  background: "#1B3A6B",
                  color: "white",
                  padding: "12px 18px",
                  borderRadius: "50px",
                  fontSize: "14px",
                  fontWeight: "600",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  width: "100%",
                }}
              >
                <Phone size={16} color="white" />
                {siteConfig.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DesktopMenuTrigger({
  label,
  isOpen,
  isActive,
  onToggle,
  onHover,
  children,
}: {
  label: string;
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  onHover: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onHover}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary-700 ${
          isActive ? "text-primary-700" : "text-slate-700"
        }`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {children}
    </div>
  );
}

function MobileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}
