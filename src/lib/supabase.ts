import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Admin layout renders this JSON tag with the server's runtime env. */
export const SUPABASE_PUBLIC_ENV_ID = "supabase-public-env";

type PublicEnv = { url?: string; anonKey?: string };

function readRuntimeEnv(): PublicEnv {
  if (typeof document === "undefined") return {};
  const el = document.getElementById(SUPABASE_PUBLIC_ENV_ID);
  if (!el?.textContent) return {};
  try {
    return JSON.parse(el.textContent) as PublicEnv;
  } catch {
    return {};
  }
}

let client: SupabaseClient | null = null;

/**
 * Browser client (stores the session in cookies so the middleware can read it).
 * URL/anon key come from the server at request time (hosting panel env vars),
 * falling back to values inlined at build — so the build does not need them.
 * Call it from effects/handlers, not at module load.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    const runtime = readRuntimeEnv();
    const url = runtime.url || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = runtime.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    client = createBrowserClient(url!, anonKey!);
  }
  return client;
}
