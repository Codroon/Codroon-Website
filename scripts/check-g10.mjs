/** GATE 10 verification: FAQPage JSON-LD ↔ visible text parity, no-JS, a11y. */
import { chromium } from "playwright";

const url = "http://localhost:3000/services/ai-agent-development";
const b = await chromium.launch();

// 1) JSON-LD ↔ visible text parity (raw SSR HTML)
const p0 = await b.newPage();
const resp = await p0.goto(url, { waitUntil: "domcontentloaded" });
const html = await resp.text();
const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
  (m) => JSON.parse(m[1].replace(/\\u003c/g, "<"))
);
const faq = blocks.find((x) => x["@type"] === "FAQPage");
if (!faq) {
  console.log("FAQPage JSON-LD: MISSING");
} else {
  console.log(`FAQPage JSON-LD: present, ${faq.mainEntity.length} questions`);
  const text = html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/&amp;/g, "&").replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/<[^>]+>/g, " ");
  let mismatches = 0;
  for (const q of faq.mainEntity) {
    const qOk = text.includes(q.name);
    const aOk = text.includes(q.acceptedAnswer.text);
    if (!qOk || !aOk) {
      mismatches++;
      console.log(`  MISMATCH: ${q.name.slice(0, 40)}… (q:${qOk} a:${aOk})`);
    }
  }
  console.log(mismatches === 0 ? "  all 7 Q&As match visible text exactly" : `  ${mismatches} mismatches`);
}
await p0.close();

// 2) no-JS: quick answers + a middle answer visible
const ctx = await b.newContext({ javaScriptEnabled: false });
const p1 = await ctx.newPage();
await p1.setViewportSize({ width: 1440, height: 900 });
await p1.goto(url, { waitUntil: "domcontentloaded" });
for (const t of [
  "Most AI agent projects take three to six weeks",
  "Yes, entirely. Repository, prompts, evals",
]) {
  const vis = await p1.locator(`text=${t}`).first().isVisible().catch(() => false);
  console.log(`no-JS "${t.slice(0, 30)}…": ${vis ? "VISIBLE" : "NOT VISIBLE"}`);
}
await ctx.close();

// 3) hydrated accordion + screenshot
const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p2.goto(url, { waitUntil: "networkidle" });
await p2.locator("text=AI agent development: common questions").scrollIntoViewIfNeeded();
await p2.waitForTimeout(700);
const expandedCount = await p2.evaluate(() => {
  const qs = [
    "difference between an AI agent",
    "How long does it take",
    "How much does AI agent",
    "Do I own the agent",
    "data is messy",
    "Which model do you use",
    "after the agent goes live",
  ];
  const btns = [...document.querySelectorAll("button[aria-expanded]")].filter((b) =>
    qs.some((q) => b.textContent.includes(q))
  );
  return {
    total: btns.length,
    open: btns.filter((b) => b.getAttribute("aria-expanded") === "true").length,
  };
});
console.log(`hydrated: ${expandedCount.total} FAQ buttons, ${expandedCount.open} open`);
await p2.screenshot({ path: "scripts/shots/g10-faq.png" });
console.log("done");
await b.close();
