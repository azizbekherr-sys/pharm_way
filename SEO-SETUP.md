# SEO Setup — connecting webmaster & analytics tools

All integrations are **optional and env-gated**: nothing is rendered or loaded
until you add the matching environment variable. No real IDs are stored in the
repo.

## Where to put the values
1. Vercel → your project → **Settings → Environment Variables**.
2. Add the variable (Production, and Preview if you want), paste the value.
3. **Redeploy** (env changes require a new deployment).
4. Locally: copy `.env.example` → `.env.local` and fill in.

`NEXT_PUBLIC_*` values are exposed to the browser — that is expected for
verification codes and analytics container IDs (they are public by design).

---

## 1. Google Search Console (verification)
1. https://search.google.com/search-console → add property **`https://www.pharmway.uz`** (URL prefix).
2. Choose **HTML tag** verification. Copy only the `content` value of
   `<meta name="google-site-verification" content="XXddd...">`.
3. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=XXddd...` in Vercel → redeploy.
4. Back in Search Console, click **Verify**.
5. Submit the sitemap: **Sitemaps → `sitemap.xml`**.

## 2. Bing Webmaster Tools (verification)
1. https://www.bing.com/webmasters → add site (you can also **import from Google Search Console**, which skips manual verification).
2. For manual: choose the **Meta tag** option, copy the `content` of `<meta name="msvalidate.01" content="YYY">`.
3. Set `NEXT_PUBLIC_BING_SITE_VERIFICATION=YYY` → redeploy → **Verify**.
4. Submit `https://www.pharmway.uz/sitemap.xml`.

## 3. Yandex Webmaster (verification)
1. https://webmaster.yandex.com → add site `https://www.pharmway.uz`.
2. Verification → **Meta tag**, copy the `content` of `<meta name="yandex-verification" content="ZZZ">`.
3. Set `NEXT_PUBLIC_YANDEX_VERIFICATION=ZZZ` → redeploy → **Check**.
4. Add the sitemap under **Indexing → Sitemap files**.

## 4. Google Analytics 4 via Google Tag Manager (recommended, single strategy)
The site uses **one** Google container: GTM. Configure GA4 **inside** GTM (do not
also add a second direct GA4 tag — that double-counts).
1. https://tagmanager.google.com → create a container for the website → copy the id **`GTM-XXXXXXX`**.
2. Set `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX` → redeploy.
3. In GTM, add a **Google Analytics: GA4 Configuration** tag with your GA4
   Measurement ID (`G-XXXXXXX`) and trigger it on **All Pages**.
4. **Consent:** the site ships **Google Consent Mode v2** with analytics/ads
   storage **denied by default**; a banner lets visitors accept. In GTM, keep
   "Additional consent checks" on so tags respect consent.
5. Custom event `web-vitals` is pushed to the dataLayer (LCP/INP/CLS/…): you can
   forward it to GA4 as an event if you want Core Web Vitals in your reports.

> Prefer GA4-in-GTM. If you ever must use direct GA4 instead, that is a separate
> tag — do not run both.

## 5. Yandex Metrica
1. https://metrica.yandex.com → create a counter → copy the **numeric id**.
2. Set `NEXT_PUBLIC_YANDEX_METRICA_ID=12345678` → redeploy.
3. Metrica loads **only after** the visitor accepts the consent banner.

## 6. Microsoft Clarity
1. https://clarity.microsoft.com → create a project → copy the **Project ID**.
2. Set `NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx` → redeploy.
3. Clarity loads **only after** consent.

---

## Verify it worked (after deploy)
- View page source of `https://www.pharmway.uz/uz` and search for the meta tags
  (`google-site-verification`, `msvalidate.01`, `yandex-verification`).
- Validate structured data: `npm run validate:jsonld` (or Google's Rich Results Test).
- Validate the sitemap: `npm run validate:sitemap`.
- Check `https://www.pharmway.uz/robots.txt` and `https://www.pharmway.uz/sitemap.xml`.
- AI/answer-engine index: `https://www.pharmway.uz/llms.txt` and `/llms-full.txt`.

## Notes on privacy
- Do not send form contents, health information, or personal data to analytics.
- Preview (non-production) deployments return `Disallow: /` in robots.txt so they
  are not indexed.
