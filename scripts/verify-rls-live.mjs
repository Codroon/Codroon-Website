/**
 * The same policy checks, run against the REAL Supabase project over
 * PostgREST with the anon key — the exact surface a browser has.
 *
 * scripts/verify-rls.mjs proves the SQL. This proves the HTTP layer on
 * top of it: that Supabase maps the anon key onto the `anon` role and
 * that PostgREST exposes nothing the policies deny.
 *
 * Uses plain fetch — no dependencies, nothing imported from the app.
 *
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
 *     node scripts/verify-rls-live.mjs
 *
 * or put them in .env.local and run:  node --env-file=.env.local scripts/verify-rls-live.mjs
 */

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Optional, cleanup only. The CHECKS always run as anon — that is the
// point of this script — but anon cannot delete its own test rows
// (DELETE is denied by design), so removal needs the service key.
const SVC_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "Set them in .env.local and run with:  node --env-file=.env.local scripts/verify-rls-live.mjs"
  );
  process.exit(2);
}

let fails = 0;
const ok = (label, pass, detail = "") => {
  if (!pass) fails++;
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
};

const rest = async (path, init = {}) => {
  const res = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { status: res.status, body };
};

const readable = (r) => r.status >= 200 && r.status < 300 && Array.isArray(r.body);

console.log("\n══ RLS VERIFICATION — live Supabase, anon key ══\n");

// A VALID six-character code from the allowed alphabet. The previous
// generation produced FOUR characters ("z" + slice(0,3)), which fails
// the short_code format in both the policy's WITH CHECK and the table
// constraint — and a WITH CHECK denial surfaces as the same
// 42501/HTTP 401 as a missing grant, which sent the 2026-08-04
// diagnosis chasing grants for what looked like one bug and was two.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const code = Array.from(
  { length: 6 },
  () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
).join("");
const created = await rest("estimates", {
  method: "POST",
  body: JSON.stringify({ short_code: code, tool: "mvp", answers: { industry: "b2b" } }),
});
ok("anon CAN insert an estimate", created.status === 201, `HTTP ${created.status}`);
const wroteEstimate = created.status === 201;

console.log("\n── the three required checks ──");

const allEstimates = await rest("estimates?select=*");
ok(
  "1. selecting all estimates FAILS",
  !readable(allEstimates) || allEstimates.body.length === 0,
  `HTTP ${allEstimates.status} ${JSON.stringify(allEstimates.body)?.slice(0, 80)}`
);

const allLeads = await rest("leads?select=*");
ok(
  "2. selecting all leads FAILS",
  !readable(allLeads) || allLeads.body.length === 0,
  `HTTP ${allLeads.status} ${JSON.stringify(allLeads.body)?.slice(0, 80)}`
);

const byCode = await rest("rpc/get_estimate", {
  method: "POST",
  body: JSON.stringify({ p_short_code: code }),
});
ok(
  "3. selecting a known short_code SUCCEEDS",
  byCode.status === 200 && Array.isArray(byCode.body) && byCode.body.length === 1,
  `HTTP ${byCode.status}, ${Array.isArray(byCode.body) ? byCode.body.length : "?"} row(s)`
);

console.log("\n── everything else anon must not do ──");

const filtered = await rest(`estimates?select=*&short_code=eq.${code}`);
ok(
  "direct table select by short_code still fails",
  !readable(filtered) || filtered.body.length === 0,
  `HTTP ${filtered.status}`
);

const patched = await rest("estimates?short_code=neq.zzzz", {
  method: "PATCH",
  body: JSON.stringify({ completed: true }),
});
ok("blanket UPDATE fails", patched.status >= 400, `HTTP ${patched.status}`);

const deleted = await rest("estimates?short_code=neq.zzzz", { method: "DELETE" });
ok("DELETE fails", deleted.status >= 400, `HTTP ${deleted.status}`);

const leadForge = await rest("leads", {
  method: "POST",
  body: JSON.stringify({ source: "estimator_quote", email: "x@y.z" }),
});
ok("cannot insert an estimator-sourced lead directly", leadForge.status >= 400, `HTTP ${leadForge.status}`);

// the run's code in the name makes this row uniquely identifiable, so
// cleanup can never touch a real lead
const leadMarker = `Live Check ${code}`;
const modalLead = await rest("leads", {
  method: "POST",
  body: JSON.stringify({ source: "modal_call", name: leadMarker, phone: "+10000000000" }),
});
ok("CAN insert a modal lead", modalLead.status === 201, `HTTP ${modalLead.status}`);
const wroteLead = modalLead.status === 201;

for (const v of [
  "v_estimate_funnel",
  "v_industry_breakdown",
  "v_value_distribution",
  "v_high_value_no_lead",
]) {
  const r = await rest(`${v}?select=*`);
  ok(`analytics view ${v} is invisible`, !readable(r) || r.body.length === 0, `HTTP ${r.status}`);
}

console.log(
  "\n" + (fails === 0 ? "ALL LIVE CHECKS PASS" : `${fails} LIVE CHECKS FAILED`) + "\n"
);

/* ---- cleanup — runs on pass AND fail ---------------------------------
   Removes exactly what this run created, nothing else: the estimate by
   its unique short code, the lead by its per-run marker. Anon cannot
   DELETE (by design — that denial is one of the checks above), so this
   uses the service key when available. Cleanup failure never changes
   the exit code: the verdict is the checks, not the housekeeping. */
{
  const wrote = [
    wroteEstimate ? `estimate ${code}` : null,
    wroteLead ? `modal_call lead "${leadMarker}"` : null,
  ].filter(Boolean);

  if (wrote.length === 0) {
    console.log("(no test rows were written, nothing to clean up)\n");
  } else if (!SVC_KEY) {
    console.log(
      `(SUPABASE_SERVICE_ROLE_KEY not set — left behind: ${wrote.join(", ")}. ` +
        "Set it in .env.local and re-run, or delete them from the dashboard.)\n"
    );
  } else {
    const svc = async (path, init = {}) => {
      const res = await fetch(`${URL_}/rest/v1/${path}`, {
        ...init,
        headers: {
          apikey: SVC_KEY,
          Authorization: `Bearer ${SVC_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          ...(init.headers ?? {}),
        },
      });
      let body = null;
      try {
        body = await res.json();
      } catch {}
      return { status: res.status, body };
    };
    try {
      let cleaned = [];
      if (wroteLead) {
        const r = await svc(
          `leads?source=eq.modal_call&name=eq.${encodeURIComponent(leadMarker)}`,
          { method: "DELETE" }
        );
        cleaned.push(`${Array.isArray(r.body) ? r.body.length : "?"} lead`);
      }
      if (wroteEstimate) {
        const r = await svc(`estimates?short_code=eq.${code}`, { method: "DELETE" });
        cleaned.push(`${Array.isArray(r.body) ? r.body.length : "?"} estimate`);
      }
      console.log(`(cleaned up test data: ${cleaned.join(", ")})\n`);
    } catch (err) {
      console.log(
        `(cleanup failed — left behind: ${wrote.join(", ")}. ${String(err).slice(0, 80)})\n`
      );
    }
  }
}

process.exit(fails === 0 ? 0 : 1);
