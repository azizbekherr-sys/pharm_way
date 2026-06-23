"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, FileText, Star, ImageIcon, Eye } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  cover_image: string | null;
  created_at: string;
  views: number | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  registration: "bg-blue-50 text-blue-700",
  import: "bg-violet-50 text-violet-700",
  baa: "bg-cyan-50 text-cyan-700",
  medicalDevices: "bg-amber-50 text-amber-700",
  regulatory: "bg-emerald-50 text-emerald-700",
  news: "bg-rose-50 text-rose-700",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/blog");
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm("Maqolani o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/blog/${id}`, { method: "DELETE" });
    await load();
  }

  async function togglePublished(post: BlogPost) {
    setTogglingId(post.id);
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
    setTogglingId(null);
  }

  async function toggleFeatured(post: BlogPost) {
    setTogglingId(post.id);
    if (!post.featured) await fetch("/api/blog/unfeatured", { method: "POST" });
    await fetch(`/api/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !post.featured }),
    });
    await load();
    setTogglingId(null);
  }

  const published = posts.filter((p) => p.published).length;
  const draft = posts.length - published;
  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Blog maqolalar</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus size={16} />
          Yangi maqola
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatPill label="Jami" value={posts.length} />
        <StatPill label="Nashr etilgan" value={published} color="text-emerald-600" />
        <StatPill label="Qoralama" value={draft} color="text-slate-500" />
        <StatPill label="Jami ko'rishlar" value={totalViews} color="text-rose-600" />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Muqova</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Sarlavha</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Kategoriya</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Asosiy</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Nashr</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Ko&apos;rishlar</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Sana</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="h-[56px] border-t border-slate-100 transition-colors hover:bg-slate-50">
                <td className="px-6">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {p.cover_image ? (
                      <Image src={p.cover_image} alt="" width={40} height={40} className="h-full w-full object-cover" />
                    ) : (
                      <ImageIcon size={16} className="text-slate-400" />
                    )}
                  </div>
                </td>
                <td className="max-w-xs truncate px-6 font-medium text-slate-900">
                  {p.title.length > 50 ? `${p.title.slice(0, 50)}…` : p.title}
                </td>
                <td className="px-6">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[p.category] ?? "bg-slate-100 text-slate-600"}`}>
                    {p.category}
                  </span>
                </td>
                <td className="px-6">
                  <button
                    onClick={() => toggleFeatured(p)}
                    disabled={togglingId === p.id}
                    title={p.featured ? "Asosiy maqola" : "Asosiy qilish"}
                  >
                    <Star size={18} className={p.featured ? "fill-amber-400 text-amber-400" : "text-slate-300 hover:text-slate-400"} />
                  </button>
                </td>
                <td className="px-6">
                  <button
                    onClick={() => togglePublished(p)}
                    disabled={togglingId === p.id}
                    className={`relative h-5 w-9 rounded-full transition-colors duration-150 ${
                      p.published ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
                        p.published ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Eye size={14} className="text-slate-400" />
                    {p.views ?? 0}
                  </span>
                </td>
                <td className="px-6 text-slate-500">{new Date(p.created_at).toLocaleDateString("uz-UZ")}</td>
                <td className="px-6">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/blog/${p.id}/edit`} className="text-slate-400 hover:text-slate-700">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && posts.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <FileText size={24} className="text-slate-400" />
                    </div>
                    <p className="text-slate-400">
                      Hali maqola yo&apos;q.{" "}
                      <Link href="/admin/blog/new" className="font-medium text-primary-600 hover:underline">
                        Birinchi maqolani yozing →
                      </Link>
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color ?? "text-slate-900"}`}>{value}</p>
    </div>
  );
}
