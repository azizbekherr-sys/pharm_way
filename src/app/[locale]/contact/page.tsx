import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactView from "@/components/site/views/contact";
import JsonLd from "@/components/seo/JsonLd";
import { MapLinks } from "@/components/site/SiteBlocks";
import { ContactForm } from "@/components/site/SiteForms";
import { contactFormLabels, formUi, siteContext, siteFaqJsonLd } from "@/components/site/page-helpers";
import { buildPageMetadata } from "@/lib/seo";
import { sectionBreadcrumb } from "@/lib/breadcrumb";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.pages.contact" });
  return buildPageMetadata({ locale, path: "/contact", title: t("title"), description: t("description") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ctx = siteContext(locale);
  const breadcrumb = await sectionBreadcrumb(locale, "contact", "/contact");
  const faq = siteFaqJsonLd("contact", ctx.t);
  return (
    <>
      <JsonLd data={faq ? [breadcrumb, faq] : breadcrumb} />
      <ContactView
        {...ctx}
        slots={{
          form: <ContactForm labels={contactFormLabels(ctx.t)} ui={formUi(locale)} />,
          mapLinks: <MapLinks locale={ctx.locale} t={ctx.t} />,
        }}
      />
    </>
  );
}
