import { chromium } from "playwright";

const AGENT = "http://localhost:3000/tools/ai-agent-cost-calculator/estimate";
const MVP = "http://localhost:3000/tools/mvp-cost-calculator/estimate";

const AGENT_RESULTS =
  AGENT +
  "?industry=ecommerce&type=workflow-agent&access=takes-actions&systems=two-or-three&docs=few&approval=high-risk&volume=mid&at=results";
const MVP_RESULTS =
  MVP +
  "?industry=b2b&type=saas-mvp&users=two&money=subscriptions&have=neither&integrations=2&ai=none&at=results";
const MVP_BUDGET_FIT =
  MVP_RESULTS.replace("&at=results", "&budget=10-20k&at=results") +
  "&cuts=drop-second-user-type,skip-admin-panel,defer-onboarding";
const CEILING =
  MVP +
  "?type=marketplace-mvp&users=three-plus&money=between-users&have=neither&integrations=3&ai=is-the-product&at=results";
const AGENT_MID =
  AGENT + "?industry=ecommerce&type=workflow-agent&access=takes-actions&at=systems";
const MVP_INTERRUPT =
  MVP + "?type=saas-mvp&users=three-plus&money=none&have=neither&at=interrupt";

const b = await chromium.launch();

const shots = [
  ["agent-q1", AGENT, 1440, 900],
  ["agent-mid", AGENT_MID, 1440, 900],
  ["agent-results", AGENT_RESULTS, 1440, 900],
  ["mvp-q1", MVP, 1440, 900],
  ["mvp-interrupt", MVP_INTERRUPT, 1440, 900],
  ["mvp-results", MVP_RESULTS, 1440, 900],
  ["mvp-budget-fit", MVP_BUDGET_FIT, 1440, 900],
  ["ceiling", CEILING, 1440, 900],
  ["agent-q1-768", AGENT, 768, 1024],
  ["mvp-results-768", MVP_RESULTS, 768, 1024],
  ["agent-q1-375", AGENT, 375, 667],
  ["mvp-results-375", MVP_RESULTS, 375, 667],
];

for (const [name, url, w, h] of shots) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `scripts/shots/w-${name}.png` });
  await p.close();
}

// full-page results for review
for (const [name, url] of [
  ["agent-results-full", AGENT_RESULTS],
  ["mvp-results-full", MVP_RESULTS],
]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `scripts/shots/w-${name}.png`, fullPage: true });
  await p.close();
}

// mobile overflow on every key state
for (const [name, url] of [
  ["agent-q", AGENT],
  ["agent-res", AGENT_RESULTS],
  ["mvp-q", MVP],
  ["mvp-res", MVP_RESULTS],
  ["ceiling", CEILING],
]) {
  const p = await b.newPage({ viewport: { width: 375, height: 667 } });
  await p.goto(url, { waitUntil: "networkidle" });
  const ov = await p.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  console.log(`overflow ${name}: ${ov}px`);
  await p.close();
}

// reduced motion
const r = await b.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await r.goto(MVP_RESULTS, { waitUntil: "networkidle" });
await r.waitForTimeout(300);
await r.screenshot({ path: "scripts/shots/w-mvp-results-rm.png" });

console.log("done");
await b.close();
