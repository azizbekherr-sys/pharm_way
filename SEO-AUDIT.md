# SEO / GEO / Accessibility / Performance Audit — Pharm Way Group

**Site:** https://www.pharmway.uz · **Audited:** 2026-08-01
**Scope:** technical SEO, structured data, AI/answer-engine readiness, YMYL/E-E-A-T, performance, accessibility, analytics scaffolding.

## Stack snapshot

| Item | Value |
|---|---|
| Framework | Next.js **14.2.35** (App Router) |
| React | 18.3.1 |
| i18n | `next-intl` 3.26, locales `uz` (default) / `ru` / `en`, `localePrefix: "always"` |
| Content/DB | Supabase (Postgres) via `supabase-js`; Prisma schema present but **not** the runtime source of truth |
| Hosting | Self-hosted: Docker + Caddy (was Vercel at audit time; see DEPLOY.md) |
| Routing | `src/app/[locale]/…` public, `src/app/admin/…` panel, `src/app/api/…` |
| Existing SEO | `src/lib/seo.ts`, `src/app/sitemap.ts`, `public/robots.txt`, OG route `src/app/og-image/route.tsx` |

Overall the foundation is **above average** for a Next.js site — centralized metadata helper, per-page `generateMetadata`, reciprocal hreflang, `metadataBase`, Organization + LocalBusiness JSON-LD, dynamic OG image, per-locale sitemap with alternates. The issues below are targeted fixes, not a rebuild.

---

## Phase 1 findings

### 🔴 Critical (rendered-HTML problems / indexing risk)

1. **Placeholder verification codes are rendered live.** `src/app/[locale]/layout.tsx:74-77` outputs
   `<meta name="google-site-verification" content="google-site-verification-code-here">` and the Yandex equivalent on **every page**. Invalid values; must be env-driven and only rendered when present. *(Explicit task requirement.)*

2. **No 404 handling → self-referencing canonical on not-found.** There is **no** `not-found.tsx` anywhere. Unknown routes under `/[locale]` still render the locale layout, which sets `alternates.canonical = /[locale]` — so a 404 can emit a `200-style` canonical to a real URL. Dynamic not-found (invalid blog slug / service slug) returns `{}` metadata (no `noindex`). Needs: localized `not-found`, `noindex,nofollow`, and no canonical.

3. **Sitemap uses request-time `lastModified` for all static pages.** `src/app/sitemap.ts:27` sets `lastModified: new Date()` for every static URL, so every crawl shows "just modified." *(Explicit task requirement: use real dates.)* Blog posts correctly use real dates.

### 🟠 High

4. **Redundant `alternates` in the locale layout** (`layout.tsx:47`) duplicate what every page already sets via `buildPageMetadata`, and are the mechanism leaking canonical/hreflang onto 404s. Should be removed from the layout (pages own their alternates).

5. **Missing structured-data types.** Present: Organization, LocalBusiness (both in layout on every page), FAQPage (on `/faq`), BlogPosting (blog detail). **Missing:** `WebSite` (+ `inLanguage`), `BreadcrumbList` (all inner pages), `Service` (service detail pages), `FAQPage` on **service-detail** pages (the FAQ accordion is visible there but not marked up), `WebPage` linking. `@id` graph not connected.

6. **`robots.txt` is static and thin.** Works, but not integrated with the sitemap source of truth and cannot adapt per-environment (e.g. block indexing on preview deployments). No explicit allow of assets (currently fine), no `/og-image`/search exclusions.

### 🟡 Medium

7. **No `WebSite` + `SearchAction`/`inLanguage`** → weaker entity understanding for AI/answer engines.
8. **No `/llms.txt`** (AEO/GEO). No concise machine-readable company/services index.
9. **Contact page has no structured data** (no breadcrumb, no ContactPoint reference).
10. **Heavy client-side JS.** ~56 `"use client"` modules; every hero uses `framer-motion` (`motion.h1`), i.e. above-the-fold LCP content is client-rendered/animated. LCP & INP risk (Phase 7).
11. **Business claims in metadata** — e.g. home description `"5+ yil tajriba, 50+ muvaffaqiyatli loyiha"`, service `"3-6 oy muddat"`. Ranges are acceptable but the counts need verification → `CONTENT-GAPS.md`.
12. **English terminology mixes `BFQ` (14×) and `dietary supplement` (37×).** Russian correctly uses **БАД**; Uzbek uses **BFQ**. English should standardize (e.g. "dietary supplements (BFQ)"). No meaning change — review only.
13. **Dead placeholder data.** `src/config/site.ts` `blogPosts[]` holds hard-coded `views` (3240, 1850…) used only for a TS type; the real blog lives in Supabase. Harmless but should be trimmed to avoid confusion.
14. **No `.env.example`, no analytics/consent integration, no test/validation scripts, no `type-check` npm script.**

