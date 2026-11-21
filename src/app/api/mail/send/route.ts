import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { MailNotConfiguredError, sendMail } from "@/lib/mail";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;

/** "Ism <a@b.uz>, c@d.uz" kabi ro'yxatdan manzillarni ajratib tekshiradi. */
function addresses(raw: unknown): string[] | null {
  if (typeof raw !== "string" || !raw.trim()) return [];
  const parts = raw
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.match(/<([^>]+)>/)?.[1]?.trim() ?? p);
  return parts.every((p) => EMAIL_RE.test(p)) ? parts : null;
}

/** POST /api/mail/send { to, cc?, subject, text, inReplyTo?, references?, replyToUid?, replyFolder? } */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });

  const to = addresses(body.to);
  const cc = addresses(body.cc);
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 300) : "";
  const text = typeof body.text === "string" ? body.text.slice(0, 100_000) : "";

  if (!to || to.length === 0) return NextResponse.json({ error: "Qabul qiluvchi email manzili noto'g'ri" }, { status: 400 });
  if (cc === null) return NextResponse.json({ error: "Nusxa (CC) manzili noto'g'ri" }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Mavzu kiritilmagan" }, { status: 400 });
  if (!text.trim()) return NextResponse.json({ error: "Xat matni bo'sh" }, { status: 400 });

  try {
    const result = await sendMail({
      to: to.join(", "),
      cc: cc.join(", ") || undefined,
      subject,
      text,
      inReplyTo: typeof body.inReplyTo === "string" ? body.inReplyTo : null,
      references: Array.isArray(body.references) ? body.references.filter((r): r is string => typeof r === "string") : [],
      replyToUid: typeof body.replyToUid === "number" ? body.replyToUid : null,
      replyFolder: typeof body.replyFolder === "string" ? body.replyFolder : null,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    if (err instanceof MailNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Xatni yuborib bo'lmadi: ${message}` }, { status: 502 });
  }
}
