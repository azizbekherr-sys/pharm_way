import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * AHOST'dagi nginx (Engintron) so'rovida nomi "NO_CACHE" bo'lgan cookie bo'lsa,
 * keshni umuman chetlab o'tadi. Admin brauzeriga shu cookie qo'yiladi: admin
 * hech qachon keshdagi eski javobni olmaydi va eski yozuvlarni (deploy'dan
 * oldin keshga tushib qolgan API javoblarini) o'z so'rovlari bilan tirik
 * ushlab turmaydi — ular nginx'da 12 soatdan keyin o'chadi.
 */
function bypassProxyCache(request: NextRequest, response: NextResponse) {
  if (request.cookies.get("NO_CACHE")?.value !== "1") {
    response.cookies.set("NO_CACHE", "1", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return bypassProxyCache(request, NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    const response = bypassProxyCache(request, NextResponse.next());

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // getClaims() sessiya tokenining imzosini shu yerning o'zida (Supabase'ning
    // ochiq ES256 kaliti bilan) tekshiradi. getUser() esa har so'rovda Supabase
    // serveriga borib kelardi va admin paneldagi har bir o'tishga ~0,3 s qo'shardi.
    const { data } = await supabase.auth.getClaims();

    if (!data?.claims) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return response;
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname === "/og-image") {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/(uz|ru|en)/:path*",
    "/admin/:path*",
    "/((?!api|og-image|_next|.*\\..*).*)",
  ],
};
