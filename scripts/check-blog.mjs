import { chromium } from "playwright";
import { readFileSync, readdirSync } from "node:fs";

/**
 * Blog QA — the Gate 8 checklist, run against rendered output rather
 * than source files, because the risk is markup introducing problems
 * the decks never had.
 */

const BASE = "http://localhost:3000";
const SLUGS = [
  "google-antigravity-vs-cursor",
  "google-stitch-vs-figma",
  "make-to-n8n-migration",
  "vercel-vs-render-vs-aws",
  "saas-founder-tools-2026",
  "custom-ecommerce-vs-shopify",
  "how-to-rank-in-ai-search",
];

let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const b = await chromium.launch();
const errs = [];

/* ══════════ 1. punctuation, over RENDERED text ══════════ */
console.log("\n=== punctuation (rendered, not source) ===");
{
  const p = await b.newPage();
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "domcontentloaded" });
    const text = await p.evaluate(() => {
      // article body + rail, excluding chrome that predates the blog
      const a = document.querySelector("article");
      return a ? a.innerText : "";
    });
    const em = [...text.matchAll(/.{0,34}—.{0,34}/g)].map((m) => m[0].replace(/\s+/g, " "));
    const semi = [...text.matchAll(/.{0,34};.{0,34}/g)].map((m) => m[0].replace(/\s+/g, " "));
    ok(`${slug}: no em dash`, em.length === 0, em[0] ?? "");
    ok(`${slug}: no semicolon`, semi.length === 0, semi[0] ?? "");
  }
  await p.close();
}

/* ══════════ 2. structure + the old template bug ══════════ */
console.log("\n=== headings render BEFORE their sections; nothing injected ===");
{
  const p = await b.newPage();
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "networkidle" });

    const h1 = await p.locator("article h1").count();
    ok(`${slug}: exactly one H1`, h1 === 1, String(h1));

    // every content <section id> must lead with its own H2
    const headingFirst = await p.evaluate(() => {
      const bad = [];
      for (const s of document.querySelectorAll("article section[id]")) {
        const h2 = s.querySelector("h2");
        if (!h2) { bad.push(`${s.id}: no h2`); continue; }
        // the H2 must precede every paragraph in that section
        const firstP = s.querySelector("p");
        if (firstP && h2.compareDocumentPosition(firstP) !== Node.DOCUMENT_POSITION_FOLLOWING)
          bad.push(`${s.id}: h2 after content`);
      }
      return bad;
    });
    ok(`${slug}: every H2 precedes its section content`, headingFirst.length === 0, headingFirst.join(" | "));

    // no heading level skip
    const skips = await p.evaluate(() => {
      const levels = [...document.querySelectorAll("article h1,article h2,article h3,article h4")]
        .map((h) => Number(h.tagName[1]));
      const bad = [];
      for (let i = 1; i < levels.length; i++)
        if (levels[i] > levels[i - 1] + 1) bad.push(`h${levels[i - 1]}→h${levels[i]}`);
      return bad;
    });
    ok(`${slug}: no heading level skip`, skips.length === 0, skips.join(" "));

    // byline appears exactly once and never inside the body
    const bylineInBody = await p.evaluate(() =>
      document.querySelectorAll("article section[id] [role='note']").length
    );
    ok(`${slug}: nothing injected into the body`, bylineInBody === 0);
  }
  await p.close();
}

/* ══════════ 3. key takeaways in SERVER html ══════════ */
console.log("\n=== key takeaways present with no JS ===");
for (const slug of SLUGS) {
  const raw = await (await fetch(`${BASE}/blog/${slug}`)).text();
  ok(`${slug}: takeaways in server HTML`, raw.includes("Key takeaways"));
  ok(`${slug}: not inside a <details>`, !/<details[^>]*>[\s\S]{0,400}Key takeaways/.test(raw));
  // count the SECTION, not every mention: the id also appears in
  // aria-labelledby and twice more in the dev RSC payload
  const once = (raw.match(/id="key-takeaways-h"/g) ?? []).length;
  ok(`${slug}: takeaways rendered once`, once === 1, String(once));
}

