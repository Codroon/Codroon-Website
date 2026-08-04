import { chromium } from "playwright";
import { mkdirSync } from "fs";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/#faq", { waitUntil: "networkidle" });
  await page.evaluate(() => document.getElementById("faq")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(1000);
  // open a second item to show accordion behaviour
  await page.evaluate(() => {
    const btns = document.querySelectorAll('#faq button[aria-controls^="faq-panel"]');
    if (btns[2]) btns[2].click();
  });
  await page.waitForTimeout(700);
  const el = await page.$("#faq");
  await el.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, "done");
  await page.close();
}

await shot("faq-desktop", 1440, 950);
await shot("faq-mobile", 390, 850);
await browser.close();
console.log("all done");