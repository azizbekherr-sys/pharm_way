import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ServicesView from "@/components/site/views/services";
import JsonLd from "@/components/seo/JsonLd";
import { siteContext } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.services" });
  return buildPageMetadata({ locale, path: "/services", title: t("title"), description: t("description") });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = await sectionBreadcrumb(locale, "services", "/services");
  return (
    <>
      <JsonLd data={breadcrumb} />
      <ServicesView {...siteContext(locale)} />
    </>
  );
}
