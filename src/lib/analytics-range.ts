// Analitika davrlari. Kun chegarasi Toshkent vaqti bo'yicha (UTC+5, yozgi vaqt yo'q).

export const RANGE_KEYS = ["today", "7d", "30d", "90d", "365d", "all"] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

const DAY_MS = 86_400_000;
const TZ_OFFSET_MS = 5 * 3_600_000;

const RANGE_DAYS: Record<Exclude<RangeKey, "all">, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
};

export function parseRange(value: string | null): RangeKey {
  return (RANGE_KEYS as readonly string[]).includes(value ?? "") ? (value as RangeKey) : "30d";
}

/** Toshkent bo'yicha `daysAgo` kun oldingi kunning boshlanishi (UTC Date). */
export function tashkentDayStart(daysAgo = 0, now = Date.now()): Date {
  const local = new Date(now + TZ_OFFSET_MS);
  const startLocal = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - daysAgo * DAY_MS;
  return new Date(startLocal - TZ_OFFSET_MS);
}

/** Davr boshi. "all" uchun 1970. */
export function rangeSince(range: RangeKey, now = Date.now()): Date {
  if (range === "all") return new Date(0);
  return tashkentDayStart(RANGE_DAYS[range] - 1, now);
}

/** Toshkent kalendar kuni "YYYY-MM-DD". */
export function tashkentDay(date: Date | string | number): string {
  const d = new Date(new Date(date).getTime() + TZ_OFFSET_MS);
  return d.toISOString().slice(0, 10);
}

/** `from` dan `to` gacha (ikkalasi ham kiradi) har bir kun "YYYY-MM-DD". */
export function dayList(from: Date, to: Date): string[] {
  const out: string[] = [];
  const start = Date.parse(`${tashkentDay(from)}T00:00:00Z`);
  const end = Date.parse(`${tashkentDay(to)}T00:00:00Z`);
  for (let t = start; t <= end && out.length < 4000; t += DAY_MS) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}
