/**
 * Full-page + per-section screenshots of the rebuilt landing page at
 * the three spec widths (375 / 768 / 1440), plus the contact modal.
 * Run with the dev server up: node scripts/shot-revamp.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const [name, width, height] of [
  ["mobile-375", 375, 720],
  ["tablet-768", 768, 900],
  ["desktop-1440", 1440, 900],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1400); // settle past entrance animations
  await page.screenshot({ path: `${OUT}/home-${name}.png`, fullPage: true });

  // horizontal overflow check
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log(`${name}: full-page ok, horizontal overflow = ${overflow}px`);
  await page.close();
}

// contact modal (desktop)
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Start a project" }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/modal-menu.png` });
await page.getByRole("button", { name: /Get a call/i }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/modal-call.png`, fullPage: false });
console.log("modal shots ok");

// a service stub page
await page.goto("http://localhost:3000/services/ai-agent-development", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/service-stub.png`, fullPage: true });
console.log("service stub shot ok");

await browser.close();
