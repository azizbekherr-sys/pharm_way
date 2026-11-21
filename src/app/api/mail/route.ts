import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { MAIL_USER, MailNotConfiguredError, listFolders, listMessages, mailConfigured, unseenCount, withImap } from "@/lib/mail";

export const dynamic = "force-dynamic";

function mailError(err: unknown) {
  if (err instanceof MailNotConfiguredError) {
    return NextResponse.json({ configured: false, mailbox: MAIL_USER }, { status: 200 });
  }
  const message = err instanceof Error ? err.message : String(err);
  const auth = /auth|login|credentials|password/i.test(message);
  return NextResponse.json(
    { error: auth ? "Pochtaga kirib bo'lmadi: login yoki parol noto'g'ri" : `Pochta serveri xatosi: ${message}` },
    { status: 502 },
  );
}

/**
 * GET /api/mail?folder=INBOX&page=1&q=...   — xatlar ro'yxati (+ papkalar)
 * GET /api/mail?unread=1                    — faqat o'qilmaganlar soni (menyu nishoni uchun)
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!mailConfigured()) return NextResponse.json({ configured: false, mailbox: MAIL_USER });

  const sp = req.nextUrl.searchParams;
  try {
    if (sp.get("unread")) {
      const unread = await withImap((c) => unseenCount(c));
      return NextResponse.json({ configured: true, unread });
    }
    const folder = sp.get("folder") || "INBOX";
    const page = Math.max(1, Number(sp.get("page")) || 1);
    const query = (sp.get("q") || "").trim().slice(0, 100) || undefined;
    const data = await withImap(async (c) => {
      const folders = await listFolders(c);
      const list = await listMessages(c, folder, { page, pageSize: 40, query });
      return { folders, ...list };
    });
    return NextResponse.json({ configured: true, mailbox: MAIL_USER, folder, page, pageSize: 40, ...data });
  } catch (err) {
    return mailError(err);
  }
}
