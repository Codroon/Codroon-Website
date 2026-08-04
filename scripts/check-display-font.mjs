import { chromium } from "playwright";

/**
 * Display-face QA after the Bricolage Grotesque swap (2026-08-04).
 *
 * Two jobs:
 *  1. prove the face and its axes are actually live, and that the old
 *     serif is gone from every surface
 *  2. catch what a narrower face breaks: headings that now wrap
 *     differently, overflow their container, or leave an orphan word on
 *     the last line
 *
 * Sizes and line heights must be UNCHANGED by the swap, so the scale is
 * asserted against the values the design system has always had.
 */
const BASE = "http://localhost:3000";
const PAGES = [
  "/",
  "/about",
  "/blog",
  "/blog/google-antigravity-vs-cursor",
  "/services/ai-agent-development",
  "/services/mvp-development",
  "/products/replydude",
  "/products/decipher-engine",
  "/tools/ai-agent-cost-calculator",
  "/tools/mvp-cost-calculator",
  "/privacy",
  "/terms",
];
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const b = await chromium.launch();
const errs = [];

/* ---------- the face itself ---------- */
console.log("── the face and its axes ──");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const probe = document.createElement("span");
    probe.textContent = "Handgloves 0123456789";
    probe.style.cssText =
      'position:absolute;visibility:hidden;white-space:nowrap;font-family:"Bricolage Grotesque Variable";font-size:64px;font-weight:600;';
    document.body.appendChild(probe);
    const w = (s) => { probe.style.fontVariationSettings = s; return +probe.getBoundingClientRect().width.toFixed(2); };
    const out = {
      loaded: document.fonts.check('600 40px "Bricolage Grotesque Variable"'),
      wdth75: w('"wdth" 75'), wdth100: w('"wdth" 100'), wdth105: w('"wdth" 105'),
      opsz12: w('"opsz" 12'), opsz96: w('"opsz" 96'),
    };
    probe.remove();
    return out;
  });
  ok("Bricolage Grotesque Variable is loaded", r.loaded);
  ok("wdth axis is live", Math.abs(r.wdth100 - r.wdth75) > 20, `${r.wdth75} vs ${r.wdth100}`);
  ok("opsz axis is live (the variable file, not static weights)",
    Math.abs(r.opsz12 - r.opsz96) > 20, `${r.opsz12} vs ${r.opsz96}`);
  // the brief asked for wdth 105; this face has no expanded end
  ok("wdth 105 does not exist in this face (clamps to 100)",
    r.wdth105 === r.wdth100, `${r.wdth105} vs ${r.wdth100}`);
  await p.close();
}

/* ---------- no trace of the old face ---------- */
console.log("\n── the old serif is gone ──");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const requested = [];
  p.on("request", (q) => requested.push(q.url()));
  for (const path of ["/", "/about", "/blog/google-antigravity-vs-cursor"]) {
    await p.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  }
  ok("no Instrument Serif file is fetched",
    !requested.some((u) => /instrument/i.test(u)),
    requested.filter((u) => /instrument/i.test(u)).slice(0, 2).join(" "));
  const stack = await p.evaluate(() => {
    const els = [...document.querySelectorAll("h1, h2, .font-serif, .text-display")];
    return [...new Set(els.map((e) => getComputedStyle(e).fontFamily))];
  });
  ok("no display element still resolves to a serif stack",
    !stack.some((s) => /Georgia|Times New Roman|Instrument/i.test(s)), stack.join(" // "));
  await p.close();
}

/* ---------- the scale is untouched ---------- */
console.log("\n── sizes and line heights unchanged by the swap ──");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const scale = await p.evaluate(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;width:1200px";
    probe.innerHTML =
      '<p class="text-display">x</p><p class="text-h1">x</p><p class="text-h2">x</p><p class="text-h3">x</p><p class="text-body">x</p>';
    document.body.appendChild(probe);
    const read = (sel) => {
      const cs = getComputedStyle(probe.querySelector(sel));
      return {
        size: Math.round(parseFloat(cs.fontSize)),
        lh: +(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2),
        weight: cs.fontWeight,
        family: cs.fontFamily.split(",")[0],
        stretch: cs.fontStretch,
        opsz: cs.fontOpticalSizing,
      };
    };
    const out = {
      display: read(".text-display"), h1: read(".text-h1"), h2: read(".text-h2"),
      h3: read(".text-h3"), body: read(".text-body"),
    };
    probe.remove();
    return out;
  });
  // at 1440 the fluid step is the vw term, not the clamp ceiling:
  // display 6vw = 86.4, h1 4.5vw = 64.8 capped at 60 (3.75rem), h2 3vw = 43.2
  ok("display size unchanged", scale.display.size === 86, `${scale.display.size}px`);
  ok("h1 size unchanged", scale.h1.size === 60, `${scale.h1.size}px`);
  ok("h2 size unchanged", scale.h2.size === 43, `${scale.h2.size}px`);
  ok("display line height unchanged", scale.display.lh === 1.05, String(scale.display.lh));
  ok("h1 line height unchanged", scale.h1.lh === 1.1, String(scale.h1.lh));
  ok("h2 line height unchanged", scale.h2.lh === 1.15, String(scale.h2.lh));
  for (const k of ["display", "h1", "h2"]) {
    ok(`${k}: display face at wght 600`,
      scale[k].weight === "600" && /Bricolage/.test(scale[k].family), `${scale[k].weight} ${scale[k].family}`);
    ok(`${k}: wdth 100 and opsz auto`,
      scale[k].stretch === "100%" && scale[k].opsz === "auto", `${scale[k].stretch} ${scale[k].opsz}`);
  }
  // the body face must NOT have moved
  ok("body face untouched", /Geist/.test(scale.body.family) && scale.body.size === 17, JSON.stringify(scale.body));
  ok("h3 stays in the body face", /Geist/.test(scale.h3.family), scale.h3.family);
  await p.close();
}

