import { chromium } from "playwright";

const MVP = "http://localhost:3000/tools/mvp-cost-calculator/estimate";
const b = await chromium.launch();

// first question — privacy note
const q = await b.newPage({ viewport: { width: 1440, height: 900 } });
await q.goto(MVP, { waitUntil: "networkidle" });
await q.waitForTimeout(400);
await q.screenshot({ path: "scripts/shots/p-privacy-note.png" });

// results — copy link control
const r = await b.newPage({ viewport: { width: 1440, height: 900 } });
await r.goto(
  MVP +
    "?e=abc234&industry=b2b&type=saas-mvp&users=two&money=subscriptions&have=neither&integrations=2&ai=none&at=results",
  { waitUntil: "networkidle" }
);
await r.waitForTimeout(600);
await r.screenshot({ path: "scripts/shots/p-copy-link.png" });

// 404 for an unknown short code
const nf = await b.newPage({ viewport: { width: 1440, height: 900 } });
await nf.goto("http://localhost:3000/e/zzzzzz", { waitUntil: "networkidle" });
await nf.waitForTimeout(300);
await nf.screenshot({ path: "scripts/shots/p-share-404.png" });

// mobile
const m = await b.newPage({ viewport: { width: 375, height: 667 } });
await m.goto(MVP, { waitUntil: "networkidle" });
const ov = await m.evaluate(
  () => document.documentElement.scrollWidth - document.documentElement.clientWidth
);
console.log("mobile overflow:", ov + "px");
await m.screenshot({ path: "scripts/shots/p-privacy-375.png" });

console.log("done");
await b.close();
