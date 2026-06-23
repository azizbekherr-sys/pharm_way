"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Handshake,
  Settings,
  HelpCircle,
  BarChart3,
  LogOut,
  Bell,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/contacts", label: "Murojaatlar", icon: MessageSquare, badge: "newContacts" as const },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/partners", label: "Hamkorlar", icon: Handshake },
  { href: "/admin/services", label: "Xizmatlar", icon: Settings },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/stats", label: "Statistika", icon: BarChart3 },
];

const WEEKDAYS = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
  "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];

function formatUzDate(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${WEEKDAYS[date.getDay()]}`;
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [newContacts, setNewContacts] = useState(0);
  const [email, setEmail] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(formatUzDate(new Date()));
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNewContacts(data.filter((c) => c.status === "new").length);
      })
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const activeItem = NAV_ITEMS.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  );
  const pageTitle = activeItem?.label ?? "Dashboard";
  const initials = email ? email.slice(0, 2).toUpperCase() : "AD";

  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col bg-primary-600">
        <div className="border-b border-white/[0.08] px-5 py-5">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">PW</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white">
              Admin Panel
            </span>
          </div>
          <div className="mt-1 text-[11px] tracking-[0.15em] text-white/60">PHARM WAY</div>
        </div>

        <div className="px-5 pb-2 pt-4 text-[10px] font-medium tracking-[0.1em] text-white/40">
          ASOSIY
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const badgeCount = item.badge === "newContacts" ? newContacts : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group mx-1 flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] font-medium transition-colors duration-150 ${
                  isActive
                    ? "border-l-[3px] border-cyan-500 bg-white/[0.12] text-white"
                    : "border-l-[3px] border-transparent text-white/75 hover:bg-white/[0.08]"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-white/60"} />
                <span className="flex-1">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="rounded-full bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-3">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white">{email || "Admin"}</p>
              <span className="text-[10px] text-white/50">Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-4 py-2.5 text-[13px] font-medium text-red-200 transition-colors duration-150 hover:bg-red-500/15 active:scale-[0.99]"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      <div className="ml-[260px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h1 className="text-[18px] font-semibold text-slate-900">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-slate-500">{today}</span>
            <button className="text-slate-400 transition-colors hover:text-slate-600">
              <Bell size={18} />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
              {initials}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1400px] p-8">{children}</main>
      </div>
    </div>
  );
}
