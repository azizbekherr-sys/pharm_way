import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AboutView from "@/components/site/views/about";
import JsonLd from "@/components/seo/JsonLd";
import { siteContext } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.about" });
  return buildPageMetadata({ locale, path: "/about", title: t("title"), description: t("description") });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const breadcrumb = await sectionBreadcrumb(locale, "about", "/about");
  return (
    <>
      <JsonLd data={breadcrumb} />
      <AboutView {...siteContext(locale)} />
    </>
  );
}
