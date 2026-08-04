import { chromium } from "playwright";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3000/tools/ai-agent-cost-calculator", { waitUntil: "networkidle" });
await p.evaluate(() => window.scrollTo(0, 700));
await p.waitForTimeout(600);
await p.screenshot({ path: "scripts/shots/t3-quickanswer.png" });
await p.getByRole("heading", { name: "What does it cost to run an AI agent each month?", level: 2 }).scrollIntoViewIfNeeded();
await p.evaluate(() => window.scrollBy(0, 500));
await p.waitForTimeout(600);
await p.screenshot({ path: "scripts/shots/t3-worked.png" });
console.log("done");
await b.close();
