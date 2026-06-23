import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ALLOWED_CATEGORIES = ["registration", "import", "baa", "medicalDevices", "regulatory", "news"];

async function extractArticleText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PharmWayBot/1.0)" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Havolani ochib bo'lmadi");

  const html = await res.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|h[1-6]|li|br|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]*\n+/g, "\n")
    .trim();

  if (text.length < 200) throw new Error("Maqola matnini topib bo'lmadi");
  return text.slice(0, 18000);
}

function parseClaudeJson(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/```\s*$/, "");
  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Havola kerak" }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: "Havola noto'g'ri" }, { status: 400 });
    }
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "Havola noto'g'ri" }, { status: 400 });
    }

    const articleText = await extractArticleText(parsedUrl.toString());

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `Quyida farmatsevtika/tibbiyot/me'yoriy-huquqiy mavzudagi maqola matni keltirilgan (internetdan olingan). Shu maqola asosida Pharm Way Group kompaniyasining blogi uchun o'zbek tilida original maqola yoz.

QOIDALAR:
- Matnni so'zma-so'z ko'chirma, o'z so'zlaring bilan qayta yoz, professional va tushunarli uslubda
- "content" maydoni HTML bo'lishi kerak: <p>, <h2>, <ul><li> teglardan foydalan, kamida 4-5 paragraf
- "category" faqat shu ro'yxatdan bo'lishi shart: registration, import, baa, medicalDevices, regulatory, news
- "excerpt" 1-2 gapli qisqacha mazmun, 200 belgidan oshmasin
- "tags" — vergul bilan ajratilgan, kichik harflarda, 3-5 ta kalit so'z
- "readTime" — daqiqalarda o'qish vaqti (butun son)
- Faqat JSON qaytar, boshqa hech narsa yozma, markdown fence ham ishlatma

JSON formati:
{"title": "...", "excerpt": "...", "content": "...", "category": "...", "tags": "...", "readTime": 5}

Maqola matni:
${articleText}`,
        },
      ],
    });

    const block = message.content[0];
    const rawText = block.type === "text" ? block.text : "";
    const result = parseClaudeJson(rawText);

    if (!result.title || !result.content) {
      return NextResponse.json({ error: "Maqolani tahlil qilib bo'lmadi" }, { status: 502 });
    }
    if (!ALLOWED_CATEGORIES.includes(result.category)) {
      result.category = "news";
    }

    return NextResponse.json({
      title: String(result.title),
      excerpt: String(result.excerpt ?? ""),
      content: String(result.content),
      category: result.category as string,
      tags: String(result.tags ?? ""),
      readTime: Number(result.readTime) || 5,
    });
  } catch (error) {
    console.error("Auto-fill error:", error);
    const msg = error instanceof Error ? error.message : "Havoladan maqola olishda xato yuz berdi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
