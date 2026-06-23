"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

type Partner = {
  id: string;
  name: string;
  country: string;
  category: string;
  active: boolean;
  order: number;
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/partners");
    const data = await res.json();
    setPartners(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function toggleActive(p: Partner) {
    setPartners((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
    await fetch(`/api/partners/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Hamkorlar</h1>
        <Link
          href="/admin/partners/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus size={16} />
          Yangi hamkor
        </Link>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Nomi</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Davlat</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Kategoriya</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Faol</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Tartib</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="h-[56px] border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-6 font-medium text-slate-900">{p.name}</td>
                <td className="px-6 text-slate-600">{p.country}</td>
                <td className="px-6 text-slate-600">{p.category}</td>
                <td className="px-6">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`relative h-5 w-9 rounded-full transition-colors duration-150 ${
                      p.active ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
                        p.active ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 text-slate-600">{p.order}</td>
                <td className="px-6">
                  <Link href={`/admin/partners/${p.id}/edit`} className="text-slate-400 hover:text-primary-600">
                    <Pencil size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {!loading && partners.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Hozircha hamkorlar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
