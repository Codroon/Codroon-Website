import { chromium } from "playwright";

const AGENT = "http://localhost:3000/tools/ai-agent-cost-calculator/estimate";
const MVP = "http://localhost:3000/tools/mvp-cost-calculator/estimate";

const b = await chromium.launch();
const errors = [];
let fails = 0;

function check(label, cond, detail = "") {
  console.log(`  ${cond ? "OK  " : "FAIL"}  ${label}${detail ? " — " + detail : ""}`);
  if (!cond) fails++;
}

/** Click an option and wait for the stage to actually change. */
async function pick(p, name) {
  const before = new URL(p.url()).searchParams.get("at");
  await p.getByRole("button", { name, exact: true }).click();
  await p
    .waitForFunction(
      (prev) => new URL(location.href).searchParams.get("at") !== prev,
      before,
      { timeout: 5000 }
    )
    .catch(() => {});
  await p.waitForTimeout(300); // let the router transition settle
}

const rangeOf = async (p) =>
  (await p.locator("header p.font-serif, h1 + p.font-serif").first().textContent()) ?? "";
const headerRange = async (p) =>
  (await p.locator("main p.font-serif").first().textContent())?.trim() ?? "";

const newPage = async (vp = { width: 1440, height: 900 }) => {
  const p = await b.newPage({ viewport: vp });
  p.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning")
      errors.push(`${m.type()}: ${m.text()}`);
  });
  p.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return p;
};

/* ══════════ AGENT ══════════ */
console.log("\n=== AGENT: full path, workflow agent ===");
const a = await newPage();
await a.goto(AGENT, { waitUntil: "networkidle" });
check("initial span is the tool floor..ceiling", (await headerRange(a)) === "$2,000–$50,000", await headerRange(a));

await pick(a, "E-commerce & retail");
check("industry does not move the range", (await headerRange(a)) === "$2,000–$50,000");

await pick(a, "Run a multi-step process across your systems");
check("type collapses to the published band", (await headerRange(a)) === "$15,000–$25,000", await headerRange(a));

await pick(a, "Acts: updates records, sends messages");
await pick(a, "2–3");
const afterSystems = await headerRange(a);
check("no interrupt for a workflow agent", await a.getByRole("heading", { name: /automation, not an agent/ }).count() === 0);

await pick(a, "A few: policies, product data, past tickets");
await pick(a, "Only the high-risk ones");
check("interstitial reached", (await a.locator("text=That's your build cost.").count()) > 0);
check("build range at interstitial", (await headerRange(a)) === "$21,000–$26,500", await headerRange(a));

await pick(a, "Keep going");
await pick(a, "100 to 1,000 times a day");
await a.waitForTimeout(500);
const agentUrl = a.url();
check("landed on results", agentUrl.includes("at=results"));
check("results range matches", (await headerRange(a)) === "$21,000–$26,500", await headerRange(a));
const ledgerText = (await a.locator("section[aria-labelledby='est-ledger-h']").textContent()) ?? "";
check("ledger core line derived", ledgerText.includes("Workflow agent core") && ledgerText.includes("$20,000"));
check("ledger retrieval line", ledgerText.includes("Retrieval over your documents") && ledgerText.includes("$2,000"));
check("ledger approval line", ledgerText.includes("$1,800"));
const runText = (await a.locator("section[aria-labelledby='est-run-h']").textContent()) ?? "";
check("run cost derived", runText.includes("$560–$1,120/mo"), runText.slice(0, 60));

// cuts
await a.getByRole("checkbox", { name: /Skip retrieval/ }).check();
await a.waitForTimeout(400);
check("cut recomputes range", (await headerRange(a)) !== "$21,000–$26,500", await headerRange(a));
const struck = await a.locator("s, .line-through").count();
check("a ledger row is struck", struck > 0);
check("cuts persisted to URL", a.url().includes("cuts=skip-retrieval"));

// URL round-trip
const p2 = await newPage();
await p2.goto(a.url(), { waitUntil: "networkidle" });
check("pasted URL reproduces range", (await headerRange(p2)) === (await headerRange(a)));

// refresh
await a.reload({ waitUntil: "networkidle" });
check("refresh keeps progress", a.url().includes("at=results") && (await headerRange(a)) === (await headerRange(p2)));

