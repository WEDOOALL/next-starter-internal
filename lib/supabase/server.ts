import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client — for Server Components, Server Actions,
 * Route Handlers, and Edge Functions wrappers.
 *
 * Reads cookies from the request to maintain user session (when Supabase Auth
 * is used). For internal apps using CF Access only, the session is empty and
 * RLS policies should rely on the CF JWT email claim instead.
 *
 * Use SERVICE_ROLE_KEY (admin) for backend mutations that need to bypass RLS.
 * Use ANON_KEY (default below) for normal queries respecting RLS.
 */
export async function createSupabaseServerClient(
  options: { admin?: boolean } = {},
) {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  const schema = process.env["SUPABASE_SCHEMA"];

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — check .env.local",
    );
  }
  if (options.admin && !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY — required for admin client. Check .env.local",
    );
  }

  const cookieStore = await cookies();
  const key = options.admin ? serviceRoleKey! : anonKey;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
        try {
          cookiesToSet.forEach(({ name, value, options: opts }) =>
            cookieStore.set(name, value, opts),
          );
        } catch {
          // Server Components cannot set cookies — silently ignore
          // (cookies will be set by middleware on next request)
        }
      },
    },
    db: schema ? { schema } : undefined,
  });
}
