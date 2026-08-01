import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FaqHero from "@/components/faq-page/FaqHero";
import FaqExplorer from "@/components/faq-page/FaqExplorer";
import StillQuestions from "@/components/faq-page/StillQuestions";
import CTA from "@/components/home/CTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildPageMetadata, buildFaqJsonLd } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.faq" });
  return buildPageMetadata({ locale, path: "/faq", title: t("title"), description: t("description") });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "faqPage.cta" });
  const tFaq = await getTranslations({ locale, namespace: "faqPage" });
  const items = tFaq.raw("items") as { category: string; q: string; a: string }[];
  const breadcrumb = await sectionBreadcrumb(locale, "faq", "/faq");
  const jsonLd = [buildFaqJsonLd(items), breadcrumb];

  return (
    <>
      <JsonLd data={jsonLd} />
      <FaqHero />
      <FaqExplorer />
      <StillQuestions />
      <CTA title={t("title")} buttonLabel={t("button")} />
    </>
  );
}
