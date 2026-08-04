import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(name, width, height, reduced = "no-preference") {
  const page = await browser.newPage({
    viewport: { width, height },
    reducedMotion: reduced,
  });
  await page.goto("http://localhost:3000/#solutions", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  // ensure the section is scrolled into view and settled
  await page.evaluate(() => {
    document.getElementById("solutions")?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(1400);
  const el = await page.$("#solutions");
  await el.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, "done");
  await page.close();
}

await shot("sol-desktop", 1440, 900);
await shot("sol-mobile", 390, 850);
await shot("sol-reduced", 1440, 900, "reduce");

await browser.close();
console.log("all done");