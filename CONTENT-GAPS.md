# Content Gaps — items that need real facts or a human decision

Nothing below was invented or auto-changed. Each item needs a verified value, a
source, or an editorial/design decision from the Pharm Way team. Once provided,
the corresponding code change is small.

## 1. Unverified business claims (currently live in metadata/UI)
| Claim | Where | Action needed |
|---|---|---|
| "5+ yil tajriba" (5+ years) | `messages/*.json` → `meta.pages.home.description`, `home.stats` | Confirm the real number, or soften to a factual statement. |
| "50+ muvaffaqiyatli loyiha" (50+ projects) | home meta / `Stats` component | Confirm the real figure or remove. |
| "3-6 oy muddat" (3–6 months) | `meta.services.bfq-registration.description` | A **range** is acceptable; confirm it is realistic and not presented as a guarantee. |

Avoid absolute claims ("leading company", "guaranteed registration"). None are
currently present — keep it that way.

## 2. LocalBusiness details (`src/lib/seo.ts` → `buildLocalBusinessJsonLd`)
- **Geo coordinates** `41.2995, 69.2836` look like a generic Tashkent-center point (also in `[locale]/layout.tsx` `geo.position`). Provide the **real office coordinates** or remove the `geo` block.
- **`priceRange: "$$"`** is a placeholder — provide a real value or remove the field.
- **Address** is district-level only (`Yunusobod tumani`). A full **street address** (`streetAddress`, `postalCode`) strengthens the LocalBusiness entity and Google Business alignment.

## 3. E-E-A-T / YMYL — authorship (Phase 6)
- Blog posts currently attribute `author` to the Organization. To add real **`Person`** authors + reviewers (recommended for a pharma/regulatory site), provide for each author: full name, role/title, short bio, and (optionally) LinkedIn/photo. Then we add author/reviewer fields to the blog model + `Person` schema.
- **"Last reviewed" date**: decide whether articles are periodically reviewed; if yes, we can surface a real `dateModified` / "reviewed on" line.

## 4. Regulatory sources (Phase 5/6)
- Regulatory statements about BFQ/registration should link to **authoritative Uzbekistan sources** (e.g. the relevant Ministry of Health / regulatory agency page). Provide the official URLs and we will add them as references on the service/blog pages.

## 5. Informational disclaimer (Phase 6) — needs approval before adding
Suggested short, non-legal disclaimer for blog/service pages (edit freely):
- **uz:** "Ushbu material umumiy ma'lumot uchun bo'lib, professional maslahat o'rnini bosmaydi. Aniq holat bo'yicha mutaxassisga murojaat qiling."
- **ru:** "Материал носит информационный характер и не заменяет профессиональную консультацию. По вашему случаю обратитесь к специалисту."
- **en:** "This content is for general information only and is not a substitute for professional advice. Contact a specialist about your specific case."

Confirm wording (and whether it reflects your real process) and we will add it.

## 6. English terminology consistency
English content mixes **"BFQ"** (14×) and **"dietary supplement"** (37×). Russian correctly uses **БАД**; Uzbek uses **BFQ**. Recommended: standardize English to **"dietary supplements (BFQ)"** on first mention, then "dietary supplements". No meaning change — just consistency. Decide and we will normalize `messages/en.json`.

## 7. Internal linking (Phase 5, editorial)
Add contextual links (no design change, but needs your intent):
- Each **service page** → 1–2 related **blog articles** + the **FAQ** section.
- **Blog articles** → the most relevant **service** page.
- **FAQ answers** → the service/contact page they reference.
Provide the desired mapping (or approve an automatic "related by category" approach).

## 8. Performance — hero entry animation (Phase 7)
Every hero animates its `<h1>`/text from `opacity: 0` via framer-motion, so the
SSR HTML renders the LCP text invisible until JS hydrates. This can delay LCP and
hides content for no-JS users. Fix (needs design sign-off): render hero text at
full opacity and animate only transform, or drop the entry fade on the LCP element.

## 9. Localized accessibility labels
Icon-only controls have English `aria-label`s ("Open menu", "Close menu",
"Change language" in `Navbar`/`LanguageSwitcher`). For full localization, add
`nav.aria.*` translation keys in all three languages. Low priority (labels exist).

## 10. Dead placeholder data
`src/config/site.ts` `blogPosts[]` holds hard-coded `views` (3240, 1850, …) that
are not used for rendering (real blog lives in Supabase). Recommend deleting the
array (keep only what `BlogSlug` type genuinely needs) to avoid confusion.

## 11. Verification & analytics IDs (owner action)
Add the optional env vars from `.env.example` in Vercel when ready (see
`SEO-SETUP.md`). Until then, no verification/analytics tags render — by design.

## 12. Sitemap static `lastModified`
`src/app/sitemap.ts` uses a fixed `STATIC_LAST_MODIFIED` constant for marketing
pages (honest and stable, unlike request-time). **Bump this date** whenever those
static pages get a meaningful content update.
