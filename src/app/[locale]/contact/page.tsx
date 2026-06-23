import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import MapSection from "@/components/contact/MapSection";
import ContactFAQ from "@/components/contact/ContactFAQ";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.contact" });
  return buildPageMetadata({ locale, path: "/contact", title: t("title"), description: t("description") });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact.cta" });

  return (
    <>
      <ContactHero />
      <ContactSection />
      <MapSection />
      <ContactFAQ />
      <CTA title={t("title")} subtitle={t("subtitle")} buttonLabel={t("button")} />
    </>
  );
}
