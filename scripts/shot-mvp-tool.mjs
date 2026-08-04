import { chromium } from "playwright";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/tools/mvp-cost-calculator", { waitUntil: "networkidle" });

for (const [name, heading] of [
  ["table", "Typical MVP cost by product type"],
  ["cutlist", "What you can cut, and what it saves"],
]) {
  await p.getByRole("heading", { name: heading, level: 2 }).scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  await p.screenshot({ path: `scripts/shots/m2-${name}.png` });
}
// what-not-to-cut + related strip
await p.getByRole("heading", { name: "What not to cut", level: 3 }).scrollIntoViewIfNeeded();
await p.waitForTimeout(500);
await p.screenshot({ path: "scripts/shots/m2-notcut.png" });

const m = await b.newPage({ viewport: { width: 375, height: 720 } });
await m.goto("http://localhost:3000/tools/mvp-cost-calculator", { waitUntil: "networkidle" });
const ov = await m.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
console.log("mobile overflow:", ov + "px");
console.log("done");
await b.close();
