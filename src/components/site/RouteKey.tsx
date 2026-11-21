"use client";

import { usePathname } from "next/navigation";
import { Fragment, type ReactNode } from "react";

/**
 * Har bir sahifa (va til) almashganda view'ni qaytadan mount qiladi: dizayn effektlari
 * DOM'ga klass/uslub qo'shadi, eski tugunlar React tomonidan qayta ishlatilmasin.
 */
export default function RouteKey({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <Fragment key={pathname}>{children}</Fragment>;
}
