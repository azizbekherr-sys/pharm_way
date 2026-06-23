"use client";

import { useEffect, useState } from "react";

type Service = {
  id: string;
  slug: string;
  title: string;
  active: boolean;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900">Xizmatlar</h1>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Sarlavha</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Slug</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Holat</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="h-[56px] border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-6 font-medium text-slate-900">{s.title}</td>
                <td className="px-6 font-mono text-[13px] text-slate-600">{s.slug}</td>
                <td className="px-6">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      s.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {s.active ? "Faol" : "Nofaol"}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && services.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-slate-400">
                  Hozircha xizmatlar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
