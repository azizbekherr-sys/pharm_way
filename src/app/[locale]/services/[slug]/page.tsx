import type { Metadata } from "next";
import type { ComponentType } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { services } from "@/config/site";
import BfqRegistration from "@/components/site/views/service-bfq-registration";
import ImportLogistics from "@/components/site/views/service-import-logistics";
import Customs from "@/components/site/views/service-customs";
import RegulatoryConsulting from "@/components/site/views/service-regulatory-consulting";
import DistributorSearch from "@/components/site/views/service-distributor-search";
import JsonLd from "@/components/seo/JsonLd";
import { SERVICE_NAMES, siteContext, siteFaqJsonLd } from "@/components/site/page-helpers";
import { buildPageMetadata, buildServiceJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

type ViewProps = ReturnType<typeof siteContext>;
const VIEWS: Record<string, ComponentType<ViewProps>> = {
  "bfq-registration": BfqRegistration,
  "import-logistics": ImportLogistics,
  customs: Customs,
  "regulatory-consulting": RegulatoryConsulting,
  "distributor-search": DistributorSearch,
};

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!VIEWS[slug]) return {};
  const t = await getTranslations({ locale, namespace: `meta.services.${slug}` });
  return buildPageMetadata({ locale, path: `/services/${slug}`, title: t("title"), description: t("description") });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const View = VIEWS[slug];
  if (!View) notFound();

  const ctx = siteContext(locale);
  const name = ctx.t(SERVICE_NAMES[slug]);
  const tMeta = await getTranslations({ locale, namespace: `meta.services.${slug}` });
  const faq = siteFaqJsonLd(`service-${slug}`, ctx.t);
  const jsonLd = [
    buildServiceJsonLd({ locale, slug, name, description: tMeta("description") }),
    buildBreadcrumbJsonLd(locale, [
      { name: ctx.t("Bosh sahifa"), path: "" },
      { name: ctx.t("Xizmatlar"), path: "/services" },
      { name, path: `/services/${slug}` },
    ]),
    ...(faq ? [faq] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <View {...ctx} />
    </>
  );
}
