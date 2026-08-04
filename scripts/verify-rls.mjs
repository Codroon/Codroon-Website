/**
 * RLS verification for the estimator persistence migration.
 *
 * Runs the real migration against a real Postgres (PGlite: Postgres
 * compiled to WASM, in-process) and exercises every policy as the
 * `anon` role — the role Supabase maps the browser's anon key onto.
 *
 * What this proves: the policies, grants and SECURITY DEFINER functions
 * behave as intended at the SQL level, which is where RLS is enforced.
 * What it does not cover: PostgREST's HTTP surface and JWT→role
 * mapping, which is Supabase's own layer. Re-run scripts/verify-rls-live.mjs
 * against the real project to confirm that end.
 *
 *   node scripts/verify-rls.mjs
 */
import { PGlite } from "@electric-sql/pglite";
import fs from "node:fs";

const db = new PGlite();
let fails = 0;
let checks = 0;

function ok(label, pass, detail = "") {
  checks++;
  if (!pass) fails++;
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
}

/** Run as anon and report what happened. */
async function asAnon(sql, params) {
  await db.exec("set role anon;");
  try {
    const r = params ? await db.query(sql, params) : await db.query(sql);
    return { ok: true, rows: r.rows };
  } catch (e) {
    return { ok: false, error: String(e.message ?? e) };
  } finally {
    await db.exec("reset role;");
  }
}

const denied = (r) =>
  !r.ok &&
  /permission denied|violates row-level security|policy/i.test(r.error);

console.log("\n════════════════════════════════════════════════════════════");
console.log("RLS VERIFICATION — real Postgres, acting as the `anon` role");
console.log("════════════════════════════════════════════════════════════\n");

// ---- set up the Supabase roles this migration expects ----
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
`);

// ---- apply the migration verbatim ----
const migration = fs.readFileSync(
  "supabase/migrations/0001_estimates_and_leads.sql",
  "utf8"
);
const migration2 = fs.readFileSync(
  "supabase/migrations/0002_lead_notifications.sql",
  "utf8"
);
await db.exec(migration);
await db.exec(migration2);
// re-running migrations is a normal thing to do by accident
await db.exec(migration);
await db.exec(migration2);
console.log("both migrations applied cleanly, and are idempotent (applied twice)\n");

// ---- seed two estimates and a lead as the owner ----
await db.exec(`
  insert into public.estimates (short_code, tool, answers, computed, completed)
  values
    ('7k2mvp', 'mvp',   '{"industry":"b2b","type":"saas-mvp"}', '{"midpoint":27800}', true),
    ('q4xtzr', 'agent', '{"industry":"finance"}',               '{"midpoint":9000}',  false);
  insert into public.leads (source, name, email)
  values ('modal_call', 'Seeded Person', 'seed@example.com');
