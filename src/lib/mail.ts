import "server-only";
import { ImapFlow, type ListResponse, type MessageAddressObject, type MessageStructureObject } from "imapflow";
import { simpleParser, type AddressObject } from "mailparser";
import nodemailer from "nodemailer";
import MailComposer from "nodemailer/lib/mail-composer";

/**
 * info@pharmway.uz pochtasi (Webspace / sayt.uz serveri) bilan ishlash.
 *
 * Sozlash (cPanel → Node.js App → Environment variables):
 *   MAIL_USER       info@pharmway.uz
 *   MAIL_PASSWORD   pochta qutisi paroli
 *   MAIL_HOST       ns9.sayt.uz (ixtiyoriy; mail.pharmway.uz shu serverga qaraydi,
 *                   lekin TLS sertifikati ns9.sayt.uz nomiga berilgan)
 *   MAIL_IMAP_PORT  993 (ixtiyoriy)
 *   MAIL_SMTP_PORT  465 (ixtiyoriy)
 */

const HOST = process.env.MAIL_HOST || "ns9.sayt.uz";
const IMAP_PORT = Number(process.env.MAIL_IMAP_PORT || 993);
const SMTP_PORT = Number(process.env.MAIL_SMTP_PORT || 465);

export const MAIL_USER = process.env.MAIL_USER || "info@pharmway.uz";

export function mailConfigured(): boolean {
  return Boolean(process.env.MAIL_PASSWORD);
}

export class MailNotConfiguredError extends Error {
  constructor() {
    super("Pochta sozlanmagan: MAIL_PASSWORD kiritilmagan");
  }
}

function imapClient(): ImapFlow {
  return new ImapFlow({
    host: HOST,
    port: IMAP_PORT,
    secure: IMAP_PORT === 993,
    auth: { user: MAIL_USER, pass: process.env.MAIL_PASSWORD ?? "" },
    logger: false,
    emitLogs: false,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 60_000,
  });
}

/** IMAP ulanishini ochib, ishni bajarib, albatta yopadi. */
export async function withImap<T>(fn: (client: ImapFlow) => Promise<T>): Promise<T> {
  if (!mailConfigured()) throw new MailNotConfiguredError();
  const client = imapClient();
  client.on("error", () => {
    // ulanish xatolari pastdagi await orqali qaytadi
  });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.logout().catch(() => client.close());
  }
}

// ---- Papkalar -------------------------------------------------------------

export type Folder = { path: string; name: string; special: string | null; unseen: number; total: number };

const SPECIAL_ORDER = ["\\Inbox", "\\Sent", "\\Drafts", "\\Junk", "\\Trash", "\\Archive"];

function specialOf(box: ListResponse): string | null {
  if (box.path.toUpperCase() === "INBOX") return "\\Inbox";
  return box.specialUse ?? null;
}

export async function listFolders(client: ImapFlow): Promise<Folder[]> {
  const boxes = await client.list({ statusQuery: { unseen: true, messages: true } });
  return boxes
    .filter((b) => !b.flags.has("\\Noselect"))
    .map((b) => ({
      path: b.path,
      name: b.name,
      special: specialOf(b),
      unseen: b.status?.unseen ?? 0,
      total: b.status?.messages ?? 0,
    }))
    .sort((a, b) => {
      const ia = a.special ? SPECIAL_ORDER.indexOf(a.special) : 99;
      const ib = b.special ? SPECIAL_ORDER.indexOf(b.special) : 99;
      return (ia === -1 ? 98 : ia) - (ib === -1 ? 98 : ib) || a.name.localeCompare(b.name);
    });
}

export async function findSpecialFolder(client: ImapFlow, special: string): Promise<string | null> {
  const boxes = await client.list();
  return boxes.find((b) => b.specialUse === special)?.path ?? null;
}

// ---- Xatlar ro'yxati ------------------------------------------------------

export type Address = { name: string; address: string };

export type MessageSummary = {
  uid: number;
  subject: string;
  from: Address[];
  to: Address[];
  date: string | null;
  seen: boolean;
  flagged: boolean;
  answered: boolean;
  hasAttachments: boolean;
  size: number;
};

function addr(list?: MessageAddressObject[]): Address[] {
  return (list ?? []).map((a) => ({ name: a.name ?? "", address: a.address ?? "" }));
}

