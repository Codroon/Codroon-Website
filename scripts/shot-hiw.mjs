import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "scripts/shots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

// Find the 300vh "How It Works" section: the section that contains the
// "How it works" eyebrow.
const rect = await page.evaluate(() => {
  const eyebrows = Array.from(document.querySelectorAll("section *"));
  const el = eyebrows.find(
    (n) => n.textContent && n.textContent.trim().toLowerCase() === "how it works"
  );
  const section = el ? el.closest("section") : null;
  if (!section) return null;
  return { top: section.offsetTop, height: section.offsetHeight };
});

if (!rect) {
  console.log("SECTION NOT FOUND");
  await browser.close();
  process.exit(1);
}

console.log("section", rect, "innerH", 900);
const travel = rect.height - 900; // scrollable distance while pinned

const stops = [
  ["p00", 0.0],
  ["p20", 0.2],
  ["p40", 0.4],
  ["p55", 0.55],
  ["p70", 0.7],
  ["p90", 0.9],
];

for (const [name, p] of stops) {
  const y = Math.round(rect.top + p * travel);
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(1300);
  const prog = await page.evaluate(() => {
    // read the active number shown
    const nums = Array.from(document.querySelectorAll("span"))
      .map((s) => s.textContent?.trim())
      .filter((t) => t === "01" || t === "02" || t === "03");
    return nums.join(",");
  });
  await page.screenshot({ path: `${OUT}/hiw-${name}.png` });
  console.log(`${name} (scrollY=${y}) visibleNumbers=[${prog}]`);
}

await browser.close();
console.log("done");