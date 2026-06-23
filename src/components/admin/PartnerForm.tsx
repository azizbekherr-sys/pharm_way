"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import { Trash2, Upload, X, Building2 } from "lucide-react";

type PartnerFormValues = {
  id?: string;
  name: string;
  country: string;
  countryFlag: string;
  category: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  website: string;
  order: number;
  active: boolean;
  logoUrl: string;
};

const EMPTY: PartnerFormValues = {
  name: "",
  country: "",
  countryFlag: "",
  category: "manufacturer",
  descriptionUz: "",
  descriptionRu: "",
  descriptionEn: "",
  website: "",
  order: 0,
  active: true,
  logoUrl: "",
};

const CATEGORIES = ["manufacturer", "distributor", "laboratory", "pharma"];

export default function PartnerForm({ initial }: { initial?: Partial<PartnerFormValues> }) {
  const router = useRouter();
  const [values, setValues] = useState<PartnerFormValues>({ ...EMPTY, ...initial });
  const [tab, setTab] = useState<"uz" | "ru" | "en">("uz");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEdit = Boolean(values.id);

  function update<K extends keyof PartnerFormValues>(key: K, value: PartnerFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      formData.append("folder", "logos");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) update("logoUrl", data.url);
      else alert(data.error || "Yuklashda xato yuz berdi");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Yuklashda xato yuz berdi");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: values.name,
      country: values.country,
      country_flag: values.countryFlag || null,
      category: values.category,
      description: values.descriptionUz || null,
      description_ru: values.descriptionRu || null,
      description_en: values.descriptionEn || null,
      website: values.website || null,
      order: values.order,
      active: values.active,
      logo_url: values.logoUrl || null,
    };

    const res = await fetch(isEdit ? `/api/partners/${values.id}` : "/api/partners", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) router.push("/admin/partners");
  }

  async function handleDelete() {
    if (!values.id) return;
    if (!confirm("Hamkorni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/partners/${values.id}`, { method: "DELETE" });
    router.push("/admin/partners");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <span className="mb-3 block text-sm font-medium text-slate-700">Kompaniya logosi</span>
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-white">
            {values.logoUrl ? (
              <Image
                src={values.logoUrl}
                alt="Logo"
                width={80}
                height={80}
                className="h-full w-full object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Building2 size={22} />
                <span className="mt-1 text-[10px]">Logo yo&apos;q</span>
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-[13px] font-medium text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              <Upload size={14} />
              {uploading ? "Yuklanmoqda..." : "Logo yuklash"}
            </button>
            <p className="mt-1.5 text-[11px] text-slate-400">PNG, JPG, SVG — max 2MB</p>
            {values.logoUrl && (
              <button
                type="button"
                onClick={() => update("logoUrl", "")}
                className="mt-1 flex items-center gap-1 text-[11px] text-red-500 hover:text-red-600"
              >
                <X size={12} />
                Logoni o&apos;chirish
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Kompaniya nomi" required>
          <input
            className="form-input"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />
        </Field>
        <Field label="Mamlakat" required>
          <input
            className="form-input"
            value={values.country}
            onChange={(e) => update("country", e.target.value)}
            required
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Bayroq emoji">
          <input
            className="form-input"
            placeholder="🇩🇪"
            value={values.countryFlag}
            onChange={(e) => update("countryFlag", e.target.value)}
          />
        </Field>
        <Field label="Kategoriya">
          <select className="form-input" value={values.category} onChange={(e) => update("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

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

      <Field label={`Tavsif (${tab.toUpperCase()})`}>
        <textarea
          className="form-input resize-none"
          rows={3}
          value={tab === "uz" ? values.descriptionUz : tab === "ru" ? values.descriptionRu : values.descriptionEn}
          onChange={(e) => {
            if (tab === "uz") update("descriptionUz", e.target.value);
            else if (tab === "ru") update("descriptionRu", e.target.value);
            else update("descriptionEn", e.target.value);
          }}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Veb-sayt">
          <input
            type="url"
            className="form-input"
            placeholder="https://"
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </Field>
        <Field label="Tartib raqami">
          <input
            type="number"
            className="form-input"
            value={values.order}
            onChange={(e) => update("order", Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
        <span className="text-sm font-medium text-slate-700">Faol</span>
        <button
          type="button"
          onClick={() => update("active", !values.active)}
          className={`relative h-5 w-9 rounded-full transition-colors duration-150 ${
            values.active ? "bg-emerald-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
              values.active ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </button>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? "Saqlanmoqda..." : "Saqlash"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors duration-150 hover:bg-red-50"
          >
            <Trash2 size={15} />
            O&apos;chirish
          </button>
        )}
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
