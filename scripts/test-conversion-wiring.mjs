import { chromium } from "playwright";

const RESULTS =
  "http://localhost:3000/tools/mvp-cost-calculator/estimate" +
  "?e=abc234&industry=b2b&type=saas-mvp&users=two&money=subscriptions" +
  "&have=neither&integrations=2&ai=none&at=results";

const b = await chromium.launch();
let fails = 0;
const ok = (label, pass, detail = "") => {
  if (!pass) fails++;
  console.log(`  ${pass ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
};

const newPage = async (ctx) => {
  const p = await ctx.newPage();
  return p;
};

/* ══════ quote CTA ══════ */
console.log("\n=== Get a fixed price quote ===");
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await newPage(ctx);

const posts = [];
await p.route("**/api/lead", async (route) => {
  posts.push(JSON.parse(route.request().postData() ?? "{}"));
  await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
});

await p.goto(RESULTS, { waitUntil: "networkidle" });
const popupPromise = ctx.waitForEvent("page", { timeout: 8000 }).catch(() => null);
await p.getByRole("button", { name: "Get a fixed price quote" }).click();
const popup = await popupPromise;

ok("posts a lead", posts.length === 1, JSON.stringify(posts[0] ?? {}));
ok("source is estimator_quote", posts[0]?.source === "estimator_quote");
ok("carries the short code", posts[0]?.shortCode === "abc234");
ok("collects no email", !posts[0]?.email);
ok("opens Calendly", Boolean(popup) && (popup?.url() ?? "").includes("calendly.com"), popup?.url() ?? "none");
ok("passes the code as a Calendly param", (popup?.url() ?? "").includes("a1=abc234"), popup?.url() ?? "");
ok("does NOT open the three-option modal",
   (await p.getByRole("heading", { name: "Start a project" }).count()) === 0);
await popup?.close();

/* ══════ quote CTA when the write fails ══════ */
console.log("\n=== …still books when the write fails ===");
const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await newPage(ctx2);
await p2.route("**/api/lead", (route) => route.abort("failed"));
await p2.goto(RESULTS, { waitUntil: "networkidle" });
const popup2Promise = ctx2.waitForEvent("page", { timeout: 8000 }).catch(() => null);
await p2.getByRole("button", { name: "Get a fixed price quote" }).click();
const popup2 = await popup2Promise;
ok("Calendly opens despite the failed POST",
   Boolean(popup2) && (popup2?.url() ?? "").includes("calendly.com"), popup2?.url() ?? "none");
ok("no error surfaced to the visitor",
   !((await p2.locator("body").textContent()) ?? "").toLowerCase().includes("something went wrong"));
await popup2?.close();

/* ══════ email CTA ══════ */
console.log("\n=== Email me this estimate ===");
const ctx3 = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p3 = await newPage(ctx3);
const posts3 = [];
await p3.route("**/api/lead", async (route) => {
  posts3.push(JSON.parse(route.request().postData() ?? "{}"));
  await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
});
await p3.goto(RESULTS, { waitUntil: "networkidle" });
await p3.getByRole("button", { name: "Email me this estimate" }).click();
await p3.waitForTimeout(300);
ok("opens a dialog, not a page change",
   (await p3.getByRole("dialog").count()) === 1 && p3.url().includes("at=results"));
// rendered with a typographic apostrophe, as everywhere else on the site
ok("shows the promise copy",
   ((await p3.getByRole("dialog").textContent()) ?? "")
     .replace(/[‘’]/g, "'")
     .includes("We'll send you a link to this estimate. Nothing else."));

await p3.getByLabel("Email address").fill("not-an-email");
await p3.getByRole("button", { name: "Send it" }).click();
await p3.waitForTimeout(200);
ok("rejects a malformed address client-side", posts3.length === 0);

await p3.getByLabel("Email address").fill("founder@example.com");
await p3.getByRole("button", { name: "Send it" }).click();
await p3.waitForTimeout(600);
ok("posts estimator_email with the code",
   posts3[0]?.source === "estimator_email" && posts3[0]?.shortCode === "abc234",
   JSON.stringify(posts3[0] ?? {}));
ok("carries the honeypot field", "company" in (posts3[0] ?? {}));
ok("inline success, still on the results page",
   ((await p3.getByRole("dialog").textContent()) ?? "").includes("On its way") &&
     p3.url().includes("at=results"));

/* ══════ contact modal ══════ */
console.log("\n=== Contact modal ===");
const ctx4 = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p4 = await newPage(ctx4);
const posts4 = [];
await p4.route("**/api/lead", async (route) => {
  posts4.push(JSON.parse(route.request().postData() ?? "{}"));
  await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
});
await p4.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await p4.getByRole("button", { name: "Start a project" }).first().click();
await p4.waitForTimeout(400);
ok("modal opens", (await p4.getByRole("dialog").count()) >= 1);

await p4.getByRole("button", { name: /Schedule a meeting/ }).click();
await p4.waitForTimeout(500);
ok("meeting selection fires a lead before the embed",
   posts4.some((x) => x.source === "modal_meeting"),
   JSON.stringify(posts4));

await p4.getByRole("button", { name: "Back" }).first().click();
await p4.waitForTimeout(300);
await p4.getByRole("button", { name: /Get a call/ }).click();
await p4.waitForTimeout(300);
const callText = (await p4.getByRole("dialog").textContent()) ?? "";
ok("call form has separate TCPA consents",
   /consent/i.test(callText) && /SMS|text message/i.test(callText));

console.log("\n" + (fails === 0 ? "ALL CONVERSION CHECKS PASS" : `${fails} FAILURES`) + "\n");
await b.close();
process.exit(fails === 0 ? 0 : 1);
