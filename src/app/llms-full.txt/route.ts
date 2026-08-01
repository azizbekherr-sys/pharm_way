import { siteConfig, services } from "@/config/site";
import { siteUrl } from "@/lib/seo";
import { supabaseAdmin } from "@/lib/supabase-admin";
import en from "../../../messages/en.json";

// Revalidate hourly so the blog index stays fresh without per-request DB load.
export const revalidate = 3600;

type ServiceMeta = { title?: string; description?: string };

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
    const { data: posts } = await supabaseAdmin
      .from("blog_posts")
      .select("slug, title, title_en, excerpt, excerpt_en, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });

    blogBlock = (posts ?? [])
      .map((p) => {
        const title = (p.title_en as string) || (p.title as string);
        const excerpt = ((p.excerpt_en as string) || (p.excerpt as string) || "").trim();
        const line = `- [${title}](${enUrl(`/blog/${p.slug}`)})`;
        return excerpt ? `${line}\n  ${excerpt}` : line;
      })
      .join("\n");
  } catch {
    blogBlock = "";
  }

  const body = `# Pharm Way Group — full content index

> Regulatory services for importing and registering dietary supplements (BFQ / БАД), medicines and medical devices in Uzbekistan and Central Asia. Languages: Uzbek (/uz), Russian (/ru), English (/en).

## Company
Pharm Way Group supports manufacturers and distributors entering the Uzbekistan and Central Asian health-product market through registration, certification, import, customs and regulatory consulting.

- Website: ${siteUrl}
- Phone: ${siteConfig.phone}
- Email: ${siteConfig.email}
- Telegram: ${siteConfig.telegram}
- Location: Tashkent, Uzbekistan
- Markets served: Uzbekistan, Kazakhstan, Kyrgyzstan, Tajikistan

## Services

${serviceBlocks}

## Blog articles

${blogBlock || "(No published articles yet.)"}

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
