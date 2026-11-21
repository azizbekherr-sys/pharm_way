import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Search engines and AI answer engines we explicitly welcome (GEO/AIO): being
// crawlable by them is what lets ChatGPT, Perplexity, Claude, Gemini, Copilot
// and YandexGPT cite pharmway.uz in answers.
const ALLOWED_BOTS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "YandexBot",
  "YandexAdditional",
  "DuckDuckBot",
  "Applebot",
  "Applebot-Extended",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "meta-externalagent",
];

const PRIVATE_PATHS = ["/api/", "/admin/"];

export default function robots(): MetadataRoute.Robots {
  // Discourage indexing of non-production copies (e.g. a staging server with
  // SITE_ENV=staging) so they never compete with www.pharmway.uz in search.
  const siteEnv = process.env.SITE_ENV;
  if (siteEnv && siteEnv !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      // Private/functional areas only — CSS, JS and images stay crawlable.
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: ALLOWED_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE_PATHS },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
