import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LANG_NAMES: Record<string, string> = {
  uz: "O'zbek",
  ru: "Rus",
  en: "Ingliz",
};

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { text, fromLang, toLangs } = await req.json();

    if (!text || !fromLang || !toLangs?.length) {
      return NextResponse.json({ error: "Matn va tillar kerak" }, { status: 400 });
    }

    const translations: Record<string, string> = {};

    for (const toLang of toLangs as string[]) {
      if (toLang === fromLang) continue;

      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `Translate the following text from ${LANG_NAMES[fromLang]} to ${LANG_NAMES[toLang]}.

IMPORTANT RULES:
- Keep HTML tags intact if present
- Keep the same formatting and structure
- Translate only the text content
- Return ONLY the translated text, nothing else
- For pharmaceutical/medical terms use proper terminology

Text to translate:
${text}`,
          },
        ],
      });

      const block = message.content[0];
      translations[toLang] = block.type === "text" ? block.text.trim() : "";
    }

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Tarjima xatosi" }, { status: 500 });
  }
}