function hasAttachment(node?: MessageStructureObject): boolean {
  if (!node) return false;
  if (node.disposition === "attachment") return true;
  if (node.disposition === "inline" && node.dispositionParameters?.filename && !node.type.startsWith("text/")) return true;
  return (node.childNodes ?? []).some(hasAttachment);
}

export async function listMessages(
  client: ImapFlow,
  folder: string,
  opts: { page: number; pageSize: number; query?: string },
): Promise<{ total: number; messages: MessageSummary[] }> {
  const lock = await client.getMailboxLock(folder, { readOnly: true });
  try {
    let uids: number[];
    if (opts.query) {
      const q = opts.query;
      const found = await client.search({ or: [{ subject: q }, { from: q }, { to: q }, { body: q }] }, { uid: true });
      uids = (found || []).sort((a, b) => b - a);
    } else {
      const all = await client.search({ all: true }, { uid: true });
      uids = (all || []).sort((a, b) => b - a);
    }
    const total = uids.length;
    const slice = uids.slice((opts.page - 1) * opts.pageSize, opts.page * opts.pageSize);
    if (slice.length === 0) return { total, messages: [] };

    const messages: MessageSummary[] = [];
    for await (const m of client.fetch(
      slice,
      { uid: true, envelope: true, flags: true, bodyStructure: true, size: true, internalDate: true },
      { uid: true },
    )) {
      const date = m.envelope?.date ?? (m.internalDate instanceof Date ? m.internalDate : null);
      messages.push({
        uid: m.uid,
        subject: m.envelope?.subject ?? "",
        from: addr(m.envelope?.from),
        to: addr(m.envelope?.to),
        date: date ? new Date(date).toISOString() : null,
        seen: m.flags?.has("\\Seen") ?? false,
        flagged: m.flags?.has("\\Flagged") ?? false,
        answered: m.flags?.has("\\Answered") ?? false,
        hasAttachments: hasAttachment(m.bodyStructure),
        size: m.size ?? 0,
      });
    }
    messages.sort((a, b) => b.uid - a.uid);
    return { total, messages };
  } finally {
    lock.release();
  }
}

// ---- Bitta xat ------------------------------------------------------------

export type AttachmentInfo = { index: number; filename: string; contentType: string; size: number };

export type FullMessage = {
  uid: number;
  folder: string;
  subject: string;
  from: Address[];
  to: Address[];
  cc: Address[];
  replyTo: Address[];
  date: string | null;
  messageId: string | null;
  references: string[];
  html: string | null;
  text: string;
  attachments: AttachmentInfo[];
  seen: boolean;
};

function parsedAddr(a?: AddressObject | AddressObject[]): Address[] {
  const list = Array.isArray(a) ? a : a ? [a] : [];
  return list.flatMap((o) => o.value.map((v) => ({ name: v.name ?? "", address: v.address ?? "" })));
}

async function fetchSource(client: ImapFlow, uid: number): Promise<{ source: Buffer; seen: boolean } | null> {
  const msg = await client.fetchOne(String(uid), { uid: true, source: true, flags: true }, { uid: true });
  if (!msg || !msg.source) return null;
  return { source: msg.source, seen: msg.flags?.has("\\Seen") ?? false };
}

export async function getMessage(client: ImapFlow, folder: string, uid: number, markSeen = true): Promise<FullMessage | null> {
  const lock = await client.getMailboxLock(folder);
  try {
    const raw = await fetchSource(client, uid);
    if (!raw) return null;
    const parsed = await simpleParser(raw.source);
    if (markSeen && !raw.seen) {
      await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true }).catch(() => false);
    }
    const refs = parsed.references;
    // Ichki (cid) rasmlar mailparser tomonidan data: URL'ga aylantirilgan — ro'yxatda faqat haqiqiy ilovalar.
    const attachments = parsed.attachments
      .map((a, index) => ({ a, index }))
      .filter(({ a }) => !(a.related && a.contentId))
      .map(({ a, index }) => ({
        index,
        filename: a.filename || `ilova-${index + 1}`,
        contentType: a.contentType,
        size: a.size,
      }));
    return {
      uid,
      folder,
      subject: parsed.subject ?? "",
      from: parsedAddr(parsed.from),
      to: parsedAddr(parsed.to),
      cc: parsedAddr(parsed.cc),
      replyTo: parsedAddr(parsed.replyTo),
      date: parsed.date ? parsed.date.toISOString() : null,
      messageId: parsed.messageId ?? null,
      references: Array.isArray(refs) ? refs : refs ? [refs] : [],
      html: typeof parsed.html === "string" ? parsed.html : null,
      text: parsed.text ?? "",
      attachments,
      seen: true,
    };
  } finally {
    lock.release();
  }
}

