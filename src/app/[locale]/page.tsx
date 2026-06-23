import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/Hero";
import ServicesOverview from "@/components/home/ServicesOverview";
import WhyUs from "@/components/home/WhyUs";
import Stats from "@/components/home/Stats";
import Partners from "@/components/home/Partners";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.home" });
  return buildPageMetadata({ locale, path: "", title: t("title"), description: t("description") });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyUs />
      <Stats />
      <Partners />
      <CTA />
    </>
  );
}
