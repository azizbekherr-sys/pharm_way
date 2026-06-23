import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORY_FALLBACK: Record<string, string> = {
  registration: "pharmacist reviewing documents pharmacy",
  import: "cargo shipping containers port logistics",
  baa: "vitamin supplement bottles pharmacy shelf",
  medicalDevices: "medical equipment hospital technology",
  regulatory: "scientist laboratory quality control testing",
  news: "pharmaceutical factory production business",
};

async function buildSearchQuery(title: string, category: string, tags: string) {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 60,
      messages: [
        {
          role: "user",
          content: `A pharmaceutical/regulatory company is publishing a blog post and needs a realistic stock-photo cover image.

Post title: "${title}"
Category: ${category}
Tags: ${tags || "none"}

Describe, in 4-8 English words, a CONCRETE, PHOTOGRAPHABLE real-world scene that stock photo sites (like Unsplash) would actually have, and that visually represents the SPECIFIC topic of this exact post (not just the general category). Think of what a photographer would point a camera at: a person doing something, an object, a place. Avoid abstract or legal concepts (e.g. don't say "registration process" — instead say what that looks like, e.g. "person stamping official document").

Examples of good outputs:
- "customs officer inspecting cargo boxes warehouse"
- "pharmacist scanning medicine barcode shelf"
- "scientist pipetting sample laboratory testing"
- "businessman signing contract paperwork office"

Return ONLY the scene description, no explanation, no quotes, no punctuation at the end.`,
        },
      ],
    });
    const block = message.content[0];
    const text = block.type === "text" ? block.text.trim() : "";
    return text || CATEGORY_FALLBACK[category] || "pharmacy medicine";
  } catch {
    return CATEGORY_FALLBACK[category] || "pharmacy medicine";
  }
}

type UnsplashResult = {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: { raw: string };
  links: { download_location: string };
};

async function pickBestResult(title: string, results: UnsplashResult[]) {
  if (results.length <= 1) return 0;

  try {
    const candidates = results
      .map((r, i) => `${i}: ${r.description || r.alt_description || "(tasvir yo'q)"}`)
      .join("\n");

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 10,
      messages: [
        {
          role: "user",
          content: `Blog post title: "${title}"

Below are candidate stock photos with their descriptions. Pick the index of the photo that best visually matches the blog post's topic. Return ONLY the index number, nothing else.

${candidates}`,
        },
      ],
    });
    const block = message.content[0];
    const text = block.type === "text" ? block.text.trim() : "";
    const idx = parseInt(text, 10);
    return Number.isInteger(idx) && idx >= 0 && idx < results.length ? idx : 0;
  } catch {
    return 0;
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, category, tags } = await req.json();
    if (!title) return NextResponse.json({ error: "Sarlavha kerak" }, { status: 400 });

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) return NextResponse.json({ error: "Unsplash kaliti sozlanmagan" }, { status: 500 });

    const query = await buildSearchQuery(title, category, tags ?? "");

    const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`;
    const res = await fetch(searchUrl, {
      headers: { Authorization: `Client-ID ${accessKey}` },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Unsplash so'rovi muvaffaqiyatsiz tugadi" }, { status: 502 });
    }

    const data = await res.json();
    const results = (data.results ?? []) as UnsplashResult[];

    if (results.length === 0) {
      return NextResponse.json({ error: "Mos rasm topilmadi", query }, { status: 404 });
    }

    const bestIdx = await pickBestResult(title, results.slice(0, 10));
    const pick = results[bestIdx];
    const imageUrl = `${pick.urls.raw}&w=900&h=506&fit=crop&q=80`;

    fetch(`${pick.links.download_location}&client_id=${accessKey}`, { cache: "no-store" }).catch(() => {});

    return NextResponse.json({ imageUrl, query });
  } catch (error) {
    console.error("Auto-image error:", error);
    return NextResponse.json({ error: "Rasm tanlashda xato yuz berdi" }, { status: 500 });
  }
}