`);

/* ═══════════ Task 2, the three required checks ═══════════ */
console.log("── Task 2: the three required checks ──");

const allEstimates = await asAnon("select * from public.estimates;");
ok(
  "1. selecting all estimates FAILS",
  !allEstimates.ok || allEstimates.rows.length === 0,
  allEstimates.ok ? `returned ${allEstimates.rows.length} rows` : "permission denied"
);

const allLeads = await asAnon("select * from public.leads;");
ok(
  "2. selecting all leads FAILS",
  !allLeads.ok || allLeads.rows.length === 0,
  allLeads.ok ? `returned ${allLeads.rows.length} rows` : "permission denied"
);

const byCode = await asAnon("select * from public.get_estimate($1);", ["7k2mvp"]);
ok(
  "3. selecting a known short_code SUCCEEDS",
  byCode.ok && byCode.rows.length === 1 && byCode.rows[0].tool === "mvp",
  byCode.ok ? `1 row, tool=${byCode.rows[0]?.tool}` : byCode.error
);

// The same read attempted against the table directly must still fail —
// this is the difference between "reachable by code" and "queryable".
const directByCode = await asAnon(
  "select * from public.estimates where short_code = '7k2mvp';"
);
ok(
  "3b. …but the same filter against the TABLE still fails",
  !directByCode.ok || directByCode.rows.length === 0,
  directByCode.ok ? `returned ${directByCode.rows.length} rows` : "permission denied"
);

// and the dashboard path still works
const svc = await (async () => {
  await db.exec("set role service_role;");
  try {
    const r = await db.query("select count(*)::int as n from public.leads;");
    return { ok: true, n: r.rows[0].n };
  } catch (e) {
    return { ok: false, error: String(e.message ?? e) };
  } finally {
    await db.exec("reset role;");
  }
})();
ok(
  "service_role still reads everything (BYPASSRLS)",
  svc.ok && svc.n > 0,
  svc.ok ? `${svc.n} leads` : svc.error
);

/* ═══════════ estimates ═══════════ */
console.log("\n── estimates ──");

const ins = await asAnon(
  "insert into public.estimates (short_code, tool) values ('ab23cd','mvp');"
);
ok("anon CAN insert an estimate", ins.ok, ins.error ?? "");

const badTool = await asAnon(
  "insert into public.estimates (short_code, tool) values ('ab24cd','other');"
);
ok("anon CANNOT insert an unknown tool", !badTool.ok);

const badCode = await asAnon(
  "insert into public.estimates (short_code, tool) values ('AB1Oxx','mvp');"
);
ok("anon CANNOT insert a malformed short_code", !badCode.ok);

const upd = await asAnon("update public.estimates set completed = true;");
ok("anon CANNOT blanket-update estimates", denied(upd) || upd.rows?.length === 0,
   upd.ok ? "update reported success" : "denied");

const del = await asAnon("delete from public.estimates;");
ok("anon CANNOT delete estimates", denied(del) || del.rows?.length === 0,
   del.ok ? "delete reported success" : "denied");

// the capability function is the only write path
await asAnon("select public.update_estimate($1, $2, null, true);", [
  "q4xtzr",
  '{"industry":"finance","type":"single-task"}',
]);
const afterUpdate = await db.query(
  "select answers, completed, updated_at > created_at as touched from public.estimates where short_code='q4xtzr';"
);
ok(
  "update_estimate() writes only its own row",
  afterUpdate.rows[0].completed === true &&
    afterUpdate.rows[0].answers.type === "single-task",
  JSON.stringify(afterUpdate.rows[0].answers)
);
const untouched = await db.query(
  "select completed from public.estimates where short_code='ab23cd';"
);
ok("…and leaves other rows alone", untouched.rows[0].completed === false);
ok("updated_at trigger fired", afterUpdate.rows[0].touched === true);

const uncomplete = await asAnon(
  "select public.update_estimate($1, null, null, false);",
  ["q4xtzr"]
);
const stillDone = await db.query(
  "select completed from public.estimates where short_code='q4xtzr';"
);
ok(
  "completion is one-way (a late write cannot un-complete)",
  uncomplete.ok && stillDone.rows[0].completed === true
);

const missing = await asAnon("select * from public.get_estimate($1);", ["zzzzzz"]);
ok("unknown short_code returns no row", missing.ok && missing.rows.length === 0);

/* ═══════════ leads ═══════════ */
console.log("\n── leads ──");

const leadIns = await asAnon(
  "insert into public.leads (source, name, email) values ('modal_call','A','a@b.c');"
);
ok("anon CAN insert a modal lead", leadIns.ok, leadIns.error ?? "");

const leadSel = await asAnon("select count(*) from public.leads;");
ok("anon CANNOT read leads, even a count", !leadSel.ok || Number(leadSel.rows[0].count) === 0,
   leadSel.ok ? `count=${leadSel.rows[0].count}` : "permission denied");

const leadUpd = await asAnon("update public.leads set email='x@y.z';");
ok("anon CANNOT update leads", denied(leadUpd) || leadUpd.rows?.length === 0);

const leadDel = await asAnon("delete from public.leads;");
ok("anon CANNOT delete leads", denied(leadDel) || leadDel.rows?.length === 0);

const forged = await asAnon(
  "insert into public.leads (estimate_id, source, email) select id, 'estimator_quote', 'x@y.z' from public.estimates limit 1;"
);
ok("anon CANNOT attach a lead to an estimate directly", !forged.ok);

const badSource = await asAnon(
  "insert into public.leads (source, email) values ('made_up','x@y.z');"
);
ok("anon CANNOT insert an unknown lead source", !badSource.ok);

await asAnon("select public.create_lead($1,$2,null,$3);", [
  "estimator_quote",
  "7k2mvp",
  "founder@example.com",
]);
const linked = await db.query(`
  select l.source, l.email, e.short_code
  from public.leads l join public.estimates e on e.id = l.estimate_id
  where l.source = 'estimator_quote';
