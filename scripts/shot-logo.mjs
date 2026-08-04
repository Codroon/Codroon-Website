import { chromium } from "playwright";
import { mkdirSync } from "fs";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

// navbar over hero (top of page)
const page = await browser.newPage({ viewport: { width: 1440, height: 300 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/logo-navbar.png` });
console.log("logo-navbar done");

// scrolled navbar (frosted bg) — crop top
await page.evaluate(() => window.scrollTo(0, 400));
await page.waitForTimeout(500);
await page.screenshot({ path: `${OUT}/logo-navbar-scrolled.png` });
console.log("logo-navbar-scrolled done");
await page.close();

await browser.close();
console.log("done");