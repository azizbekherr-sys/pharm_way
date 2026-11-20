import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  // Discourage indexing of non-production copies (e.g. a staging server with
  // SITE_ENV=staging) so they never compete with www.pharmway.uz in search.
  const siteEnv = process.env.SITE_ENV;
  if (siteEnv && siteEnv !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private/functional areas only — CSS, JS and images stay crawlable.
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