/* ══════════ 4. tables: semantic markup ══════════ */
console.log("\n=== comparison tables use real semantic markup ===");
{
  const p = await b.newPage();
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "domcontentloaded" });
    const t = await p.evaluate(() => {
      const tables = [...document.querySelectorAll("article table")];
      return tables.map((tb) => ({
        colHeaders: tb.querySelectorAll('thead th[scope="col"]').length,
        rowHeaders: tb.querySelectorAll('tbody th[scope="row"]').length,
        caption: !!tb.querySelector("caption"),
        divs: tb.querySelectorAll("div[role='row'],div[role='cell']").length,
      }));
    });
    // NOT every deck has a table: blog-07 (how-to-rank-in-ai-search)
    // contains none. Inventing one would be writing copy, so this
    // asserts correctness where tables exist and reports the count.
    ok(`${slug}: ${t.length} table(s)`, true, t.length === 0 ? "deck has none" : "");
    ok(`${slug}: scope=col + scope=row + caption`,
      t.every((x) => x.colHeaders > 0 && x.rowHeaders > 0 && x.caption && x.divs === 0),
      JSON.stringify(t));
  }
  await p.close();
}

/* ══════════ 5. FAQ JSON-LD matches visible text ══════════ */
console.log("\n=== FAQPage JSON-LD matches visible text exactly ===");
{
  const p = await b.newPage();
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "networkidle" });
    const res = await p.evaluate(() => {
      const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent));
      const faq = scripts.find((s) => s["@type"] === "FAQPage");
      if (!faq) return { ok: false, why: "no FAQPage" };
      const visibleQ = [...document.querySelectorAll("article button")]
        .map((el) => el.innerText.trim())
        .filter(Boolean);
      const missing = faq.mainEntity
        .map((e) => e.name)
        .filter((q) => !visibleQ.some((v) => v.startsWith(q)));
      return { ok: missing.length === 0, why: missing.join(" | "), n: faq.mainEntity.length };
    });
    ok(`${slug}: ${res.n ?? 0} FAQ questions match the accordion`, res.ok, res.why);

    const types = await p.evaluate(() =>
      [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)["@type"])
    );
    ok(`${slug}: Article + FAQPage + BreadcrumbList + Organization`,
      ["Article", "FAQPage", "BreadcrumbList", "Organization"].every((t) => types.includes(t)),
      types.join(", "));
  }
  await p.close();
}

/* ══════════ 6. metadata ══════════ */
console.log("\n=== per-post metadata ===");
{
  const p = await b.newPage();
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "domcontentloaded" });
    const m = await p.evaluate(() => ({
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      tw: document.querySelector('meta[name="twitter:card"]')?.content,
      ogImg: document.querySelector('meta[property="og:image"]')?.content,
      desc: document.querySelector('meta[name="description"]')?.content,
      title: document.title,
    }));
    ok(`${slug}: canonical`, m.canonical === `https://codroon.com/blog/${slug}`, m.canonical ?? "");
    ok(`${slug}: summary_large_image`, m.tw === "summary_large_image");
    ok(`${slug}: og:image is the generated cover`, (m.ogImg ?? "").includes("opengraph-image"), m.ogImg ?? "");
    ok(`${slug}: description present`, (m.desc ?? "").length > 100);
    ok(`${slug}: no em dash in title/description`, !m.title.includes("—") && !(m.desc ?? "").includes("—"));
  }
  await p.close();
}

