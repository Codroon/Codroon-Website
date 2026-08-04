import { chromium } from "playwright";
const MVP = "http://localhost:3000/tools/mvp-cost-calculator/estimate";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(MVP, { waitUntil: "networkidle" });

await p.getByRole("button", { name: "Consumer apps", exact: true }).click();
await p.waitForTimeout(600);
console.log("q after industry:", (await p.locator("h2").first().textContent())?.trim());

// sample the heading every 80ms after answering `type`
await p.getByRole("button", { name: "Landing page with a waitlist", exact: true }).click();
for (let i = 1; i <= 12; i++) {
  await p.waitForTimeout(80);
  const h = (await p.locator("h2").first().textContent())?.trim();
  console.log(`${String(i * 80).padStart(4)}ms  ${p.url().split("at=")[1] ?? "-"}  |  ${h}`);
}
await b.close();
