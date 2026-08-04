import { chromium } from "playwright";
const MVP = "http://localhost:3000/tools/mvp-cost-calculator/estimate";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(MVP, { waitUntil: "networkidle" });

const q = () => p.url().split("?")[1] ?? "(none)";
async function pick(name) {
  await p.getByRole("button", { name, exact: true }).click();
  await p.waitForTimeout(500);
  console.log(`after picking "${name}": ${q()}`);
}
console.log("start:", q());
await pick("B2B services");
await pick("SaaS tool");
await pick("Two");

await p.goBack({ waitUntil: "networkidle" });
await p.waitForTimeout(400);
console.log("goBack 1:", q(), "| h2:", (await p.locator("h2").first().textContent())?.trim());
console.log("   mainLen:", ((await p.locator("main").textContent()) ?? "").length);
console.log("   hasUsersQ:", ((await p.locator("main").textContent()) ?? "").includes("How many kinds of user"));
await p.goBack({ waitUntil: "networkidle" });
await p.waitForTimeout(400);
console.log("goBack 2:", q());
const heading = await p.locator("h2").first().textContent();
const pressed = await p.locator('button[aria-pressed="true"]').count();
console.log("heading:", heading, "| pressed:", pressed);
await b.close();