/* interrupt */
console.log("\n=== AGENT: interrupt path ===");
const ai = await newPage();
await ai.goto(AGENT, { waitUntil: "networkidle" });
await pick(ai, "Healthcare");
await pick(ai, "Trigger one action when something happens");
await pick(ai, "Reads: answers questions, drafts replies");
await pick(ai, "1");
await ai.waitForTimeout(300);
const interruptText = (await ai.locator("main").textContent()) ?? "";
check("interrupt fires for simple automation", interruptText.includes("automation, not an agent"));
check("interrupt interpolates both config ranges", interruptText.includes("$2,000–$5,000") && interruptText.includes("$10,000–$18,000"), "");
await pick(ai, "Keep going");
check("dismiss advances past the interrupt", (await ai.locator("main").textContent())?.includes("Does it need your own documents?") ?? false);
check("interrupt marked seen in URL", ai.url().includes("si=1"));

/* ceiling */
console.log("\n=== MVP: ceiling ===");
const mc = await newPage();
await mc.goto(MVP + "?type=marketplace-mvp&users=three-plus&money=between-users&have=neither&integrations=3&ai=is-the-product&at=results", { waitUntil: "networkidle" });
const ceilText = (await mc.locator("main").textContent()) ?? "";
check("above-ceiling screen shown", ceilText.includes("Above $50,000"));
check("no fabricated number", !ceilText.includes("$114,000"));

/* ══════════ MVP ══════════ */
console.log("\n=== MVP: SaaS path ===");
const m = await newPage();
await m.goto(MVP, { waitUntil: "networkidle" });
check("initial span", (await headerRange(m)) === "$3,000–$50,000", await headerRange(m));
await pick(m, "B2B services");
await pick(m, "SaaS tool");
check("type band", (await headerRange(m)) === "$12,000–$18,000", await headerRange(m));
await pick(m, "Two");
await pick(m, "Subscriptions");
await pick(m, "Neither, and that's normal");
check("no interrupt (users is two)", !((await m.locator("main").textContent()) ?? "").includes("closer to a V1"));
await pick(m, "Two");           // integrations = 2
await pick(m, "None");          // ai
check("interstitial reached", ((await m.locator("main").textContent()) ?? "").includes("That's your build cost and timeline"));
check("MVP build range", (await headerRange(m)) === "$24,500–$31,000", await headerRange(m));
await pick(m, "Show my estimate");
await m.waitForTimeout(400);
const mLedger = (await m.locator("section[aria-labelledby='est-ledger-h']").textContent()) ?? "";
check("ledger derived", mLedger.includes("SaaS MVP core") && mLedger.includes("$15,000") && mLedger.includes("Second user type"));
const notCut = (await m.locator("main").textContent()) ?? "";
check("what not to cut present", notCut.includes("Three things we'd never cut"));

/* budget preselect */
console.log("\n=== MVP: budget pre-selects the leaner version ===");
const mb = await newPage();
await mb.goto(MVP + "?type=saas-mvp&users=two&money=subscriptions&have=neither&integrations=2&ai=none&at=budget", { waitUntil: "networkidle" });
await pick(mb, "$10–20k");
await mb.waitForTimeout(500);
check("budget routes to results", mb.url().includes("at=results"));
check("cuts pre-applied in URL", mb.url().includes("cuts="), mb.url().split("?")[1] ?? "");
const bText = (await mb.locator("main").textContent()) ?? "";
check("fit message shown", bText.includes("Here's a version that fits $10,000–$20,000"));
const checked = await mb.locator("input[type=checkbox]:checked").count();
check("checkboxes arrive on", checked > 0, `${checked} checked`);

/* landing page skip */
console.log("\n=== MVP: landing page skips users/money/integrations ===");
const ml = await newPage();
await ml.goto(MVP, { waitUntil: "networkidle" });
await pick(ml, "Consumer apps");
await pick(ml, "Landing page with a waitlist");
const afterType = (await ml.locator("main").textContent()) ?? "";
check("skips straight to 'what do you already have'", afterType.includes("What do you already have?"), afterType.slice(0, 0));
check("does not ask about user types", !afterType.includes("How many kinds of user"));
await pick(ml, "Neither, and that's normal");
await pick(ml, "None");
await ml.waitForTimeout(300);
check("interstitial after ai", ((await ml.locator("main").textContent()) ?? "").includes("That's your build cost"));
await pick(ml, "Show my estimate");
await ml.waitForTimeout(400);
check("landing range", (await headerRange(ml)) === "$3,500–$4,500", await headerRange(ml));
const mlCuts = await ml.locator("input[type=checkbox]").count();
check("no irrelevant cuts offered", mlCuts === 0, `${mlCuts} checkboxes`);

