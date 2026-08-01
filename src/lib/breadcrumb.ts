import "server-only";
import { getTranslations } from "next-intl/server";
import { buildBreadcrumbJsonLd } from "@/lib/seo";

/**
 * BreadcrumbList JSON-LD for a top-level section: Home › <Section>.
 * `sectionKey` must be a key in the `nav` translation namespace.
 */
export async function sectionBreadcrumb(locale: string, sectionKey: string, sectionPath: string) {
  const tNav = await getTranslations({ locale, namespace: "nav" });
  return buildBreadcrumbJsonLd(locale, [
    { name: tNav("home"), path: "" },
    { name: tNav(sectionKey), path: sectionPath },
  ]);
}
