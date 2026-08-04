/** Viewport shots after REAL scrolling (IntersectionObserver fires). */
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.screenshot({ path: "scripts/shots/hero-viewport.png" });

for (const [name, sel] of [
  ["why", "#why-codroon"],
  ["footer", "footer"],
]) {
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // settle > animation duration
  await page.screenshot({ path: `scripts/shots/scrolled-${name}.png` });
}
console.log("done");
await browser.close();
