import "server-only";
import { headers } from "next/headers";
import { userAgent } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Qidiruv robotlari / preview botlarini analitikadan chiqarib tashlaymiz.
const BOT_RE =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegram|preview|monitor|lighthouse|headless|pingdom|gtmetrix|uptimerobot|google-inspectiontool|vercel-screenshot/i;

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Tashqi manba hostini ajratamiz; ichki (o'z sayti) navigatsiyani "direct" deb qoldiramiz.
function parseReferrer(referer: string | null, host: string | null): string | null {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    if (host && url.host === host) return null;
    return url.hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Blog maqolasi ko'rilganda bitta tashrif yozuvini saqlaydi.
 * Geo (davlat/shahar) Vercel'ning `x-vercel-ip-*` sarlavhalaridan olinadi
 * (faqat production'da mavjud), qurilma/OS/brauzer esa User-Agent'dan.
 * Xatolar hech qachon sahifa renderini buzmaydi.
 */
export async function recordBlogView(slug: string, locale: string): Promise<void> {
  try {
    const h = headers();
    const ua = h.get("user-agent") ?? "";
    if (!ua || BOT_RE.test(ua)) return;

    const { device, os, browser } = userAgent({ headers: h as unknown as Headers });
    const deviceType =
      device.type === "mobile" ? "mobile" : device.type === "tablet" ? "tablet" : "desktop";

    const cityRaw = h.get("x-vercel-ip-city");

    await supabaseAdmin.from("blog_views").insert({
      slug,
      country: h.get("x-vercel-ip-country") || null,
      region: h.get("x-vercel-ip-country-region") || null,
      city: cityRaw ? safeDecode(cityRaw) : null,
      device: deviceType,
      os: os.name ?? null,
      browser: browser.name ?? null,
      locale,
      referrer: parseReferrer(h.get("referer"), h.get("host")),
    });
  } catch {
    // Analitika ikkilamchi — hech qachon sahifani buzmasin.
  }
}
