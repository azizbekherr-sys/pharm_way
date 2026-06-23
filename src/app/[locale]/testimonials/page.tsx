import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TestimonialsHero from "@/components/testimonials-page/TestimonialsHero";
import TestimonialsStats from "@/components/testimonials-page/TestimonialsStats";
import FeaturedTestimonial from "@/components/testimonials-page/FeaturedTestimonial";
import TestimonialsExplorer from "@/components/testimonials-page/TestimonialsExplorer";
import VideoTestimonials from "@/components/testimonials-page/VideoTestimonials";
import TrustBadges from "@/components/testimonials-page/TrustBadges";
import LeaveReview from "@/components/testimonials-page/LeaveReview";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.testimonials" });
  return buildPageMetadata({ locale, path: "/testimonials", title: t("title"), description: t("description") });
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "testimonialsPage.cta" });

  return (
    <>
      <TestimonialsHero />
      <TestimonialsStats />
      <FeaturedTestimonial />
      <TestimonialsExplorer />
      <VideoTestimonials />
      <TrustBadges />
      <LeaveReview />
      <CTA title={t("title")} buttonLabel={t("button")} />
    </>
  );
}
