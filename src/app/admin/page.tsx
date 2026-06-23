import Link from "next/link";
import { MessageSquare, FileText, Handshake, Bell, Plus, ArrowRight, Eye } from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";

const STAT_CARDS = [
  { key: "contacts", label: "Jami murojaatlar", href: "/admin/contacts", icon: MessageSquare, color: "bg-blue-500" },
  { key: "blog_posts", label: "Blog maqolalar", href: "/admin/blog", icon: FileText, color: "bg-violet-500" },
  { key: "partners", label: "Hamkorlar", href: "/admin/partners", icon: Handshake, color: "bg-emerald-500" },
] as const;

const QUICK_ACTIONS = [
  { label: "Yangi blog maqola", href: "/admin/blog/new", icon: FileText },
  { label: "Hamkor qo'shish", href: "/admin/partners", icon: Handshake },
  { label: "FAQ qo'shish", href: "/admin/faq", icon: Plus },
];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  read: "bg-slate-100 text-slate-600",
  replied: "bg-emerald-50 text-emerald-700",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Yangi",
  read: "Ko'rildi",
  replied: "Javob berildi",
};

export default async function AdminDashboard() {
  const counts = await Promise.all(
    STAT_CARDS.map((c) => supabaseAdmin.from(c.key).select("*", { count: "exact", head: true }))
  );

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const { count: newToday } = await supabaseAdmin
    .from("contacts")
    .select("*", { count: "exact", head: true })
    .gte("created_at", todayStart.toISOString());

  const { data: recentContacts } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: blogViewsRows } = await supabaseAdmin.from("blog_posts").select("views");
  const totalViews = (blogViewsRows ?? []).reduce((sum, r) => sum + (r.views ?? 0), 0);

  const { data: topPosts } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, category, views, published")
    .order("views", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div>
                <p className="text-[13px] font-medium text-slate-500">{c.label}</p>
                <p className="mt-2 text-[28px] font-bold leading-none text-slate-900">{counts[i].count ?? 0}</p>
              </div>
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${c.color}`}>
                <Icon size={22} className="text-white" />
              </div>
            </Link>
          );
        })}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md">
          <div>
            <p className="text-[13px] font-medium text-slate-500">Yangi bugun</p>
            <p className="mt-2 text-[28px] font-bold leading-none text-slate-900">{newToday ?? 0}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-amber-500">
            <Bell size={22} className="text-white" />
          </div>
        </div>
        <Link
          href="/admin/blog"
          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
        >
          <div>
            <p className="text-[13px] font-medium text-slate-500">Blog ko&apos;rishlari</p>
            <p className="mt-2 text-[28px] font-bold leading-none text-slate-900">{totalViews}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-rose-500">
            <Eye size={22} className="text-white" />
          </div>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-slate-900">So&apos;nggi murojaatlar</h2>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-700"
          >
            Barchasini ko&apos;rish
            <ArrowRight size={14} />
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Ism</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Telefon</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Xizmat</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Sana</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {(recentContacts ?? []).map((c, i) => (
              <tr
                key={c.id}
                className={`h-[52px] transition-colors hover:bg-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
              >
                <td className="px-6 font-medium text-slate-900">{c.name}</td>
                <td className="px-6 text-slate-600">{c.phone}</td>
                <td className="px-6 text-slate-600">{c.service_type ?? "—"}</td>
                <td className="px-6 text-slate-500">{new Date(c.created_at).toLocaleDateString("uz-UZ")}</td>
                <td className="px-6">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[c.status] ?? STATUS_STYLES.new}`}>
                    {STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </td>
              </tr>
            ))}
            {(recentContacts ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  Hozircha murojaatlar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-[16px] font-bold text-slate-900">Eng ko&apos;p o&apos;qilgan maqolalar</h2>
          <Link
            href="/admin/blog"
            className="flex items-center gap-1 text-[13px] font-medium text-blue-600 hover:text-blue-700"
          >
            Barchasini ko&apos;rish
            <ArrowRight size={14} />
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Sarlavha</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Kategoriya</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Holat</th>
              <th className="px-6 py-3 text-[12px] font-medium uppercase tracking-wide">Ko&apos;rishlar</th>
            </tr>
          </thead>
          <tbody>
            {(topPosts ?? []).map((p, i) => (
              <tr
                key={p.id}
                className={`h-[52px] transition-colors hover:bg-slate-50 ${i % 2 === 1 ? "bg-slate-50/50" : ""}`}
              >
                <td className="max-w-xs truncate px-6 font-medium text-slate-900">{p.title}</td>
                <td className="px-6 text-slate-600">{p.category}</td>
                <td className="px-6">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      p.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.published ? "Nashr etilgan" : "Qoralama"}
                  </span>
                </td>
                <td className="px-6">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <Eye size={14} className="text-slate-400" />
                    {p.views ?? 0}
                  </span>
                </td>
              </tr>
            ))}
            {(topPosts ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                  Hozircha maqolalar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Icon size={18} />
                </div>
                <span className="text-[14px] font-semibold text-slate-900">{a.label}</span>
              </div>
              <ArrowRight size={16} className="text-slate-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
