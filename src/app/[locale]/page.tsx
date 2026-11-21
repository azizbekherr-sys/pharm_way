import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomeView from "@/components/site/views/home";
import JsonLd from "@/components/seo/JsonLd";
import { siteContext, siteFaqJsonLd } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.home" });
  return buildPageMetadata({ locale, path: "", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ctx = siteContext(locale);
  const faq = siteFaqJsonLd("home", ctx.t);
  return (
    <>
      {faq && <JsonLd data={faq} />}
      <HomeView {...ctx} />
    </>
  );
}
