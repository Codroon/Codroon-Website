/** Full-page no-JS + reduced-motion sweep for the service page. */
import { chromium } from "playwright";

const URL = "http://localhost:3000/services/ai-agent-development";
const CHECKS = [
  ["hero", "Codroon is an AI agent development company that builds"],
  ["what-is", "AI agent development is the process of building software"],
  ["table cell", "Chains tools across systems"],
  ["table closing", "Most teams asking for a chatbot want an agent"],
  ["sub-service 2", "Several specialised agents coordinating"],
  ["process step 3", "We build in weekly increments"],
  ["tech protocols", "MCP is the vertical bus"],
  ["industry 4", "Reconciliation, document processing"],
  ["pricing", "Most AI agent projects with Codroon run"],
  ["faq quick answers", "Most AI agent projects take three to six weeks"],
  ["faq a6", "Whichever benchmarks best on your task"],
  ["final cta", "Forty-five minutes, no prep, no commitment"],
];

const b = await chromium.launch();
const ctx = await b.newContext({ javaScriptEnabled: false });
const p = await ctx.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto(URL, { waitUntil: "domcontentloaded" });
let fails = 0;
for (const [name, text] of CHECKS) {
  const vis = await p.locator(`text=${text}`).first().isVisible().catch(() => false);
  if (!vis) {
    fails++;
    console.log(`no-JS ${name}: NOT VISIBLE`);
  }
}
console.log(fails === 0 ? `no-JS: all ${CHECKS.length} sections readable` : `${fails} failures`);
await ctx.close();

// reduced motion: afv animation frozen + content visible
const ctx2 = await b.newContext({ reducedMotion: "reduce" });
const p2 = await ctx2.newPage();
await p2.setViewportSize({ width: 1440, height: 900 });
await p2.goto(URL, { waitUntil: "networkidle" });
const dur = await p2.evaluate(() => {
  const el = document.querySelector(".afv-flow");
  return el ? getComputedStyle(el).animationDuration : "no element";
});
console.log(`reduced-motion afv animation-duration: ${dur}`);
await ctx2.close();
await b.close();
console.log("sweep done");
