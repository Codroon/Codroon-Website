/** Viewport shots of the round-2 changes after real scrolling. */
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.screenshot({ path: "scripts/shots/r2-hero.png" });

// services — two scroll positions to show the sticky heading holding
const svc = await page.evaluate(() => {
  const el = document.querySelector("#services");
  return { top: el.offsetTop, height: el.offsetHeight };
});
await page.evaluate((y) => window.scrollTo(0, y), svc.top - 80);
await page.waitForTimeout(1500);
await page.screenshot({ path: "scripts/shots/r2-services-a.png" });
await page.evaluate((y) => window.scrollTo(0, y), svc.top + Math.round(svc.height * 0.55));
await page.waitForTimeout(1500);
await page.screenshot({ path: "scripts/shots/r2-services-b.png" });

for (const [name, sel] of [
  ["products", "#products"],
  ["testimonials", "#testimonials"],
  ["blog", "#blog"],
]) {
  await page.locator(sel).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `scripts/shots/r2-${name}.png` });
}
console.log("done");
await browser.close();
