import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, company, serviceType, message } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Ism va telefon majburiy" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("contacts")
      .insert([{ name, phone, email, company, service_type: serviceType, message }])
      .select()
      .single();

    if (error) throw error;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const dateStr = new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" });
      const text = [
        "🔔 <b>Yangi murojaat!</b>",
        "",
        `👤 <b>Ism:</b> ${escapeHtml(name)}`,
        `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>`,
        `📧 <b>Email:</b> ${email ? escapeHtml(email) : "—"}`,
        `🏢 <b>Kompaniya:</b> ${company ? escapeHtml(company) : "—"}`,
        `🔧 <b>Xizmat:</b> ${serviceType ? escapeHtml(serviceType) : "—"}`,
        `💬 <b>Xabar:</b> ${message ? escapeHtml(message) : "—"}`,
        "",
        `🕐 <b>Vaqt:</b> ${dateStr}`,
        `🆔 <b>ID:</b> #${data.id.slice(0, 8)}`,
        "",
        `<a href="https://pharmwaygroup.uz/admin/contacts">Admin panelda ko'rish →</a>`,
      ].join("\n");

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
