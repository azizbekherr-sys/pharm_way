"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileWarning,
  Forward,
  Image as ImageIcon,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  Paperclip,
  PenSquare,
  RefreshCw,
  Reply,
  ReplyAll,
  Search,
  Send,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";

// ---- Turlar ---------------------------------------------------------------

type Address = { name: string; address: string };
type Folder = { path: string; name: string; special: string | null; unseen: number; total: number };
type Summary = {
  uid: number;
  subject: string;
  from: Address[];
  to: Address[];
  date: string | null;
  seen: boolean;
  flagged: boolean;
  answered: boolean;
  hasAttachments: boolean;
  size: number;
};
type Attachment = { index: number; filename: string; contentType: string; size: number };
type FullMessage = {
  uid: number;
  folder: string;
  subject: string;
  from: Address[];
  to: Address[];
  cc: Address[];
  replyTo: Address[];
  date: string | null;
  messageId: string | null;
  references: string[];
  html: string | null;
  text: string;
  attachments: Attachment[];
};
type ListResponse = {
  configured: boolean;
  mailbox: string;
  folder?: string;
  page?: number;
  pageSize?: number;
  total?: number;
  folders?: Folder[];
  messages?: Summary[];
  error?: string;
};
type Draft = {
  to: string;
  cc: string;
  subject: string;
  text: string;
  inReplyTo?: string | null;
  references?: string[];
  replyToUid?: number | null;
  replyFolder?: string | null;
  title: string;
};

// ---- Yordamchilar ---------------------------------------------------------

const FOLDER_LABELS: Record<string, { label: string; icon: typeof Inbox }> = {
  "\\Inbox": { label: "Kiruvchi", icon: Inbox },
  "\\Sent": { label: "Yuborilgan", icon: Send },
  "\\Drafts": { label: "Qoralamalar", icon: PenSquare },
  "\\Junk": { label: "Spam", icon: ShieldAlert },
  "\\Trash": { label: "Savat", icon: Trash2 },
  "\\Archive": { label: "Arxiv", icon: Archive },
};

function folderMeta(f: Folder) {
  return (f.special && FOLDER_LABELS[f.special]) || { label: f.name, icon: Mail };
}

function who(a: Address[] | undefined): string {
  if (!a?.length) return "—";
  return a.map((x) => x.name || x.address).join(", ");
}

function fullAddr(a: Address): string {
  return a.name ? `${a.name} <${a.address}>` : a.address;
}

function listDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

function longDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fileSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

const SIGNATURE = `\n\n--\nHurmat bilan,\nPharm Way Group\n${siteConfig.phone}\n${siteConfig.email} · www.pharmway.uz`;

function quote(msg: FullMessage): string {
  const header = `${longDate(msg.date)}, ${msg.from.map(fullAddr).join(", ")} yozdi:`;
  const body = (msg.text || "").trim().split("\n").map((l) => `> ${l}`).join("\n");
  return `\n\n${header}\n${body}`;
}

function prefixed(prefix: string, subject: string): string {
  const re = new RegExp(`^${prefix}:`, "i");
  return re.test(subject.trim()) ? subject : `${prefix}: ${subject}`;
}

/** Xat HTML'ini xavfsiz ko'rsatish: skriptlar o'chirilgan, tashqi rasmlar so'ralgandagina yuklanadi. */
function emailDocument(html: string, allowRemote: boolean): string {
  const remote = allowRemote ? " https: http:" : "";
  return `<!doctype html><html><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: cid:${remote}; style-src 'unsafe-inline'${remote}; font-src data:${remote}; media-src data:${remote}">
<base target="_blank">
<style>html,body{margin:0;padding:0}body{padding:4px 2px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:14px;line-height:1.55;color:#0f172a;word-wrap:break-word;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{max-width:100%}pre{white-space:pre-wrap}a{color:#2563eb}</style>
</head><body>${html}</body></html>`;
}

// ---- Xat matni (iframe) ---------------------------------------------------

