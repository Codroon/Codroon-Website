import { chromium } from "playwright";
const b = await chromium.launch();
const errs = [];
// replydude is black by client decision, not its sampled blue.
for (const [slug, expect] of [["replydude", "#000000"], ["decipher-engine", "#7852b5"]]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${slug}: ${m.text()}`); });
  await p.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "networkidle" });
  await p.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0), null, { timeout: 30000 }).catch(()=>{});
  const carousel = p.locator('[aria-roledescription="carousel"]');
  await carousel.scrollIntoViewIfNeeded();
  await carousel.hover();               // pause autoplay so the shot is stable
  await p.waitForTimeout(900);
  const frame = carousel.locator("> div").first();
  const style = await frame.evaluate((el) => {
    const s = getComputedStyle(el);
    return { w: s.borderTopWidth, c: s.borderTopColor };
  });
  console.log(`${slug}: border ${style.w} ${style.c}  (expected ${expect})`);
  const bb = await frame.boundingBox();
  await p.screenshot({
    path: `scripts/shots/brand-frame-${slug}.png`,
    clip: { x: bb.x - 56, y: bb.y - 56, width: bb.width + 112, height: bb.height + 112 },
  });
  await p.close();
}
console.log(errs.length ? "CONSOLE ERRORS:\n" + errs.join("\n") : "console clean");
await b.close();
