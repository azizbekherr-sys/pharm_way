#!/usr/bin/env node
/**
 * Validates JSON-LD on live pages. Run against production or a preview URL:
 *   node scripts/validate-jsonld.mjs [baseUrl]
 * Exits non-zero if any structured-data problem is found.
 */
const BASE = (process.argv[2] || process.env.SITE_URL || "https://www.pharmway.uz").replace(/\/$/, "");

const PAGES = [
  "/uz",
  "/uz/about",
  "/uz/services",
  "/uz/services/bfq-registration",
  "/uz/faq",
  "/uz/blog",
  "/uz/contact",
];

// Minimum required fields per schema.org @type we emit.
const REQUIRED = {
  Organization: ["name", "url"],
  WebSite: ["url", "name"],
  LocalBusiness: ["name", "address"],
  BreadcrumbList: ["itemListElement"],
  Service: ["name", "provider"],
  FAQPage: ["mainEntity"],
  BlogPosting: ["headline"],
};

let failures = 0;
let blocksChecked = 0;

for (const path of PAGES) {
  const url = `${BASE}${path}`;
  let html;
  try {
    const res = await fetch(url, { headers: { "user-agent": "pharmway-jsonld-validator" } });
    if (!res.ok) {
      console.error(`✗ ${url} → HTTP ${res.status}`);
      failures++;
      continue;
    }
    html = await res.text();
  } catch (err) {
    console.error(`✗ ${url} → ${err.message}`);
    failures++;
    continue;
  }

  const blocks = [
    ...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g),
  ].map((m) => m[1]);

  if (blocks.length === 0) {
    console.warn(`⚠ ${url} → no JSON-LD found`);
    continue;
  }

  for (const raw of blocks) {
    blocksChecked++;
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      console.error(`✗ ${url} → invalid JSON-LD (parse error)`);
      failures++;
      continue;
    }
    for (const obj of Array.isArray(data) ? data : [data]) {
      const type = obj["@type"];
      if (!obj["@context"]) {
        console.error(`✗ ${url} → ${type ?? "?"} missing @context`);
        failures++;
      }
      const required = REQUIRED[type];
      if (required) {
        for (const field of required) {
          if (!(field in obj)) {
            console.error(`✗ ${url} → ${type} missing "${field}"`);
            failures++;
          }
        }
      }
    }
  }
  console.log(`✓ ${url} → ${blocks.length} JSON-LD block(s)`);
}

console.log(`\nJSON-LD: ${blocksChecked} block(s) checked, ${failures} problem(s).`);
process.exit(failures ? 1 : 0);