function HtmlBody({ html, allowRemote }: { html: string; allowRemote: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(400);
  const doc = useMemo(() => emailDocument(html, allowRemote), [html, allowRemote]);

  const resize = useCallback(() => {
    const d = ref.current?.contentDocument;
    if (d?.body) setHeight(Math.max(200, d.documentElement.scrollHeight + 8));
  }, []);

  return (
    <iframe
      ref={ref}
      title="Xat matni"
      srcDoc={doc}
      // Skriptlar ishga tushmaydi; same-origin faqat balandlikni o'lchash uchun.
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      onLoad={() => {
        resize();
        window.setTimeout(resize, 600);
      }}
      className="w-full border-0"
      style={{ height }}
    />
  );
}

// ---- Yozish oynasi --------------------------------------------------------

function Composer({
  draft,
  onClose,
  onSent,
}: {
  draft: Draft;
  onClose: () => void;
  onSent: (draft: Draft) => void;
}) {
  const [d, setD] = useState<Draft>(draft);
  const [showCc, setShowCc] = useState(Boolean(draft.cc));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Javobda kursor iqtibos ustida, eng boshida tursin.
    const el = textRef.current;
    if (el) {
      el.focus();
      el.setSelectionRange(0, 0);
      el.scrollTop = 0;
    }
  }, []);

  async function send() {
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/mail/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(d),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Xatni yuborib bo'lmadi");
      onSent(d);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSending(false);
    }
  }

  const field = "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6">
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h3 className="font-semibold text-slate-900">{d.title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-16 shrink-0">Kimdan</span>
            <span className="font-medium text-slate-800">Pharm Way Group &lt;{siteConfig.email}&gt;</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="w-16 shrink-0 text-sm text-slate-500" htmlFor="m-to">
              Kimga
            </label>
            <input id="m-to" className={field} value={d.to} onChange={(e) => setD({ ...d, to: e.target.value })} placeholder="email@kompaniya.uz" />
            {!showCc && (
              <button type="button" onClick={() => setShowCc(true)} className="shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700">
                + Nusxa
              </button>
            )}
          </div>
          {showCc && (
            <div className="flex items-center gap-2">
              <label className="w-16 shrink-0 text-sm text-slate-500" htmlFor="m-cc">
                Nusxa
              </label>
              <input id="m-cc" className={field} value={d.cc} onChange={(e) => setD({ ...d, cc: e.target.value })} placeholder="ixtiyoriy" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <label className="w-16 shrink-0 text-sm text-slate-500" htmlFor="m-subj">
              Mavzu
            </label>
            <input id="m-subj" className={field} value={d.subject} onChange={(e) => setD({ ...d, subject: e.target.value })} />
          </div>
          <textarea
            ref={textRef}
            className={`${field} min-h-[300px] font-[inherit] leading-relaxed`}
            value={d.text}
            onChange={(e) => setD({ ...d, text: e.target.value })}
            placeholder="Xat matni…"
          />
          {error && (
            <p className="flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <AlertTriangle size={16} /> {error}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-400">Ilova biriktirish hozircha pochta dasturi orqali.</p>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Bekor qilish
            </button>
            <button
              type="button"
              disabled={sending}
              onClick={() => void send()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Yuborish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Asosiy sahifa --------------------------------------------------------

export default function AdminMailPage() {
  const [folder, setFolder] = useState("INBOX");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [list, setList] = useState<ListResponse | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState<FullMessage | null>(null);
  const [msgLoading, setMsgLoading] = useState(false);
  const [msgError, setMsgError] = useState("");
  const [allowRemote, setAllowRemote] = useState(false);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [toast, setToast] = useState("");

  const notifyShell = () => window.dispatchEvent(new Event("pw-mail-changed"));

  const loadList = useCallback(async () => {
    setListLoading(true);
    setListError("");
    try {
      const qs = new URLSearchParams({ folder, page: String(page) });
      if (search) qs.set("q", search);
      const res = await fetch(`/api/mail?${qs}`);
      const data = (await res.json()) as ListResponse;
      if (!res.ok) throw new Error(data.error || "Pochtani yuklab bo'lmadi");
      setList(data);
    } catch (e) {
      setListError(e instanceof Error ? e.message : String(e));
    } finally {
      setListLoading(false);
    }
  }, [folder, page, search]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  // Telegram'dagi "Admin panelda ochish" havolasi: /admin/mail?uid=123
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const uid = Number(sp.get("uid"));
    const f = sp.get("folder");
    if (f) setFolder(f);
    if (uid > 0) setSelected(uid);
  }, []);

  useEffect(() => {
    if (!selected) {
      setMessage(null);
      return;
    }
    let cancelled = false;
    setMsgLoading(true);
    setMsgError("");
    setAllowRemote(false);
    fetch(`/api/mail/${selected}?folder=${encodeURIComponent(folder)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Xatni ochib bo'lmadi");
        if (cancelled) return;
        setMessage(data as FullMessage);
        // ro'yxatda o'qilgan deb belgilaymiz
        setList((l) =>
          l?.messages ? { ...l, messages: l.messages.map((m) => (m.uid === selected ? { ...m, seen: true } : m)) } : l,
        );
        notifyShell();
      })
      .catch((e) => !cancelled && setMsgError(e instanceof Error ? e.message : String(e)))
      .finally(() => !cancelled && setMsgLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selected, folder]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const folders = list?.folders ?? [];
  const currentFolder = folders.find((f) => f.path === folder);
  const isSentFolder = currentFolder?.special === "\\Sent";
  const total = list?.total ?? 0;
  const pageSize = list?.pageSize ?? 40;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const own = siteConfig.email.toLowerCase();

  function openCompose(kind: "new" | "reply" | "replyAll" | "forward") {
    if (kind === "new" || !message) {
      setDraft({ to: "", cc: "", subject: "", text: SIGNATURE, title: "Yangi xat" });
      return;
    }
    const replyTarget = message.replyTo.length ? message.replyTo : message.from;
    if (kind === "forward") {
      const header = [
        "---------- Yo'naltirilgan xat ----------",
        `Kimdan: ${message.from.map(fullAddr).join(", ")}`,
        `Sana: ${longDate(message.date)}`,
        `Mavzu: ${message.subject}`,
        `Kimga: ${message.to.map(fullAddr).join(", ")}`,
      ].join("\n");
      setDraft({
        to: "",
        cc: "",
        subject: prefixed("Fwd", message.subject),
        text: `${SIGNATURE}\n\n${header}\n\n${message.text}`,
        title: "Yo'naltirish",
      });
      return;
    }
    const cc =
      kind === "replyAll"
        ? [...message.to, ...message.cc]
            .filter((a) => a.address && a.address.toLowerCase() !== own)
            .filter((a) => !replyTarget.some((r) => r.address.toLowerCase() === a.address.toLowerCase()))
            .map(fullAddr)
            .join(", ")
        : "";
    setDraft({
      to: replyTarget.map(fullAddr).join(", "),
      cc,
      subject: prefixed("Re", message.subject),
      text: `${SIGNATURE}${quote(message)}`,
      inReplyTo: message.messageId,
      references: [...message.references, ...(message.messageId ? [message.messageId] : [])],
      replyToUid: message.uid,
      replyFolder: message.folder,
      title: kind === "replyAll" ? "Hammaga javob" : "Javob yozish",
    });
  }

  async function markUnread() {
    if (!message) return;
    await fetch(`/api/mail/${message.uid}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ folder, seen: false }),
    });
    setList((l) =>
      l?.messages ? { ...l, messages: l.messages.map((m) => (m.uid === message.uid ? { ...m, seen: false } : m)) } : l,
    );
    setSelected(null);
    notifyShell();
  }

  async function remove() {
    if (!message) return;
    const inTrash = currentFolder?.special === "\\Trash";
    if (!window.confirm(inTrash ? "Xat butunlay o'chiriladi. Davom etasizmi?" : "Xat Savatga ko'chirilsinmi?")) return;
    const res = await fetch(`/api/mail/${message.uid}?folder=${encodeURIComponent(folder)}`, { method: "DELETE" });
    if (res.ok) {
      setList((l) => (l?.messages ? { ...l, messages: l.messages.filter((m) => m.uid !== message.uid), total: (l.total ?? 1) - 1 } : l));
      setSelected(null);
      setToast(inTrash ? "Xat o'chirildi" : "Xat Savatga ko'chirildi");
      notifyShell();
    } else {
      const data = await res.json().catch(() => ({}));
      setToast(data.error || "O'chirib bo'lmadi");
    }
  }

  // ---- Sozlanmagan holat ----
  if (list && !list.configured) {
    return (
      <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="text-sm text-amber-900">
            <p className="text-base font-semibold">Pochta hali ulanmagan</p>
            <p className="mt-2">
              <b>{list.mailbox}</b> qutisini ulash uchun cPanel → <b>Setup Node.js App</b> → <b>pharmway</b> →{" "}
              <b>Environment variables</b> bo&apos;limiga quyidagini qo&apos;shing va <b>Restart</b> bosing:
            </p>
            <pre className="mt-3 rounded-lg bg-white/70 p-3 text-xs text-slate-800">
              MAIL_USER = {list.mailbox}
              {"\n"}MAIL_PASSWORD = (pochta qutisi paroli)
            </pre>
            <p className="mt-3 text-amber-800">
              Shundan so&apos;ng xatlar shu yerda ko&apos;rinadi va har bir yangi xat Telegram guruhiga yuboriladi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sarlavha */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pochta</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {list?.mailbox ?? siteConfig.email} · yangi xatlar Telegram guruhiga ham yuboriladi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void loadList()}
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
            title="Yangilash"
          >
            <RefreshCw size={16} className={listLoading ? "animate-spin" : ""} />
          </button>
          <button
            type="button"
            onClick={() => openCompose("new")}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            <PenSquare size={16} /> Yangi xat
          </button>
        </div>
      </div>

      {listError && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-rose-500" />
          {listError}
        </div>
      )}

      <div className="grid min-h-[70vh] grid-cols-1 overflow-hidden rounded-xl border border-slate-200 bg-white lg:grid-cols-[190px_360px_1fr]">
        {/* Papkalar */}
        <nav className={`border-b border-slate-100 p-2 lg:border-b-0 lg:border-r ${selected ? "hidden lg:block" : ""}`}>
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {(folders.length ? folders : [{ path: "INBOX", name: "INBOX", special: "\\Inbox", unseen: 0, total: 0 }]).map((f) => {
              const meta = folderMeta(f);
              const Icon = meta.icon;
              const active = f.path === folder;
              return (
                <button
                  key={f.path}
                  type="button"
                  onClick={() => {
                    setFolder(f.path);
                    setPage(1);
                    setSelected(null);
                  }}
                  className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    active ? "bg-primary-50 font-semibold text-primary-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="flex-1 truncate">{meta.label}</span>
                  {f.unseen > 0 && (
                    <span className="rounded-full bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{f.unseen}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Ro'yxat */}
        <section className={`flex min-h-0 flex-col border-slate-100 lg:border-r ${selected ? "hidden lg:flex" : "flex"}`}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(1);
              setSearch(query.trim());
            }}
            className="border-b border-slate-100 p-3"
          >
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Qidirish: kimdan, mavzu, matn…"
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-8 text-sm outline-none focus:border-primary-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {listLoading && !list?.messages?.length
              ? Array.from({ length: 8 }, (_, i) => (
                  <li key={i} className="space-y-2 px-4 py-3">
                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
                  </li>
                ))
              : list?.messages?.map((m) => (
                  <li key={m.uid}>
                    <button
                      type="button"
                      onClick={() => setSelected(m.uid)}
                      className={`block w-full px-4 py-3 text-left transition-colors ${
                        selected === m.uid ? "bg-primary-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {!m.seen && <span className="h-2 w-2 shrink-0 rounded-full bg-primary-600" />}
                        <span className={`flex-1 truncate text-sm ${m.seen ? "text-slate-700" : "font-bold text-slate-900"}`}>
                          {isSentFolder ? `Kimga: ${who(m.to)}` : who(m.from)}
                        </span>
                        {m.hasAttachments && <Paperclip size={13} className="shrink-0 text-slate-400" />}
                        {m.answered && <Reply size={13} className="shrink-0 text-emerald-500" />}
                        <span className="shrink-0 text-xs text-slate-400">{listDate(m.date)}</span>
                      </div>
                      <p className={`mt-0.5 truncate text-[13px] ${m.seen ? "text-slate-500" : "font-semibold text-slate-800"}`}>
                        {m.subject || "(mavzusiz)"}
                      </p>
                    </button>
                  </li>
                ))}
            {!listLoading && list?.messages?.length === 0 && (
              <li className="px-4 py-12 text-center text-sm text-slate-400">{search ? "Hech narsa topilmadi" : "Bu papka bo'sh"}</li>
            )}
          </ul>

          {total > pageSize && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
              <span>
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-30"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* O'qish */}
        <section className={`min-w-0 ${selected ? "block" : "hidden lg:block"}`}>
          {!selected ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-slate-400">
              <MailOpen size={40} strokeWidth={1.5} />
              <p className="text-sm">O&apos;qish uchun chapdan xatni tanlang</p>
            </div>
          ) : msgLoading ? (
            <div className="flex h-full items-center justify-center p-10 text-slate-400">
              <Loader2 size={28} className="animate-spin" />
            </div>
          ) : msgError ? (
            <div className="p-6">
              <button type="button" onClick={() => setSelected(null)} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-500 lg:hidden">
                <ArrowLeft size={16} /> Orqaga
              </button>
              <p className="flex items-center gap-2 rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
                <FileWarning size={18} /> {msgError}
              </p>
            </div>
          ) : message ? (
            <article className="flex h-full flex-col">
              <div className="border-b border-slate-100 px-6 py-4">
                <button type="button" onClick={() => setSelected(null)} className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 lg:hidden">
                  <ArrowLeft size={16} /> Orqaga
                </button>
                <h2 className="text-lg font-bold text-slate-900">{message.subject || "(mavzusiz)"}</h2>
                <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5 text-sm">
                    <p className="truncate">
                      <span className="text-slate-400">Kimdan: </span>
                      <span className="font-semibold text-slate-900">{message.from.map(fullAddr).join(", ")}</span>
                    </p>
                    <p className="truncate text-slate-600">
                      <span className="text-slate-400">Kimga: </span>
                      {message.to.map(fullAddr).join(", ") || "—"}
                    </p>
                    {message.cc.length > 0 && (
                      <p className="truncate text-slate-600">
                        <span className="text-slate-400">Nusxa: </span>
                        {message.cc.map(fullAddr).join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">{longDate(message.date)}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => openCompose("reply")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
                    >
                      <Reply size={15} /> Javob
                    </button>
                    <button
                      type="button"
                      onClick={() => openCompose("replyAll")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      title="Hammaga javob"
                    >
                      <ReplyAll size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => openCompose("forward")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      title="Yo'naltirish"
                    >
                      <Forward size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void markUnread()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      title="O'qilmagan deb belgilash"
                    >
                      <Mail size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
                      title="O'chirish"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {message.attachments.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.attachments.map((a) => (
                      <a
                        key={a.index}
                        href={`/api/mail/${message.uid}?folder=${encodeURIComponent(message.folder)}&att=${a.index}`}
                        className="inline-flex max-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:border-primary-200 hover:bg-primary-50"
                      >
                        <Paperclip size={13} className="shrink-0 text-slate-400" />
                        <span className="truncate font-medium">{a.filename}</span>
                        <span className="shrink-0 text-slate-400">{fileSize(a.size)}</span>
                        <Download size={13} className="shrink-0 text-slate-400" />
                      </a>
                    ))}
                  </div>
                )}

                {message.html && !allowRemote && /<img[^>]+src=["']?https?:/i.test(message.html) && (
                  <button
                    type="button"
                    onClick={() => setAllowRemote(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100"
                  >
                    <ImageIcon size={14} /> Tashqi rasmlar xavfsizlik uchun yashirilgan — ko&apos;rsatish
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                {message.html ? (
                  <HtmlBody html={message.html} allowRemote={allowRemote} />
                ) : (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-slate-800">{message.text}</pre>
                )}
              </div>
            </article>
          ) : null}
        </section>
      </div>

      {draft && (
        <Composer
          draft={draft}
          onClose={() => setDraft(null)}
          onSent={(d) => {
            setDraft(null);
            setToast("Xat yuborildi ✓");
            if (d.replyToUid) {
              setList((l) =>
                l?.messages ? { ...l, messages: l.messages.map((m) => (m.uid === d.replyToUid ? { ...m, answered: true } : m)) } : l,
              );
            }
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">{toast}</div>
      )}
    </div>
  );
}
