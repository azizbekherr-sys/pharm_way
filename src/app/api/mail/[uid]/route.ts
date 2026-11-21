import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAttachment, getMessage, setSeen, trashMessage, withImap } from "@/lib/mail";

export const dynamic = "force-dynamic";

function parseUid(raw: string): number | null {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function fail(err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  return NextResponse.json({ error: `Pochta serveri xatosi: ${message}` }, { status: 502 });
}

/**
 * GET  /api/mail/123?folder=INBOX            — xatni to'liq ochish (o'qilgan deb belgilanadi)
 * GET  /api/mail/123?folder=INBOX&att=0      — ilovani yuklab olish
 */
export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const uid = parseUid(params.uid);
  if (!uid) return NextResponse.json({ error: "Noto'g'ri UID" }, { status: 400 });
  const folder = req.nextUrl.searchParams.get("folder") || "INBOX";
  const att = req.nextUrl.searchParams.get("att");

  try {
    if (att !== null) {
      const file = await withImap((c) => getAttachment(c, folder, uid, Number(att)));
      if (!file) return NextResponse.json({ error: "Ilova topilmadi" }, { status: 404 });
      const inline = req.nextUrl.searchParams.get("inline") === "1";
      return new NextResponse(new Uint8Array(file.content), {
        headers: {
          "content-type": file.contentType || "application/octet-stream",
          "content-disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
          "cache-control": "private, no-store",
          "x-content-type-options": "nosniff",
        },
      });
    }

    const message = await withImap((c) => getMessage(c, folder, uid));
    if (!message) return NextResponse.json({ error: "Xat topilmadi" }, { status: 404 });
    return NextResponse.json(message);
  } catch (err) {
    return fail(err);
  }
}

/** PATCH /api/mail/123  { folder, seen: boolean } — o'qilgan / o'qilmagan */
export async function PATCH(req: NextRequest, { params }: { params: { uid: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const uid = parseUid(params.uid);
  if (!uid) return NextResponse.json({ error: "Noto'g'ri UID" }, { status: 400 });
  const body = (await req.json().catch(() => ({}))) as { folder?: string; seen?: boolean };
  try {
    await withImap((c) => setSeen(c, body.folder || "INBOX", uid, body.seen !== false));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}

/** DELETE /api/mail/123?folder=INBOX — Savatga ko'chirish */
export async function DELETE(req: NextRequest, { params }: { params: { uid: string } }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const uid = parseUid(params.uid);
  if (!uid) return NextResponse.json({ error: "Noto'g'ri UID" }, { status: 400 });
  const folder = req.nextUrl.searchParams.get("folder") || "INBOX";
  try {
    await withImap((c) => trashMessage(c, folder, uid));
    return NextResponse.json({ ok: true });
  } catch (err) {
    return fail(err);
  }
}
