import { chromium } from "playwright";
import path from "node:path";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 900, height: 560 } });
const f = path.resolve("public/products/replydude/01-campaign-builder.png");
await p.goto("file://" + f);
await p.waitForTimeout(400);
await p.screenshot({ path: "scripts/shots/raw-01-campaign-builder.png" });
// sample some pixels to see if it's a flat colour
const info = await p.evaluate(async () => {
  const img = document.querySelector("img");
  if (!img) return { err: "no img element" };
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  c.getContext("2d").drawImage(img, 0, 0);
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  const seen = new Set();
  for (let i = 0; i < d.length; i += 4 * 997) seen.add(`${d[i]},${d[i+1]},${d[i+2]}`);
  return { w: img.naturalWidth, h: img.naturalHeight, distinctSampled: seen.size,
           sample: [...seen].slice(0, 6) };
});
console.log(JSON.stringify(info, null, 1));
await b.close();
