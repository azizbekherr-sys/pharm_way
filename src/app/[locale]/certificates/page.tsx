import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import CertificatesHero from "@/components/certificates-page/CertificatesHero";
import CertificatesSection from "@/components/certificates-page/CertificatesSection";
import CTA from "@/components/home/CTA";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.certificates" });
  return buildPageMetadata({ locale, path: "/certificates", title: t("title"), description: t("description") });
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "certificatesPage.cta" });

  return (
    <>
      <CertificatesHero />
      <CertificatesSection />
      <CTA title={t("title")} buttonLabel={t("button")} />
    </>
  );
}
