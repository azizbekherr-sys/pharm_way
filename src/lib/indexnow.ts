import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { siteUrl } from "@/lib/seo";
import { PUBLIC_DATA_TAG } from "@/lib/supabase-public";
import { availableLocales } from "@/lib/blog";

/**
 * IndexNow — Yandex, Bing (va ular orqali Copilot/ChatGPT qidiruvi), Seznam, Naver
 * qidiruv tizimlariga sahifa o'zgarganini darhol xabar qilish protokoli.
 * Kalit maxfiy emas: u https://www.pharmway.uz/<KEY>.txt da ochiq turadi.
 */
export const INDEXNOW_KEY = "ab5caa0c5c6c62b692e4435235a0696b";

export async function submitIndexNow(urls: string[]): Promise<boolean> {
  const list = [...new Set(urls)].filter((u) => u.startsWith(siteUrl)).slice(0, 10_000);
  if (list.length === 0) return false;
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteUrl).host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
        urlList: list,
      }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

type PostLike = { slug?: string | null; published?: boolean | null; content_ru?: string | null; content_en?: string | null };

/**
 * Admin blogni o'zgartirgandan keyin: ochiq sahifalarni (ISR keshi) darhol
 * yangilaydi va e'lon qilingan maqola manzillarini IndexNow'ga yuboradi.
 */
export async function afterBlogChange(post?: PostLike | null): Promise<void> {
  revalidateTag(PUBLIC_DATA_TAG);
  revalidatePath("/", "layout");

  const urls = ["uz", "ru", "en"].map((l) => `${siteUrl}/${l}/blog`);
  if (post?.slug && post.published) {
    for (const l of availableLocales(post)) urls.push(`${siteUrl}/${l}/blog/${post.slug}`);
  }
  // Javobni kutmaymiz — admin saqlash tezligiga ta'sir qilmasin.
  void submitIndexNow(urls);
}
