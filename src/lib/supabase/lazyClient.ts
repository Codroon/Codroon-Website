import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * The browser's Supabase client, loaded on first write.
 *
 * WHY A SECOND MODULE. ./client statically imports @supabase/supabase-js,
 * so every bundle that touches it ships the whole library whether or not
 * a client is ever constructed. The estimator pages import it through
 * useEstimatorFlow, which put the full client in their initial payload
 * where it sat 99.95% unused at load (client, 2026-08-09): nothing is
 * written until the visitor answers a question, and most sessions on the
 * landing pages never do.
 *
 * The import below is dynamic and the two imports above are type-only,
 * so they are erased at compile time and this module adds nothing to the
 * initial bundle. The library arrives with the first write instead.
 *
 * ./client stays as it is for the API route: on the server the bundle
 * cost is irrelevant and a synchronous getter is easier to read.
 *
 * Same contract as ./client: null means persistence is off, and every
 * caller must carry on regardless. The estimators run entirely from URL
 * state and must never depend on a database.
 */

let cached: SupabaseClient<Database> | null | undefined;
let inFlight: Promise<SupabaseClient<Database> | null> | undefined;

export function getSupabaseLazy(): Promise<SupabaseClient<Database> | null> {
  if (cached !== undefined) return Promise.resolve(cached);
  // Answers can fire several writes in quick succession; without this
  // they would each start their own import of the library.
  if (inFlight) return inFlight;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    cached = null;
    return Promise.resolve(null);
  }

  inFlight = import("@supabase/supabase-js")
    .then(({ createClient }) => {
      cached = createClient<Database>(url, key, {
        auth: {
          // Anonymous throughout: no identity is ever attached to an
          // estimate, and there is no session to keep. This also keeps
          // the client away from browser storage entirely.
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
      return cached;
    })
    .catch(() => {
      // A failed chunk load must not break the estimator, only
      // persistence. Left uncached so a later write can retry.
      inFlight = undefined;
      return null;
    });

  return inFlight;
}
