import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { parseRange, rangeSince } from "@/lib/analytics-range";

export const dynamic = "force-dynamic";

const COLUMNS = [
  "created_at",
  "page",
  "title",
  "locale",
  "page_type",
  "country",
  "region",
  "city",
  "device",
  "os",
  "browser",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "is_entry",
  "session_id",
  "visitor",
] as const;

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Tanlangan davrdagi barcha tashriflarni CSV (Excel'da ochiladi) qilib beradi. */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const range = parseRange(req.nextUrl.searchParams.get("range"));
  const since = rangeSince(range);

  const rows: Record<string, unknown>[] = [];
  const PAGE = 1000;
  for (let from = 0; from < 100_000; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from("page_views")
      .select(COLUMNS.join(", "))
      .gte("created_at", since.toISOString())
      .order("id", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    rows.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < PAGE) break;
  }

  const lines = [COLUMNS.join(",")];
  for (const r of rows) lines.push(COLUMNS.map((c) => csvCell(r[c])).join(","));
  // BOM — Excel UTF-8 (kirill/o'zbek harflari) to'g'ri ko'rsatishi uchun.
  const csv = "﻿" + lines.join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="pharmway-tashriflar-${range}.csv"`,
      "cache-control": "no-store",
    },
  });
}
