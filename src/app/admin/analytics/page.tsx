"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Chrome,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  Languages,
  Layers,
  ListOrdered,
  LogIn,
  MapPin,
  MessageSquare,
  Monitor,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Tablet,
  Timer,
  UserPlus,
  Users,
  X,
} from "lucide-react";

// ---- Turlar ---------------------------------------------------------------

type Slice = { key: string; count: number; visitors?: number; title?: string; country?: string };
type Totals = {
  views: number;
  visitors: number;
  sessions: number;
  bounces: number;
  avgPages: number;
  avgDuration: number;
};
type DayPoint = { day: string; views: number; visitors: number; sessions: number; contacts: number };
type BlogStats = {
  historyTotal: number;
  historyByArticle: { key: string; title: string; count: number }[];
  total: number;
  byArticle: { key: string; title: string; count: number }[];
};
type Stats = {
  setupNeeded?: boolean;
  range: string;
  totals: Totals;
  prev: Totals | null;
  online: number;
  allTime: number;
  firstAt: string | null;
  today: { views: number; visitors: number };
  newVisitors: number;
  contacts: { total: number; prevTotal: number | null };
  daily: DayPoint[];
  hourly: number[];
  weekday: number[];
  topPages: Slice[];
  pageTypes: Slice[];
  entryPages: Slice[];
  byCountry: Slice[];
  byCity: Slice[];
  byDevice: Slice[];
  byOs: Slice[];
  byBrowser: Slice[];
  byLocale: Slice[];
  byReferrer: Slice[];
  byUtm: Slice[];
  blog: BlogStats;
};
type Visit = {
  id: number;
  created_at: string;
  path: string;
  page: string;
  page_type: string;
  title: string | null;
  locale: string | null;
  visitor: string | null;
  session_id: string | null;
  is_entry: boolean;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string;
  os: string | null;
  browser: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

// ---- Konstantalar ---------------------------------------------------------

const RANGES = [
  { key: "today", label: "Bugun" },
  { key: "7d", label: "7 kun" },
  { key: "30d", label: "30 kun" },
  { key: "90d", label: "90 kun" },
  { key: "365d", label: "1 yil" },
  { key: "all", label: "Butun davr" },
];

const TABS = [
  { key: "overview", label: "Umumiy", icon: Layers },
  { key: "pages", label: "Sahifalar", icon: FileText },
  { key: "audience", label: "Auditoriya", icon: Users },
  { key: "sources", label: "Manbalar", icon: ExternalLink },
  { key: "journal", label: "Tashriflar jurnali", icon: ListOrdered },
  { key: "blog", label: "Blog", icon: Eye },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const PAGE_TYPE_LABELS: Record<string, string> = {
  home: "Bosh sahifa",
  blog: "Blog ro'yxati",
  blog_post: "Blog maqolalari",
  services: "Xizmatlar ro'yxati",
  service: "Xizmat sahifalari",
  partners: "Hamkorlar",
  partner: "Hamkor sahifalari",
  contact: "Aloqa",
  about: "Biz haqimizda",
  faq: "Savol-javob",
  testimonials: "Fikrlar",
  other: "Boshqa",
};

const LOCALE_LABELS: Record<string, string> = {
  uz: "🇺🇿 O'zbekcha",
  ru: "🇷🇺 Ruscha",
  en: "🇬🇧 Inglizcha",
};

const DEVICE_META: Record<string, { label: string; icon: typeof Smartphone; color: string; bar: string }> = {
  mobile: { label: "Telefon", icon: Smartphone, color: "text-blue-500", bar: "bg-blue-500" },
  tablet: { label: "Planshet", icon: Tablet, color: "text-violet-500", bar: "bg-violet-500" },
  desktop: { label: "Kompyuter", icon: Monitor, color: "text-emerald-500", bar: "bg-emerald-500" },
};

const WEEKDAYS_SHORT = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];

const REFERRER_NAMES: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)yandex\.|(^|\.)ya\.ru$/, "Yandex"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)t\.me$|telegram\.org$/, "Telegram"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$/, "Facebook"],
  [/(^|\.)linkedin\.com$|lnkd\.in$/, "LinkedIn"],
  [/(^|\.)youtube\.com$/, "YouTube"],
  [/chatgpt\.com$|openai\.com$/, "ChatGPT"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/perplexity\.ai$/, "Perplexity"],
];

// ---- Yordamchi funksiyalar ------------------------------------------------

