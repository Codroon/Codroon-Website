import { chromium } from "playwright";

const URL = "http://localhost:3000/tools/ai-agent-cost-calculator/estimate";
const PICKS = [
  "E-commerce & retail",
  "Answer customer questions",
  "Acts — updates records, sends messages",
  "2–3",
  "Yes — policies, product data, past tickets",
];

async function toResults(p) {
  await p.goto(URL, { waitUntil: "networkidle" });
  for (const pick of PICKS) {
    await p.getByRole("button", { name: pick, exact: true }).click();
    await p.waitForTimeout(150);
  }
  await p.getByRole("button", { name: "Show my estimate", exact: true }).click();
  await p.waitForTimeout(400);
}

const b = await chromium.launch();
const errors = [];

// ---- 1440 ----
const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
d.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    errors.push(`${m.type()}: ${m.text()}`);
});
await toResults(d);
await d.screenshot({ path: "scripts/shots/est-b-1440-top.png" });

// toggle the two cuts from the spec's example line (−$4,500 · −7d)
await d.getByRole("checkbox", { name: /Skip retrieval/ }).check();
await d.getByRole("checkbox", { name: /Remove approval layer/ }).check();
await d.waitForTimeout(300);
await d.getByRole("heading", { name: "Bring it down", level: 2 }).scrollIntoViewIfNeeded();
await d.waitForTimeout(200);
await d.screenshot({ path: "scripts/shots/est-b-1440-cuts.png" });

// partial cut: integrations row repriced, not struck
await d.getByRole("checkbox", { name: /Drop one integration/ }).check();
await d.waitForTimeout(300);
await d.screenshot({ path: "scripts/shots/est-b-1440-allcuts.png" });

// below the fold: run cost + comparison table
await d.getByRole("heading", { name: "How this compares", level: 2 }).scrollIntoViewIfNeeded();
await d.waitForTimeout(200);
await d.screenshot({ path: "scripts/shots/est-b-1440-belowfold.png" });

// ---- 768 ----
const t = await b.newPage({ viewport: { width: 768, height: 1024 } });
await toResults(t);
await t.screenshot({ path: "scripts/shots/est-b-768-top.png" });

// ---- 375 ----
const m = await b.newPage({ viewport: { width: 375, height: 667 } });
await toResults(m);
await m.screenshot({ path: "scripts/shots/est-b-375-fold.png" });
await m.getByRole("checkbox", { name: /Skip retrieval/ }).check();
await m.getByRole("checkbox", { name: /Remove approval layer/ }).check();
await m.waitForTimeout(300);
await m.screenshot({ path: "scripts/shots/est-b-375-full.png", fullPage: true });
const ov = await m.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
console.log("mobile overflow:", ov + "px");

console.log(errors.length ? "CONSOLE:\n" + errors.join("\n") : "console clean");
console.log("done");
await b.close();
