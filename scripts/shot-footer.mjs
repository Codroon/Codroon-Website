import { chromium } from "playwright";
import { mkdirSync } from "fs";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

// footer desktop
let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await (await page.$("footer")).screenshot({ path: `${OUT}/footer-desktop.png` });
console.log("footer-desktop done");
await page.close();

// footer mobile
page = await browser.newPage({ viewport: { width: 390, height: 850 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1200);
await (await page.$("footer")).screenshot({ path: `${OUT}/footer-mobile.png` });
console.log("footer-mobile done");
await page.close();

// privacy page
page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto("http://localhost:3000/privacy", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/privacy.png` });
console.log("privacy done");
await page.close();

await browser.close();
console.log("all done");