import { chromium } from "playwright";

const URL = "http://localhost:3000/tools/ai-agent-cost-calculator/estimate";
const FIRST_PICKS = [
  "E-commerce & retail",
  "Answer customer questions",
  "Acts — updates records, sends messages",
  "2–3",
  "Yes — policies, product data, past tickets",
];

const b = await chromium.launch();

// ---- 1440: initial, mid-flow (2 answers), 4 answers, interstitial ----
const errors = [];
const d = await b.newPage({ viewport: { width: 1440, height: 900 } });
d.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    errors.push(`${m.type()}: ${m.text()}`);
});
await d.goto(URL, { waitUntil: "networkidle" });
await d.screenshot({ path: "scripts/shots/est-a-1440-q1.png" });

for (let i = 0; i < FIRST_PICKS.length; i++) {
  await d.getByRole("button", { name: FIRST_PICKS[i], exact: true }).click();
  await d.waitForTimeout(650); // let the bar transition land
  if (i === 1) await d.screenshot({ path: "scripts/shots/est-a-1440-2ans.png" });
  if (i === 3) await d.screenshot({ path: "scripts/shots/est-a-1440-4ans.png" });
}
await d.screenshot({ path: "scripts/shots/est-a-1440-interstitial.png" });

// back from interstitial → Q5 should show its selected accent border
await d.getByRole("button", { name: "Back", exact: true }).click();
await d.waitForTimeout(400);
await d.screenshot({ path: "scripts/shots/est-a-1440-back-selected.png" });

// ---- 768 ----
const t = await b.newPage({ viewport: { width: 768, height: 1024 } });
await t.goto(URL, { waitUntil: "networkidle" });
await t.screenshot({ path: "scripts/shots/est-a-768-q1.png" });
for (const pick of FIRST_PICKS.slice(0, 2)) {
  await t.getByRole("button", { name: pick, exact: true }).click();
  await t.waitForTimeout(650);
}
await t.screenshot({ path: "scripts/shots/est-a-768-2ans.png" });

// ---- 375 ----
const m = await b.newPage({ viewport: { width: 375, height: 667 } });
await m.goto(URL, { waitUntil: "networkidle" });
await m.screenshot({ path: "scripts/shots/est-a-375-fold.png" }); // above-the-fold check
await m.screenshot({ path: "scripts/shots/est-a-375-full.png", fullPage: true });
for (const pick of FIRST_PICKS) {
  await m.getByRole("button", { name: pick, exact: true }).click();
  await m.waitForTimeout(650);
}
await m.screenshot({ path: "scripts/shots/est-a-375-interstitial.png", fullPage: true });
const ov = await m.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
console.log("mobile overflow:", ov + "px");

// ---- reduced motion: instant updates, no assembly animation ----
const r = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await r.goto(URL, { waitUntil: "networkidle" });
for (const pick of FIRST_PICKS.slice(0, 3)) {
  await r.getByRole("button", { name: pick, exact: true }).click();
  await r.waitForTimeout(80);
}
await r.screenshot({ path: "scripts/shots/est-a-rm-3ans.png" });

console.log(errors.length ? "CONSOLE:\n" + errors.join("\n") : "console clean");
console.log("done");
await b.close();