export async function getAttachment(
  client: ImapFlow,
  folder: string,
  uid: number,
  index: number,
): Promise<{ filename: string; contentType: string; content: Buffer } | null> {
  const lock = await client.getMailboxLock(folder, { readOnly: true });
  try {
    const raw = await fetchSource(client, uid);
    if (!raw) return null;
    const parsed = await simpleParser(raw.source);
    const a = parsed.attachments[index];
    if (!a) return null;
    return { filename: a.filename || `ilova-${index + 1}`, contentType: a.contentType, content: a.content };
  } finally {
    lock.release();
  }
}

export async function setSeen(client: ImapFlow, folder: string, uid: number, seen: boolean): Promise<void> {
  const lock = await client.getMailboxLock(folder);
  try {
    if (seen) await client.messageFlagsAdd(String(uid), ["\\Seen"], { uid: true });
    else await client.messageFlagsRemove(String(uid), ["\\Seen"], { uid: true });
  } finally {
    lock.release();
  }
}

/** Xatni Savatga (Trash) ko'chiradi; Savatning o'zida bo'lsa — butunlay o'chiradi. */
export async function trashMessage(client: ImapFlow, folder: string, uid: number): Promise<void> {
  const trash = await findSpecialFolder(client, "\\Trash");
  const lock = await client.getMailboxLock(folder);
  try {
    if (trash && trash !== folder) await client.messageMove(String(uid), trash, { uid: true });
    else await client.messageDelete(String(uid), { uid: true });
  } finally {
    lock.release();
  }
}

export async function unseenCount(client: ImapFlow): Promise<number> {
  const st = await client.status("INBOX", { unseen: true });
  return st.unseen ?? 0;
}

// ---- Yuborish -------------------------------------------------------------

export type OutgoingMail = {
  to: string;
  cc?: string;
  subject: string;
  text: string;
  inReplyTo?: string | null;
  references?: string[];
  replyToUid?: number | null;
  replyFolder?: string | null;
};

const FROM_NAME = "Pharm Way Group";

export async function sendMail(mail: OutgoingMail): Promise<{ messageId: string }> {
  if (!mailConfigured()) throw new MailNotConfiguredError();

  const message = {
    from: { name: FROM_NAME, address: MAIL_USER },
    to: mail.to,
    cc: mail.cc || undefined,
    subject: mail.subject,
    text: mail.text,
    inReplyTo: mail.inReplyTo || undefined,
    references: mail.references?.length ? mail.references : undefined,
  };

  const transport = nodemailer.createTransport({
    host: HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: MAIL_USER, pass: process.env.MAIL_PASSWORD ?? "" },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
  });
  const info = await transport.sendMail(message);

  // Yuborilgan xat nusxasini "Yuborilganlar" papkasiga qo'yamiz va asl xatga "javob berildi" belgisi.
  try {
    const raw = await new MailComposer({ ...message, messageId: info.messageId }).compile().build();
    await withImap(async (client) => {
      const sent = await findSpecialFolder(client, "\\Sent");
      if (sent) await client.append(sent, raw, ["\\Seen"]);
      if (mail.replyToUid && mail.replyFolder) {
        const lock = await client.getMailboxLock(mail.replyFolder);
        try {
          await client.messageFlagsAdd(String(mail.replyToUid), ["\\Answered"], { uid: true });
        } finally {
          lock.release();
        }
      }
    });
  } catch {
    // xat baribir yuborilgan — nusxa saqlanmasa ham xato qaytarmaymiz
  }

  return { messageId: info.messageId };
}

// ---- Matn yordamchilari ---------------------------------------------------

export function formatAddress(a: Address): string {
  return a.name ? `${a.name} <${a.address}>` : a.address;
}