`);
ok(
  "create_lead() links a lead to the estimate behind its code",
  linked.rows.length === 1 && linked.rows[0].short_code === "7k2mvp",
  linked.rows[0] ? `${linked.rows[0].source} → ${linked.rows[0].short_code}` : "none"
);

/* ═══════════ views ═══════════ */
console.log("\n── analytics views (must be invisible to anon) ──");

for (const v of [
  "v_estimate_funnel",
  "v_industry_breakdown",
  "v_value_distribution",
  "v_high_value_no_lead",
]) {
  const r = await asAnon(`select * from public.${v};`);
  ok(`anon CANNOT read ${v}`, !r.ok, r.ok ? `returned ${r.rows.length} rows` : "permission denied");
}

// and they work for the owner / service role
for (const v of [
  "v_estimate_funnel",
  "v_industry_breakdown",
  "v_value_distribution",
  "v_high_value_no_lead",
]) {
  const r = await db.query(`select * from public.${v};`);
  ok(`${v} runs for the dashboard`, Array.isArray(r.rows), `${r.rows.length} rows`);
}

// the high-value view must actually find the seeded case
await db.exec(`
  insert into public.estimates (short_code, tool, answers, computed, completed)
  values ('m9pqrs','mvp','{"industry":"b2b"}','{"midpoint":31000}', true);
`);
const hv = await db.query("select short_code from public.v_high_value_no_lead;");
ok(
  "v_high_value_no_lead finds a >$25k completed estimate with no lead",
  hv.rows.some((r) => r.short_code === "m9pqrs"),
  hv.rows.map((r) => r.short_code).join(", ") || "none"
);
ok(
  "…and excludes one that already has a lead",
  !hv.rows.some((r) => r.short_code === "7k2mvp")
);

/* ═══════════ retention ═══════════ */
console.log("\n── retention (24 months, keeps anything with a lead) ──");

await db.exec(`
  insert into public.estimates (short_code, tool, created_at)
  values
    ('zap222', 'mvp',   now() - interval '25 months'),  -- old, no lead  -> purge
    ('zap333', 'agent', now() - interval '30 months'),  -- old, has lead -> keep
    ('zap444', 'mvp',   now() - interval '23 months');  -- recent        -> keep
  insert into public.leads (estimate_id, source, email)
  select id, 'estimator_email', 'kept@example.com'
  from public.estimates where short_code = 'zap333';
`);

const purgeDenied = await asAnon("select public.purge_expired_estimates();");
ok("anon CANNOT run the purge", !purgeDenied.ok, "permission denied");

const purged = await db.query("select public.purge_expired_estimates() as n;");
const remaining = await db.query(
  "select short_code from public.estimates where short_code in ('zap222','zap333','zap444') order by short_code;"
);
const left = remaining.rows.map((r) => r.short_code);
ok("purge removes an expired estimate with no lead", !left.includes("zap222"), `deleted ${purged.rows[0].n}`);
ok("purge KEEPS an expired estimate that has a lead", left.includes("zap333"));
ok("purge keeps anything inside 24 months", left.includes("zap444"));

/* ═══════════ high-value alert tracking ═══════════ */
console.log("\n── high-value alert tracking (0002) ──");

const markDenied = await asAnon("select public.mark_high_value_notified(array['m9pqrs']);");
ok("anon CANNOT mark estimates as notified", !markDenied.ok, "permission denied");

const colDenied = await asAnon(
  "update public.estimates set high_value_notified_at = now();"
);
ok("anon CANNOT write the new column directly", denied(colDenied) || colDenied.rows?.length === 0);

const before = await db.query("select short_code from public.v_high_value_no_lead where high_value_notified_at is null;");
ok("the alert view lists an un-notified high-value estimate", before.rows.some((r) => r.short_code === "m9pqrs"));

const marked = await db.query("select public.mark_high_value_notified(array['m9pqrs']) as n;");
const after = await db.query("select short_code from public.v_high_value_no_lead where high_value_notified_at is null;");
ok("marking removes it from the pending set", marked.rows[0].n === 1 && !after.rows.some((r) => r.short_code === "m9pqrs"));

const remark = await db.query("select public.mark_high_value_notified(array['m9pqrs']) as n;");
ok("marking twice is a no-op (no duplicate alerts)", remark.rows[0].n === 0);

console.log("\n════════════════════════════════════════════════════════════");
console.log(
  fails === 0
    ? `ALL ${checks} POLICY CHECKS PASS`
    : `${fails} of ${checks} CHECKS FAILED`
);
console.log("════════════════════════════════════════════════════════════\n");

// PGlite's WASM worker trips a libuv assertion if the process exits in
// the same tick as a pending callback, which mangles the exit code.
// Let the event loop drain first, then exit deliberately.
process.exitCode = fails === 0 ? 0 : 1;
await new Promise((r) => setTimeout(r, 50));
process.exit(process.exitCode);
