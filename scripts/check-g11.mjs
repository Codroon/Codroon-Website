import { chromium } from "playwright";

const url = "http://localhost:3000/services/ai-agent-development";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: "networkidle" });
await p.locator("text=Let's find out if an agent is the right answer").scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
await p.screenshot({ path: "scripts/shots/g11-cta.png" });

// the CTA must open the shared modal (no inline form on the page)
const inlineForms = await p.evaluate(
  () => document.querySelectorAll("main form").length
);
console.log("inline forms on page:", inlineForms);
await p.getByRole("button", { name: "Book a free discovery call" }).click();
await p.waitForTimeout(700);
const dialogVisible = await p.getByRole("dialog").isVisible().catch(() => false);
console.log("shared modal opens:", dialogVisible);
await p.screenshot({ path: "scripts/shots/g11-cta-modal.png" });
console.log("done");
await b.close();
