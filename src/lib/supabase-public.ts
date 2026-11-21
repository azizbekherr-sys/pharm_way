import "server-only";
import { createClient } from "@supabase/supabase-js";

/** revalidateTag(PUBLIC_DATA_TAG) — admin o'zgartirishidan keyin ochiq sahifalarni yangilash uchun. */
export const PUBLIC_DATA_TAG = "supabase-public";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Bazaga so'rov shundan uzoq davom etsa, xato bilan to'xtatiladi. */
const FETCH_TIMEOUT_MS = 10_000;

/**
 * Next.js data cache bilan so'rov + vaqt chegarasi.
 *
 * Faqat `next.revalidate` (cache: "force-cache" bilan birga yozilsa Next.js
 * revalidate'ni e'tiborsiz qoldirib, ma'lumotni abadiy keshlaydi).
 *
 * Vaqt chegarasi `AbortSignal` bilan emas, `Promise.race` bilan: Next.js ISR
 * qayta yaratishda eskirgan so'rovni `signal`siz yuboradi (patch-fetch.js), va
 * javobsiz osilib qolgan bitta so'rov sahifa qayta yaratilishini abadiy
 * to'xtatib qo'yardi — sahifa ilova qayta ishga tushmaguncha eski holatda
 * ("STALE") qotib qolardi (2026-11-21 da blog ro'yxatida shunday bo'lgan).
 */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Supabase did not respond within ${FETCH_TIMEOUT_MS} ms`)),
      FETCH_TIMEOUT_MS,
    );
  });
  const request = fetch(input, { ...init, next: { revalidate: 300, tags: [PUBLIC_DATA_TAG] } });
  return Promise.race([request, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Ochiq (sayt) sahifalari uchun o'qish mijozi. `supabaseAdmin` har bir so'rovni
 * `no-store` qiladi va sahifani har safar qayta render qilishga majburlaydi
 * (2–6 s). Bu mijoz so'rovlarni Next.js data cache'da saqlaydi, shuning uchun
 * sahifalar statik/ISR bo'lib tez ochiladi; admin o'zgartirsa
 * `revalidateTag(PUBLIC_DATA_TAG)` + `revalidatePath` darhol yangilaydi.
 */
export const supabasePublic = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: fetchWithTimeout },
});

/**
 * Ochiq o'qish xato bilan tugaganda chaqiriladi.
 *
 * Build paytida (CI'da haqiqiy kalit yo'q) jim o'tadi — sahifa bo'sh holda
 * yig'iladi va saytda birinchi so'rovda to'ldiriladi. Ishlayotgan saytda esa
 * xato otiladi: shunda ISR oxirgi muvaffaqiyatli sahifani saqlab qoladi va
 * keyingi so'rovda qayta urinadi, vaqtinchalik nosozlik tufayli bo'sh
 * ro'yxatni 5 daqiqaga keshlab qo'ymaydi.
 */
export function publicReadFailed(error: unknown, what: string): void {
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const detail =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);
  throw new Error(`Supabase read failed (${what}): ${detail}`);
}
