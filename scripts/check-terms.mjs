import { readFileSync } from "node:fs";
import { chromium } from "playwright";

/**
 * /terms QA, mirroring check-privacy.mjs. Same first job: prove the
 * rendered page says exactly what the deck says, then the structure.
 *
 * The one thing this page does that the privacy page does not is the
 * two-way commitments table, so that gets its own assertions: both
 * headers are column headers, neither side is subordinate, and both
 * columns carry all six rows.
 */
const BASE = "http://localhost:3000";
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const b = await chromium.launch();
const errs = [];
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto(`${BASE}/terms`, { waitUntil: "networkidle" });

console.log("── copy is verbatim ──");
{
  const src = readFileSync("src/content/terms.ts", "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/export const TERMS_META[\s\S]*?\n};/, "");
  const text = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  const strings = [
    ...src.matchAll(/"([^"\\\n]{40,})"/g),
    ...src.matchAll(/'([^'\\\n]{40,})'/g),
  ].map((m) => m[1]);
  const missing = strings.filter((s) => !text.includes(s.replace(/\s+/g, " ")));
  ok(`all ${strings.length} copy strings render verbatim`, missing.length === 0,
    missing.slice(0, 2).join(" // "));

  const meta = await p.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    robots: document.querySelector('meta[name="robots"]')?.content ?? null,
  }));
  ok("title tag verbatim", meta.title === "Terms of Service | Codroon", meta.title);
  ok("meta description verbatim",
    meta.desc === "The terms covering Codroon's website, cost estimators, and development work. Including what we commit to and what we need from you.",
    meta.desc);
  ok("canonical set", meta.canonical === "https://codroon.com/terms", meta.canonical);
  ok("NOT noindex", !/noindex/i.test(meta.robots ?? ""), String(meta.robots));
  // the standing client rule, and the one punctuation change from the deck
  ok("no em or en dash in body copy", !/[—–]/.test(text));
  ok("no defined-term capitalisation", !/\bthe Company\b|\bthe Client\b/.test(text));
}

console.log("\n── structure ──");
{
  const h = await p.evaluate(() => {
    const hs = [...document.querySelectorAll("main h1, main h2")];
    return {
      h1: hs.filter((x) => x.tagName === "H1").length,
      policyH2s: [...document.querySelectorAll("main section > h2")].map((e) => e.innerText.trim()),
    };
  });
  ok("exactly one H1", h.h1 === 1, String(h.h1));
  // 21 deck sections: §1 is the header (H1), §19 is withheld pending the
  // jurisdiction decision, so 19 H2s render
  ok("every deck section renders except governing law", h.policyH2s.length === 19,
    `${h.policyH2s.length} H2s`);
  ok("governing law is withheld, not stubbed",
    !h.policyH2s.includes("Governing law"), h.policyH2s.join(" | "));

  const date = await p.evaluate(() => {
    const el = [...document.querySelectorAll("main p")].find((e) => e.innerText.startsWith("Last updated:"));
    const cs = getComputedStyle(el);
    return { text: el.innerText.trim(), font: cs.fontFamily, size: parseFloat(cs.fontSize),
      top: Math.round(el.getBoundingClientRect().top + window.scrollY) };
  });
  ok("last-updated near the top", date.top < 500, `${date.text} @${date.top}px`);
  ok("last-updated in the display face", /Bricolage/.test(date.font), date.font);
  ok("last-updated is prominent", date.size >= 22, `${date.size}px`);
}

console.log("\n── §2 the two-way table ──");
{
  const t = await p.evaluate(() => {
    const tb = document.querySelector("main table");
    return {
      tables: document.querySelectorAll("main table").length,
      cols: [...tb.querySelectorAll('th[scope="col"]')].map((e) => e.innerText.trim()),
      rowHeaders: tb.querySelectorAll('th[scope="row"]').length,
      rows: tb.querySelectorAll("tbody tr").length,
      cellsPerRow: [...tb.querySelectorAll("tbody tr")].map((r) => r.children.length),
      divs: tb.querySelectorAll("div").length,
      caption: !!tb.querySelector("caption"),
      widths: [...tb.querySelectorAll("tbody tr:first-child td")]
        .map((c) => Math.round(c.getBoundingClientRect().width)),
    };
  });
  ok("one table on the page", t.tables === 1, String(t.tables));
  ok("both headers are column headers", t.cols.length === 2, t.cols.join(" | "));
  ok("headers read both ways",
    t.cols[0] === "WHAT WE COMMIT TO" && t.cols[1] === "WHAT WE NEED FROM YOU", t.cols.join(" | "));
  ok("neither column is subordinate (no row headers)", t.rowHeaders === 0, String(t.rowHeaders));
  ok("six rows, two cells each", t.rows === 6 && t.cellsPerRow.every((n) => n === 2),
    `${t.rows} rows / ${t.cellsPerRow.join(",")}`);
  ok("not built from divs", t.divs === 0);
  ok("carries a caption", t.caption);
  ok("columns are equal peers in width", Math.abs(t.widths[0] - t.widths[1]) <= 2, t.widths.join(" vs "));
}

