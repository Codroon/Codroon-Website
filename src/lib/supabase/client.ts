import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * The Supabase client, anon key only.
 *
 * This module is safe on both sides of the client boundary: it never
 * touches SUPABASE_SERVICE_ROLE_KEY. The service key bypasses RLS and
 * can read every lead, so it exists purely for dashboard and analytics
 * access and is never imported by application code.
 *
 * Returns null when the environment is not configured, which is the
 * normal state in local development and before the live RLS gate has
 * been run against a real project. Every caller must treat a null
 * client as "persistence is off" and carry on — the estimators run
 * entirely from URL state and must never depend on a database.
 */

let cached: SupabaseClient<Database> | null | undefined;

export function getSupabase(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  cached =
    url && key
      ? createClient<Database>(url, key, {
          auth: {
            // Anonymous throughout: no identity is ever attached to an
            // estimate, and there is no session to keep. This also
            // keeps the client away from browser storage entirely.
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        })
      : null;

  return cached;
}

/** True when writes will actually go somewhere. */
export const persistenceEnabled = () => getSupabase() !== null;
