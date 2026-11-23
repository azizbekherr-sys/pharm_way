import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function isAdminAuthenticated() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  // Token imzosi mahalliy tekshiriladi (middleware.ts dagi izohga qarang).
  const { data } = await supabase.auth.getClaims();
  return !!data?.claims;
}
