import { chromium } from "playwright";
const b = await chromium.launch();
const m = await b.newPage({ viewport: { width: 375, height: 720 } });
await m.goto("http://localhost:3000/products/replydude", { waitUntil: "networkidle" });
const ov = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("mobile overflow:", ov + "px");
const r = await b.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: "reduce" });
await r.goto("http://localhost:3000/products/decipher-engine", { waitUntil: "networkidle" });
const moved = await r.evaluate(async () => {
  const first = document.querySelector('[aria-roledescription="slide"] img')?.src;
  await new Promise((res) => setTimeout(res, 8000));
  const after = document.querySelector('[aria-roledescription="carousel"] [style*="translateX"]')?.getAttribute("style");
  return { first: !!first, transform: after };
});
console.log("reduced motion — autoplay transform after 8s:", moved.transform);
await b.close();
