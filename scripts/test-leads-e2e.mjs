/**
 * End-to-end lead test: fires one lead of each of the five sources and
 * reports what landed.
 *
 * Run against a deployment (or localhost) that has Supabase and Resend
 * configured. It reads SUPABASE_SERVICE_ROLE_KEY to verify the rows,
 * so run it locally against .env.local rather than in CI.
 *
 *   node --env-file=.env.local scripts/test-leads-e2e.mjs
 *   node --env-file=.env.local scripts/test-leads-e2e.mjs https://codroon.com
 *
 * Emails go to NOTIFICATION_EMAIL; the visitor mails go to the address
 * below — change it to one you can actually read.
 */

const BASE = process.argv[2] ?? "http://localhost:3000";
const VISITOR_EMAIL = process.env.TEST_VISITOR_EMAIL ?? "you+codroontest@example.com";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const code = Array.from(
  { length: 6 },
  () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
).join("");

let fails = 0;
const ok = (label, pass, detail = "") => {
  if (!pass) fails++;
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
};

const rest = (path, key, init = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

const lead = async (body) => {
  const res = await fetch(`${BASE}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, json: await res.json().catch(() => null) };
};

console.log(`\nTarget: ${BASE}`);
console.log(`Test estimate code: ${code}\n`);

if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/test-leads-e2e.mjs"
  );
  process.exit(2);
}

/* ---- 1. seed a completed estimate so the estimator_* leads attach ---- */
console.log("── seeding a completed estimate ──");
const seed = await rest("estimates", SERVICE_KEY, {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({
    short_code: code,
    tool: "mvp",
    completed: true,
    answers: {
      industry: "b2b",
      type: "saas-mvp",
      users: "two",
      money: "subscriptions",
      have: "neither",
      integrations: 2,
      ai: "none",
    },
    computed: {
      midpoint: 27800,
      lo: 24500,
      hi: 31000,
      state: "range",
      timelineLabel: "4–5 weeks",
      confidenceLabel: "±12%",
      cuts: [],
      snapshot: {
        version: 1,
        tool: "mvp",
        floor: 3000,
        spread: 0.12,
        confidenceLabel: "±12%",
        uncutTotal: 27842.1,
        weeksLo: 4,
        weeksHi: 5,
        baseLabel: "SaaS MVP core",
        lines: [
          { id: "users", label: "Second user type", amount: 4500 },
          { id: "money", label: "Subscriptions and billing", amount: 3500 },
          { id: "integrations", label: "Integrations — 2 systems", amount: 4800 },
        ],
        cuts: [
          { id: "drop-second-user-type", label: "Drop the second user type", days: 7, factor: 0.738, reverses: "users" },
          { id: "skip-admin-panel", label: "Skip the admin panel", days: 4, factor: 0.88 },
          { id: "defer-onboarding", label: "Defer the onboarding flow", days: 3, factor: 0.92 },
        ],
        runCost: null,
      },
      display: {
        eyebrow: "Your estimate · SaaS MVP, two user types",
        metaLine: "4–5 weeks · you own the code · ±12%",
        panelLabel: "Your SaaS build · 4–5 weeks",
      },
    },
  }),
});
ok("estimate seeded", seed.status === 201, `HTTP ${seed.status}`);

/* ---- 2. fire one lead of each source ---- */
console.log("\n── firing one lead of each source ──");

const cases = [
  ["modal_call", { source: "modal_call", name: "E2E Call", phone: "+1 214 555 0101", message: "Test — call request.", callConsent: true, smsConsent: true }],
  ["modal_email", { source: "modal_email", name: "E2E Email", email: VISITOR_EMAIL, message: "Test — email enquiry." }],
  ["modal_meeting", { source: "modal_meeting" }],
  ["estimator_email", { source: "estimator_email", shortCode: code, email: VISITOR_EMAIL }],
  ["estimator_quote", { source: "estimator_quote", shortCode: code }],
];

for (const [name, body] of cases) {
  const r = await lead(body);
  ok(`${name} accepted`, r.status === 200 && r.json?.ok === true, `HTTP ${r.status} ${JSON.stringify(r.json)}`);
  await new Promise((r) => setTimeout(r, 250)); // stay inside 5/min
}

/* ---- 3. verify the rows landed ---- */
console.log("\n── verifying rows ──");
const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
const rowsRes = await rest(
  `leads?select=source,name,email,phone,estimate_id&created_at=gte.${since}`,
  SERVICE_KEY
);
const rows = await rowsRes.json();

for (const [name] of cases) {
  ok(`${name} row present`, rows.some((r) => r.source === name));
}

const estimatorRows = rows.filter((r) => r.source.startsWith("estimator_"));
ok(
  "estimator leads are linked to the estimate",
  estimatorRows.length === 2 && estimatorRows.every((r) => r.estimate_id),
  estimatorRows.map((r) => `${r.source}:${r.estimate_id ? "linked" : "NULL"}`).join(", ")
);
ok(
  "modal leads have no estimate attached",
  rows.filter((r) => r.source.startsWith("modal_")).every((r) => !r.estimate_id)
);

/* ---- 4. anon still cannot read any of it ---- */
console.log("\n── anon still blind ──");
const anonLeads = await rest("leads?select=*", ANON_KEY);
const anonBody = await anonLeads.json().catch(() => null);
ok(
  "anon cannot read leads",
  !Array.isArray(anonBody) || anonBody.length === 0,
  `HTTP ${anonLeads.status}`
);

console.log(`
── check your inbox ──
  ${process.env.NOTIFICATION_EMAIL ?? "NOTIFICATION_EMAIL"}  should have 5 notifications,
    one per source. The two estimator ones carry the full estimate.
  ${VISITOR_EMAIL}  should have 2 visitor emails
    (modal_email and estimator_email). No others send one.

  Shared estimate: ${BASE}/e/${code}

  Clean up when done:
    delete from leads where created_at > now() - interval '10 minutes';
    delete from estimates where short_code = '${code}';
`);

console.log(fails === 0 ? "ALL E2E CHECKS PASS\n" : `${fails} FAILURES\n`);
process.exit(fails === 0 ? 0 : 1);
