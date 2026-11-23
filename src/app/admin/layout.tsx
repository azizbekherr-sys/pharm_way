import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AdminShell from "@/components/admin/AdminShell";
import { SUPABASE_PUBLIC_ENV_ID } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Rendered per request so the Supabase public config below comes from the
// server's runtime env (hosting panel), not from build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // Saytning manifest.webmanifest havolasi admin sahifalariga kerak emas:
  // brauzer uni har bir bo'limga o'tishda qayta so'rab, serverni band qilardi.
  manifest: null,
  robots: { index: false, follow: false },
};

function publicEnvJson(): string {
  return JSON.stringify({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  }).replace(/</g, "\\u003c");
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.className}>
      <body className="bg-slate-50 text-slate-900">
        <script
          id={SUPABASE_PUBLIC_ENV_ID}
          type="application/json"
          dangerouslySetInnerHTML={{ __html: publicEnvJson() }}
        />
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
