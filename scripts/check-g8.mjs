import { chromium } from "playwright";

const url = "http://localhost:3000/services/ai-agent-development";
const b = await chromium.launch();

// no-JS: all four industry bodies must be visible
const ctx = await b.newContext({ javaScriptEnabled: false });
let p = await ctx.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto(url, { waitUntil: "domcontentloaded" });
for (const t of [
  "Order triage, returns handling",
  "Support ticket routing",
  "Reporting, content pipelines",
  "Reconciliation, document processing",
]) {
  const vis = await p.locator(`text=${t}`).first().isVisible().catch(() => false);
  console.log(`no-JS "${t.slice(0, 26)}…": ${vis ? "VISIBLE" : "NOT VISIBLE"}`);
}
await ctx.close();

// hydrated: first open, others collapsed; toggle works
p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: "networkidle" });
await p.locator("text=Where AI agent development pays off fastest").scrollIntoViewIfNeeded();
await p.waitForTimeout(700);
const TITLES = [
  "E-commerce and DTC",
  "SaaS and software teams",
  "Agencies and marketing teams",
  "Operations and internal tools",
];
const states = await p.evaluate((titles) => {
  return [...document.querySelectorAll("button[aria-expanded]")]
    .filter((b) => titles.some((t) => b.textContent.includes(t)))
    .map((b) => `${b.textContent.trim().slice(0, 22)} => ${b.getAttribute("aria-expanded")}`);
}, TITLES);
console.log("hydrated aria-expanded:", JSON.stringify(states, null, 0));
await p.screenshot({ path: "scripts/shots/g8-industries.png" });
await p.getByRole("button", { name: "SaaS and software teams" }).click();
await p.waitForTimeout(500);
await p.screenshot({ path: "scripts/shots/g8-industries-open2.png" });
console.log("done");
await b.close();
