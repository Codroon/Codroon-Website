import { chromium } from "playwright";
import { mkdirSync } from "fs";
const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

async function shot(name, width, height, reduced = "no-preference") {
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced });
  await page.goto("http://localhost:3000/#products", { waitUntil: "networkidle" });

  // scroll the whole page top→bottom so every whileInView row reveals (once)
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
  });
  await page.waitForTimeout(900);
  await page.evaluate(() => document.getElementById("products")?.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(400);

  const el = await page.$("#products");
  await el.screenshot({ path: `${OUT}/${name}.png` });
  console.log(name, "done");
  await page.close();
}

await shot("prod-desktop", 1440, 1000);
await shot("prod-mobile", 390, 850);
await browser.close();
console.log("all done");