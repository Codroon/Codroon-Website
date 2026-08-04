import { chromium } from "playwright";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/tools/ai-agent-cost-calculator", { waitUntil: "networkidle" });

for (const [name, heading] of [
  ["costtable", "Typical AI agent cost by type"],
  ["runcost", "What does it cost to run an AI agent each month?"],
  ["finalcta", "See what your agent would cost"],
]) {
  await p.getByRole("heading", { name: heading, level: 2 }).scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await p.screenshot({ path: `scripts/shots/t2-${name}.png` });
}

const m = await b.newPage({ viewport: { width: 375, height: 720 } });
await m.goto("http://localhost:3000/tools/ai-agent-cost-calculator", { waitUntil: "networkidle" });
const ov = await m.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
console.log("mobile overflow:", ov + "px");
const wraps = await m.evaluate(() =>
  [...document.querySelectorAll("table")].map(
    (t) => t.parentElement.scrollWidth > t.parentElement.clientWidth
  )
);
console.log("mobile table wrappers scrollable:", JSON.stringify(wraps));
console.log("done");
await b.close();
