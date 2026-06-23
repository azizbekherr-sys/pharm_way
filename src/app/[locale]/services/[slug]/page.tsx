import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { services } from "@/config/site";
import ServiceDetailHero from "@/components/service-detail/ServiceDetailHero";
import ServiceOverview from "@/components/service-detail/ServiceOverview";
import ServiceProcessSteps from "@/components/service-detail/ServiceProcessSteps";
import ServiceDocuments from "@/components/service-detail/ServiceDocuments";
import ServiceTimelinePricing from "@/components/service-detail/ServiceTimelinePricing";
import ServiceFAQAccordion from "@/components/service-detail/ServiceFAQAccordion";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!services.some((s) => s.slug === slug)) return {};
  const t = await getTranslations({ locale, namespace: `meta.services.${slug}` });
  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    title: t("title"),
    description: t("description"),
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const tServices = await getTranslations({ locale, namespace: "home.services" });
  const items = tServices.raw("items") as { title: string }[];
  const title = items[index]?.title ?? "";

  const tDetail = await getTranslations({ locale, namespace: "serviceDetail" });

  return (
    <>
      <ServiceDetailHero title={title} />
      <ServiceOverview slug={slug} />
      <ServiceProcessSteps slug={slug} />
      <ServiceDocuments slug={slug} />
      <ServiceTimelinePricing slug={slug} />
      <ServiceFAQAccordion slug={slug} />
      <CTA title={tDetail("ctaTitle")} buttonLabel={tDetail("ctaButton")} href="/contact" />
    </>
  );
}