/* back button */
console.log("\n=== Back button steps backwards ===");
const bp = await newPage();
await bp.goto(MVP, { waitUntil: "networkidle" });
await pick(bp, "B2B services");
await pick(bp, "SaaS tool");
await pick(bp, "Two");
await bp.goBack({ waitUntil: "networkidle" });
await bp.waitForTimeout(300);
check("browser back returns to the user-types question", ((await bp.locator("main").textContent()) ?? "").includes("How many kinds of user"));
await bp.getByRole("button", { name: "Back", exact: true }).click();
await bp.waitForTimeout(400);
check("in-page Back returns to the type question", ((await bp.locator("main").textContent()) ?? "").includes("What are you building?"));
check("previous answer still highlighted", (await bp.locator('button[aria-pressed="true"]').count()) > 0);

/* ══════════ audit regressions ══════════ */
console.log("\n=== Audit regressions ===");

// 1. cumulative saving must equal the actual reduction, not the sum of
//    independently-measured per-cut figures
const cs = await newPage();
await cs.goto(
  MVP + "?type=saas-mvp&users=three-plus&money=between-users&have=designs&integrations=0&ai=none&at=results",
  { waitUntil: "networkidle" }
);
const uncut = await headerRange(cs);
const uncutMid = Number(uncut.split("–")[0].replace(/[^0-9]/g, ""));
for (const box of await cs.locator("input[type=checkbox]").all()) await box.click();
await cs.waitForTimeout(600);
const cutLo = Number((await headerRange(cs)).split("–")[0].replace(/[^0-9]/g, ""));
const claimed = Number(
  ((await cs.locator("text=/You've taken/").textContent()) ?? "").match(/\$([\d,]+)/)?.[1].replace(/,/g, "") ?? "0"
);
const actualDrop = uncutMid - cutLo;
check(
  "closing line matches the real reduction",
  Math.abs(claimed - actualDrop) / Math.max(actualDrop, 1) < 0.25,
  `claimed $${claimed} vs range drop $${actualDrop}`
);

// 2. stale answer to a skipped question must not fire the interrupt
const si = await newPage();
await si.goto(MVP + "?industry=b2b&type=landing-waitlist&users=three-plus&at=have", {
  waitUntil: "networkidle",
});
await pick(si, "Neither, and that's normal");
check(
  "no V1 interrupt for a waitlist page with a stale users answer",
  !((await si.locator("main").textContent()) ?? "").includes("closer to a V1")
);

// 3. "Not sure" must offer the cut for the fallback it is charged for
const ns = await newPage();
await ns.goto(
  MVP + "?type=saas-mvp&users=unsure&money=none&have=neither&integrations=0&ai=none&at=results",
  { waitUntil: "networkidle" }
);
const nsText = (await ns.locator("main").textContent()) ?? "";
check(
  "unsure users is charged for a second user type…",
  nsText.includes("Second user type")
);
check(
  "…and the cut that removes it is offered",
  nsText.includes("Drop the second user type")
);

// 4. two options sharing a value must not both highlight
const dv = await newPage();
await dv.goto(AGENT + "?industry=ecommerce&type=workflow-agent&access=both&at=access", {
  waitUntil: "networkidle",
});
check(
  "only one option selected when restoring 'Both'",
  (await dv.locator('button[aria-pressed="true"]').count()) === 1,
  `${await dv.locator('button[aria-pressed="true"]').count()} pressed`
);

// 5. the narrowing bar must never widen as answers arrive
const bar = await newPage();
const widths = [];
await bar.goto(AGENT, { waitUntil: "networkidle" });
const barWidth = async (p) =>
  p.evaluate(() => {
    // the fill is the only element carrying inline left+right insets
    const fill = [...document.querySelectorAll("div[style]")].find(
      (el) => el.style.left !== "" && el.style.right !== ""
    );
    if (!fill) return -1;
    return (100 - parseFloat(fill.style.left) - parseFloat(fill.style.right)) / 100;
  });
