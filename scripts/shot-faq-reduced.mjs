import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 950 },
  reducedMotion: "reduce",
});
await page.goto("http://localhost:3000/#faq", { waitUntil: "networkidle" });
await page.evaluate(() => document.getElementById("faq")?.scrollIntoView({ block: "start" }));
await page.waitForTimeout(1200);
const el = await page.$("#faq");
await el.screenshot({ path: "scripts/shots/faq-reduced.png" });
await browser.close();
console.log("done");