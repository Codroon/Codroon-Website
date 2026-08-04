import { chromium } from "playwright";
const RESULTS =
  "http://localhost:3000/tools/mvp-cost-calculator/estimate" +
  "?e=abc234&industry=b2b&type=saas-mvp&users=two&money=subscriptions" +
  "&have=neither&integrations=2&ai=none&at=results";
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, "1440"], [375, 667, "375"]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(RESULTS, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Email me this estimate" }).click();
  await p.waitForTimeout(400);
  await p.screenshot({ path: `scripts/shots/cta-email-dialog-${tag}.png` });
  await p.close();
}
console.log("done");
await b.close();
