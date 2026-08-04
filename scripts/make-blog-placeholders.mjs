/**
 * Generates 3 brand-styled placeholder cover images for the DUMMY blog
 * posts (public/blog/dummy-{1..3}.png, 1200×675).
 * Replace with real cover art when real posts exist.
 * Run: node scripts/make-blog-placeholders.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("public/blog", { recursive: true });

const variants = [
  { glow: "right -140px top -140px", num: "01" },
  { glow: "left -140px bottom -140px", num: "02" },
  { glow: "right -140px bottom -140px", num: "03" },
];

const browser = await chromium.launch();
for (const [i, v] of variants.entries()) {
  const html = `<!doctype html><html><head><style>
    * { margin: 0; box-sizing: border-box; }
    body { width: 1200px; height: 675px; background: #232220; position: relative; overflow: hidden;
           font-family: Arial, Helvetica, sans-serif; }
    .glow { position: absolute; inset: 0;
            background: radial-gradient(circle 560px at ${v.glow.replace(/ /, " ").replace("px ", "px ")}, rgba(233,106,66,0.28), transparent 70%); }
    .grid { position: absolute; inset: 0;
            background-image: radial-gradient(#403d36 1.5px, transparent 1.5px);
            background-size: 44px 44px; opacity: .5; }
    .num { position: absolute; left: 64px; bottom: 40px; font-size: 200px; font-weight: 700;
           color: #2e2c28; letter-spacing: .04em; }
    .mark { position: absolute; right: 64px; top: 56px; font-size: 26px; font-weight: 700;
            letter-spacing: .22em; color: #c8c5b9; text-transform: uppercase; }
  </style></head><body>
    <div class="glow"></div><div class="grid"></div>
    <div class="num">${v.num}</div><div class="mark">Codroon</div>
  </body></html>`;
  const page = await browser.newPage({ viewport: { width: 1200, height: 675 } });
  await page.setContent(html);
  await page.screenshot({ path: `public/blog/dummy-${i + 1}.png` });
  await page.close();
}
await browser.close();
console.log("Wrote public/blog/dummy-1..3.png");