### 🟢 Good (keep as-is)

- `metadataBase` set; per-page absolute titles; reciprocal hreflang + `x-default`; OG + Twitter tags; dynamic 1200×630 OG image (edge).
- Security headers in `next.config.mjs` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`), image cache headers, AVIF/WebP enabled.
- Admin/API correctly excluded in `robots.txt` and behind auth middleware.
- Each public page has exactly one `<h1>` (via hero `motion.h1`).
- `next-intl` correctly wired; canonical host already normalized to `www.pharmway.uz`.

### Accessibility (Phase 9) — quick pass

- No **skip-to-content** link.
- Icon-only controls (social links in `Footer`, language switcher, share buttons) — need to confirm every one has an accessible name.
- External links should carry `rel="noopener noreferrer"` consistently.
- Verify form labels/validation messages are localized (contact form).

### Performance (Phase 7) — quick pass

- Hero/LCP is a client component with animation; consider a server-rendered static hero shell.
- Fonts: `Manrope` via `next/font/google` (self-hosted at build) — good; but layout also `preconnect`s to `fonts.googleapis.com`/`fonts.gstatic.com` which is unnecessary when using `next/font` (remove to drop 2 connections).
- Confirm hero images use `next/image` with correct `sizes` and only the true LCP image is `priority`.

---

## Proposed implementation groups (file-level)

**Group 1 — Critical technical SEO** *(safe, mostly required)*
- `src/lib/seo.ts` — add `buildVerification()` (env-gated google/yandex/bing), `buildWebSiteJsonLd`, `buildBreadcrumbJsonLd`, `buildServiceJsonLd`, `buildWebPageJsonLd`; connect `@id`s.
- `src/app/[locale]/layout.tsx` — replace placeholder `verification` with env-gated; **remove** redundant `alternates`; add `WebSite` JSON-LD; remove needless font `preconnect`s.
- `src/app/[locale]/not-found.tsx` (new) + `src/app/not-found.tsx` (new) — localized 404, `robots: noindex,nofollow`, no canonical.
- `src/app/[locale]/blog/[slug]/page.tsx`, `services/[slug]/page.tsx` — return `noindex` metadata on not-found instead of `{}`.
- `src/app/sitemap.ts` — real `lastModified` (config/build constants for static pages; Supabase dates for blog), add `x-default`.
- `src/app/robots.ts` (new, replaces `public/robots.txt`) — env-aware, sitemap-linked.

**Group 2 — Structured data**
- Service-detail: `Service` + `BreadcrumbList` + `FAQPage` (from the visible accordion translations).
- Inner pages (about/services/contact/blog/partners/faq/testimonials): `BreadcrumbList`.
- Contact: `ContactPoint`/breadcrumb.
- `scripts/validate-jsonld.mjs` — schema sanity checks.

**Group 3 — GEO/AEO**
- `src/app/llms.txt/route.ts` + `src/app/llms-full.txt/route.ts` (plain-text, HTTP 200, real facts only).
- Internal-link additions between services ↔ blog ↔ FAQ ↔ contact.

**Group 4 — Analytics & webmaster scaffolding** *(env-gated, no real IDs)*
- `src/components/analytics/*` — GA4 **or** GTM (single strategy), Yandex Metrica, Clarity, Web Vitals; all render nothing unless env set; consent-aware.
- `.env.example` documenting every `NEXT_PUBLIC_*` toggle.

**Group 5 — Accessibility & performance**
- Skip link in layout; audit aria-labels; external-link `rel`; hero LCP/image/`sizes` review; drop font preconnects.

**Group 6 — Docs & tooling**
- `CONTENT-GAPS.md`, `SEO-SETUP.md`, `.env.example`; `type-check` + validation npm scripts; sitemap/JSON-LD validators.

---

## Constraints & notes

- **Build cannot be run in this sandbox** (Supabase host is network-blocked here); `tsc --noEmit` + `eslint` are used per group, and the production build must be confirmed on Vercel.
- No company facts, IDs, certifications, coordinates, or claims will be invented — anything unverifiable goes to `CONTENT-GAPS.md`.
- No visual redesign; changes are metadata/markup/config only unless a perf fix is explicitly low-risk.
