"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Phone, Send } from "lucide-react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  service_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

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

const TABS = [
  { key: "all", label: "Barchasi" },
  { key: "new", label: "Yangi" },
  { key: "read", label: "Ko'rildi" },
  { key: "replied", label: "Javob berildi" },
] as const;

const AVATAR_COLORS = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];

function avatarColor(name: string) {
  const idx = name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyun", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"];
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [tab, setTab] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/contact");
    const data = await res.json();
    setContacts(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function updateStatus(contact: Contact, status: string) {
    await fetch(`/api/contact/${contact.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
    setSelected((prev) => (prev && prev.id === contact.id ? { ...prev, status } : prev));
  }

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (tab !== "all" && c.status !== tab) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.phone.includes(q)) return false;
      }
      return true;
    });
  }, [contacts, tab, search]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-900">Murojaatlar</h1>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {contacts.length}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          className="form-input max-w-xs"
          placeholder="Ism yoki telefon qidiring..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
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
            {filtered.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelected(c)}
                className="h-[60px] cursor-pointer border-t border-slate-100 transition-colors hover:bg-slate-50"
              >
                <td className="px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${avatarColor(c.name)}`}
                    >
                      {initials(c.name)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{c.name}</p>
                      {c.company && <p className="text-xs text-slate-400">{c.company}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6">
                  <a
                    href={`tel:${c.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-600 hover:text-blue-600"
                  >
                    {c.phone}
                  </a>
                </td>
                <td className="px-6">
                  {c.service_type ? (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {c.service_type}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-6 text-slate-500">{formatDate(c.created_at)}</td>
                <td className="px-6">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[c.status] ?? STATUS_STYLES.new}`}>
                    {STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                  Hozircha murojaatlar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30" onClick={() => setSelected(null)}>
          <div
            className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <h2 className="text-[16px] font-bold text-slate-900">Murojaat tafsilotlari</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 px-6 py-6">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColor(selected.name)}`}
                >
                  {initials(selected.name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selected.name}</p>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[selected.status] ?? STATUS_STYLES.new}`}>
                    {STATUS_LABELS[selected.status] ?? selected.status}
                  </span>
                </div>
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <Detail label="Telefon" value={selected.phone} />
                <Detail label="Email" value={selected.email ?? "—"} />
                <Detail label="Kompaniya" value={selected.company ?? "—"} />
                <Detail label="Xizmat turi" value={selected.service_type ?? "—"} />
                <Detail label="Xabar" value={selected.message ?? "—"} />
                <Detail label="Sana" value={new Date(selected.created_at).toLocaleString("uz-UZ")} />
              </dl>
            </div>

            <div className="space-y-2 border-t border-slate-100 p-6">
              {selected.status !== "read" && selected.status !== "replied" && (
                <button
                  onClick={() => updateStatus(selected, "read")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
                >
                  Ko&apos;rildi deb belgilash
                </button>
              )}
              <a
                href={`https://t.me/share/url?url=&text=${encodeURIComponent(`Salom ${selected.name}, Pharm Way Group dan murojaatingiz bo'yicha javob:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => updateStatus(selected, "replied")}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-transform duration-150 hover:scale-[1.01] hover:bg-slate-50 active:scale-[0.99]"
              >
                <Send size={15} />
                Telegram orqali javob
              </a>
              <a
                href={`tel:${selected.phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-transform duration-150 hover:scale-[1.01] hover:bg-slate-50 active:scale-[0.99]"
              >
                <Phone size={15} />
                Qo&apos;ng&apos;iroq qilish
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-900">{value}</dd>
    </div>
  );
}
