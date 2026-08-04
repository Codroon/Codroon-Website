import { chromium } from "playwright";
const b = await chromium.launch();
const errs = [];

for (const slug of ["replydude", "decipher-engine"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${slug}: ${m.text()}`); });
  await p.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "networkidle" });
  await p.waitForFunction(() =>
    [...document.images].every((i) => i.complete && i.naturalWidth > 0),
    null, { timeout: 30000 }).catch(() => {});

  const dots = p.locator('button[aria-label^="Show screenshot"]');
  const n = await dots.count();
  console.log(`${slug}: ${n} dots`);
  for (let i = 0; i < n; i++) {
    await dots.nth(i).click();
    await p.waitForTimeout(1000); // let transform + ratio transitions land
    const img = p.locator('[aria-roledescription="slide"]').nth(i).locator("img");
    await img.scrollIntoViewIfNeeded().catch(() => {});
    await p.waitForTimeout(300);
    // measure fit: image box vs its frame box
    const fit = await p.evaluate((idx) => {
      const slide = document.querySelectorAll('[aria-roledescription="slide"]')[idx];
      const im = slide?.querySelector("img");
      const frame = im?.parentElement;
      if (!im || !frame) return null;
      const a = im.getBoundingClientRect(), f = frame.getBoundingClientRect();
      const rendered = { w: 0, h: 0 };
      // object-contain rendered size
      const ir = im.naturalWidth / im.naturalHeight, fr = f.width / f.height;
      if (ir > fr) { rendered.w = f.width; rendered.h = f.width / ir; }
      else { rendered.h = f.height; rendered.w = f.height * ir; }
      return {
        frame: { w: Math.round(f.width), h: Math.round(f.height) },
        image: { w: Math.round(rendered.w), h: Math.round(rendered.h) },
        gapX: Math.round(f.width - rendered.w),
        gapY: Math.round(f.height - rendered.h),
      };
    }, i);
    console.log(`  slide ${i + 1}: frame ${fit?.frame.w}x${fit?.frame.h}  image ${fit?.image.w}x${fit?.image.h}  gap ${fit?.gapX}x${fit?.gapY}`);
    const region = p.locator('[aria-roledescription="carousel"]');
    await region.screenshot({ path: `scripts/shots/cycle-${slug}-${i + 1}.png` });
  }
  await p.close();
}
console.log(errs.length ? "CONSOLE ERRORS:\n" + errs.join("\n") : "console clean");
await b.close();
