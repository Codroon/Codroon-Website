/** GATE 13 mechanical QA for /services/ai-agent-development. */
import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:3000/services/ai-agent-development";
const out = (k, v) => console.log(`${k}: ${v}`);
const b = await chromium.launch();

/* ---------- 1. headings, codroon count, touch targets, contrast ---------- */
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(URL, { waitUntil: "networkidle" });
await p.waitForTimeout(1200);

const core = await p.evaluate(() => {
  const res = {};
  // headings
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
    .filter((h) => !h.closest("header,footer"))
    .map((h) => ({ level: +h.tagName[1], text: h.textContent.trim().slice(0, 40) }));
  res.h1Count = hs.filter((h) => h.level === 1).length;
  let skips = [];
  for (let i = 1; i < hs.length; i++) {
    if (hs[i].level - hs[i - 1].level > 1) skips.push(`${hs[i - 1].level}→${hs[i].level} at "${hs[i].text}"`);
  }
  res.headingSkips = skips.length ? skips.join("; ") : "none";

  // codroon count in main content
  const main = document.querySelector("main");
  res.codroonCount = (main.innerText.match(/Codroon/g) || []).length;

  // touch targets (buttons + non-inline links in main)
  const small = [];
  for (const el of main.querySelectorAll("a,button")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    const inlineText = el.matches("nav a, p a"); // WCAG 2.5.8 inline exception
    if (!inlineText && (r.height < 44 || r.width < 44)) {
      small.push(`${el.textContent.trim().slice(0, 24)} (${Math.round(r.width)}×${Math.round(r.height)})`);
    }
  }
  res.smallTargets = small.length ? small.join("; ") : "none";

  // contrast — every visible text element in main
  const lum = (r, g, bl) => {
    const f = (c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
  };
  const parse = (s) => s.match(/[\d.]+/g)?.map(Number) ?? null;
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const c = parse(bg);
      if (c && (c.length < 4 || c[3] > 0.05)) return c;
      n = n.parentElement;
    }
    return [26, 25, 23];
  };
  const fails = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (!t.textContent.trim()) continue;
    const el = t.parentElement;
    if (!el || seen.has(el) || el.closest('[aria-hidden="true"],script,style,.sr-only')) continue;
    seen.add(el);
    const st = getComputedStyle(el);
    if (st.visibility === "hidden" || st.display === "none" || +st.opacity === 0) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const fg = parse(st.color);
    const bg = bgOf(el);
    if (!fg) continue;
    const L1 = lum(fg[0], fg[1], fg[2]);
    const L2 = lum(bg[0], bg[1], bg[2]);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(st.fontSize);
    const bold = +st.fontWeight >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need) {
      fails.push(`"${t.textContent.trim().slice(0, 28)}" ${ratio.toFixed(2)}:1 (${size}px, need ${need})`);
    }
  }
  res.contrastFails = fails.length ? [...new Set(fails)].slice(0, 12).join(" | ") : "none";

  // text on accent surfaces must be #232220
  const accentBad = [];
  for (const el of main.querySelectorAll("*")) {
    const st = getComputedStyle(el);
    if (st.backgroundColor === "rgb(233, 106, 66)") {
      for (const child of [el, ...el.querySelectorAll("*")]) {
        const cs = getComputedStyle(child);
        if (child.textContent.trim() && cs.color !== "rgb(35, 34, 32)" && !child.querySelector("*")) {
          accentBad.push(`${child.textContent.trim().slice(0, 24)} → ${cs.color}`);
        }
      }
    }
  }
  res.textOnAccentViolations = accentBad.length ? [...new Set(accentBad)].join("; ") : "none";

  // images/icons
  const imgs = [...main.querySelectorAll("img")].filter((i) => !i.alt || /^(image|icon)$/i.test(i.alt));
  res.badAlts = imgs.length ? imgs.map((i) => i.src).join("; ") : "none";
  const unhiddenSvgs = [...main.querySelectorAll("svg")].filter(
    (s) => !s.closest('[aria-hidden="true"]') && s.getAttribute("aria-hidden") !== "true" && !s.getAttribute("aria-label")
  );
  res.unlabelledSvgs = unhiddenSvgs.length;
  return res;
});
for (const [k, v] of Object.entries(core)) out(k, v);

// page overflow at 3 breakpoints
for (const w of [375, 768, 1440]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.waitForTimeout(400);
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  out(`overflow@${w}`, `${ov}px`);
}
await p.setViewportSize({ width: 1440, height: 900 });

// focus rings: tab through first 25 focusables, all must show outline
const focusInfo = await p.evaluate(async () => {
  const results = [];
  const els = [...document.querySelectorAll("a[href],button")].filter((e) => e.offsetParent).slice(0, 25);
  return els.length;
});
await p.keyboard.press("Tab");
let noRing = [];
for (let i = 0; i < 25; i++) {
  const r = await p.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const st = getComputedStyle(el);
    return { text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 20), ok: st.outlineStyle !== "none" && parseFloat(st.outlineWidth) > 0 };
  });
  if (r && !r.ok) noRing.push(r.text);
  await p.keyboard.press("Tab");
}
out("focusables missing visible ring (first 25 tabs)", noRing.length ? [...new Set(noRing)].join("; ") : "none");
await p.close();

/* ---------- 2. LCP + CLS ---------- */
const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p2.addInitScript(() => {
  window.__vitals = { lcp: 0, cls: 0 };
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__vitals.lcp = e.startTime;
  }).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) if (!e.hadRecentInput) window.__vitals.cls += e.value;
  }).observe({ type: "layout-shift", buffered: true });
});
await p2.goto(URL, { waitUntil: "networkidle" });
await p2.waitForTimeout(2500);
await p2.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await p2.waitForTimeout(1200);
const vitals = await p2.evaluate(() => window.__vitals);
out("LCP", `${Math.round(vitals.lcp)}ms`);
out("CLS", vitals.cls.toFixed(4));
await p2.close();

await b.close();
console.log("qa done");
