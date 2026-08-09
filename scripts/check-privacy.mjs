import { readFileSync } from "node:fs";
import { chromium } from "playwright";

/**
 * /privacy QA. The deck is a legal document, so the first job is proving
 * the rendered page says exactly what the deck says — every paragraph,
 * every table cell, no rephrasing.
 *
 * Then: real tables (not cards), readable anchors that actually resolve,
 * the reused blog TOC, and a consent banner where reject is as easy as
 * accept.
 */
const BASE = "http://localhost:3000";
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const b = await chromium.launch();
const errs = [];
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto(`${BASE}/privacy`, { waitUntil: "networkidle" });

/* ---------- copy is the deck's, verbatim ---------- */
console.log("── copy is verbatim ──");
{
  // every copy string in the module must appear on the page, character
  // for character. Comments are stripped first (they quote phrases too),
  // and PRIVACY_META is excluded because it renders into <head>, not the
  // body — it is asserted separately below.
  const src = readFileSync("src/content/privacy.ts", "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/export const PRIVACY_META[\s\S]*?\n};/, "");
  const text = await p.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
  const strings = [...src.matchAll(/"([^"\\\n]{40,})"/g)].map((m) => m[1]);
  const missing = strings.filter((s) => !text.includes(s.replace(/\s+/g, " ")));
  ok(`all ${strings.length} copy strings render verbatim`, missing.length === 0,
    missing.slice(0, 2).join(" // "));

  const meta = await p.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    robots: document.querySelector('meta[name="robots"]')?.content ?? null,
  }));
  ok("title tag verbatim", meta.title === "Privacy Policy | Codroon", meta.title);
  ok("meta description verbatim",
    meta.desc === "What data Codroon collects, why, how long we keep it, and who else sees it. Written in plain English with a summary table.",
    meta.desc);
  ok("canonical set", meta.canonical === "https://codroon.com/privacy", meta.canonical);
  ok("NOT noindex", !/noindex/i.test(meta.robots ?? ""), String(meta.robots));
  ok("no 'privacy seriously' line", !/privacy seriously/i.test(text));
}

/* ---------- structure ---------- */
console.log("\n── structure ──");
{
  const h = await p.evaluate(() => {
    const hs = [...document.querySelectorAll("main h1, main h2, main h3")];
    return {
      h1: hs.filter((x) => x.tagName === "H1").length,
      levels: hs.map((x) => +x.tagName[1]),
      h2s: hs.filter((x) => x.tagName === "H2").map((x) => x.innerText.trim()),
    };
  });
  ok("exactly one H1", h.h1 === 1, String(h.h1));
  const skips = h.levels.filter((l, i) => i && l > h.levels[i - 1] + 1);
  ok("no heading level skips", skips.length === 0);
  // §1 is the header and carries the H1, so the deck's fourteen sections
  // produce thirteen H2s in the policy column (the rail's own "Summary"
  // heading lives in the aside and is excluded)
  const policyH2s = await p.evaluate(() =>
    [...document.querySelectorAll("main section > h2")].map((e) => e.innerText.trim()));
  ok("all fourteen deck sections render", policyH2s.length === 13, `${policyH2s.length} H2s`);

  const dateEl = await p.evaluate(() => {
    const el = [...document.querySelectorAll("main p")].find((e) => e.innerText.startsWith("Last updated:"));
    if (!el) return null;
    const cs = getComputedStyle(el);
    return { text: el.innerText.trim(), font: cs.fontFamily, size: parseFloat(cs.fontSize), top: Math.round(el.getBoundingClientRect().top + window.scrollY) };
  });
  ok("last-updated is present and near the top", dateEl && dateEl.top < 500, `${dateEl?.text} @${dateEl?.top}px`);
  ok("last-updated is in the display face", /bricolage/i.test(dateEl?.font ?? ""), dateEl?.font);
  ok("last-updated is prominent, not small", (dateEl?.size ?? 0) >= 22, `${dateEl?.size}px`);
}

/* ---------- the two tables ---------- */
console.log("\n── tables are real tables ──");
{
  const t = await p.evaluate(() => {
    const tables = [...document.querySelectorAll("main table")];
    return tables.map((tb) => ({
      cols: [...tb.querySelectorAll('th[scope="col"]')].map((e) => e.innerText.trim()),
      rowHeaders: tb.querySelectorAll('th[scope="row"]').length,
      rows: tb.querySelectorAll("tbody tr").length,
      divs: tb.querySelectorAll("div").length,
      caption: !!tb.querySelector("caption"),
    }));
  });
  ok("two tables", t.length === 2, String(t.length));
  ok("summary table: 4 cols, 7 rows, row headers on every row",
    t[0]?.cols.length === 4 && t[0]?.rows === 7 && t[0]?.rowHeaders === 7,
    JSON.stringify(t[0]));
  ok("processor table: 3 cols, 9 rows, row headers on every row",
    t[1]?.cols.length === 3 && t[1]?.rows === 9 && t[1]?.rowHeaders === 9,
    JSON.stringify(t[1]));
  ok("neither table is built from divs", t.every((x) => x.divs === 0));
  ok("both tables carry a caption", t.every((x) => x.caption));
}

