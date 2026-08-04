import { chromium } from "playwright";
const b = await chromium.launch();
const errs = [];

async function settle(p) {
  // wait until every <img> has actually decoded, not just laid out
  await p.waitForFunction(() =>
    [...document.querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0),
    null, { timeout: 30000 }
  ).catch(() => {});
  await p.waitForTimeout(600);
}

for (const slug of ["replydude", "decipher-engine"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${slug}: ${m.text()}`); });
  await p.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "networkidle" });
  await p.locator("img").first().scrollIntoViewIfNeeded().catch(() => {});
  await settle(p);
  await p.screenshot({ path: `scripts/shots/prod-${slug}-slide1.png` });

  const dots = p.locator('button[aria-label*="lide" i], [role="tab"]');
  if ((await dots.count()) > 2) {
    await dots.nth(2).click().catch(() => {});
    await settle(p);
    await p.screenshot({ path: `scripts/shots/prod-${slug}-slide3.png` });
  }
  await p.close();
}

const mob = await b.newPage({ viewport: { width: 375, height: 720 } });
await mob.goto("http://localhost:3000/products/replydude", { waitUntil: "networkidle" });
await mob.locator("img").first().scrollIntoViewIfNeeded().catch(() => {});
await settle(mob);
await mob.screenshot({ path: "scripts/shots/prod-replydude-375.png" });
const ov = await mob.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log("mobile overflow:", ov + "px");
console.log(errs.length ? "CONSOLE ERRORS:\n" + errs.join("\n") : "console clean");
await b.close();