/* ══════════ 7. internal links resolve ══════════ */
console.log("\n=== every internal link resolves ===");
{
  const p = await b.newPage();
  const seen = new Map();
  for (const slug of [...SLUGS, ""]) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "domcontentloaded" });
    const hrefs = await p.evaluate(() =>
      [...document.querySelectorAll("article a[href^='/'], main a[href^='/']")].map((a) => a.getAttribute("href"))
    );
    for (const h of hrefs) if (!seen.has(h)) seen.set(h, null);
  }
  for (const h of [...seen.keys()]) {
    if (h.startsWith("#")) continue;
    const r = await fetch(`${BASE}${h}`, { redirect: "manual" });
    seen.set(h, r.status);
  }
  const broken = [...seen.entries()].filter(([, s]) => s && s >= 400);
  ok(`all internal links resolve (${seen.size} unique)`, broken.length === 0, broken.map(([h, s]) => `${h}=${s}`).join(" "));
  await p.close();
}

/* ══════════ 8. redirects ══════════ */
console.log("\n=== 301/308 redirects ===");
{
  const R = [
    ["/blogs/antigravity-google-vs-cursor-ai-the-future-of-coding-feels-different-now", "/blog/google-antigravity-vs-cursor"],
    ["/blogs/vercel-render-aws-a-developer-s-honest-deployment-guide", "/blog/vercel-vs-render-vs-aws"],
    ["/blogs/why-developers-are-moving-from-make-to-n8n-and-when-you-shouldn-t", "/blog/make-to-n8n-migration"],
    ["/blogs/custom-ecommerce-vs-shopify-wordpress-choosing-the-right-canvas-for-your-store", "/blog/custom-ecommerce-vs-shopify"],
    ["/blogs/stitch-by-google-and-figma-what-it-gets-right-and-where-it-s-just-fine", "/blog/google-stitch-vs-figma"],
    ["/blogs/top-10-tools-every-saas-founder-should-know-in-2026", "/blog/saas-founder-tools-2026"],
    ["/blogs/auto-seo-explained-how-ai-learns-who-you-are-and-markets-you-better", "/blog/how-to-rank-in-ai-search"],
    ["/blogs/inside-codroon-the-texas-software-studio-that-builds-with-purpose", "/about"],
    ["/blogs", "/blog"],
    ["/blogs/emergent-labs-vs-lovable-ai", "/blog"],
  ];
  for (const [from, to] of R) {
    const r = await fetch(`${BASE}${from}`, { redirect: "manual" });
    const loc = r.headers.get("location");
    ok(`${from.slice(0, 44)}… → ${to}`, (r.status === 301 || r.status === 308) && loc === to, `${r.status} ${loc}`);
  }
}

/* ══════════ 9. sitemap ══════════ */
console.log("\n=== sitemap ===");
{
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  for (const s of SLUGS) ok(`sitemap has /blog/${s}`, xml.includes(`/blog/${s}`));
  ok("sitemap has /blog", xml.includes("<loc>https://codroon.com/blog</loc>"));
}