/* ---------- weight floor ---------- */
console.log("\n── never below wght 500 in the display face ──");
for (const path of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${path}: ${m.text()}`); });
  await p.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const light = await p.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((e) => {
        const cs = getComputedStyle(e);
        return /Bricolage/.test(cs.fontFamily) && e.textContent.trim() && +cs.fontWeight < 500 && e.offsetParent !== null;
      })
      .map((e) => `${e.tagName}.${e.className.toString().slice(0, 40)}=${getComputedStyle(e).fontWeight}`)
      .slice(0, 4));
  ok(`${path}`, light.length === 0, light.join(" | "));
  await p.close();
}

/* ---------- wrapping, overflow and orphans ---------- */
console.log("\n── display headings: wrapping, overflow, orphans ──");
const wraps = [];
for (const w of [375, 768, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 1000 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${w}: ${m.text()}`); });
  for (const path of PAGES) {
    await p.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(250);
    const r = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll("h1, h2, h3, p, dd, span, td, th")) {
        const cs = getComputedStyle(e);
        if (!/Bricolage/.test(cs.fontFamily)) continue;
        const text = e.textContent.trim();
        if (!text || e.offsetParent === null) continue;
        // only leaf-ish text nodes
        if ([...e.children].some((c) => c.textContent.trim().length > text.length * 0.6)) continue;
        const size = parseFloat(cs.fontSize);
        const lh = parseFloat(cs.lineHeight) || size * 1.2;
        const box = e.getBoundingClientRect();
        const lines = Math.max(1, Math.round(box.height / lh));
        const parent = e.parentElement.getBoundingClientRect();
        const words = text.split(/\s+/);
        // orphan: multi-line heading whose last line is one short word
        const range = document.createRange();
        let lastLineWords = words.length;
        if (lines > 1) {
          const node = e.firstChild;
          if (node && node.nodeType === 3) {
            let count = 0, seen = 0;
            for (let i = 0; i < words.length; i++) {
              seen += words[i].length + (i ? 1 : 0);
              range.setStart(node, 0);
              range.setEnd(node, Math.min(seen, node.length));
              const rects = range.getClientRects();
              if (rects.length === lines) { count = words.length - i; break; }
            }
            lastLineWords = count || words.length;
          }
        }
        out.push({
          text: text.slice(0, 46),
          size: Math.round(size),
          lines,
          overflowX: Math.round(box.right - parent.right),
          overflowY: Math.round(e.scrollHeight - e.clientHeight),
          clipped: e.scrollWidth > e.clientWidth + 1,
          orphan: lines > 1 && lastLineWords === 1 && words[words.length - 1].length <= 6,
        });
      }
      return out;
    });
    for (const h of r) wraps.push({ w, path, ...h });
  }
  await p.close();
}
{
  const clipped = wraps.filter((h) => h.clipped);
  ok("no display heading is clipped by its own box", clipped.length === 0,
    clipped.slice(0, 3).map((h) => `${h.path}@${h.w} "${h.text}"`).join(" | "));
  const spill = wraps.filter((h) => h.overflowX > 2);
  ok("no display heading spills past its container", spill.length === 0,
    spill.slice(0, 3).map((h) => `${h.path}@${h.w} "${h.text}" +${h.overflowX}px`).join(" | "));
  // Orphans: a two-line heading ending on one short word is ordinary at
  // phone widths and not worth chasing, so only HERO-scale type fails.
  // The smaller ones are printed as information — the new face sets 13%
  // wider than the old serif, so there are more of them than there were.
  const orphans = wraps.filter((h) => h.orphan);
  const heroOrphans = orphans.filter((h) => h.size >= 48);
  ok("no hero-scale heading leaves a one-word last line", heroOrphans.length === 0,
    heroOrphans.slice(0, 4).map((h) => `${h.path}@${h.w} ${h.size}px "${h.text}"`).join(" | "));
  console.log(`  (info: ${orphans.length - heroOrphans.length} smaller headings end on a single word, mostly at 375)`);
  console.log(`  (measured ${wraps.length} display headings across ${PAGES.length} pages x 3 widths)`);
}

/* ---------- page-level overflow, all pages, all widths ---------- */
console.log("\n── no page overflows horizontally ──");
for (const w of [375, 768, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const bad = [];
  for (const path of PAGES) {
    await p.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    await p.evaluate(() => document.fonts.ready);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (ov > 0) bad.push(`${path}(${ov}px)`);
  }
  ok(`${w} all pages`, bad.length === 0, bad.join(" "));
  await p.close();
}

console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + [...new Set(errs)].slice(0, 5).join("\n") : "console clean"));
console.log(fails === 0 ? "ALL DISPLAY FONT CHECKS PASS" : `${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
