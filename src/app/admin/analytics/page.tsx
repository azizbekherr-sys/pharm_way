"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  Globe2,
  Smartphone,
  Tablet,
  Monitor,
  TrendingUp,
  CalendarDays,
  MapPin,
  Chrome,
  Languages,
  ExternalLink,
  FileText,
  AlertTriangle,
} from "lucide-react";

type Slice = { key: string; count: number };
type ArticleSlice = { key: string; title: string; count: number };
type DayPoint = { day: string; count: number };

type Stats = {
  historyTotal: number;
  historyByArticle: ArticleSlice[];
  allTime: number;
  total: number;
  today: number;
  byCountry: Slice[];
  byCity: Slice[];
  byDevice: Slice[];
  byBrowser: Slice[];
  byOs: Slice[];
  byLocale: Slice[];
  byReferrer: Slice[];
  byArticle: ArticleSlice[];
  daily: DayPoint[];
};

const RANGES = [
  { key: "7d", label: "7 kun" },
  { key: "30d", label: "30 kun" },
  { key: "90d", label: "90 kun" },
  { key: "all", label: "Butun davr" },
];

// ---- Yordamchi funksiyalar ------------------------------------------------

let regionNames: Intl.DisplayNames | null = null;
try {
  regionNames = new Intl.DisplayNames(["uz", "ru", "en"], { type: "region" });
} catch {
  regionNames = null;
}

