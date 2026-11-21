"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SESSION_KEY = "pw_sid";
const SESSION_TS_KEY = "pw_sid_ts";
const SESSION_IDLE_MS = 30 * 60 * 1000; // 30 daqiqa faolsizlikdan keyin yangi sessiya

function newId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Joriy sessiya ID'si; yangi sessiya boshlangan bo'lsa `entry: true`. */
function session(): { sid: string; entry: boolean } {
  try {
    const now = Date.now();
    const sid = sessionStorage.getItem(SESSION_KEY);
    const ts = Number(sessionStorage.getItem(SESSION_TS_KEY) || 0);
    if (sid && now - ts < SESSION_IDLE_MS) {
      sessionStorage.setItem(SESSION_TS_KEY, String(now));
      return { sid, entry: false };
    }
    const fresh = newId();
    sessionStorage.setItem(SESSION_KEY, fresh);
    sessionStorage.setItem(SESSION_TS_KEY, String(now));
    return { sid: fresh, entry: true };
  } catch {
    return { sid: newId(), entry: true };
  }
}

/**
 * Saytning har bir sahifa ko'rilishini o'z serverimizga (/api/track) yuboradi.
 * Cookie ishlatilmaydi, uchinchi tomonga hech narsa ketmaydi.
 */
export default function PageTracker({ locale }: { locale: string }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;

    // Sahifa sarlavhasi client navigatsiyadan keyin yangilanishi uchun biroz kutamiz.
    const timer = window.setTimeout(() => {
      lastPath.current = pathname;
      try {
        const { sid, entry } = session();
        const qs = new URLSearchParams(window.location.search);
        const body = JSON.stringify({
          path: pathname,
          locale,
          title: document.title,
          sid,
          entry,
          ref: entry ? document.referrer : "",
          utm_source: qs.get("utm_source"),
          utm_medium: qs.get("utm_medium"),
          utm_campaign: qs.get("utm_campaign"),
        });
        const blob = new Blob([body], { type: "application/json" });
        if (!navigator.sendBeacon?.("/api/track", blob)) {
          void fetch("/api/track", {
            method: "POST",
            body,
            keepalive: true,
            headers: { "content-type": "application/json" },
          }).catch(() => {});
        }
      } catch {
        // analitika hech qachon sahifani buzmasin
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [pathname, locale]);

  return null;
}
