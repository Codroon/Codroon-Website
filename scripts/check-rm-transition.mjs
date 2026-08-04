import { chromium } from "playwright";
const b = await chromium.launch();
for (const [label, opts] of [["normal", {}], ["reduced", { reducedMotion: "reduce" }]]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 }, ...opts });
  await p.goto("http://localhost:3000/products/decipher-engine", { waitUntil: "networkidle" });
  const s = await p.locator('[aria-roledescription="carousel"] > div').first().evaluate((el) => {
    const c = getComputedStyle(el);
    return { prop: c.transitionProperty, dur: c.transitionDuration, cls: el.className };
  });
  console.log(`${label}:`);
  console.log(`  transition-property: ${s.prop}`);
  console.log(`  transition-duration: ${s.dur}`);
  console.log(`  has transition class: ${/transition-\[aspect-ratio\]/.test(s.cls)}`);
  await p.close();
}
await b.close();
