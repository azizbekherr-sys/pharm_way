#!/usr/bin/env node
/**
 * Validates /sitemap.xml on a live deployment:
 *   node scripts/validate-sitemap.mjs [baseUrl]
 * Checks every <loc> is an absolute https URL on the canonical host, warns if
 * all <lastmod> values are identical (request-time smell), and HEAD-checks a
 * sample of URLs for non-error status. Exits non-zero on failure.
 */
const BASE = (process.argv[2] || process.env.SITE_URL || "https://www.pharmway.uz").replace(/\/$/, "");
const HOST = new URL(BASE).host;

let failures = 0;

const res = await fetch(`${BASE}/sitemap.xml`);
if (!res.ok) {
  console.error(`✗ /sitemap.xml → HTTP ${res.status}`);
  process.exit(1);
}
const xml = await res.text();

const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim());
console.log(`Found ${locs.length} URL(s), ${lastmods.length} lastmod value(s).`);

if (locs.length === 0) {
  console.error("✗ sitemap has no <loc> entries");
  process.exit(1);
}

for (const url of locs) {
  if (!/^https:\/\//.test(url)) {
    console.error(`✗ not https: ${url}`);
    failures++;
  } else if (new URL(url).host !== HOST) {
    console.error(`✗ wrong host: ${url}`);
    failures++;
  }
}

// Heuristic: if every lastmod is identical, it is likely request/deploy time.
const uniqueLastmods = new Set(lastmods);
if (lastmods.length > 5 && uniqueLastmods.size === 1) {
  console.warn(`⚠ all ${lastmods.length} <lastmod> values are identical (${[...uniqueLastmods][0]}) — verify these are real content dates`);
}

// Status-check a sample to catch dead URLs in the sitemap.
const sample = locs.slice(0, Math.min(15, locs.length));
for (const url of sample) {
  try {
    const head = await fetch(url, { method: "HEAD", redirect: "manual" });
    if (head.status >= 400) {
      console.error(`✗ ${url} → HTTP ${head.status}`);
      failures++;
    } else if (head.status >= 300) {
      console.warn(`⚠ ${url} → HTTP ${head.status} (sitemap URLs should be the final canonical, not a redirect)`);
    }
  } catch (err) {
    console.error(`✗ ${url} → ${err.message}`);
    failures++;
  }
}

console.log(`\nSitemap: ${sample.length} URL(s) status-checked, ${failures} problem(s).`);
process.exit(failures ? 1 : 0);
