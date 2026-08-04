/**
 * Pulls each product's own brand colour out of its marketing screenshot,
 * so the slider frame can be tinted to match the product rather than to
 * a colour someone eyeballed.
 *
 * Ranks saturated, mid-to-bright pixels by frequency and reports the
 * top clusters with their contrast against the page background.
 */
import { chromium } from "playwright";
import path from "node:path";

const PAGE_BG = [0x1a, 0x19, 0x17]; // --surface-page

const TARGETS = [
  ["replydude", "public/products/replydude/01-replydude-site.png"],
  ["decipher-engine", "public/products/decipher-engine/01-decipher-site.png"],
];

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrast = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

const b = await chromium.launch();
const p = await b.newPage();

for (const [slug, file] of TARGETS) {
  await p.goto("file://" + path.resolve(file).split(path.sep).join("/"));
  await p.waitForTimeout(300);

  const clusters = await p.evaluate(() => {
    const img = document.querySelector("img");
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;

    const bucket = new Map();
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], bl = d[i + 2];
      const max = Math.max(r, g, bl), min = Math.min(r, g, bl);
      const v = max / 255;
      const s = max === 0 ? 0 : (max - min) / max;
      // saturated and bright enough to read as a brand colour, and not
      // near-white (which is just text)
      // Vivid only. A looser filter surfaces background gradients
      // (Decipher's nebula) instead of the actual brand colour.
      if (s < 0.5 || v < 0.5 || v > 0.97) continue;
      // quantise so near-identical pixels group
      const key = `${r >> 4},${g >> 4},${bl >> 4}`;
      const e = bucket.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
      e.n++; e.r += r; e.g += g; e.b += bl;
      bucket.set(key, e);
    }
    return [...bucket.values()]
      .sort((a, z) => z.n - a.n)
      .slice(0, 6)
      .map((e) => ({
        n: e.n,
        rgb: [Math.round(e.r / e.n), Math.round(e.g / e.n), Math.round(e.b / e.n)],
      }));
  });

  console.log(`\n${slug}`);
  for (const c of clusters) {
    const hex = "#" + c.rgb.map((v) => v.toString(16).padStart(2, "0")).join("");
    console.log(
      `  ${hex}  rgb(${c.rgb.join(", ")})  ${String(c.n).padStart(7)} px` +
        `  contrast vs page bg ${contrast(c.rgb, PAGE_BG).toFixed(2)}:1`
    );
  }
}

await b.close();
