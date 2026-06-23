import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ServicesHero from "@/components/services-page/ServicesHero";
import ServicesGrid from "@/components/services-page/ServicesGrid";
import ServicesProcess from "@/components/services-page/ServicesProcess";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.services" });
  return buildPageMetadata({ locale, path: "/services", title: t("title"), description: t("description") });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ServicesProcess />
      <CTA />
    </>
  );
}
