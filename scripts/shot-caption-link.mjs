import { chromium } from "playwright";
const b = await chromium.launch();
for (const slug of ["replydude", "decipher-engine"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  await p.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "networkidle" });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 }).catch(() => {});
  const carousel = p.locator('[aria-roledescription="carousel"]');
  await carousel.scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  const link = carousel.locator("a");
  const href = await link.getAttribute("href");
  const rel = await link.getAttribute("rel");
  const target = await link.getAttribute("target");
  console.log(`${slug}: href=${href} target=${target} rel=${rel}`);
  await carousel.screenshot({ path: `scripts/shots/caption-link-${slug}.png` });
  // link must vanish on an app-screenshot slide
  await p.locator('button[aria-label^="Show screenshot 2"]').click();
  await p.waitForTimeout(900);
  console.log(`  slide 2 has link: ${await carousel.locator("a").count()}`);
  await p.close();
}
await b.close();