widths.push(await barWidth(bar));
for (const o of [
  "Finance & insurance",
  "Coordinate several agents on one job",
  "Acts: updates records, sends messages",
  "4–6",
  "A large library: hundreds of documents or more",
  "Yes, every action",
]) {
  await pick(bar, o);
  widths.push(await barWidth(bar));
}
const monotonic = widths.every((w, i) => i === 0 || w <= widths[i - 1] + 0.005);
check(
  "bar fill only ever closes in",
  monotonic,
  widths.map((w) => (w * 100).toFixed(1) + "%").join(" → ")
);

/* ══════════ persistence ══════════ */
console.log("\n=== Persistence (works with the database absent) ===");

const pp = await newPage();
await pp.goto(MVP, { waitUntil: "networkidle" });
check("no short code before the first answer", !pp.url().includes("e="));
await pick(pp, "B2B services");
const code = new URL(pp.url()).searchParams.get("e");
check("first answer mints a short code", !!code, code ?? "none");
check("code is 6 chars from the readable alphabet", /^[a-hjkmnp-z2-9]{6}$/.test(code ?? ""), code ?? "");
await pick(pp, "SaaS tool");
check("code is stable across answers", new URL(pp.url()).searchParams.get("e") === code);
check(
  "privacy note shown on the first question only",
  !((await pp.locator("main").textContent()) ?? "").includes("Nothing personal until you tell us")
);
const first = await newPage();
await first.goto(MVP, { waitUntil: "networkidle" });
check(
  "privacy note IS on the first question",
  ((await first.locator("main").textContent()) ?? "").includes(
    "We save your answers so you can come back to this"
  )
);

// the whole point: a missing database must be invisible
await pick(pp, "Two");
await pick(pp, "Subscriptions");
await pick(pp, "Neither, and that's normal");
await pick(pp, "Two");
await pick(pp, "None");
await pick(pp, "Show my estimate");
await pp.waitForTimeout(600);
check(
  "estimator completes with persistence unconfigured",
  (await headerRange(pp)) === "$24,500–$31,000",
  await headerRange(pp)
);
// Copy-link + download controls removed (client, 2026-08-02) — assert
// they STAY gone, alongside the CTAs that remain.
{
  const txt = (await pp.locator("main").textContent()) ?? "";
  check("copy-link control removed", !txt.includes("Copy link to this estimate"));
  check("download control removed", !/Download (diagram|build plan)/.test(txt));
  check("quote + email CTAs still present",
    txt.includes("Get a fixed price quote") && txt.includes("Email me this estimate"));
}
const stillNoStorage = await pp.evaluate(() => ({
  ls: Object.keys(localStorage).length,
  ss: Object.keys(sessionStorage).length,
}));
check("still no browser storage", stillNoStorage.ls === 0 && stillNoStorage.ss === 0);

/* ══════════ share route ══════════ */
console.log("\n=== /e/[shortCode] ===");

const sh = await newPage();
const bad = await sh.goto("http://localhost:3000/e/zzz", { waitUntil: "networkidle" });
check("malformed short code 404s", bad?.status() === 404, `HTTP ${bad?.status()}`);
check(
  "…with a friendly pointer at the tools",
  ((await sh.locator("main").textContent()) ?? "").includes("Estimate an MVP")
);

const unknown = await sh.goto("http://localhost:3000/e/zzzzzz", { waitUntil: "networkidle" });
check("unknown short code 404s", unknown?.status() === 404, `HTTP ${unknown?.status()}`);

const noref = await sh.locator('a[rel~="noreferrer"]').count();
check("outbound links carry rel=noreferrer", noref > 0, `${noref} links`);

const robots = await (await fetch("http://localhost:3000/robots.txt")).text();
check("robots.txt disallows /e/", robots.includes("Disallow: /e/"), robots.replace(/\n/g, " | "));
check("robots.txt disallows the estimator routes", robots.includes("/tools/*/estimate"));

/* mobile */
const mob = await newPage({ width: 375, height: 667 });
await mob.goto(MVP, { waitUntil: "networkidle" });
const ov = await mob.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("mobile overflow 0", ov === 0, ov + "px");

/* no browser storage anywhere */
const storage = await m.evaluate(() => ({
  ls: Object.keys(localStorage).length,
  ss: Object.keys(sessionStorage).length,
}));
check("no localStorage/sessionStorage used", storage.ls === 0 && storage.ss === 0, JSON.stringify(storage));

console.log("\n" + (errors.length ? "CONSOLE:\n" + errors.join("\n") : "console clean"));
console.log(fails === 0 ? "\nALL WIRING CHECKS PASS" : `\n${fails} FAILURES`);
await b.close();
