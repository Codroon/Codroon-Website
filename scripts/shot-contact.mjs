import { chromium } from "playwright";
import { mkdirSync } from "fs";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function go(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/#contact", { waitUntil: "networkidle" });
  await page.evaluate(() => document.getElementById("contact")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1000);
  return page;
}

// desktop
let page = await go(1440, 950);
let el = await page.$("#contact");
await el.screenshot({ path: `${OUT}/contact-desktop.png` });
console.log("desktop done");
await page.close();

// mobile
page = await go(390, 850);
el = await page.$("#contact");
await el.screenshot({ path: `${OUT}/contact-mobile.png` });
console.log("mobile done");
await page.close();

// success state — fill + submit
page = await go(1440, 950);
await page.fill("#cf-name", "Alex Founder");
await page.fill("#cf-email", "alex@startup.com");
await page.click('button[aria-pressed]'); // toggle first chip
await page.fill("#cf-message", "We want to automate our customer onboarding workflow.");
await page.click('button[type="submit"]');
await page.waitForTimeout(1200);
el = await page.$("#contact");
await el.screenshot({ path: `${OUT}/contact-success.png` });
console.log("success done");
await page.close();

await browser.close();
console.log("all done");