let regionNames: Intl.DisplayNames | null = null;
try {
  regionNames = new Intl.DisplayNames(["uz", "ru", "en"], { type: "region" });
} catch {
  regionNames = null;
}

function countryName(code: string | null | undefined): string {
  if (!code) return "Noma'lum";
  try {
    return regionNames?.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function flagEmoji(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => base + c.charCodeAt(0) - 65));
}

function referrerLabel(host: string): string {
  if (host === "direct") return "To'g'ridan-to'g'ri";
  for (const [re, name] of REFERRER_NAMES) if (re.test(host)) return `${name} · ${host}`;
  return host;
}

const fmt = (n: number) => n.toLocaleString("ru-RU");

function pct(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

function duration(sec: number): string {
  if (!sec) return "0 s";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  if (m >= 60) return `${Math.floor(m / 60)} soat ${m % 60} daq`;
  return m ? `${m} daq ${s} s` : `${s} s`;
}

function dateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function shortDay(day: string): string {
  const [, m, d] = day.split("-");
  return `${Number(d)}.${Number(m)}`;
}

/** Joriy davrni oldingisi bilan solishtirish (%). */
function delta(now: number, prev: number | null | undefined): number | null {
  if (prev === null || prev === undefined) return null;
  if (prev === 0) return now > 0 ? 100 : 0;
  return Math.round(((now - prev) / prev) * 100);
}

// ---- Kichik UI bloklari ---------------------------------------------------

function Card({
  icon: Icon,
  title,
  right,
  children,
  empty,
  className = "",
}: {
  icon: typeof Eye;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  empty?: boolean;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon size={17} className="text-slate-400" />
          <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
        </div>
        {right}
      </div>
      {empty ? <p className="py-6 text-center text-sm text-slate-400">Ma&apos;lumot yo&apos;q</p> : children}
    </div>
  );
}

function BarList({
  items,
  renderLabel,
  barClass = "bg-primary-500",
  total,
  showVisitors,
  onSelect,
  limit = 10,
}: {
  items: Slice[];
  renderLabel: (item: Slice) => React.ReactNode;
  barClass?: string;
  total?: number;
  showVisitors?: boolean;
  onSelect?: (item: Slice) => void;
  limit?: number;
}) {
  const [all, setAll] = useState(false);
  const max = Math.max(1, ...items.map((i) => i.count));
  const sum = total ?? items.reduce((s, i) => s + i.count, 0);
  const shown = all ? items : items.slice(0, limit);
  return (
    <div>
      <ul className="space-y-3">
        {shown.map((it) => (
          <li key={it.key}>
            <button
              type="button"
              disabled={!onSelect}
              onClick={() => onSelect?.(it)}
              className={`w-full text-left ${onSelect ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2 truncate text-slate-700">{renderLabel(it)}</span>
                <span className="flex shrink-0 items-baseline gap-2">
                  {showVisitors && it.visitors !== undefined && (
                    <span className="text-xs text-slate-400" title="Unikal tashrifchilar">
                      {fmt(it.visitors)} kishi
                    </span>
                  )}
                  <span className="font-semibold text-slate-900">{fmt(it.count)}</span>
                  <span className="w-11 text-right text-xs text-slate-400">{pct(it.count, sum)}%</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${barClass}`} style={{ width: `${(it.count / max) * 100}%` }} />
              </div>
            </button>
          </li>
        ))}
      </ul>
      {items.length > limit && (
        <button
          type="button"
          onClick={() => setAll((v) => !v)}
          className="mt-4 text-[13px] font-medium text-primary-600 hover:text-primary-700"
        >
          {all ? "Kamroq ko'rsatish" : `Hammasini ko'rsatish (${items.length})`}
        </button>
      )}
    </div>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  color,
  change,
  hint,
  invert,
}: {
  label: string;
  value: string;
  icon: typeof Eye;
  color: string;
  change?: number | null;
  hint?: string;
  invert?: boolean;
}) {
  const good = change === null || change === undefined ? null : invert ? change <= 0 : change >= 0;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[26px] font-bold leading-none text-slate-900">{value}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {change !== null && change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ${
              good ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            }`}
          >
            {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
        {hint && <span className="truncate text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}

const SERIES = [
  { key: "views", label: "Ko'rishlar", stroke: "#0d9488", fill: "rgba(13,148,136,0.12)" },
  { key: "visitors", label: "Tashrifchilar", stroke: "#2563eb", fill: "transparent" },
  { key: "sessions", label: "Sessiyalar", stroke: "#a855f7", fill: "transparent" },
  { key: "contacts", label: "Murojaatlar", stroke: "#f59e0b", fill: "transparent" },
] as const;
type SeriesKey = (typeof SERIES)[number]["key"];

function TrendChart({ data }: { data: DayPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [enabled, setEnabled] = useState<Record<SeriesKey, boolean>>({
    views: true,
    visitors: true,
    sessions: false,
    contacts: true,
  });
  const ref = useRef<HTMLDivElement>(null);

  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">Hozircha tashriflar yo&apos;q</p>;
  }

  const W = 1000;
  const H = 220;
  const max = Math.max(
    1,
    ...data.flatMap((d) => SERIES.filter((s) => enabled[s.key]).map((s) => d[s.key])),
  );
  const x = (i: number) => (data.length === 1 ? W / 2 : (i / (data.length - 1)) * W);
  const y = (v: number) => H - (v / max) * (H - 12);

  const line = (k: SeriesKey) => data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d[k]).toFixed(1)}`).join(" ");

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const rel = (e.clientX - rect.left) / rect.width;
    setHover(Math.min(data.length - 1, Math.max(0, Math.round(rel * (data.length - 1)))));
  }

  const h = hover !== null ? data[hover] : null;
  const ticks = [0, Math.floor((data.length - 1) / 2), data.length - 1].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setEnabled((p) => ({ ...p, [s.key]: !p[s.key] }))}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              enabled[s.key] ? "border-slate-300 bg-white text-slate-800" : "border-slate-200 bg-slate-50 text-slate-400"
            }`}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: enabled[s.key] ? s.stroke : "#cbd5e1" }} />
            {s.label}
          </button>
        ))}
      </div>
      <div ref={ref} className="relative" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-56 w-full">
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={0} x2={W} y1={H - f * (H - 12)} y2={H - f * (H - 12)} stroke="#f1f5f9" strokeWidth={1} />
          ))}
          {SERIES.filter((s) => enabled[s.key]).map((s) => (
            <g key={s.key}>
              {s.fill !== "transparent" && (
                <path d={`${line(s.key)} L${x(data.length - 1)},${H} L${x(0)},${H} Z`} fill={s.fill} />
              )}
              <path
                d={line(s.key)}
                fill="none"
                stroke={s.stroke}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
              />
            </g>
          ))}
          {hover !== null && (
            <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="#94a3b8" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          )}
        </svg>
        {h && hover !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(hover / Math.max(1, data.length - 1)) * 100}%`,
              transform: `translateX(${hover > data.length / 2 ? "-105%" : "5%"})`,
            }}
          >
            <p className="mb-1 font-semibold text-slate-900">{h.day.split("-").reverse().join(".")}</p>
            {SERIES.map((s) => (
              <p key={s.key} className="flex items-center justify-between gap-4 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.stroke }} />
                  {s.label}
                </span>
                <span className="font-semibold text-slate-900">{fmt(h[s.key])}</span>
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-400">
        {ticks.map((t) => (
          <span key={t}>{shortDay(data[t].day)}</span>
        ))}
      </div>
    </div>
  );
}

function ColumnChart({ values, labels, color = "bg-primary-500" }: { values: number[]; labels: string[]; color?: string }) {
  const max = Math.max(1, ...values);
  const total = values.reduce((s, v) => s + v, 0);
  return (
    <div>
      <div className="flex h-36 items-end gap-1">
        {values.map((v, i) => (
          <div key={i} className="group relative flex h-full flex-1 flex-col justify-end" title={`${labels[i]}: ${fmt(v)} (${pct(v, total)}%)`}>
            <div
              className={`w-full rounded-t ${color} opacity-80 transition-opacity group-hover:opacity-100`}
              style={{ height: `${Math.max(v ? 3 : 1, (v / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1 text-[10px] text-slate-400">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 text-center">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function DeviceBlock({ items }: { items: Slice[] }) {
  const total = items.reduce((s, d) => s + d.count, 0);
  return (
    <div className="grid grid-cols-3 gap-3">
      {(["mobile", "desktop", "tablet"] as const).map((key) => {
        const meta = DEVICE_META[key];
        const Icon = meta.icon;
        const item = items.find((d) => d.key === key);
        const count = item?.count ?? 0;
        return (
          <div key={key} className="rounded-xl bg-slate-50 p-4 text-center">
            <Icon size={24} className={`mx-auto ${meta.color}`} />
            <p className="mt-2 text-xl font-bold text-slate-900">{pct(count, total)}%</p>
            <p className="text-xs text-slate-500">{meta.label}</p>
            <p className="mt-1 text-[11px] text-slate-400">
              {fmt(count)} ko&apos;rish{item?.visitors !== undefined ? ` · ${fmt(item.visitors)} kishi` : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ---- Tashriflar jurnali ---------------------------------------------------

type JournalFilter = { session?: string; visitor?: string; country?: string; device?: string; page?: string };

const FILTER_LABELS: Record<keyof JournalFilter, string> = {
  session: "Sessiya",
  visitor: "Tashrifchi",
  country: "Davlat",
  device: "Qurilma",
  page: "Sahifa",
};

function Journal({ range, filter, setFilter }: { range: string; filter: JournalFilter; setFilter: (f: JournalFilter) => void }) {
  const [rows, setRows] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(
    async (before?: number) => {
      setLoading(true);
      const qs = new URLSearchParams({ range, limit: "100" });
      if (before) qs.set("before", String(before));
      for (const [k, v] of Object.entries(filter)) if (v) qs.set(k, v);
      try {
        const res = await fetch(`/api/analytics/visits?${qs}`);
        const data = await res.json();
        if (res.ok) {
          setRows((prev) => (before ? [...prev, ...data.rows] : data.rows));
          setHasMore(Boolean(data.hasMore));
        }
      } finally {
        setLoading(false);
      }
    },
    [range, filter],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const activeFilters = Object.entries(filter).filter(([, v]) => v) as [keyof JournalFilter, string][];

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2">
          <ListOrdered size={17} className="text-slate-400" />
          <h2 className="text-[15px] font-bold text-slate-900">Har bir tashrif</h2>
          <span className="text-xs text-slate-400">— eng yangisi yuqorida</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter({ ...filter, [k]: undefined })}
              className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700 hover:bg-primary-100"
            >
              {FILTER_LABELS[k]}: {k === "country" ? countryName(v) : v.length > 14 ? `${v.slice(0, 8)}…` : v}
              <X size={12} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Yangilash
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-slate-500">
            <tr className="text-[11px] uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Vaqt</th>
              <th className="px-4 py-3 font-medium">Sahifa</th>
              <th className="px-4 py-3 font-medium">Joylashuv</th>
              <th className="px-4 py-3 font-medium">Qurilma</th>
              <th className="px-4 py-3 font-medium">Manba</th>
              <th className="px-4 py-3 font-medium">Sessiya</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const dm = DEVICE_META[r.device] ?? DEVICE_META.desktop;
              const DIcon = dm.icon;
              return (
                <tr key={r.id} className={`align-top transition-colors hover:bg-slate-50 ${i % 2 ? "bg-slate-50/40" : ""}`}>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{dateTime(r.created_at)}</td>
                  <td className="max-w-[320px] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setFilter({ ...filter, page: r.page })}
                      className="block max-w-full truncate text-left font-medium text-slate-900 hover:text-primary-700"
                      title={r.title ?? r.page}
                    >
                      {r.title?.split(" | ")[0] || r.page}
                    </button>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      {r.path}
                      {r.is_entry && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1 py-px text-[10px] font-semibold text-emerald-700">
                          <LogIn size={10} /> kirish
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      disabled={!r.country}
                      onClick={() => r.country && setFilter({ ...filter, country: r.country })}
                      className="text-left text-slate-700 hover:text-primary-700"
                    >
                      <span className="mr-1">{flagEmoji(r.country)}</span>
                      {r.city ? `${r.city}, ` : ""}
                      {r.country ? countryName(r.country) : "Noma'lum"}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setFilter({ ...filter, device: r.device })}
                      className="flex items-center gap-1.5 text-slate-700 hover:text-primary-700"
                    >
                      <DIcon size={14} className={dm.color} />
                      {[r.os, r.browser].filter(Boolean).join(" · ") || dm.label}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {r.is_entry ? (
                      <>
                        {referrerLabel(r.referrer ?? "direct")}
                        {r.utm_source && (
                          <span className="block text-xs text-slate-400">
                            utm: {[r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ")}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-slate-300">ichki o&apos;tish</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    {r.session_id && (
                      <button
                        type="button"
                        onClick={() => setFilter({ session: r.session_id! })}
                        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                        title="Shu sessiyadagi barcha sahifalar"
                      >
                        {r.session_id.slice(0, 8)}
                      </button>
                    )}
                    {r.visitor && (
                      <button
                        type="button"
                        onClick={() => setFilter({ visitor: r.visitor! })}
                        className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-500 hover:bg-primary-50 hover:text-primary-700"
                        title="Shu tashrifchining barcha tashriflari"
                      >
                        👤 {r.visitor.slice(0, 6)}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Bu davrda tashriflar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="border-t border-slate-100 p-4 text-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => void load(rows[rows.length - 1]?.id)}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Yuklanmoqda…" : "Yana 100 ta"}
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Asosiy sahifa --------------------------------------------------------

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("30d");
  const [tab, setTab] = useState<TabKey>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [journalFilter, setJournalFilter] = useState<JournalFilter>({});
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      try {
        const res = await fetch(`/api/analytics?range=${range}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setStats(data as Stats);
        setFailed(false);
        setUpdatedAt(new Date());
      } catch {
        setFailed(true);
      } finally {
        setLoading(false);
      }
    },
    [range],
  );

  useEffect(() => {
    void load();
    const t = window.setInterval(() => void load(true), 60_000);
    return () => window.clearInterval(t);
  }, [load]);

  const openJournal = (f: JournalFilter) => {
    setJournalFilter(f);
    setTab("journal");
  };

  const t = stats?.totals;
  const p = stats?.prev;
  const bounceRate = t ? pct(t.bounces, t.sessions) : 0;
  const prevBounce = p ? pct(p.bounces, p.sessions) : null;
  const conversion = t && stats ? pct(stats.contacts.total, t.visitors) : 0;
  const deviceTotal = useMemo(() => (stats ? stats.byDevice.reduce((s, d) => s + d.count, 0) : 0), [stats]);

  return (
    <div className="space-y-6">
      {/* Sarlavha */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-bold text-slate-900">
            Sayt analitikasi
            {stats && !stats.setupNeeded && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Hozir saytda: {stats.online}
              </span>
            )}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Butun sayt: har bir sahifa, tashrifchi, davlat, qurilma va manba
            {updatedAt && (
              <span className="text-slate-400">
                {" "}
                · yangilandi {updatedAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  range === r.key ? "bg-primary-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <a
            href={`/api/analytics/export?range=${range}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
            title="Tanlangan davrdagi barcha tashriflarni Excel (CSV) faylga yuklab olish"
          >
            <Download size={15} /> Excel (CSV)
          </a>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
            title="Yangilash"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Bo'limlar */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          return (
            <button
              key={tb.key}
              type="button"
              onClick={() => setTab(tb.key)}
              className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === tb.key
                  ? "border-primary-600 text-primary-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={15} />
              {tb.label}
            </button>
          );
        })}
      </div>

      {failed && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-rose-500" />
          Ma&apos;lumotni yuklab bo&apos;lmadi. Sahifani yangilang yoki birozdan keyin qayta urinib ko&apos;ring.
        </div>
      )}

      {stats?.setupNeeded && tab !== "blog" && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Butun sayt analitikasi jadvali hali yaratilmagan</p>
            <p className="mt-1 text-amber-700">
              Supabase → SQL Editor&apos;da <code className="rounded bg-amber-100 px-1">supabase/site_analytics.sql</code>{" "}
              faylini bir marta ishga tushiring. Shundan so&apos;ng har bir tashrif avtomatik yozila boshlaydi.
            </p>
          </div>
        </div>
      )}

      {loading && !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : stats && t && !stats.setupNeeded ? (
        <>
          {tab === "overview" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi
                  label="Sahifa ko'rishlar"
                  value={fmt(t.views)}
                  icon={Eye}
                  color="bg-teal-500"
                  change={delta(t.views, p?.views)}
                  hint={`Bugun: ${fmt(stats.today.views)}`}
                />
                <Kpi
                  label="Tashrifchilar (unikal)"
                  value={fmt(t.visitors)}
                  icon={Users}
                  color="bg-blue-500"
                  change={delta(t.visitors, p?.visitors)}
                  hint={`Bugun: ${fmt(stats.today.visitors)}`}
                />
                <Kpi
                  label="Sessiyalar (kirishlar)"
                  value={fmt(t.sessions)}
                  icon={MousePointerClick}
                  color="bg-violet-500"
                  change={delta(t.sessions, p?.sessions)}
                  hint={`${t.avgPages} sahifa / sessiya`}
                />
                <Kpi
                  label="Murojaatlar (forma)"
                  value={fmt(stats.contacts.total)}
                  icon={MessageSquare}
                  color="bg-amber-500"
                  change={delta(stats.contacts.total, stats.contacts.prevTotal)}
                  hint={`Konversiya: ${conversion}%`}
                />
                <Kpi
                  label="Yangi tashrifchilar"
                  value={fmt(stats.newVisitors)}
                  icon={UserPlus}
                  color="bg-emerald-500"
                  hint={`${pct(stats.newVisitors, t.visitors)}% — birinchi marta kelganlar`}
                />
                <Kpi
                  label="O'rtacha sessiya vaqti"
                  value={duration(t.avgDuration)}
                  icon={Timer}
                  color="bg-sky-500"
                  change={delta(t.avgDuration, p?.avgDuration)}
                  hint="Bir nechta sahifa ko'rganlar"
                />
                <Kpi
                  label="Faqat 1 sahifa ko'rib chiqqanlar"
                  value={`${bounceRate}%`}
                  icon={LogIn}
                  color="bg-rose-500"
                  change={prevBounce === null ? null : Math.round(bounceRate - prevBounce)}
                  invert
                  hint="Bounce rate — qancha past bo'lsa yaxshi"
                />
                <Kpi
                  label="Jami ko'rishlar (boshidan)"
                  value={fmt(stats.allTime)}
                  icon={Clock}
                  color="bg-slate-500"
                  hint={
                    stats.firstAt
                      ? `${new Date(stats.firstAt).toLocaleDateString("ru-RU")} dan beri`
                      : "Kuzatuv yangi boshlandi"
                  }
                />
              </div>

              <Card icon={Clock} title="Kunlik dinamika" right={<span className="text-xs text-slate-400">Toshkent vaqti</span>}>
                <TrendChart data={stats.daily} />
              </Card>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card icon={Clock} title="Soatlar bo'yicha (qachon kirishadi)" empty={t.views === 0}>
                  <ColumnChart
                    values={stats.hourly}
                    labels={stats.hourly.map((_, i) => (i % 3 === 0 ? String(i) : ""))}
                    color="bg-teal-500"
                  />
                </Card>
                <Card icon={Clock} title="Hafta kunlari bo'yicha" empty={t.views === 0}>
                  <ColumnChart values={stats.weekday} labels={WEEKDAYS_SHORT} color="bg-blue-500" />
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card icon={Smartphone} title="Qurilmalar" empty={deviceTotal === 0}>
                  <DeviceBlock items={stats.byDevice} />
                </Card>
                <Card icon={Globe2} title="Top davlatlar" empty={stats.byCountry.length === 0}>
                  <BarList
                    items={stats.byCountry}
                    limit={6}
                    barClass="bg-emerald-500"
                    showVisitors
                    onSelect={(it) => openJournal({ country: it.key })}
                    renderLabel={(it) => (
                      <>
                        <span className="text-base leading-none">{flagEmoji(it.key)}</span>
                        <span className="truncate">{countryName(it.key)}</span>
                      </>
                    )}
                  />
                </Card>
                <Card icon={FileText} title="Top sahifalar" empty={stats.topPages.length === 0}>
                  <BarList
                    items={stats.topPages}
                    limit={6}
                    showVisitors
                    onSelect={(it) => openJournal({ page: it.key })}
                    renderLabel={(it) => <span className="truncate">{it.title?.split(" | ")[0] || it.key}</span>}
                  />
                </Card>
                <Card icon={ExternalLink} title="Qayerdan kelishdi" empty={stats.byReferrer.length === 0}>
                  <BarList
                    items={stats.byReferrer}
                    limit={6}
                    barClass="bg-amber-500"
                    renderLabel={(it) => <span className="truncate">{referrerLabel(it.key)}</span>}
                  />
                </Card>
              </div>
            </>
          )}

          {tab === "pages" && (
            <>
              <div className="rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
                  <FileText size={17} className="text-slate-400" />
                  <h2 className="text-[15px] font-bold text-slate-900">Barcha sahifalar</h2>
                  <span className="text-xs text-slate-400">— bosing: shu sahifaga kirganlar jurnali</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="text-slate-500">
                      <tr className="text-[11px] uppercase tracking-wide">
                        <th className="px-6 py-3 font-medium">Sahifa</th>
                        <th className="px-6 py-3 text-right font-medium">Ko&apos;rishlar</th>
                        <th className="px-6 py-3 text-right font-medium">Tashrifchilar</th>
                        <th className="px-6 py-3 text-right font-medium">Ulushi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topPages.map((pg, i) => (
                        <tr
                          key={pg.key}
                          onClick={() => openJournal({ page: pg.key })}
                          className={`cursor-pointer transition-colors hover:bg-slate-50 ${i % 2 ? "bg-slate-50/40" : ""}`}
                        >
                          <td className="max-w-md px-6 py-3">
                            <span className="block truncate font-medium text-slate-900">{pg.title?.split(" | ")[0] || pg.key}</span>
                            <span className="text-xs text-slate-400">{pg.key}</span>
                          </td>
                          <td className="px-6 py-3 text-right font-semibold text-slate-900">{fmt(pg.count)}</td>
                          <td className="px-6 py-3 text-right text-slate-700">{fmt(pg.visitors ?? 0)}</td>
                          <td className="px-6 py-3 text-right text-slate-500">{pct(pg.count, t.views)}%</td>
                        </tr>
                      ))}
                      {stats.topPages.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                            Hozircha ma&apos;lumot yo&apos;q
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card icon={LogIn} title="Kirish sahifalari (saytga birinchi ochilgan)" empty={stats.entryPages.length === 0}>
                  <BarList
                    items={stats.entryPages}
                    barClass="bg-emerald-500"
                    renderLabel={(it) => <span className="truncate">{it.title?.split(" | ")[0] || it.key}</span>}
                  />
                </Card>
                <Card icon={Layers} title="Bo'limlar bo'yicha" empty={stats.pageTypes.length === 0}>
                  <BarList
                    items={stats.pageTypes}
                    barClass="bg-violet-500"
                    renderLabel={(it) => <span className="truncate">{PAGE_TYPE_LABELS[it.key] ?? it.key}</span>}
                  />
                </Card>
              </div>
            </>
          )}

          {tab === "audience" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card icon={Smartphone} title="Qurilmalar" className="lg:col-span-2" empty={deviceTotal === 0}>
                <DeviceBlock items={stats.byDevice} />
              </Card>
              <Card icon={Globe2} title="Davlatlar" empty={stats.byCountry.length === 0}>
                <BarList
                  items={stats.byCountry}
                  barClass="bg-emerald-500"
                  showVisitors
                  limit={15}
                  onSelect={(it) => openJournal({ country: it.key })}
                  renderLabel={(it) => (
                    <>
                      <span className="text-base leading-none">{flagEmoji(it.key)}</span>
                      <span className="truncate">{countryName(it.key)}</span>
                    </>
                  )}
                />
              </Card>
              <Card icon={MapPin} title="Shaharlar" empty={stats.byCity.length === 0}>
                <BarList
                  items={stats.byCity}
                  barClass="bg-teal-500"
                  showVisitors
                  limit={15}
                  renderLabel={(it) => (
                    <>
                      <span className="text-base leading-none">{flagEmoji(it.country)}</span>
                      <span className="truncate">{it.key}</span>
                    </>
                  )}
                />
              </Card>
              <Card icon={Monitor} title="Operatsion tizimlar" empty={stats.byOs.length === 0}>
                <BarList items={stats.byOs} barClass="bg-slate-500" renderLabel={(it) => <span className="truncate">{it.key}</span>} />
              </Card>
              <Card icon={Chrome} title="Brauzerlar" empty={stats.byBrowser.length === 0}>
                <BarList items={stats.byBrowser} barClass="bg-blue-500" renderLabel={(it) => <span className="truncate">{it.key}</span>} />
              </Card>
              <Card icon={Languages} title="Sayt tili" empty={stats.byLocale.length === 0}>
                <BarList
                  items={stats.byLocale}
                  barClass="bg-primary-500"
                  renderLabel={(it) => <span className="truncate">{LOCALE_LABELS[it.key] ?? it.key}</span>}
                />
              </Card>
              <Card icon={UserPlus} title="Yangi va qaytgan tashrifchilar" empty={t.visitors === 0}>
                <BarList
                  items={[
                    { key: "Yangi (birinchi marta)", count: stats.newVisitors },
                    { key: "Qaytib kelganlar", count: Math.max(0, t.visitors - stats.newVisitors) },
                  ]}
                  barClass="bg-emerald-500"
                  renderLabel={(it) => <span>{it.key}</span>}
                />
              </Card>
            </div>
          )}

          {tab === "sources" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card icon={ExternalLink} title="Manbalar (saytga qayerdan kelishdi)" empty={stats.byReferrer.length === 0}>
                <BarList
                  items={stats.byReferrer}
                  barClass="bg-amber-500"
                  limit={20}
                  renderLabel={(it) => <span className="truncate">{referrerLabel(it.key)}</span>}
                />
              </Card>
              <Card icon={MousePointerClick} title="Reklama / UTM kampaniyalar" empty={stats.byUtm.length === 0}>
                <BarList items={stats.byUtm} barClass="bg-rose-500" renderLabel={(it) => <span className="truncate">{it.key}</span>} />
                <p className="mt-4 text-xs text-slate-400">
                  Havolaga <code>?utm_source=instagram&amp;utm_campaign=noyabr</code> qo&apos;shsangiz, shu yerda alohida
                  ko&apos;rinadi.
                </p>
              </Card>
              <Card icon={LogIn} title="Kirish sahifalari" empty={stats.entryPages.length === 0}>
                <BarList
                  items={stats.entryPages}
                  barClass="bg-emerald-500"
                  renderLabel={(it) => <span className="truncate">{it.title?.split(" | ")[0] || it.key}</span>}
                />
              </Card>
              <Card icon={MessageSquare} title="Murojaatlarga aylanish" empty={t.visitors === 0}>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xl font-bold text-slate-900">{fmt(t.visitors)}</p>
                    <p className="text-xs text-slate-500">Tashrifchi</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xl font-bold text-slate-900">{fmt(stats.contacts.total)}</p>
                    <p className="text-xs text-slate-500">Murojaat</p>
                  </div>
                  <div className="rounded-xl bg-amber-50 p-4">
                    <p className="text-xl font-bold text-amber-700">{conversion}%</p>
                    <p className="text-xs text-amber-700">Konversiya</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {tab === "journal" && <Journal range={range} filter={journalFilter} setFilter={setJournalFilter} />}
        </>
      ) : null}

      {tab === "blog" && stats?.blog && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Kpi label="Blog ko'rishlar (boshidan)" value={fmt(stats.blog.historyTotal)} icon={Eye} color="bg-rose-500" />
            <Kpi label="Blog ko'rishlar (tanlangan davr)" value={fmt(stats.blog.total)} icon={FileText} color="bg-blue-500" />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-slate-400" />
                <h2 className="text-[15px] font-bold text-slate-900">Eng ko&apos;p o&apos;qilgan maqolalar</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">Boshidan, umumiy</span>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="text-[11px] uppercase tracking-wide">
                  <th className="px-6 py-3 font-medium">Maqola</th>
                  <th className="px-6 py-3 text-right font-medium">Tanlangan davr</th>
                  <th className="px-6 py-3 text-right font-medium">Boshidan</th>
                </tr>
              </thead>
              <tbody>
                {stats.blog.historyByArticle.map((a, i) => (
                  <tr key={a.key} className={`h-[52px] transition-colors hover:bg-slate-50 ${i % 2 ? "bg-slate-50/50" : ""}`}>
                    <td className="max-w-md truncate px-6 font-medium text-slate-900">{a.title}</td>
                    <td className="px-6 text-right text-slate-600">
                      {fmt(stats.blog.byArticle.find((b) => b.key === a.key)?.count ?? 0)}
                    </td>
                    <td className="px-6 text-right font-semibold text-slate-900">{fmt(a.count)}</td>
                  </tr>
                ))}
                {stats.blog.historyByArticle.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                      Hozircha ko&apos;rishlar yo&apos;q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <p className="text-center text-xs text-slate-400">
        Har bir sahifa ochilishi o&apos;z serverimizda yoziladi (cookie va tashqi xizmatlarsiz). Admin sifatida kirgan
        holda ko&apos;rilgan sahifalar hisobga olinmaydi; IP manzil saqlanmaydi — tashrifchi anonim belgi bilan
        ajratiladi.{" "}
        <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" className="underline">
          IP Geolocation by DB-IP
        </a>
      </p>
    </div>
  );
}
