import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import maxmind, { type CityResponse, type Reader } from "maxmind";

/**
 * Tashrifchining davlat/viloyat/shahrini aniqlaydi.
 *
 * Vercel bu ma'lumotni `x-vercel-ip-*` sarlavhalarida berardi. O'z serverimizda
 * esa uni ikki manbadan olamiz (birinchi topilgani ishlatiladi):
 *   1. Cloudflare sarlavhalari (`cf-ipcountry`, `cf-ipcity`, `cf-region-code`) —
 *      sayt Cloudflare orqasida bo'lsa.
 *   2. Lokal MMDB baza (DB-IP City Lite yoki MaxMind GeoLite2-City) —
 *      `GEOIP_DB_PATH` dagi fayl. `deploy/update-geoip.sh` uni yuklab beradi.
 * Hech biri bo'lmasa — hamma maydon `null`, analitika baribir ishlayveradi.
 */

export type Geo = { country: string | null; region: string | null; city: string | null };

const EMPTY: Geo = { country: null, region: null, city: null };
const DB_PATH =
  process.env.GEOIP_DB_PATH || path.join(process.cwd(), "geoip", "dbip-city-lite.mmdb");

let readerPromise: Promise<Reader<CityResponse> | null> | null = null;
let missingSince = 0;
const RECHECK_MS = 10 * 60 * 1000;

function getReader(): Promise<Reader<CityResponse> | null> {
  // Baza ilova ishga tushgandan keyin yuklansa ham (cron), 10 daqiqada topiladi.
  if (readerPromise === null || (missingSince && Date.now() - missingSince > RECHECK_MS)) {
    if (existsSync(DB_PATH)) {
      missingSince = 0;
      readerPromise = maxmind.open<CityResponse>(DB_PATH).catch((err) => {
        console.error("GeoIP bazasini ochib bo'lmadi:", err);
        return null;
      });
    } else {
      missingSince = Date.now();
      readerPromise = Promise.resolve(null);
    }
  }
  return readerPromise;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/** Reverse proxy (Caddy/nginx) qo'ygan sarlavhalardan mijoz IP manzilini oladi. */
function clientIp(h: Headers): string | null {
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = h.get("cf-connecting-ip") || forwarded || h.get("x-real-ip");
  return ip || null;
}

export async function lookupGeo(h: Headers): Promise<Geo> {
  const cfCountry = h.get("cf-ipcountry");
  // "XX" — noma'lum, "T1" — Tor (Cloudflare belgilari).
  if (cfCountry && cfCountry !== "XX" && cfCountry !== "T1") {
    const city = h.get("cf-ipcity");
    return {
      country: cfCountry,
      region: h.get("cf-region-code") || null,
      city: city ? safeDecode(city) : null,
    };
  }

  const ip = clientIp(h);
  if (!ip || !maxmind.validate(ip)) return EMPTY;

  try {
    const reader = await getReader();
    const rec = reader?.get(ip);
    if (!rec) return EMPTY;
    const sub = rec.subdivisions?.[0];
    return {
      country: rec.country?.iso_code ?? null,
      region: sub?.iso_code ?? sub?.names?.en ?? null,
      city: rec.city?.names?.en ?? null,
    };
  } catch {
    return EMPTY;
  }
}
