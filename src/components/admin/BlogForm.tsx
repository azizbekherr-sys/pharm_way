"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import { Star, Upload, X, ImageIcon, Sparkles, Eye, Wand2, Link2 } from "lucide-react";
import { blogCategories } from "@/config/site";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Lang = "uz" | "ru" | "en";

type BlogFormValues = {
  id?: string;
  title: string;
  titleRu: string;
  titleEn: string;
  slug: string;
  category: string;
  readTime: number;
  excerpt: string;
  excerptRu: string;
  excerptEn: string;
  content: string;
  contentRu: string;
  contentEn: string;
  published: boolean;
  featured: boolean;
  coverImage: string;
  tags: string;
};

const EMPTY: BlogFormValues = {
  title: "",
  titleRu: "",
  titleEn: "",
  slug: "",
  category: blogCategories[1],
  readTime: 5,
  excerpt: "",
  excerptRu: "",
  excerptEn: "",
  content: "",
  contentRu: "",
  contentEn: "",
  published: false,
  featured: false,
  coverImage: "",
  tags: "",
};

const TITLE_KEY: Record<Lang, keyof BlogFormValues> = { uz: "title", ru: "titleRu", en: "titleEn" };
const EXCERPT_KEY: Record<Lang, keyof BlogFormValues> = { uz: "excerpt", ru: "excerptRu", en: "excerptEn" };
const CONTENT_KEY: Record<Lang, keyof BlogFormValues> = { uz: "content", ru: "contentRu", en: "contentEn" };

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function BlogForm({ initial }: { initial?: Partial<BlogFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<BlogFormValues>({ ...EMPTY, ...initial });
  const [tab, setTab] = useState<Lang>("uz");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(values.id);

  function update<K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Faqat rasm fayl yuklang");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Fayl hajmi 2MB dan oshmasin");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "blog/covers");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) update("coverImage", data.url);
      else alert(data.error || "Yuklashda xato yuz berdi");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Yuklashda xato yuz berdi");
    } finally {
      setUploading(false);
    }
  }

  async function translateField(text: string, fromLang: Lang, toLangs: Lang[]) {
    if (!text) return {};
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, fromLang, toLangs }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Tarjima xatosi");
    return (data.translations ?? {}) as Record<string, string>;
  }

  async function handleAutoTranslate() {
    const sourceLang = tab;
    const targetLangs = (["uz", "ru", "en"] as Lang[]).filter((l) => l !== sourceLang);

    setTranslating(true);
    try {
      const [titleTr, contentTr, excerptTr] = await Promise.all([
        translateField(values[TITLE_KEY[sourceLang]] as string, sourceLang, targetLangs),
        translateField(values[CONTENT_KEY[sourceLang]] as string, sourceLang, targetLangs),
        translateField(values[EXCERPT_KEY[sourceLang]] as string, sourceLang, targetLangs),
      ]);

      setValues((prev) => {
        const next = { ...prev };
        for (const lang of targetLangs) {
          if (titleTr[lang]) next[TITLE_KEY[lang]] = titleTr[lang] as never;
          if (contentTr[lang]) next[CONTENT_KEY[lang]] = contentTr[lang] as never;
          if (excerptTr[lang]) next[EXCERPT_KEY[lang]] = excerptTr[lang] as never;
        }
        return next;
      });

      alert("✅ Tarjima muvaffaqiyatli amalga oshirildi!");
    } catch (err) {
      console.error("Translate error:", err);
      alert("❌ Tarjima xatosi yuz berdi");
    } finally {
      setTranslating(false);
    }
  }

  async function handleAutoImage() {
    if (!values.title) {
      alert("Avval sarlavhani kiriting");
      return;
    }
    setPickingImage(true);
    try {
      const res = await fetch("/api/blog/auto-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: values.title, category: values.category, tags: values.tags }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rasm topilmadi");
      update("coverImage", data.imageUrl);
    } catch (err) {
      console.error("Auto-image error:", err);
      alert(err instanceof Error ? err.message : "Rasm tanlashda xato yuz berdi");
    } finally {
      setPickingImage(false);
    }
  }

  async function handleImportFromUrl() {
    if (!importUrl.trim()) {
      alert("Avval maqola havolasini kiriting");
      return;
    }
    setImporting(true);
    try {
      const res = await fetch("/api/blog/auto-fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Maqolani tahlil qilib bo'lmadi");

      setValues((prev) => ({
        ...prev,
        title: data.title,
        slug: prev.slug || slugify(data.title),
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags,
        readTime: data.readTime,
      }));
      setTab("uz");
      alert("✅ Maqola havoladan muvaffaqiyatli to'ldirildi!");
    } catch (err) {
      console.error("Import error:", err);
      alert(err instanceof Error ? err.message : "Havoladan maqola olishda xato yuz berdi");
    } finally {
      setImporting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: values.title,
      title_ru: values.titleRu || null,
      title_en: values.titleEn || null,
      slug: values.slug || slugify(values.title) || `post-${Date.now()}`,
      category: values.category,
      read_time: values.readTime,
      excerpt: values.excerpt || null,
      excerpt_ru: values.excerptRu || null,
      excerpt_en: values.excerptEn || null,
      content: values.content,
      content_ru: values.contentRu || null,
      content_en: values.contentEn || null,
      published: values.published,
      featured: values.featured,
      cover_image: values.coverImage || null,
      tags: values.tags
        ? values.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : null,
      published_at: values.published ? new Date().toISOString() : null,
    };

    if (values.featured) {
      await fetch("/api/blog/unfeatured", { method: "POST" });
    }

    const res = await fetch(isEdit ? `/api/blog/${values.id}` : "/api/blog", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) router.push("/admin/blog");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[60%_1fr]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
          <Link2 size={16} className="shrink-0 text-violet-600" />
          <input
            type="url"
            className="form-input min-w-[220px] flex-1 bg-white"
            placeholder="Maqola havolasini joylashtiring (https://...)"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleImportFromUrl}
            disabled={importing}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-violet-600 px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 hover:bg-violet-700 disabled:opacity-60"
          >
            <Sparkles size={14} />
            {importing ? "Tahlil qilinmoqda..." : "Havoladan to'ldirish"}
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setTab(l)}
                className={`rounded-md px-4 py-1.5 text-[13px] font-semibold uppercase transition-colors duration-150 ${
                  tab === l ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={translating || !values[TITLE_KEY[tab]]}
            className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-[13px] font-semibold text-violet-700 transition-colors duration-150 hover:bg-violet-100 disabled:opacity-50"
            title={`${tab.toUpperCase()} tildan boshqa tillarga avtomatik tarjima qilish`}
          >
            <Sparkles size={14} />
            {translating ? "Tarjima qilinmoqda..." : "Avtomatik tarjima"}
          </button>
        </div>

        <input
          className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-2xl font-semibold text-slate-900 outline-none placeholder:text-slate-300 focus:border-primary-500"
          placeholder="Maqola sarlavhasi..."
          value={values[TITLE_KEY[tab]] as string}
          onChange={(e) => {
            update(TITLE_KEY[tab], e.target.value as never);
            if (tab === "uz" && !isEdit) update("slug", slugify(e.target.value));
          }}
          required={tab === "uz"}
        />

        <Field label="Slug" required={tab === "uz"}>
          <input
            className="form-input font-mono text-[13px]"
            value={values.slug}
            onChange={(e) => update("slug", e.target.value)}
            required={tab === "uz"}
          />
        </Field>

        <Field label={`Qisqacha (${tab.toUpperCase()})`}>
          <textarea
            className="form-input resize-none"
            rows={2}
            value={values[EXCERPT_KEY[tab]] as string}
            onChange={(e) => update(EXCERPT_KEY[tab], e.target.value as never)}
          />
        </Field>

        <Field label={`Matn (${tab.toUpperCase()})`} required={tab === "uz"}>
          <RichTextEditor
            content={values[CONTENT_KEY[tab]] as string}
            onChange={(html) => update(CONTENT_KEY[tab], html as never)}
            placeholder="Maqola matnini kiriting..."
          />
        </Field>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-[15px] font-bold text-slate-900">Nashr sozlamalari</h3>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Nashr etish</span>
            <button
              type="button"
              onClick={() => update("published", !values.published)}
              className={`relative h-5 w-9 rounded-full transition-colors duration-150 ${
                values.published ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
                  values.published ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Star size={14} className={values.featured ? "fill-amber-400 text-amber-400" : "text-slate-400"} />
              Asosiy maqola
            </span>
            <button
              type="button"
              onClick={() => update("featured", !values.featured)}
              className={`relative h-5 w-9 rounded-full transition-colors duration-150 ${
                values.featured ? "bg-amber-400" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
                  values.featured ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
          {values.featured && (
            <p className="-mt-2 text-[11px] text-amber-600">
              Saqlanganda boshqa asosiy maqola avtomatik bekor qilinadi.
            </p>
          )}

          <Field label="Kategoriya">
            <select className="form-input" value={values.category} onChange={(e) => update("category", e.target.value)}>
              {blogCategories
                .filter((c) => c !== "all")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </Field>

          <Field label="O'qish vaqti (daqiqa)">
            <input
              type="number"
              min={1}
              className="form-input"
              value={values.readTime}
              onChange={(e) => update("readTime", Number(e.target.value) || 1)}
            />
          </Field>

          <Field label="Teglar (vergul bilan ajratilgan)">
            <input
              className="form-input"
              placeholder="bfq, sertifikat, eksport"
              value={values.tags}
              onChange={(e) => update("tags", e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <span className="block text-sm font-medium text-slate-700">Muqova rasmi</span>
          <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-white">
            {values.coverImage ? (
              <Image
                src={values.coverImage}
                alt="Muqova"
                width={640}
                height={360}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <ImageIcon size={22} />
                <span className="mt-1 text-[10px]">Rasm yo&apos;q</span>
              </div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-[13px] font-medium text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              <Upload size={14} />
              {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
            </button>
            <button
              type="button"
              onClick={handleAutoImage}
              disabled={pickingImage}
              className="flex items-center gap-1.5 rounded-lg bg-violet-50 px-4 py-2 text-[13px] font-semibold text-violet-700 transition-colors duration-150 hover:bg-violet-100 disabled:opacity-60"
              title="Mavzuga mos rasmni internetdan avtomatik tanlash"
            >
              <Wand2 size={14} />
              {pickingImage ? "Tanlanmoqda..." : "Avtomatik rasm"}
            </button>
            {values.coverImage && (
              <button
                type="button"
                onClick={() => update("coverImage", "")}
                className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600"
              >
                <X size={12} />
                O&apos;chirish
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? "Saqlanmoqda..." : "💾 Saqlash"}
          </button>
          {isEdit && values.slug && (
            <a
              href={`/uz/blog/${values.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-150 hover:bg-slate-50"
            >
              <Eye size={15} />
              Ko&apos;rish
            </a>
          )}
          <button
            type="button"
            onClick={() => router.push("/admin/blog")}
            className="w-full text-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Bekor qilish
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-primary-600"> *</span>}
      </span>
      {children}
    </label>
  );
}