/* ---------- §8 is hairline rows, not cards or bullets ---------- */
console.log("\n── §8 what we don't do ──");
{
  const s = await p.evaluate(() => {
    const sec = document.getElementById("what-we-dont-do");
    const dl = sec.querySelector("dl");
    const first = dl.querySelector("div");
    const cs = getComputedStyle(first);
    return {
      isDl: !!dl,
      rows: dl.querySelectorAll("dt").length,
      lists: sec.querySelectorAll("ul, ol").length,
      radius: cs.borderTopLeftRadius,
      bg: cs.backgroundColor,
      rule: cs.borderTopWidth,
    };
  });
  ok("four hairline rows in a dl", s.isDl && s.rows === 4, `${s.rows} rows`);
  ok("no bulleted list", s.lists === 0);
  ok("not cards: no radius, no fill", s.radius === "0px" && /rgba\(0, 0, 0, 0\)/.test(s.bg), `${s.radius} ${s.bg}`);
  ok("hairline rule on each row", parseFloat(s.rule) > 0 && parseFloat(s.rule) <= 1, s.rule);
}

/* ---------- anchors + the reused TOC ---------- */
console.log("\n── TOC and anchors ──");
{
  const toc = await p.evaluate(() => {
    const rail = document.querySelector("aside nav");
    const links = [...rail.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    return {
      count: links.length,
      links,
      resolve: links.filter((h) => !document.getElementById(h.slice(1))),
      numericIds: links.filter((h) => /^#\d|section-\d/.test(h)),
      mobileDetails: !!document.querySelector("details"),
    };
  });
  ok("rail lists every section", toc.count === 13, String(toc.count));
  ok("every anchor resolves to a section", toc.resolve.length === 0, toc.resolve.join(" "));
  ok("slugs are readable, not numeric", toc.numericIds.length === 0, toc.numericIds.join(" "));
  ok("the deck's example link exists", toc.links.includes("#session-recording"));
  ok("mobile variant is a <details>, closed by default", toc.mobileDetails);
  const closed = await p.evaluate(() => document.querySelector("details")?.open === false);
  ok("mobile TOC starts closed", closed);

  // scroll-spy comes from the SAME component the blog uses. Scroll the
  // way a reader does — to where the heading sits under the header, not
  // flush with the viewport top, which is above the spy's band.
  // wait for the serif to swap before measuring anything positional: it
  // changes the document height by ~400px and every scroll target drifts
  await p.evaluate(() => document.fonts.ready);
  // Scroll until it STICKS: late layout shifts move the target out from
  // under a single scrollTo, which is the same drift the cold-load
  // anchor hits. Target 60px, above the spy's 96px band start, so the
  // previous section is genuinely out of view rather than clipping it.
  for (let i = 0; i < 5; i++) {
    await p.evaluate(() => {
      const el = document.getElementById("cookies");
      window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 60);
    });
    await p.waitForTimeout(300);
    const top = await p.evaluate(() =>
      Math.round(document.getElementById("cookies").getBoundingClientRect().top));
    if (Math.abs(top - 60) <= 8) break;
  }
  await p.waitForTimeout(500);
  const spy = await p.evaluate(() => {
    const r = (id) => Math.round(document.getElementById(id).getBoundingClientRect().top);
    return {
      active: document.querySelector('aside nav a[aria-current="true"]')?.getAttribute("href") ?? null,
      cookiesTop: r("cookies"),
      sessionTop: r("session-recording"),
    };
  });
  ok("scroll-spy highlights the section in view", spy.active === "#cookies", JSON.stringify(spy));

  // A pasted support link is a COLD load, which is the case that broke:
  // the serif swaps in after the browser has already scrolled, every
  // heading above the target changes height, and the anchor drifts under
  // the header. Must be a fresh page — a same-document hash change would
  // not exercise it.
  const cold = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await cold.goto(`${BASE}/privacy#session-recording`, { waitUntil: "networkidle" });
  await cold.waitForTimeout(1500);
  const y = await cold.evaluate(() =>
    Math.round(document.getElementById("session-recording").getBoundingClientRect().top));
  ok("#session-recording lands clear of the fixed header on a cold load",
    y >= 0 && y < 200, `${y}px`);
  await cold.close();
}

/* ---------- consent ---------- */
console.log("\n── cookie consent ──");
{
  const footer = await p.evaluate(() => {
    const f = document.querySelector("footer");
    return [...f.querySelectorAll("a, button")].map((e) => e.innerText.trim());
  });
  ok('footer has "Cookie settings"', footer.includes("Cookie settings"), "");

  await p.evaluate(() => {
    const btn = [...document.querySelectorAll("footer button")].find((b) => b.innerText.includes("Cookie settings"));
    btn.click();
  });
  await p.waitForTimeout(400);
  const banner = await p.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-labelledby="cookie-banner-h"]');
    if (!d) return null;
    const btns = [...d.querySelectorAll("button")].map((x) => ({
      t: x.innerText.trim(),
      w: Math.round(x.getBoundingClientRect().width),
      h: Math.round(x.getBoundingClientRect().height),
    }));
    return { btns, cookie: document.cookie };
  });
  ok("footer link opens the banner", !!banner);
  const [accept, reject] = banner?.btns ?? [];
  ok("accept and reject both present", accept?.t === "Accept" && reject?.t === "Reject",
    (banner?.btns ?? []).map((x) => x.t).join(" "));
  ok("reject is as easy to click as accept",
    Math.abs((accept?.h ?? 0) - (reject?.h ?? 0)) <= 1 && Math.abs((accept?.w ?? 0) - (reject?.w ?? 0)) <= 24,
    JSON.stringify(banner?.btns));
  ok("no consent cookie before choosing", !/codroon_consent/.test(banner?.cookie ?? ""));

  await p.evaluate(() => [...document.querySelectorAll('[role="dialog"] button')].find((x) => x.innerText.trim() === "Reject").click());
  await p.waitForTimeout(300);
  const afterReject = await p.evaluate(() => ({
    cookie: document.cookie,
    open: !!document.querySelector('[role="dialog"][aria-labelledby="cookie-banner-h"]'),
    storage: (() => { try { return localStorage.length + sessionStorage.length; } catch { return -1; } })(),
  }));
  ok("reject stores a preference in a cookie", /codroon_consent=rejected/.test(afterReject.cookie), afterReject.cookie);
  ok("banner closes after choosing", !afterReject.open);
  ok("no localStorage or sessionStorage used", afterReject.storage === 0, String(afterReject.storage));

  // and nothing analytics-shaped loads either way
  const scripts = await p.evaluate(() =>
    [...document.querySelectorAll("script[src]")].map((s) => s.src)
      .filter((s) => /clarity|mouseflow|googletagmanager|google-analytics/i.test(s)));
  ok("no analytics scripts load while none are configured", scripts.length === 0, scripts.join(" "));
}