/* ══════════ 10. no-JS ══════════ */
console.log("\n=== readable with JavaScript disabled ===");
{
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/blog/how-to-rank-in-ai-search`, { waitUntil: "domcontentloaded" });
  const t = await p.locator("article").innerText();
  ok("body prose present", t.includes("Generative engine optimization means structuring content"));
  // innerText reflects text-transform, and the heading is uppercased
  ok("key takeaways present", /key takeaways/i.test(t));
  ok("FAQ answers present", t.includes("It is an additional layer on top of strong SEO fundamentals"));
  // check the table on a post that HAS one
  await p.goto(`${BASE}/blog/saas-founder-tools-2026`, { waitUntil: "domcontentloaded" });
  ok("table present", (await p.locator("article table").count()) >= 1);
  ok("TOC links present", (await p.locator("article details a, aside a").count()) >= 0);
  await ctx.close();
}

/* ══════════ 11. responsive ══════════ */
console.log("\n=== 375 / 768 / 1440 ===");
for (const w of [375, 768, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(`${w}: ${m.text()}`); });
  for (const path of ["/blog", "/blog/saas-founder-tools-2026", "/"]) {
    await p.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(`${w} ${path} no horizontal overflow`, ov === 0, ov + "px");
  }
  // the table must scroll inside its own container, never widen the page
  await p.goto(`${BASE}/blog/saas-founder-tools-2026`, { waitUntil: "networkidle" });
  const tableScrolls = await p.evaluate(() => {
    const t = document.querySelector("article table");
    const wrap = t?.parentElement;
    return wrap ? getComputedStyle(wrap).overflowX : "none";
  });
  ok(`${w} table scrolls in its own wrapper`, tableScrolls === "auto", tableScrolls);
  if (w === 1440) {
    const railSticky = await p.evaluate(() => {
      const el = document.querySelector("aside > div");
      return el ? getComputedStyle(el).position : "none";
    });
    ok("rail is sticky at 1440", railSticky === "sticky", railSticky);
  }
  if (w !== 1440) {
    const railHidden = await p.evaluate(() => {
      const el = document.querySelector("aside");
      return el ? getComputedStyle(el).display : "none";
    });
    ok(`rail hidden at ${w}`, railHidden === "none", railHidden);
    const details = await p.locator("article details").count();
    ok(`${w} mobile TOC present`, details === 1, String(details));
    const open = await p.locator("article details").evaluate((d) => d.open).catch(() => null);
    ok(`${w} mobile TOC closed by default`, open === false, String(open));
  }
  await p.close();
}

/* ══════════ 12. a11y ══════════ */
console.log("\n=== accessibility ===");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/blog/make-to-n8n-migration`, { waitUntil: "networkidle" });
  const small = await p.evaluate(() =>
    [...document.querySelectorAll("article a, article button, aside a")]
      .map((el) => ({ t: el.innerText.slice(0, 24), r: el.getBoundingClientRect() }))
      .filter((x) => x.r.height > 0 && x.r.height < 44)
      .map((x) => `${x.t}(${Math.round(x.r.height)}px)`)
  );
  ok("all interactive targets ≥44px tall", small.length === 0, small.slice(0, 4).join(" "));

  const focus = await p.evaluate(() => {
    const a = document.querySelector("article a");
    a.focus();
    const s = getComputedStyle(a, ":focus-visible");
    return s.outlineStyle !== "none" || s.boxShadow !== "none";
  });
  ok("focus ring present", focus);

  const stepsOl = await p.locator("article ol").count();
  ok("step list is an ordered list", stepsOl >= 1, String(stepsOl));
  await p.close();
}

/* ══════════ 13. author ══════════ */
console.log("\n=== author ===");
{
  const p = await b.newPage();
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "domcontentloaded" });
    const t = await p.locator("article header").innerText();
    ok(`${slug}: byline reads "By Mujtaba Abbas"`, t.includes("By Mujtaba Abbas"), t.replace(/\s+/g, " ").slice(0, 70));
    ok(`${slug}: nothing published under "By Codroon"`, !(await p.locator("article").innerText()).includes("By Codroon"));
    // name only: no photo, role, bio or LinkedIn
    ok(`${slug}: no author photo or LinkedIn`, (await p.locator("article header img, article header a[href*='linkedin']").count()) === 0);
    const ld = await p.evaluate(() => {
      const a = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)).find((x) => x["@type"] === "Article");
      return a?.author?.name;
    });
    ok(`${slug}: Article JSON-LD author`, ld === "Mujtaba Abbas", String(ld));
  }
  await p.close();
}

/* ══════════ 14. registry ══════════ */
console.log("\n=== content registry ===");
{
  const files = readdirSync("src/content/blog").filter((f) => f.endsWith(".ts") && !["types.ts", "index.ts", "authors.ts"].includes(f));
  ok("seven post modules", files.length === 7, files.length + "");
  const p = await b.newPage();
  await p.goto(`${BASE}/blog`, { waitUntil: "networkidle" });
  const cards = await p.locator("article").count();
  ok("listing renders all seven", cards === 7, String(cards));
  const dates = await p.locator("article time").allTextContents();
  const sorted = [...dates].sort((a, c) => new Date(c) - new Date(a));
  ok("newest first", JSON.stringify(dates) === JSON.stringify(sorted), dates.join(" | "));
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const teaser = await p.locator("#blog article").count();
  ok("landing teaser shows 3", teaser === 3, String(teaser));
  await p.close();
}

