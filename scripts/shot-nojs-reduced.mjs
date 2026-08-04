/** No-JS + reduced-motion verification for the rebuilt page. */
import { chromium } from "playwright";

const browser = await chromium.launch();

// 1) JavaScript disabled — all three HowItWorks steps must be readable
const ctx1 = await browser.newContext({ javaScriptEnabled: false });
const p1 = await ctx1.newPage();
await p1.setViewportSize({ width: 1440, height: 900 });
await p1.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
for (const t of ["Free discovery call", "We map your workflow", "Shipped in weeks"]) {
  const el = p1.locator(`text=${t}`).first();
  const visible = await el.isVisible().catch(() => false);
  console.log(`no-JS "${t}": ${visible ? "VISIBLE" : "NOT VISIBLE"}`);
}
// hero + services also must be visible without JS
for (const t of ["Ship your AI product in weeks, not months.", "What we build."]) {
  const visible = await p1.locator(`text=${t}`).first().isVisible().catch(() => false);
  console.log(`no-JS "${t}": ${visible ? "VISIBLE" : "NOT VISIBLE"}`);
}
await p1.locator("#how-it-works").scrollIntoViewIfNeeded();
await p1.screenshot({ path: "scripts/shots/nojs-hiw.png" });
await ctx1.close();

// 2) prefers-reduced-motion — steps render statically, page intact
const ctx2 = await browser.newContext({ reducedMotion: "reduce" });
const p2 = await ctx2.newPage();
await p2.setViewportSize({ width: 1440, height: 900 });
await p2.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await p2.locator("#how-it-works").scrollIntoViewIfNeeded();
await p2.waitForTimeout(800);
await p2.screenshot({ path: "scripts/shots/reduced-hiw.png" });
for (const t of ["Free discovery call", "We map your workflow", "Shipped in weeks"]) {
  const visible = await p2.locator(`text=${t}`).first().isVisible().catch(() => false);
  console.log(`reduced-motion "${t}": ${visible ? "VISIBLE" : "NOT VISIBLE"}`);
}
await ctx2.close();

await browser.close();
console.log("done");
