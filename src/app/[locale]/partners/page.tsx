import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PartnersView from "@/components/site/views/partners";
import JsonLd from "@/components/seo/JsonLd";
import { PartnerLogos } from "@/components/site/SiteBlocks";
import { PartnerForm } from "@/components/site/SiteForms";
import { formUi, partnerFormLabels, siteContext } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.partners" });
  return buildPageMetadata({ locale, path: "/partners", title: t("title"), description: t("description") });
}

export default async function PartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ctx = siteContext(locale);
  const breadcrumb = await sectionBreadcrumb(locale, "partners", "/partners");
  return (
    <>
      <JsonLd data={breadcrumb} />
      <PartnersView
        {...ctx}
        slots={{
          logos: <PartnerLogos t={ctx.t} />,
          form: <PartnerForm labels={partnerFormLabels(ctx.t)} ui={formUi(locale)} serviceType="Hamkorlik arizasi" />,
        }}
      />
    </>
  );
}
