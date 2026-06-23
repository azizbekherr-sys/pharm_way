"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";

type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const EMPTY = { question: "", answer: "", category: "general" };

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/faq");
    const data = await res.json();
    setFaqs(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm("Savolni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/faq/${id}`, { method: "DELETE" });
    await load();
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setForm(EMPTY);
    setShowForm(false);
    await load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">FAQ</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99]"
        >
          <Plus size={16} />
          Yangi savol
        </button>
      </div>

      {showForm && (
        <form onSubmit={create} className="mt-4 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          <input
            className="form-input"
            placeholder="Savol"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
          <textarea
            className="form-input resize-none"
            rows={3}
            placeholder="Javob"
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            required
          />
          <input
            className="form-input"
            placeholder="Kategoriya"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {saving ? "Saqlanmoqda..." : "Qo'shish"}
          </button>
        </form>
      )}

      <div className="mt-5 space-y-2">
        {faqs.map((f) => (
          <div key={f.id} className="rounded-xl border border-slate-200 bg-white">
            <button
              onClick={() => setOpenId(openId === f.id ? null : f.id)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium text-slate-900">{f.question}</span>
              <div className="flex items-center gap-3">
                <Trash2
                  size={16}
                  className="text-slate-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(f.id);
                  }}
                />
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform duration-150 ${openId === f.id ? "rotate-180" : ""}`}
                />
              </div>
            </button>
            {openId === f.id && <p className="px-5 pb-4 text-sm text-slate-600">{f.answer}</p>}
          </div>
        ))}
        {!loading && faqs.length === 0 && <p className="text-center text-slate-400">Hozircha savollar yo&apos;q</p>}
      </div>
    </div>
  );
}
