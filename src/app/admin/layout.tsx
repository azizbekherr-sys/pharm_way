import { Inter } from "next/font/google";
import "../globals.css";
import AdminShell from "@/components/admin/AdminShell";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.className}>
      <body className="bg-slate-50 text-slate-900">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
