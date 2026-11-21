import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseRange, rangeSince } from "@/lib/analytics-range";

export const dynamic = "force-dynamic";

const COLUMNS =
  "id, created_at, path, page, page_type, title, locale, visitor, session_id, is_entry, country, region, city, device, os, browser, referrer, utm_source, utm_medium, utm_campaign";

/** Tashriflar jurnali: har bir sahifa ko'rilishi, eng yangisi birinchi. */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const since = rangeSince(parseRange(sp.get("range")));
  const limit = Math.min(Math.max(Number(sp.get("limit")) || 100, 1), 500);
  const before = Number(sp.get("before")) || 0;
  const session = sp.get("session");
  const visitor = sp.get("visitor");
  const country = sp.get("country");
  const device = sp.get("device");
  const page = sp.get("page");

  let q = supabaseAdmin
    .from("page_views")
    .select(COLUMNS)
    .gte("created_at", since.toISOString())
    .order("id", { ascending: false })
    .limit(limit);

  if (before > 0) q = q.lt("id", before);
  if (session) q = q.eq("session_id", session);
  if (visitor) q = q.eq("visitor", visitor);
  if (country) q = q.eq("country", country);
  if (device) q = q.eq("device", device);
  if (page) q = q.eq("page", page);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ rows: data ?? [], hasMore: (data?.length ?? 0) === limit });
}