function countryName(code: string): string {
  try {
    return regionNames?.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  const chars = [...code.toUpperCase()].map((c) => base + c.charCodeAt(0) - 65);
  return String.fromCodePoint(...chars);
}

const LOCALE_LABELS: Record<string, string> = {
  uz: "🇺🇿 O'zbekcha",
  ru: "🇷🇺 Ruscha",
  en: "🇬🇧 Inglizcha",
};

const DEVICE_META: Record<string, { label: string; icon: typeof Smartphone; color: string }> = {
  mobile: { label: "Telefon", icon: Smartphone, color: "text-blue-500" },
  tablet: { label: "Planshet", icon: Tablet, color: "text-violet-500" },
  desktop: { label: "Kompyuter", icon: Monitor, color: "text-emerald-500" },
};

function pct(part: number, whole: number): number {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}

// ---- Kichik UI bloklari ---------------------------------------------------

function Card({
  icon: Icon,
  title,
  children,
  empty,
}: {
  icon: typeof Eye;
  title: string;
  children: React.ReactNode;
  empty?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={17} className="text-slate-400" />
        <h2 className="text-[15px] font-bold text-slate-900">{title}</h2>
      </div>
      {empty ? <p className="py-6 text-center text-sm text-slate-400">Ma&apos;lumot yo&apos;q</p> : children}
    </div>
  );
}

function BarList({
  items,
  renderLabel,
  barClass = "bg-primary-500",
}: {
  items: Slice[];
  renderLabel: (item: Slice) => React.ReactNode;
  barClass?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.key}>
          <div className="mb-1 flex items-center justify-between gap-2 text-sm">
            <span className="flex min-w-0 items-center gap-2 truncate text-slate-700">{renderLabel(it)}</span>
            <span className="shrink-0 font-semibold text-slate-900">{it.count}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${barClass}`} style={{ width: `${(it.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyChart({ data }: { data: DayPoint[] }) {
  if (data.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">Hozircha tashriflar yo&apos;q</p>;
  }
  const max = Math.max(1, ...data.map((d) => d.count));
  const fmt = (day: string) => {
    const d = new Date(day);
    return `${d.getDate()}.${d.getMonth() + 1}`;
  };
  return (
    <div>
      <div className="flex h-44 items-end gap-[3px] overflow-x-auto pb-1">
        {data.map((d) => (
          <div
            key={d.day}
            className="group relative flex h-full min-w-[6px] flex-1 flex-col justify-end"
            title={`${d.day}: ${d.count} ko'rish`}
          >
            <div
              className="w-full rounded-t bg-primary-500 transition-colors group-hover:bg-primary-600"
              style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-400">
        <span>{fmt(data[0].day)}</span>
        <span>{fmt(data[data.length - 1].day)}</span>
      </div>
    </div>
  );
}

// ---- Asosiy sahifa --------------------------------------------------------

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("30d");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/analytics?range=${range}`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setSetupNeeded(true);
          setStats(null);
        } else {
          setSetupNeeded(false);
          setStats(data as Stats);
        }
      })
      .catch(() => {
        if (!cancelled) setSetupNeeded(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const deviceTotal = stats ? stats.byDevice.reduce((s, d) => s + d.count, 0) : 0;

  const SUMMARY = stats
    ? [
        { label: "Jami ko'rishlar (boshidan)", value: stats.historyTotal.toLocaleString("uz-UZ"), icon: Eye, color: "bg-rose-500" },
        { label: "Kuzatilgan (tanlangan davr)", value: stats.total, icon: TrendingUp, color: "bg-blue-500" },
        { label: "Bugun", value: stats.today, icon: CalendarDays, color: "bg-amber-500" },
        { label: "Davlatlar", value: stats.byCountry.length, icon: Globe2, color: "bg-emerald-500" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Sarlavha + davr tanlash */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tashriflar analitikasi</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Maqolalaringizni qaysi davlatlardan, qanday qurilmalarda o&apos;qishmoqda
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                range === r.key ? "bg-primary-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {setupNeeded && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Analitika jadvali hali sozlanmagan</p>
            <p className="mt-1 text-amber-700">
              Supabase Dashboard → SQL Editor&apos;da <code className="rounded bg-amber-100 px-1">supabase/blog_analytics.sql</code>{" "}
              faylini bir marta ishga tushiring. Shundan so&apos;ng tashriflar avtomatik yig&apos;ila boshlaydi.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Umumiy ko'rsatkichlar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUMMARY.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div>
                    <p className="text-[13px] font-medium text-slate-500">{c.label}</p>
                    <p className="mt-2 text-[28px] font-bold leading-none text-slate-900">{c.value}</p>
                  </div>
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${c.color}`}>
                    <Icon size={22} className="text-white" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Kunlik grafik */}
          <Card icon={CalendarDays} title="Kunlik tashriflar">
            <DailyChart data={stats.daily} />
          </Card>

          {/* Qurilmalar (ajratilgan blok) */}
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
              <Smartphone size={17} className="text-slate-400" />
              <h2 className="text-[15px] font-bold text-slate-900">Qurilmalar</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {(["mobile", "tablet", "desktop"] as const).map((key) => {
                const meta = DEVICE_META[key];
                const Icon = meta.icon;
                const count = stats.byDevice.find((d) => d.key === key)?.count ?? 0;
                return (
                  <div key={key} className="rounded-xl bg-slate-50 p-5 text-center">
                    <Icon size={26} className={`mx-auto ${meta.color}`} />
                    <p className="mt-3 text-2xl font-bold text-slate-900">{count}</p>
                    <p className="text-sm text-slate-500">{meta.label}</p>
                    <p className="mt-1 text-xs font-medium text-slate-400">{pct(count, deviceTotal)}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ikki ustunli kesimlar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card icon={Globe2} title="Davlatlar bo'yicha" empty={stats.byCountry.length === 0}>
              <BarList
                items={stats.byCountry}
                barClass="bg-emerald-500"
                renderLabel={(it) => (
                  <>
                    <span className="text-base leading-none">{flagEmoji(it.key)}</span>
                    <span className="truncate">{countryName(it.key)}</span>
                  </>
                )}
              />
            </Card>

            <Card icon={MapPin} title="Shaharlar bo'yicha" empty={stats.byCity.length === 0}>
              <BarList items={stats.byCity} barClass="bg-teal-500" renderLabel={(it) => <span className="truncate">{it.key}</span>} />
            </Card>

            <Card icon={Chrome} title="Brauzerlar" empty={stats.byBrowser.length === 0}>
              <BarList items={stats.byBrowser} barClass="bg-blue-500" renderLabel={(it) => <span className="truncate">{it.key}</span>} />
            </Card>

            <Card icon={Monitor} title="Operatsion tizim" empty={stats.byOs.length === 0}>
              <BarList items={stats.byOs} barClass="bg-slate-500" renderLabel={(it) => <span className="truncate">{it.key}</span>} />
            </Card>

            <Card icon={Languages} title="O'qish tili" empty={stats.byLocale.length === 0}>
              <BarList
                items={stats.byLocale}
                barClass="bg-primary-500"
                renderLabel={(it) => <span className="truncate">{LOCALE_LABELS[it.key] ?? it.key}</span>}
              />
            </Card>

            <Card icon={ExternalLink} title="Tashrif manbalari" empty={stats.byReferrer.length === 0}>
              <BarList
                items={stats.byReferrer}
                barClass="bg-amber-500"
                renderLabel={(it) => (
                  <span className="truncate">{it.key === "direct" ? "To'g'ridan-to'g'ri" : it.key}</span>
                )}
              />
            </Card>
          </div>

          {/* Eng ko'p o'qilgan maqolalar (boshidan, umumiy hisoblagich) */}
          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-slate-400" />
                <h2 className="text-[15px] font-bold text-slate-900">Eng ko&apos;p o&apos;qilgan maqolalar</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                Boshidan, umumiy
              </span>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Maqola</th>
                  <th className="px-6 py-3 text-right text-[12px] font-medium uppercase tracking-wide">Ko&apos;rishlar</th>
                </tr>
              </thead>
              <tbody>
                {stats.historyByArticle.map((a, i) => (
                  <tr key={a.key} className={`h-[52px] transition-colors hover:bg-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}>
                    <td className="max-w-md truncate px-6 font-medium text-slate-900">{a.title}</td>
                    <td className="px-6 text-right">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-slate-900">
                        <Eye size={14} className="text-slate-400" />
                        {a.count.toLocaleString("uz-UZ")}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.historyByArticle.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-slate-400">
                      Hozircha ko&apos;rishlar yo&apos;q
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-slate-400">
            &laquo;Boshidan&raquo; ko&apos;rsatkichlar barcha ko&apos;rishlarni o&apos;z ichiga oladi. Davlat, shahar va
            qurilma ma&apos;lumoti faqat yangi kuzatuvdan (production, pharmway.uz) yig&apos;iladi — eski ko&apos;rishlar
            uchun bu ma&apos;lumot mavjud emas.
          </p>
        </>
      ) : null}
    </div>
  );
}