console.log("\n── TOC and anchors ──");
{
  const toc = await p.evaluate(() => {
    const rail = document.querySelector("aside nav");
    const links = [...rail.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    return {
      count: links.length,
      links,
      unresolved: links.filter((h) => !document.getElementById(h.slice(1))),
      numeric: links.filter((h) => /^#\d|section-\d/.test(h)),
      mobile: document.querySelector("details")?.open === false,
    };
  });
  ok("rail lists every rendered section", toc.count === 19, String(toc.count));
  ok("every anchor resolves", toc.unresolved.length === 0, toc.unresolved.join(" "));
  ok("slugs are readable, not numeric", toc.numeric.length === 0, toc.numeric.join(" "));
  ok("the commercial sections are linkable",
    ["#who-owns-what", "#fixed-price", "#warranties", "#liability"].every((x) => toc.links.includes(x)));
  ok("no governing-law entry while it is withheld", !toc.links.includes("#governing-law"));
  ok("mobile TOC is a <details>, closed by default", toc.mobile);

  await p.evaluate(() => document.fonts.ready);
  for (let i = 0; i < 5; i++) {
    await p.evaluate(() => {
      const el = document.getElementById("payment");
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 60);
    });
    await p.waitForTimeout(300);
    const top = await p.evaluate(() =>
      Math.round(document.getElementById("payment").getBoundingClientRect().top));
    if (Math.abs(top - 60) <= 8) break;
  }
  await p.waitForTimeout(500);
  const active = await p.evaluate(() =>
    document.querySelector('aside nav a[aria-current="true"]')?.getAttribute("href"));
  ok("scroll-spy highlights the section in view", active === "#payment", String(active));

  // a pasted support link is a cold load, which is the case that drifts
  const cold = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await cold.goto(`${BASE}/terms#who-owns-what`, { waitUntil: "networkidle" });
  await cold.waitForTimeout(1500);
  const y = await cold.evaluate(() =>
    Math.round(document.getElementById("who-owns-what").getBoundingClientRect().top));
  ok("#who-owns-what lands clear of the header on a cold load", y >= 0 && y < 200, `${y}px`);
  await cold.close();
}

console.log("\n── the commitments actually appear ──");
{
  const text = await p.evaluate(() => document.body.innerText);
  for (const claim of [
    "For thirty days after handover",
    "Until full payment is received, ownership stays with us",
    "limited to the fees you have paid us",
    "We will not hold work hostage over a disagreement",
    "That arrangement is never covered by these terms",
  ]) ok(`"${claim.slice(0, 40)}…"`, text.includes(claim));
}

console.log("\n── 375 / 768 / 1440 ──");
await p.close();
for (const w of [375, 768, 1440]) {
  const v = await b.newPage({ viewport: { width: w, height: 900 } });
  v.on("console", (m) => { if (m.type() === "error") errs.push(`${w}: ${m.text()}`); });
  await v.goto(`${BASE}/terms`, { waitUntil: "networkidle" });
  const r = await v.evaluate(() => {
    const cells = [...document.querySelectorAll("main th, main td")];
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      clipped: cells.filter((c) => c.scrollWidth > c.clientWidth + 1).length,
      rail: !!document.querySelector("aside nav")?.getBoundingClientRect().width,
      mobileToc: !!document.querySelector("details")?.getBoundingClientRect().height,
    };
  });
  ok(`${w} no horizontal page overflow`, r.overflow === 0, `${r.overflow}px`);
  ok(`${w} no truncated table cell`, r.clipped === 0, String(r.clipped));
  ok(`${w} correct TOC variant`, w >= 1024 ? r.rail : r.mobileToc);
  await v.close();
}

console.log("\n── readable with JavaScript disabled ──");
{
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const np = await ctx.newPage();
  await np.goto(`${BASE}/terms`, { waitUntil: "domcontentloaded" });
  const t = await np.evaluate(() => document.body.innerText);
  ok("every section server-rendered",
    ["What we commit to", "Who these terms are with", "Using this website",
     "The cost estimators are estimates", "The discovery call", "What fixed price means",
     "Change orders", "Payment", "Who owns what", "How we use AI in our work",
     "What we need from you", "Confidentiality", "Third-party services",
     "What we promise and what we do not", "Limitation of liability",
     "Ending an engagement", "Equity arrangements", "Changes to these terms",
     "Contact"].every((s) => t.includes(s)));
  ok("both table columns server-rendered",
    t.includes("A fixed price, quoted after discovery, that we hold") &&
    t.includes("One person empowered to make decisions"));
  await ctx.close();
}

console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + [...new Set(errs)].join("\n") : "console clean"));
console.log(fails === 0 ? "ALL TERMS CHECKS PASS" : `${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