/* ---------- breakpoints ---------- */
console.log("\n── 375 / 768 / 1440 ──");
await p.close();
for (const w of [375, 768, 1440]) {
  const v = await b.newPage({ viewport: { width: w, height: 900 } });
  v.on("console", (m) => { if (m.type() === "error") errs.push(`${w}: ${m.text()}`); });
  await v.goto(`${BASE}/privacy`, { waitUntil: "networkidle" });
  const r = await v.evaluate(() => {
    const cells = [...document.querySelectorAll("main th, main td")];
    return {
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      clipped: cells.filter((c) => c.scrollWidth > c.clientWidth + 1).length,
      railVisible: !!document.querySelector("aside nav")?.getBoundingClientRect().width,
      mobileToc: !!document.querySelector("details")?.getBoundingClientRect().height,
    };
  });
  ok(`${w} no horizontal page overflow`, r.overflow === 0, `${r.overflow}px`);
  ok(`${w} no truncated table cell`, r.clipped === 0, `${r.clipped}`);
  ok(`${w} correct TOC variant`, w >= 1024 ? r.railVisible : r.mobileToc);
  await v.close();
}

/* ---------- no JS ---------- */
console.log("\n── readable with JavaScript disabled ──");
{
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const np = await ctx.newPage();
  await np.goto(`${BASE}/privacy`, { waitUntil: "domcontentloaded" });
  const t = await np.evaluate(() => document.body.innerText);
  ok("every section server-rendered",
    ["Everything we collect", "Who we are", "The cost estimators", "When you contact us",
     "Analytics and session recording", "Cookies", "What we don't do",
     "Who else processes your data", "Your rights", "How we protect it", "Children",
     "Changes to this policy", "Contact"].every((s) => t.includes(s)));
  ok("summary table server-rendered", t.includes("Estimator answers") && t.includes("Vercel, Cloudflare"));
  await ctx.close();
}

console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + [...new Set(errs)].join("\n") : "console clean"));
console.log(fails === 0 ? "ALL PRIVACY CHECKS PASS" : `${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
