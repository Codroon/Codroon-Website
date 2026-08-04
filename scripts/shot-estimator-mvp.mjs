import { chromium } from "playwright";

const URL = "http://localhost:3000/tools/mvp-cost-calculator/estimate";
const AGENT_URL = "http://localhost:3000/tools/ai-agent-cost-calculator/estimate";

const b = await chromium.launch();
const errors = [];

async function click(p, name) {
  await p.getByRole("button", { name, exact: true }).click();
  await p.waitForTimeout(450);
}

// ---- 1440: full flow ----
const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
d.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    errors.push(`${m.type()}: ${m.text()}`);
});
await d.goto(URL, { waitUntil: "networkidle" });
await d.screenshot({ path: "scripts/shots/mvp-a-1440-q1.png" });

await click(d, "B2B services"); // Q1
await click(d, "SaaS tool"); // Q2
await click(d, "Two"); // Q3 → interrupt
await d.screenshot({ path: "scripts/shots/mvp-a-1440-interrupt.png" });

await click(d, "Keep going anyway"); // → Q4
await d.screenshot({ path: "scripts/shots/mvp-a-1440-q4.png" });
await click(d, "Subscriptions"); // Q4
await click(d, "Neither, and that's normal"); // Q5 → interstitial
await d.screenshot({ path: "scripts/shots/mvp-a-1440-interstitial.png" });

await click(d, "Keep going"); // → Q6
await click(d, "Third-party integrations"); // Q6 → Q7
await d.screenshot({ path: "scripts/shots/mvp-a-1440-q7.png" });
await click(d, "$10–20k"); // Q7 → results, 3 cuts preselected
await d.screenshot({ path: "scripts/shots/mvp-b-1440-preselected.png" });

await d
  .getByRole("heading", { name: "How this compares", level: 2 })
  .scrollIntoViewIfNeeded();
await d.waitForTimeout(200);
await d.screenshot({ path: "scripts/shots/mvp-b-1440-belowfold.png" });

// ---- spec example state: user2 + component system = $9,000 / 10 days ----
const s = await b.newPage({ viewport: { width: 1440, height: 900 } });
await s.goto(URL, { waitUntil: "networkidle" });
await click(s, "B2B services");
await click(s, "SaaS tool");
await click(s, "Two");
await click(s, "Keep going anyway");
await click(s, "Subscriptions");
await click(s, "Neither, and that's normal");
await click(s, "Show my estimate"); // leave at the interstitial
await s.getByRole("checkbox", { name: /Drop the second user type/ }).check();
await s.getByRole("checkbox", { name: /Use the component system/ }).check();
await s.waitForTimeout(300);
const line = await s
  .locator("text=/You've taken/")
  .textContent()
  .catch(() => "NOT FOUND");
console.log("closing line:", line);
await s
  .getByRole("heading", { name: "Bring it down", level: 2 })
  .scrollIntoViewIfNeeded();
await s.waitForTimeout(200);
await s.screenshot({ path: "scripts/shots/mvp-b-1440-speccuts.png" });

// ---- 768 ----
const t = await b.newPage({ viewport: { width: 768, height: 1024 } });
await t.goto(URL, { waitUntil: "networkidle" });
await t.screenshot({ path: "scripts/shots/mvp-a-768-q1.png" });

// ---- 375 ----
const m = await b.newPage({ viewport: { width: 375, height: 667 } });
await m.goto(URL, { waitUntil: "networkidle" });
await m.screenshot({ path: "scripts/shots/mvp-a-375-fold.png" });
await click(m, "B2B services");
await click(m, "SaaS tool");
await click(m, "Two");
await m.screenshot({ path: "scripts/shots/mvp-a-375-interrupt.png", fullPage: true });
await click(m, "Keep going anyway");
await click(m, "Subscriptions");
await click(m, "Neither, and that's normal");
await click(m, "Keep going");
await click(m, "Third-party integrations");
await click(m, "$10–20k");
await m.screenshot({ path: "scripts/shots/mvp-b-375-full.png", fullPage: true });
const ov = await m.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
console.log("mobile overflow:", ov + "px");

// ---- reduced motion: instant plan assembly ----
const r = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await r.goto(URL, { waitUntil: "networkidle" });
await click(r, "B2B services");
await click(r, "SaaS tool");
await click(r, "Two");
await click(r, "Keep going anyway");
await r.screenshot({ path: "scripts/shots/mvp-a-rm-q4.png" });

// ---- agent estimator parity after the shared-primitive refactor ----
const a = await b.newPage({ viewport: { width: 1440, height: 900 } });
await a.goto(AGENT_URL, { waitUntil: "networkidle" });
await a.screenshot({ path: "scripts/shots/est-a-1440-q1-re.png" });
for (const pick of [
  "E-commerce & retail",
  "Answer customer questions",
  "Acts — updates records, sends messages",
  "2–3",
  "Yes — policies, product data, past tickets",
]) {
  await a.getByRole("button", { name: pick, exact: true }).click();
  await a.waitForTimeout(150);
}
await a.getByRole("button", { name: "Show my estimate", exact: true }).click();
await a.waitForTimeout(400);
await a.screenshot({ path: "scripts/shots/est-b-1440-top-re.png" });

console.log(errors.length ? "CONSOLE:\n" + errors.join("\n") : "console clean");
console.log("done");
await b.close();
