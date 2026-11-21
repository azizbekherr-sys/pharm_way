import "server-only";
import { createClient } from "@supabase/supabase-js";

/** revalidateTag(PUBLIC_DATA_TAG) — admin o'zgartirishidan keyin ochiq sahifalarni yangilash uchun. */
export const PUBLIC_DATA_TAG = "supabase-public";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Ochiq (sayt) sahifalari uchun o'qish mijozi. `supabaseAdmin` har bir so'rovni
 * `no-store` qiladi va sahifani har safar qayta render qilishga majburlaydi
 * (2–6 s). Bu mijoz so'rovlarni Next.js data cache'da saqlaydi, shuning uchun
 * sahifalar statik/ISR bo'lib tez ochiladi; admin o'zgartirsa
 * `revalidateTag(PUBLIC_DATA_TAG)` + `revalidatePath` darhol yangilaydi.
 */
export const supabasePublic = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (url, options) =>
      // Faqat `next.revalidate` (cache: "force-cache" bilan birga yozilsa Next.js
      // revalidate'ni e'tiborsiz qoldirib, ma'lumotni abadiy keshlaydi).
      fetch(url, { ...options, next: { revalidate: 300, tags: [PUBLIC_DATA_TAG] } }),
  },
});
