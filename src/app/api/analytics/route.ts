import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const DAYS: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = req.nextUrl.searchParams.get("range") ?? "30d";
  const since =
    range === "all"
      ? new Date(0)
      : new Date(Date.now() - (DAYS[range] ?? 30) * 86_400_000);

  const { data, error } = await supabaseAdmin.rpc("blog_views_stats", {
    since: since.toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // RPC eski/to'liqmas bo'lsa ham sahifa buzilmasligi uchun to'liq shaklga keltiramiz.
  const raw = (data ?? {}) as Record<string, unknown>;
  const num = (k: string) => (typeof raw[k] === "number" ? (raw[k] as number) : 0);
  const arr = (k: string) => (Array.isArray(raw[k]) ? raw[k] : []);

  return NextResponse.json({
    allTime: num("allTime"),
    total: num("total"),
    today: num("today"),
    byCountry: arr("byCountry"),
    byCity: arr("byCity"),
    byDevice: arr("byDevice"),
    byBrowser: arr("byBrowser"),
    byOs: arr("byOs"),
    byLocale: arr("byLocale"),
    byReferrer: arr("byReferrer"),
    byArticle: arr("byArticle"),
    daily: arr("daily"),
  });
}
