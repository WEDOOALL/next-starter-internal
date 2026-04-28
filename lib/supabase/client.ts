import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client — for Client Components.
 *
 * Uses anon key + RLS policies. Reads `supabase.<schema>` based on
 * `SUPABASE_SCHEMA` env var (set by FORGE provisioning).
 *
 * Usage in a "use client" component:
 *   const sb = createSupabaseBrowserClient();
 *   const { data } = await sb.from('my_table').select('*');
 */
export function createSupabaseBrowserClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  const schema = process.env["NEXT_PUBLIC_SUPABASE_SCHEMA"];

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — check .env.local",
    );
  }

  return createBrowserClient(url, anonKey, {
    db: schema ? { schema } : undefined,
  });
}
