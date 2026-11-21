import { createHash } from "node:crypto";
import { NextRequest, NextResponse, userAgent } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { clientIp, lookupGeo } from "@/lib/geoip";
import { incrementBlogPostViews } from "@/lib/blog";

export const dynamic = "force-dynamic";

// Qidiruv robotlari, preview va monitoring botlari hisobga olinmaydi.
const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|monitor|lighthouse|headless|pingdom|gtmetrix|uptimerobot|google-inspectiontool|curl|wget|python|axios|node-fetch/i;

const LOCALES = new Set(["uz", "ru", "en"]);

const PAGE_TYPES: Record<string, [string, string]> = {
  // birinchi segment -> [ro'yxat sahifasi turi, ichki sahifa turi]
  blog: ["blog", "blog_post"],
  services: ["services", "service"],
  partners: ["partners", "partner"],
  contact: ["contact", "contact"],
  about: ["about", "about"],
  faq: ["faq", "faq"],
  testimonials: ["testimonials", "testimonials"],
};

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s ? s.slice(0, max) : null;
}

/** "/uz/blog/abc" -> { locale: "uz", page: "/blog/abc", type: "blog_post" } */
function classify(path: string) {
  const parts = path.split("/").filter(Boolean);
  const locale = parts[0] && LOCALES.has(parts[0]) ? parts.shift()! : null;
  const page = "/" + parts.join("/");
  if (parts.length === 0) return { locale, page, type: "home" };
  const pair = PAGE_TYPES[parts[0]];
  if (!pair) return { locale, page, type: "other" };
  return { locale, page, type: parts.length > 1 ? pair[1] : pair[0] };
}

function referrerHost(ref: string | null, ownHost: string | null): string | null {
  if (!ref) return null;
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    const own = (ownHost ?? "").split(":")[0].replace(/^www\./, "");
    if (!host || host === own) return null;
    return host;
  } catch {
    return null;
  }
}

/** Anonim tashrifchi belgisi: IP+brauzer'dan bir tomonlama hash (IP saqlanmaydi). */
function visitorId(ip: string | null, ua: string): string {
  const salt = process.env.ANALYTICS_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || "pharmway";
  return createHash("sha256").update(`${salt}|${ip ?? "-"}|${ua}`).digest("hex").slice(0, 24);
}

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get("user-agent") ?? "";
    if (!ua || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });

    // Admin o'z saytini ko'rganda statistikaga qo'shilmasin.
    if (req.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"))) {
      return new NextResponse(null, { status: 204 });
    }

    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const path = str(body?.path, 300);
    if (!path || !path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) {
      return new NextResponse(null, { status: 204 });
    }

    const { locale: pathLocale, page, type } = classify(path);
    const bodyLocale = str(body?.locale, 5);
    const locale = pathLocale ?? (bodyLocale && LOCALES.has(bodyLocale) ? bodyLocale : null);

    const { device, os, browser } = userAgent(req);
    const deviceType =
      device.type === "mobile" ? "mobile" : device.type === "tablet" ? "tablet" : "desktop";

    const geo = await lookupGeo(req.headers);
    const sid = str(body?.sid, 64);
    const isEntry = body?.entry === true;

    const referrer = isEntry ? referrerHost(str(body?.ref, 500), req.headers.get("host")) : null;
    const views = supabaseAdmin.from("page_views").insert({
      path,
      page,
      page_type: type,
      title: str(body?.title, 200),
      locale,
      visitor: visitorId(clientIp(req.headers), ua),
      session_id: sid && /^[A-Za-z0-9-]+$/.test(sid) ? sid : null,
      is_entry: isEntry,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      device: deviceType,
      os: os.name ?? null,
      browser: browser.name ?? null,
      referrer,
      utm_source: isEntry ? str(body?.utm_source, 100) : null,
      utm_medium: isEntry ? str(body?.utm_medium, 100) : null,
      utm_campaign: isEntry ? str(body?.utm_campaign, 100) : null,
    });

    // Blog maqolasi: umumiy hisoblagich (blog_posts.views) + blog_views jadvali.
    // Avval bu sahifa render qilinganda qilinardi va maqolani har safar dinamik qilardi.
    const slug = type === "blog_post" ? page.split("/")[2] : null;
    const blog =
      slug && /^[a-z0-9-]{1,200}$/.test(slug)
        ? Promise.all([
            incrementBlogPostViews(slug),
            supabaseAdmin.from("blog_views").insert({
              slug,
              country: geo.country,
              region: geo.region,
              city: geo.city,
              device: deviceType,
              os: os.name ?? null,
              browser: browser.name ?? null,
              locale,
              referrer,
            }),
          ])
        : null;

    await Promise.all([views, blog]);
  } catch {
    // Analitika ikkilamchi — xato foydalanuvchiga ta'sir qilmaydi.
  }
  return new NextResponse(null, { status: 204 });
}
