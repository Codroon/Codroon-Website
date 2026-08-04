import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client. Bypasses RLS entirely and can read every lead.
 *
 * The `server-only` import above is load-bearing: it makes the build
 * fail if this module is ever pulled into a client component, which is
 * the one mistake that would put the key in a browser bundle.
 *
 * Used by the cron digests and nothing else — the estimators and the
 * lead route run on the anon key.
 */

let cached: SupabaseClient<Database> | null | undefined;

export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  cached =
    url && key
      ? createClient<Database>(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;

  return cached;
}

/**
 * Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Anything
 * without it is refused — these routes read the whole lead pipeline.
 * If CRON_SECRET is unset the routes refuse everything rather than
 * defaulting open.
 */
export function cronAuthorised(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}
