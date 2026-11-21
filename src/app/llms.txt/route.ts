import { siteConfig, services } from "@/config/site";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// Human-readable English labels for the service slugs (factual service names,
// not marketing claims). Keep in sync with src/config/site.ts `services`.
const SERVICE_LABELS: Record<string, string> = {
  "bfq-registration": "Dietary supplement (BFQ) registration",
  certification: "Certification",
  "import-logistics": "Import & logistics",
  customs: "Customs clearance",
  "regulatory-consulting": "Regulatory consulting",
  "distributor-search": "Distributor search",
};

export async function GET() {
  const en = (path: string) => `${siteUrl}/en${path}`;

  const body = `# Pharm Way Group

> Regulatory services for importing and registering dietary supplements (BFQ / БАД), medicines and medical devices in Uzbekistan and Central Asia.

Pharm Way Group helps manufacturers and distributors bring health products to the Uzbekistan market. The website is available in Uzbek (/uz), Russian (/ru) and English (/en).

## Services
${services
  .map((s) => `- [${SERVICE_LABELS[s.slug] ?? s.slug}](${en(`/services/${s.slug}`)})`)
  .join("\n")}

## Key pages
- [Home](${en("")})
- [About](${en("/about")})
- [Services](${en("/services")})
- [Blog](${en("/blog")})
- [FAQ](${en("/faq")})
- [Partners](${en("/partners")})
- [Contact](${en("/contact")})

## Contact
- Phone: ${siteConfig.phone}
- Email: ${siteConfig.email}
- Address: ${siteConfig.address.en}
- Map: ${siteConfig.maps.yandex}
- Telegram: ${siteConfig.telegram}

## Notes
- Markets served: Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan.
- Full machine-readable index: ${siteUrl}/llms-full.txt
- Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
