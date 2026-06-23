import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AboutHero from "@/components/about/AboutHero";
import CompanyIntro from "@/components/about/CompanyIntro";
import MissionVision from "@/components/about/MissionVision";
import HistoryTimeline from "@/components/about/HistoryTimeline";
import OurValues from "@/components/about/OurValues";
import Geography from "@/components/about/Geography";
import Team from "@/components/about/Team";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.about" });
  return buildPageMetadata({ locale, path: "/about", title: t("title"), description: t("description") });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <AboutHero />
      <CompanyIntro />
      <MissionVision />
      <HistoryTimeline />
      <OurValues />
      <Geography />
      <Team />
      <CTA />
    </>
  );
}
