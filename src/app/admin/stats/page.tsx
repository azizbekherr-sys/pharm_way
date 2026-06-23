"use client";

import { useEffect, useState } from "react";
import { Package, Handshake, Globe, TrendingUp, BarChart3 } from "lucide-react";

type Stat = {
  id: string;
  key: string;
  value: string;
  label: string;
  label_ru: string | null;
  label_en: string | null;
  icon: string | null;
  updated_at: string;
};

const ICONS: Record<string, typeof Package> = {
  package: Package,
  handshake: Handshake,
  globe: Globe,
  "trending-up": TrendingUp,
};

const ICON_COLORS = ["text-blue-500", "text-emerald-500", "text-amber-500", "text-violet-500"];

export default function AdminStatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/stats");
    const data = await res.json();
    setStats(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function update(key: string, field: keyof Stat, value: string) {
    setStats((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)));
  }

  async function save(stat: Stat) {
    setSavingKey(stat.key);
    await fetch("/api/stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stat),
    });
    await load();
    setSavingKey(null);
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Sayt statistikasi</h1>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((s, i) => {
          const Icon = (s.icon && ICONS[s.icon]) || BarChart3;
          return (
            <div key={s.key} className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
              <Icon size={32} className={ICON_COLORS[i % ICON_COLORS.length]} />

              <input
                className="mt-4 w-full border-0 bg-transparent text-center text-[32px] font-bold text-slate-900 outline-none"
                value={s.value}
                onChange={(e) => update(s.key, "value", e.target.value)}
              />
              <input
                className="mt-1 w-full border-0 bg-transparent text-center text-sm text-slate-500 outline-none"
                value={s.label}
                onChange={(e) => update(s.key, "label", e.target.value)}
              />

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Yangilandi: {new Date(s.updated_at).toLocaleDateString("uz-UZ")}
                </span>
                <button
                  onClick={() => save(s)}
                  disabled={savingKey === s.key}
                  className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  {savingKey === s.key ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-[15px] font-bold text-slate-900">Saytda qanday ko&apos;rinadi</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.key} className="text-center">
              <p className="text-2xl font-bold text-primary-600">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
