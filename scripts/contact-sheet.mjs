/**
 * Renders every wired product screenshot beside the caption it will
 * appear under, so image/caption mismatches are obvious before launch.
 *
 *   node scripts/contact-sheet.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const SLUGS = ["replydude", "decipher-engine"];
const publicDir = path.resolve("public").split(path.sep).join("/");

const rows = [];
for (const slug of SLUGS) {
  const file = `src/content/products/${slug}.ts`;
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, "utf8");
  const block = source.slice(source.indexOf("slides: ["));
  const re = /src:\s*"([^"]+)"[\s\S]*?caption:\s*"([^"]+)"/g;
  let m;
  let i = 0;
  while ((m = re.exec(block)) !== null && i < 4) {
    rows.push({ slug, n: ++i, src: m[1], caption: m[2] });
  }
}

if (rows.length === 0) {
  console.log("No wired slides found — run scripts/wire-product-images.mjs first.");
  process.exit(0);
}

const figure = (r) => `
<figure style="margin:0">
  <img src="file://${publicDir}${r.src}" style="width:100%;border:1px solid #403d36;border-radius:8px;display:block">
  <figcaption style="padding:8px 2px;color:#c8c5b9;line-height:1.45">
    <strong style="color:#eae5e1">${r.n}.</strong> ${r.caption}
  </figcaption>
</figure>`;

const section = (slug) => `
<h2 style="padding:20px 20px 6px;margin:0;font:600 13px system-ui;letter-spacing:.14em;text-transform:uppercase;color:#e96a42">${slug}</h2>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 20px 24px">
${rows.filter((r) => r.slug === slug).map(figure).join("")}
</div>`;

const html = `<!doctype html><meta charset="utf-8">
<body style="margin:0;background:#1a1917;font:14px system-ui;color:#eae5e1">
${SLUGS.map(section).join("")}
</body>`;

fs.writeFileSync("scripts/shots/_sheet.html", html);

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 1000 } });
await p.goto("file://" + path.resolve("scripts/shots/_sheet.html").split(path.sep).join("/"));
await p
  .waitForFunction(
    () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    null,
    { timeout: 30000 }
  )
  .catch(() => {});
await p.waitForTimeout(500);
await p.screenshot({ path: "scripts/shots/_contact-sheet.png", fullPage: true });
console.log(rows.map((r) => `  ${r.slug} ${r.n}: ${r.caption}`).join("\n"));
console.log("\nwrote scripts/shots/_contact-sheet.png");
await b.close();