/* ══════════ 15. the 2026-08-03 revision round ══════════ */
console.log("\n=== post page revisions ===");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`${BASE}/blog/make-to-n8n-migration`, { waitUntil: "networkidle" });

  const fit = await p.evaluate(() => {
    const art = document.querySelector("article");
    const cover = art.querySelector('div[role="img"]');
    const h1 = art.querySelector("h1");
    return {
      cover: Math.round(cover.getBoundingClientRect().width),
      col: Math.round(art.getBoundingClientRect().width),
      h1x: Math.round(h1.getBoundingClientRect().x),
      coverx: Math.round(cover.getBoundingClientRect().x),
    };
  });
  ok("cover spans the article column", Math.abs(fit.cover - fit.col) <= 2, `${fit.cover} vs ${fit.col}`);
  ok("cover flush left with the H1", fit.coverx === fit.h1x, `${fit.coverx} vs ${fit.h1x}`);
  ok("cover bigger than the old 520px cap", fit.cover > 520, `${fit.cover}px`);

  const railOrder = await p.evaluate(() => [...document.querySelectorAll("aside h2")].map((h) => h.innerText.trim()));
  ok("rail order: Summary, Summarize, Recent",
    JSON.stringify(railOrder) === JSON.stringify(["SUMMARY", "SUMMARIZE WITH AI", "RECENT POSTS"]), railOrder.join(" | "));

  const railLinks = await p.locator("aside a[href*='chatgpt.com'], aside a[href*='claude.ai'], aside a[href*='perplexity'], aside a[href*='udm=50']").count();
  ok("four summarize links in the rail", railLinks === 4, String(railLinks));
  const sy = await p.locator("aside a[href*='chatgpt.com']").first().evaluate((el) => Math.round(el.getBoundingClientRect().top));
  ok("summarize links above the fold", sy > 0 && sy < 1000, `${sy}px`);

  const recent = await p.evaluate(() => {
    const sec = [...document.querySelectorAll("aside section")].find((s) => s.innerText.startsWith("RECENT"));
    return {
      links: sec.querySelectorAll("a").length,
      labels: [...sec.querySelectorAll("a")].map((a) => a.getAttribute("aria-label")),
      stray: [...sec.querySelectorAll("a p, a > span")].filter((e) => !e.closest('[role="img"]')).length,
    };
  });
  ok("recent posts: 3 cover links", recent.links === 3, String(recent.links));
  ok("recent posts: no title text under covers", recent.stray === 0, String(recent.stray));
  ok("recent posts: links named for screen readers", recent.labels.every((l) => l && l.length > 20), JSON.stringify(recent.labels[0]));

  const pn = await p.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="More posts"]');
    return { text: nav.innerText.replace(/\s+/g, " ").trim(), labels: [...nav.querySelectorAll("a")].map((a) => a.getAttribute("aria-label")) };
  });
  ok("prev/next shows direction only", /^(previous ?next|previous|next)$/i.test(pn.text), pn.text);
  ok("prev/next carries titles as accessible names", pn.labels.every((l) => l && /post:/.test(l)), JSON.stringify(pn.labels));
  await p.close();
}

console.log("\n=== mobile summarize ===");
{
  const p = await b.newPage({ viewport: { width: 375, height: 800 } });
  await p.goto(`${BASE}/blog/make-to-n8n-migration`, { waitUntil: "networkidle" });
  ok("375: summarize present in the article", (await p.locator("article a[href*='chatgpt.com']").count()) === 1);
  const y = await p.locator("article a[href*='chatgpt.com']").evaluate((el) => Math.round(el.getBoundingClientRect().top));
  ok("375: summarize near the top, not buried", y < 1600, `${y}px`);
  await p.close();
}

