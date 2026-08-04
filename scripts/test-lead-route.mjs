/**
 * Smoke test for /api/lead — validation, honeypot, rate limiting.
 * Runs against the dev server with no Supabase or Resend configured,
 * which is exactly the case that must still return success.
 */
const URL_ = "http://localhost:3000/api/lead";

let fails = 0;
const ok = (label, pass, detail = "") => {
  if (!pass) fails++;
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
};

const post = async (body, headers = {}) => {
  const res = await fetch(URL_, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, json, retryAfter: res.headers.get("retry-after") };
};

// each block gets its own IP so the rate limiter doesn't cross-talk
const ip = (n) => ({ "x-forwarded-for": `203.0.113.${n}` });

console.log("\n── validation ──");
const badSource = await post({ source: "totally_made_up" }, ip(1));
ok("unknown source rejected", badSource.status === 400, `HTTP ${badSource.status}`);

const noSource = await post({ email: "a@b.co" }, ip(2));
ok("missing source rejected", noSource.status === 400, `HTTP ${noSource.status}`);

const badEmail = await post({ source: "modal_email", email: "not-an-email" }, ip(3));
ok("malformed email rejected", badEmail.status === 400, `HTTP ${badEmail.status}`);

const goodEmail = await post(
  { source: "modal_email", name: "Test", email: "founder@example.com", message: "hi" },
  ip(4)
);
ok("valid modal_email accepted", goodEmail.status === 200 && goodEmail.json?.ok === true,
   `HTTP ${goodEmail.status} ${JSON.stringify(goodEmail.json)}`);

console.log("\n── honeypot ──");
const trapped = await post(
  { source: "modal_email", email: "bot@example.com", company: "Acme Bots Inc" },
  ip(5)
);
ok("populated honeypot returns 200", trapped.status === 200, `HTTP ${trapped.status}`);
ok("…and reports nothing stored", trapped.json?.stored === undefined,
   JSON.stringify(trapped.json));

console.log("\n── estimator sources ──");
const quote = await post({ source: "estimator_quote", shortCode: "k7m2xq" }, ip(6));
ok("estimator_quote with no contact details accepted", quote.status === 200,
   `HTTP ${quote.status}`);

const forged = await post(
  { source: "estimator_quote", shortCode: "k7m2xq", estimate_id: "11111111-2222-3333-4444-555555555555" },
  ip(7)
);
ok("a client-sent estimate_id is ignored, not honoured", forged.status === 200,
   "route accepts no estimate_id field at all");

const badCode = await post({ source: "estimator_email", shortCode: "NOPE!!", email: "a@b.co" }, ip(8));
ok("malformed short code does not 500", badCode.status === 200, `HTTP ${badCode.status}`);

console.log("\n── rate limit (5/min per IP) ──");
const burst = [];
for (let i = 0; i < 7; i++) burst.push(await post({ source: "modal_meeting" }, ip(9)));
const codes = burst.map((r) => r.status);
ok("first five allowed", codes.slice(0, 5).every((c) => c === 200), codes.join(","));
ok("sixth rejected with 429", codes[5] === 429, `got ${codes[5]}`);
ok("429 carries Retry-After", Boolean(burst[5].retryAfter), burst[5].retryAfter ?? "missing");
ok("a different IP is unaffected",
   (await post({ source: "modal_meeting" }, ip(10))).status === 200);

console.log("\n── unconfigured backends must not fail the request ──");
ok("succeeds with no Supabase and no Resend",
   goodEmail.json?.ok === true && goodEmail.json?.stored === false,
   JSON.stringify(goodEmail.json));

console.log("\n" + (fails === 0 ? "ALL LEAD ROUTE CHECKS PASS" : `${fails} FAILURES`) + "\n");
process.exit(fails === 0 ? 0 : 1);
