/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { supabasePublic, publicReadFailed } from "@/lib/supabase-public";
import type { BlogPostData } from "@/types/blog";
import type { SiteT } from "@/i18n/site-t";

// Bazadagi blog kategoriyasi -> dizayndagi chip nomi (o'zbekcha manba, t() bilan tarjima).
export const BLOG_CATEGORY_LABEL: Record<string, string> = {
  registration: "Registratsiya",
  import: "Import",
  baa: "BFQ",
  regulatory: "Regulatory",
  medicalDevices: "Tibbiy buyumlar",
  news: "Yangiliklar",
};

/** Blog sahifasidagi kategoriya chiplari — faqat maqolasi bor kategoriyalar. */
export function BlogChips({ posts, t }: { posts: BlogPostData[]; t: SiteT }) {
  const cats = Object.keys(BLOG_CATEGORY_LABEL).filter((c) => posts.some((p) => p.category === c));
  if (cats.length < 2) return null;
  return (
    <div className="chip-row" data-filter-group="blog" role="group" aria-label={t("Kategoriyalar")}>
      <button className="chip active" type="button" data-filter="all" aria-pressed="true">
        {t("Barcha")}
      </button>
      {cats.map((c) => (
        <button key={c} className="chip" type="button" data-filter={c} aria-pressed="false">
          {t(BLOG_CATEGORY_LABEL[c])}
        </button>
      ))}
    </div>
  );
}

/** Dizayndagi blog kartalari, ma'lumot bazadan (birinchisi — "featured"). */
export function BlogGrid({ posts, t, L }: { posts: BlogPostData[]; t: SiteT; L: (p: string) => string }) {
  if (posts.length === 0) {
    return <p className="lead">{t("Tez orada yangi maqolalar e’lon qilinadi.")}</p>;
  }
  return (
    <div className="blog-grid reveal" data-filter-target="blog">
      {posts.map((post, i) => (
        <Link
          key={post.slug}
          href={L(`/blog/${post.slug}`)}
          className={`card blog-card${i === 0 ? " featured" : ""}`}
          data-cat={post.category}
        >
          <span className="blog-badge">{t(BLOG_CATEGORY_LABEL[post.category] ?? post.category)}</span>
          <h3>{post.title}</h3>
          {post.excerpt && <p className="text">{post.excerpt}</p>}
          <div className="blog-meta">
            <span>{post.date}</span>
            <span className="dot" aria-hidden="true" />
            <span>{post.readTime}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

type Partner = { id: string; name: string; country: string | null; logo_url: string | null; website: string | null };

/** Hamkorlar sahifasi: admin panelda qo'shilgan real hamkorlar logotiplari. */
export async function PartnerLogos({ t }: { t: SiteT }) {
  const { data, error } = await supabasePublic
    .from("partners")
    .select("id, name, country, logo_url, website")
    .eq("active", true)
    .order("order", { ascending: true });
  if (error) publicReadFailed(error, "partners");
  const partners = ((data ?? []) as Partner[]).filter((p) => p.logo_url && p.logo_url.trim());
  if (partners.length === 0) return null;

  return (
    <section className="section">
      <div className="container">
        <div className="section-head rise">
          <div>
            <div className="eyebrow">{t("Hamkorlar")}</div>
            <h2>{t("Hamkorlarimiz")}</h2>
          </div>
        </div>
        <div className="head-rule line-in" aria-hidden="true" />
        <div className="logo-grid reveal">
          {partners.map((p) => {
            const inner = (
              <>
                <img src={p.logo_url!} alt={p.name} loading="lazy" decoding="async" />
                <strong>{p.name}</strong>
                {p.country && <span>{p.country}</span>}
              </>
            );
            return p.website ? (
              <a key={p.id} className="card logo-card" href={p.website} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <div key={p.id} className="card logo-card">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const MAPS: { key: "yandex" | "google" | "twoGis"; label: Record<string, string>; color: string }[] = [
  { key: "yandex", label: { uz: "Yandex Xarita", ru: "Яндекс Карты", en: "Yandex Maps" }, color: "#FC3F1D" },
  { key: "google", label: { uz: "Google Maps", ru: "Google Карты", en: "Google Maps" }, color: "#34A853" },
  { key: "twoGis", label: { uz: "2GIS", ru: "2ГИС", en: "2GIS" }, color: "#19AA1E" },
];

/** Aloqa sahifasi: manzil va Yandex / Google / 2GIS havolalari (xarita ustida). */
export function MapLinks({ locale, t }: { locale: "uz" | "ru" | "en"; t: SiteT }) {
  return (
    <div className="map-links">
      <a className="chip" href={siteConfig.maps.yandex} target="_blank" rel="noopener noreferrer">
        {siteConfig.address[locale]}
      </a>
      <span className="small">{t("Xaritada ochish")}:</span>
      {MAPS.map((m) => (
        <a key={m.key} className="chip" href={siteConfig.maps[m.key]} target="_blank" rel="noopener noreferrer">
          <span className="dot" style={{ background: m.color }} aria-hidden="true" />
          {m.label[locale]}
        </a>
      ))}
    </div>
  );
}