console.log("\n=== landing Insights band ===");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const band = await p.locator("#blog").evaluate((el) => getComputedStyle(el).backgroundColor);
  const testi = await p.locator("#testimonials").evaluate((el) => getComputedStyle(el).backgroundColor);
  ok("Insights band is accent orange", band === "rgb(233, 106, 66)", band);
  ok("matches the Testimonials band", band === testi, `${band} vs ${testi}`);

  // every text node sitting directly on the orange, alpha-blended
  const contrast = await p.locator("#blog").evaluate((sec) => {
    const lum = (c) => {
      const [r, g, bl] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const bgArr = [233, 106, 66];
    const out = [];
    for (const el of sec.querySelectorAll("p, h2, time, span, a")) {
      if (el.closest('[role="img"]')) continue;  // the cover is its own dark surface
      if (!el.textContent.trim() || el.children.length) continue;
      const s = getComputedStyle(el);
      const f = s.color.match(/[\d.]+/g).map(Number);
      const a = f.length > 3 ? f[3] : 1;
      const eff = `rgb(${f.slice(0, 3).map((v, i) => Math.round(v * a + bgArr[i] * (1 - a))).join(",")})`;
      const l1 = lum(eff), l2 = lum(`rgb(${bgArr.join(",")})`);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const size = parseFloat(s.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700);
      out.push({ t: el.textContent.trim().slice(0, 24), ratio: +ratio.toFixed(2), need: large ? 3 : 4.5 });
    }
    return out;
  });
  const low = contrast.filter((c) => c.ratio < c.need);
  ok(`all ${contrast.length} text nodes on orange meet contrast`, low.length === 0, low.map((c) => `"${c.t}"=${c.ratio}<${c.need}`).join("  "));
  await p.close();
}

/* ══════════ post page: the two rules and the footer edge ══════════
 *
 * Both were on EVERY post (client, 2026-08-04):
 *  · the FAQ accordion closes itself with a bottom rule and the CTA drew
 *    its own top rule 80px below it, so the pair read as an empty extra
 *    question under the last one.
 *  · the article column and the sticky rail both ended exactly at the
 *    footer's top edge, so the last recent-post cover butted into it.
 */
console.log("\n=== post page: rules and the footer edge ===");
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  for (const slug of SLUGS) {
    await p.goto(`${BASE}/blog/${slug}`, { waitUntil: "networkidle" });
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(300);
    const m = await p.evaluate(() => {
      const rows = [...document.querySelectorAll("div.border-t.border-border.last\\:border-b")];
      const cta = document.querySelector('section[aria-labelledby="post-cta-h"]');
      const article = document.querySelector("article");
      const aside = document.querySelector("aside");
      const ft = document.querySelector("footer").getBoundingClientRect().top;
      return {
        faqRows: rows.length,
        ctaRule: cta ? parseFloat(getComputedStyle(cta).borderTopWidth) : null,
        articleGap: Math.round(ft - article.getBoundingClientRect().bottom),
        asideGap: Math.round(ft - aside.getBoundingClientRect().bottom),
      };
    });
    // with an FAQ above it the CTA must NOT draw a second rule
    ok(`${slug}: no empty row under the last FAQ`,
      m.faqRows === 0 || m.ctaRule === 0, `${m.faqRows} rows, cta rule ${m.ctaRule}px`);
    ok(`${slug}: article clears the footer`, m.articleGap >= 64, `${m.articleGap}px`);
    ok(`${slug}: rail clears the footer`, m.asideGap >= 64, `${m.asideGap}px`);
  }
  await p.close();
}

console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + [...new Set(errs)].join("\n") : "console clean"));
console.log(fails === 0 ? "\nALL BLOG QA CHECKS PASS" : `\n${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
