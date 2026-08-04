/**
 * Generates /public/og.png (1200×630) from brand tokens.
 * Run: node scripts/make-og.mjs
 */
import { chromium } from "playwright";

const html = `<!doctype html>
<html><head><style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #1a1917;
    font-family: Arial, Helvetica, sans-serif;
    color: #eae5e1;
    display: flex; flex-direction: column; justify-content: space-between;
    padding: 72px 80px;
    position: relative; overflow: hidden;
  }
  .glow {
    position: absolute; right: -220px; top: -220px;
    width: 640px; height: 640px; border-radius: 50%;
    background: radial-gradient(circle, rgba(233,106,66,0.32), transparent 68%);
  }
  .rule { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: #e96a42; }
  .wordmark { font-size: 44px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }
  h1 { font-size: 84px; line-height: 1.08; font-weight: 600; letter-spacing: -0.02em; max-width: 980px; }
  h1 .accent { color: #e96a42; }
  .sub { font-size: 30px; color: #c8c5b9; }
  .foot { display: flex; justify-content: space-between; align-items: flex-end; }
</style></head>
<body>
  <div class="glow"></div>
  <div class="wordmark">Codroon</div>
  <h1>Ship your AI product in <span class="accent">weeks</span>, not months.</h1>
  <div class="foot">
    <div class="sub">AI-native software studio · Dallas, TX</div>
    <div class="sub">codroon.com</div>
  </div>
  <div class="rule"></div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "networkidle" });
await page.screenshot({ path: "public/og.png" });
await browser.close();
console.log("Wrote public/og.png (1200x630)");
