import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { dayList, parseRange, rangeSince, tashkentDay } from "@/lib/analytics-range";

export const dynamic = "force-dynamic";

type Totals = {
  views: number;
  visitors: number;
  sessions: number;
  bounces: number;
  avgPages: number;
  avgDuration: number;
};

function toTotals(raw: unknown): Totals {
  const r = (raw ?? {}) as Record<string, unknown>;
  const n = (k: keyof Totals) => Number(r[k] ?? 0) || 0;
  return {
    views: n("views"),
    visitors: n("visitors"),
    sessions: n("sessions"),
    bounces: n("bounces"),
    avgPages: n("avgPages"),
    avgDuration: n("avgDuration"),
  };
}

function arr<T = unknown>(raw: Record<string, unknown>, k: string): T[] {
  return Array.isArray(raw[k]) ? (raw[k] as T[]) : [];
}

/** Eski blog analitikasi (blog_views jadvali + blog_posts.views hisoblagichi). */
async function blogStats(since: Date) {
  const { data } = await supabaseAdmin.rpc("blog_views_stats", { since: since.toISOString() });
  const raw = (data ?? {}) as Record<string, unknown>;
  const { data: posts } = await supabaseAdmin
    .from("blog_posts")
    .select("slug, title, views")
    .order("views", { ascending: false });
  const historyByArticle = (posts ?? [])
    .map((p) => ({ key: p.slug as string, title: (p.title as string) ?? p.slug, count: (p.views as number) ?? 0 }))
    .filter((a) => a.count > 0);
  return {
    historyTotal: historyByArticle.reduce((s, a) => s + a.count, 0),
    historyByArticle,
    total: Number(raw.total ?? 0) || 0,
    byArticle: arr(raw, "byArticle"),
    byCountry: arr(raw, "byCountry"),
    byDevice: arr(raw, "byDevice"),
  };
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = parseRange(req.nextUrl.searchParams.get("range"));
  const now = new Date();
  const since = rangeSince(range, now.getTime());
  const prevSince = range === "all" ? null : new Date(since.getTime() - (now.getTime() - since.getTime()));

  const [main, totals, prev, contactsNow, contactsPrev, blog] = await Promise.all([
    supabaseAdmin.rpc("site_analytics", { since: since.toISOString() }),
    supabaseAdmin.rpc("site_analytics_totals", { since: since.toISOString(), until: now.toISOString() }),
    prevSince
      ? supabaseAdmin.rpc("site_analytics_totals", { since: prevSince.toISOString(), until: since.toISOString() })
      : Promise.resolve({ data: null, error: null }),
    supabaseAdmin
      .from("contacts")
      .select("created_at")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true })
      .limit(10000),
    prevSince
      ? supabaseAdmin
          .from("contacts")
          .select("id", { count: "exact", head: true })
          .gte("created_at", prevSince.toISOString())
          .lt("created_at", since.toISOString())
      : Promise.resolve({ count: null }),
    blogStats(since),
  ]);

  if (main.error || totals.error) {
    // page_views jadvali / funksiyalar hali yaratilmagan bo'lsa.
    return NextResponse.json({ setupNeeded: true, blog, error: (main.error ?? totals.error)?.message }, { status: 200 });
  }

  const raw = (main.data ?? {}) as Record<string, unknown>;
  const firstAt = typeof raw.firstAt === "string" ? raw.firstAt : null;

  // Kunlik qator: bo'sh kunlar 0 bilan to'ldiriladi, murojaatlar qo'shiladi.
  const contactsByDay = new Map<string, number>();
  for (const c of contactsNow.data ?? []) {
    const d = tashkentDay(c.created_at as string);
    contactsByDay.set(d, (contactsByDay.get(d) ?? 0) + 1);
  }
  const dailyRaw = arr<{ day: string; views: number; visitors: number; sessions: number }>(raw, "daily");
  const byDay = new Map(dailyRaw.map((d) => [d.day, d]));
  const startDay =
    range === "all"
      ? new Date(Math.min(firstAt ? Date.parse(firstAt) : now.getTime(), ...[...contactsByDay.keys()].map((d) => Date.parse(d))))
      : since;
  const days = dayList(startDay, now).slice(-730);
  const daily = days.map((day) => ({
    day,
    views: byDay.get(day)?.views ?? 0,
    visitors: byDay.get(day)?.visitors ?? 0,
    sessions: byDay.get(day)?.sessions ?? 0,
    contacts: contactsByDay.get(day) ?? 0,
  }));

  const hourly = Array.from({ length: 24 }, () => 0);
  for (const h of arr<{ hour: number; count: number }>(raw, "hourly")) {
    if (h.hour >= 0 && h.hour < 24) hourly[h.hour] = h.count;
  }
  const weekday = Array.from({ length: 7 }, () => 0); // 0 = Dushanba ... 6 = Yakshanba
  for (const w of arr<{ dow: number; count: number }>(raw, "weekday")) {
    if (w.dow >= 1 && w.dow <= 7) weekday[w.dow - 1] = w.count;
  }

  const today = (raw.today ?? {}) as { views?: number; visitors?: number };

  return NextResponse.json({
    range,
    since: since.toISOString(),
    totals: toTotals(totals.data),
    prev: prevSince ? toTotals(prev.data) : null,
    online: Number(raw.online ?? 0) || 0,
    allTime: Number(raw.allTime ?? 0) || 0,
    firstAt,
    today: { views: today.views ?? 0, visitors: today.visitors ?? 0 },
    newVisitors: Number(raw.newVisitors ?? 0) || 0,
    contacts: {
      total: contactsNow.data?.length ?? 0,
      prevTotal: prevSince ? contactsPrev.count ?? 0 : null,
    },
    daily,
    hourly,
    weekday,
    topPages: arr(raw, "topPages"),
    pageTypes: arr(raw, "pageTypes"),
    entryPages: arr(raw, "entryPages"),
    byCountry: arr(raw, "byCountry"),
    byCity: arr(raw, "byCity"),
    byDevice: arr(raw, "byDevice"),
    byOs: arr(raw, "byOs"),
    byBrowser: arr(raw, "byBrowser"),
    byLocale: arr(raw, "byLocale"),
    byReferrer: arr(raw, "byReferrer"),
    byUtm: arr(raw, "byUtm"),
    blog,
  });
}
