import { NextResponse } from "next/server";
import { simpleParser } from "mailparser";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { MAIL_USER, mailConfigured, withImap } from "@/lib/mail";
import { escapeTelegramHtml, sendTelegram } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SITE = "https://www.pharmway.uz";
const MIN_INTERVAL_MS = 45_000; // bir nechta cron/so'rov bir vaqtda kelsa ham takror ishlamasin
const MAX_PER_RUN = 15;

function dateStr(d: Date | undefined): string {
  return (d ?? new Date()).toLocaleString("ru-RU", { timeZone: "Asia/Tashkent", dateStyle: "short", timeStyle: "short" });
}

/**
 * cPanel cron har 2–5 daqiqada chaqiradi: info@pharmway.uz ga yangi kelgan xatlarni
 * Telegram guruhiga yuboradi. Maxfiy kalit talab qilinmaydi — so'rov faqat
 * "yangi xat bormi" tekshiruvini boshlaydi, takror yuborish UID orqali bloklanadi.
 */
export async function GET() {
  if (!mailConfigured()) return NextResponse.json({ ok: false, reason: "mail-not-configured" });

  const mailbox = MAIL_USER;
  const nowIso = new Date().toISOString();
  const cutoff = new Date(Date.now() - MIN_INTERVAL_MS).toISOString();

  // Holat qatorini "band" qilamiz (atomik): faqat oxirgi tekshiruvdan 45 s o'tgan bo'lsa.
  const { data: existing } = await supabaseAdmin.from("mail_state").select("*").eq("mailbox", mailbox).maybeSingle();
  if (!existing) {
    await supabaseAdmin.from("mail_state").insert({ mailbox, last_uid: 0, checked_at: null });
  }
  const { data: claimed, error: claimError } = await supabaseAdmin
    .from("mail_state")
    .update({ checked_at: nowIso })
    .eq("mailbox", mailbox)
    .or(`checked_at.is.null,checked_at.lt."${cutoff}"`)
    .select()
    .maybeSingle();
  if (claimError) return NextResponse.json({ ok: false, error: claimError.message }, { status: 500 });
  if (!claimed) return NextResponse.json({ ok: true, skipped: "too-soon" });

  try {
    const result = await withImap(async (client) => {
      const box = await client.mailboxOpen("INBOX", { readOnly: true });
      const uidValidity = Number(box.uidValidity);
      const lastUid = Number(claimed.last_uid ?? 0);

      // Birinchi ishga tushish (yoki papka qayta yaratilgan): eski xatlarni yubormaymiz.
      if (!claimed.uid_validity || Number(claimed.uid_validity) !== uidValidity) {
        const baseline = Math.max(0, box.uidNext - 1);
        await supabaseAdmin
          .from("mail_state")
          .update({ uid_validity: uidValidity, last_uid: baseline, last_error: null })
          .eq("mailbox", mailbox);
        return { baseline, sent: 0 };
      }

      if (box.uidNext - 1 <= lastUid) return { sent: 0 };

      const fresh: { uid: number; source: Buffer }[] = [];
      for await (const m of client.fetch(`${lastUid + 1}:*`, { uid: true, source: true }, { uid: true })) {
        if (m.uid > lastUid && m.source) fresh.push({ uid: m.uid, source: m.source });
      }
      fresh.sort((a, b) => a.uid - b.uid);

      let sent = 0;
      let newLast = lastUid;
      for (const m of fresh.slice(0, MAX_PER_RUN)) {
        const p = await simpleParser(m.source);
        const from = p.from?.value?.[0];
        const fromText = from ? (from.name ? `${from.name} <${from.address}>` : from.address ?? "") : "—";
        const files = p.attachments.filter((a) => !(a.related && a.contentId));
        const body = (p.text ?? "").replace(/\n{3,}/g, "\n\n").trim();
        const snippet = body.length > 900 ? `${body.slice(0, 900)}…` : body;

        const html = [
          `📧 <b>Yangi xat — ${escapeTelegramHtml(mailbox)}</b>`,
          "",
          `👤 <b>Kimdan:</b> ${escapeTelegramHtml(fromText)}`,
          `📝 <b>Mavzu:</b> ${escapeTelegramHtml(p.subject || "(mavzusiz)")}`,
          `🕐 <b>Vaqt:</b> ${escapeTelegramHtml(dateStr(p.date))}`,
          files.length
            ? `📎 <b>Ilovalar:</b> ${escapeTelegramHtml(files.map((f) => f.filename || "fayl").join(", ")).slice(0, 300)}`
            : "",
          "",
          snippet ? `<blockquote>${escapeTelegramHtml(snippet)}</blockquote>` : "<i>(matn yo'q)</i>",
          "",
          `🔗 <a href="${SITE}/admin/mail?uid=${m.uid}">Admin panelda ochish va javob yozish</a>`,
        ]
          .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
          .join("\n");

        const ok = await sendTelegram(html);
        if (!ok) throw new Error(`Telegram'ga yuborib bo'lmadi (UID ${m.uid})`);
        sent += 1;
        newLast = m.uid;
        await supabaseAdmin.from("mail_state").update({ last_uid: newLast, last_error: null }).eq("mailbox", mailbox);
      }
      return { sent, pending: Math.max(0, fresh.length - sent) };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabaseAdmin.from("mail_state").update({ last_error: message.slice(0, 500) }).eq("mailbox", mailbox);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
