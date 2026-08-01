import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PartnersHero from "@/components/partners-page/PartnersHero";
import PartnerStats from "@/components/partners-page/PartnerStats";
import PartnersTabs from "@/components/partners-page/PartnersTabs";
import BecomePartner from "@/components/partners-page/BecomePartner";
import WhyPartner from "@/components/partners-page/WhyPartner";
import CTA from "@/components/home/CTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.partners" });
  return buildPageMetadata({ locale, path: "/partners", title: t("title"), description: t("description") });
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "partnersPage.cta" });
  const breadcrumb = await sectionBreadcrumb(locale, "partners", "/partners");

  return (
    <>
      <JsonLd data={breadcrumb} />
      <PartnersHero />
      <PartnerStats />
      <PartnersTabs />
      <BecomePartner />
      <WhyPartner />
      <CTA title={t("title")} buttonLabel={t("button")} />
    </>
  );
}
