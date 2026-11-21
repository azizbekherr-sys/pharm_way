import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FaqView from "@/components/site/views/faq";
import JsonLd from "@/components/seo/JsonLd";
import { siteContext, siteFaqJsonLd } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.faq" });
  return buildPageMetadata({ locale, path: "/faq", title: t("title"), description: t("description") });
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ctx = siteContext(locale);
  const breadcrumb = await sectionBreadcrumb(locale, "faq", "/faq");
  const faq = siteFaqJsonLd("faq", ctx.t);
  return (
    <>
      <JsonLd data={faq ? [faq, breadcrumb] : breadcrumb} />
      <FaqView {...ctx} />
    </>
  );
}
