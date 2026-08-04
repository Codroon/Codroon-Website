import { getSupabase } from "./client";
import type { EstimateRow, LeadSource, ToolKey } from "./types";

/**
 * Persistence for the estimators.
 *
 * EVERY function here is fire-and-forget. A database that is down,
 * misconfigured, blocked by an extension or simply absent must never
 * block the UI, surface an error, or change what the visitor sees. The
 * estimators compute entirely from URL state; this is a durable mirror
 * of that state, never its source.
 *
 * That is also why the whole module no-ops when the environment is
 * unset: the tools work today, and persistence lights up when the
 * credentials land — after scripts/verify-rls-live.mjs has passed
 * against the real project.
 */

/* ------------------------------------------------------------------
   short codes
   ------------------------------------------------------------------ */

/** Lowercase alphanumeric minus 0/o/1/l/i — readable down a phone. */
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const CODE_LENGTH = 6; // 31^6 = 887,503,681
const MAX_ATTEMPTS = 5;

/** Postgres unique-violation. */
const UNIQUE_VIOLATION = "23505";

export function generateShortCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export const isShortCode = (v: string): boolean =>
  new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`).test(v);

/* ------------------------------------------------------------------
   writes
   ------------------------------------------------------------------ */

/**
 * Create the row. Retries on a code collision, then gives up quietly.
 * Returns the code that was actually used, or null if nothing was
 * written — callers keep the code they generated either way, because
 * it is already in the URL and the flow must not depend on the write.
 */
export async function createEstimate(
  tool: ToolKey,
  shortCode: string,
  answers: Record<string, unknown>
): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  let code = shortCode;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const { error } = await supabase
      .from("estimates")
      .insert({ short_code: code, tool, answers });

    if (!error) return code;
    if (error.code !== UNIQUE_VIOLATION) return null; // quiet failure
    code = generateShortCode();
  }
  return null;
}

export async function updateEstimate(
  shortCode: string,
  patch: {
    answers?: Record<string, unknown>;
    computed?: Record<string, unknown> | null;
    completed?: boolean;
  }
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.rpc("update_estimate", {
    p_short_code: shortCode,
    p_answers: patch.answers ?? null,
    p_computed: patch.computed ?? null,
    p_completed: patch.completed ?? null,
  });
}

/** Reads one estimate by its code. The only anon-reachable read. */
export async function fetchEstimate(
  shortCode: string
): Promise<EstimateRow | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_estimate", {
    p_short_code: shortCode,
  });
  if (error || !data || data.length === 0) return null;
  return data[0] as EstimateRow;
}

/**
 * Lead capture. Modal sources insert directly; estimator sources go
 * through create_lead() so the estimate is resolved from its code
 * server-side. Used by the next prompt's contact wiring.
 */
export async function createLead(input: {
  source: LeadSource;
  shortCode?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
}): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.rpc("create_lead", {
    p_source: input.source,
    p_short_code: input.shortCode ?? null,
    p_name: input.name ?? null,
    p_email: input.email ?? null,
    p_phone: input.phone ?? null,
    p_message: input.message ?? null,
  });
}

/* ------------------------------------------------------------------
   fire-and-forget wrapper
   ------------------------------------------------------------------ */

/**
 * Runs a write and swallows everything — rejected promises, thrown
 * errors, network failures. Nothing here reaches the UI or the console
 * in production; a broken database is invisible to the visitor.
 */
export function fireAndForget(run: () => Promise<unknown>): void {
  try {
    void run().catch((e) => {
      if (process.env.NODE_ENV === "development") {
        console.debug("[estimate persistence] write failed (ignored):", e);
      }
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[estimate persistence] write threw (ignored):", e);
    }
  }
}
