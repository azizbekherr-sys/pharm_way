import { siteConfig, services } from "@/config/site";
import { siteUrl } from "@/lib/seo";
import { supabasePublic } from "@/lib/supabase-public";
import en from "../../../messages/en.json";

// Revalidate hourly so the blog index stays fresh without per-request DB load.
export const revalidate = 3600;

type ServiceMeta = { title?: string; description?: string };
type FaqItem = { q: string; a: string; category?: string };
type Stat = { value: string; label: string };

export async function GET() {
  const enUrl = (path: string) => `${siteUrl}/en${path}`;
  const metaServices = (en as { meta?: { services?: Record<string, ServiceMeta> } }).meta?.services ?? {};

  const serviceBlocks = services
    .map((s) => {
      const m = metaServices[s.slug] ?? {};
      const title = m.title ?? s.slug;
      const description = m.description ?? "";
      return `### ${title}\nURL: ${enUrl(`/services/${s.slug}`)}\n${description}`.trim();
    })
    .join("\n\n");

  let blogBlock = "";
  try {
    const { data: posts } = await supabasePublic
      .from("blog_posts")
      .select("slug, title, title_en, excerpt, excerpt_en, content_en, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    blogBlock = (posts ?? [])
      .map((p) => {
        // Link the English version only when the article is really translated.
        const translated = Boolean((p.content_en as string | null)?.trim());
        const title = translated ? (p.title_en as string) || (p.title as string) : (p.title as string);
        const excerpt = ((translated ? (p.excerpt_en as string) : "") || (p.excerpt as string) || "").trim();
        const url = translated ? enUrl(`/blog/${p.slug}`) : `${siteUrl}/uz/blog/${p.slug}`;
        const line = `- [${title}](${url})${translated ? "" : " (Uzbek)"}`;
        return excerpt ? `${line}\n  ${excerpt}` : line;
      })
      .join("\n");
  } catch {
    blogBlock = "";
  }

  const enJson = en as unknown as {
    faqPage?: { items?: FaqItem[] };
    about?: { intro?: { stats?: Stat[] } };
  };
  const faqBlock = (enJson.faqPage?.items ?? [])
    .map((f) => `### ${f.q}\n${f.a}`)
    .join("\n\n");
  const facts = (enJson.about?.intro?.stats ?? []).map((st) => `- ${st.value} ${st.label}`).join("\n");

  const body = `# Pharm Way Group — full content index

> Regulatory services for importing and registering dietary supplements (BFQ / БАД) and medicines in Uzbekistan and Central Asia. Languages: Uzbek (/uz), Russian (/ru), English (/en).

## Company
Pharm Way Group supports manufacturers and distributors entering the Uzbekistan and Central Asian health-product market through registration, import, customs and regulatory consulting.

- Website: ${siteUrl}
- Phone: ${siteConfig.phone}
- Email: ${siteConfig.email}
- Telegram: ${siteConfig.telegram}
- Address: ${siteConfig.address.en} (postal code ${siteConfig.postalCode})
- Map: ${siteConfig.maps.yandex} · ${siteConfig.maps.google}
- Working hours: Monday–Friday, 09:00–18:00 (Tashkent, UTC+5)
- Markets served: Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan
- Languages: Uzbek, Russian, English

## Key facts
${facts}

## Services

${serviceBlocks}

## Blog articles

${blogBlock || "(No published articles yet.)"}

## Frequently asked questions

${faqBlock}

## Reference
- FAQ: ${enUrl("/faq")}
- Contact: ${enUrl("/contact")}
- Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
