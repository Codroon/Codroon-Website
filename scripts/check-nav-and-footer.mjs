import { chromium } from "playwright";

/**
 * The 2026-08-04 client sweep, asserted against rendered output:
 *   1. no VISIBLE breadcrumb on the six service pages (the invisible
 *      BreadcrumbList JSON-LD must survive — that is what search uses)
 *   2. no equity percentage anywhere on the two product pages
 *   3. Status "Live" renders in the accent, the version stays muted
 *   4. footer: Careers gone, Company keeps About + Blog
 *   5. /careers is deleted (404) and out of the sitemap
 *   6. the giant footer wordmark is the real SVG mark, not typed text
 */
const BASE = "http://localhost:3000";
const SERVICES = [
  "ai-agent-development",
  "generative-ai-development",
  "ai-integration",
  "mvp-development",
  "saas-development",
  "custom-software-development",
];
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const b = await chromium.launch();
const errs = [];
/** the /careers probe below is EXPECTED to 404, so stop collecting first */
let collect = true;
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
p.on("console", (m) => { if (collect && m.type() === "error") errs.push(m.text()); });

console.log("── service pages: breadcrumb removed, schema kept ──");
for (const slug of SERVICES) {
  await p.goto(`${BASE}/services/${slug}`, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => JSON.parse(s.textContent));
    const crumb = ld.find((x) => x["@type"] === "BreadcrumbList");
    const h1 = document.querySelector("h1");
    return {
      visible: document.querySelectorAll('nav[aria-label="Breadcrumb"]').length,
      trail: crumb?.itemListElement?.map((i) => i.name) ?? null,
      // the trail must not be rendered as text either
      textTrail: /Home\s*\/\s*Services\s*\//.test(document.body.innerText),
      h1: h1?.innerText.trim(),
      h1Top: h1 ? Math.round(h1.getBoundingClientRect().top + window.scrollY) : null,
    };
  });
  ok(`${slug}: no visible breadcrumb`, r.visible === 0 && !r.textTrail, `${r.visible} nav`);
  // Two crumbs, not three. The middle one was "/#services", a fragment
  // on the homepage, so crumbs 1 and 2 resolved to the same document
  // and claimed a hierarchy with no page behind it (2026-08-09).
  ok(`${slug}: BreadcrumbList schema kept`, r.trail?.length === 2, (r.trail ?? []).join(" > "));
  ok(`${slug}: H1 sits high on the page`, r.h1Top !== null && r.h1Top < 400, `${r.h1Top}px`);
}

console.log("\n── product pages: no equity %, Live in accent ──");
for (const slug of ["replydude", "decipher-engine"]) {
  await p.goto(`${BASE}/products/${slug}`, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const rows = [...document.querySelectorAll("aside dl > div")].map((d) => {
      const dd = d.querySelector("dd");
      const el = dd?.firstElementChild ?? dd;
      return {
        label: d.querySelector("dt")?.innerText.trim(),
        value: dd?.innerText.replace(/\s+/g, " ").trim(),
        colour: el ? getComputedStyle(el).color : null,
      };
    });
    // hero eyebrow: "PRODUCT · LIVE", status half in the accent
    const eyebrow = document.querySelector("h1")?.previousElementSibling?.querySelector("span");
    const state = eyebrow?.querySelector("span");
    return {
      rows,
      text: document.body.innerText,
      eyebrow: eyebrow?.innerText.replace(/\s+/g, " ").trim(),
      stateText: state?.innerText.trim(),
      stateColour: state ? getComputedStyle(state).color : null,
    };
  });
  const status = r.rows.find((x) => /status/i.test(x.label ?? ""));
  const role = r.rows.find((x) => /role/i.test(x.label ?? ""));
  ok(`${slug}: no equity percentage on the page`, !/\d+\s*%\s*equity/i.test(r.text));
  ok(`${slug}: role reads "Technical co-founder"`, role?.value === "Technical co-founder", role?.value);
  ok(`${slug}: Status starts "Live"`, status?.value.startsWith("Live"), status?.value);
  // the WHOLE status is accent, version number included
  ok(`${slug}: the whole Status value is accent orange`,
    status?.colour === "rgb(233, 106, 66)", `${status?.value} = ${status?.colour}`);
  ok(`${slug}: hero eyebrow reads PRODUCT · LIVE`, r.eyebrow === "PRODUCT · LIVE", r.eyebrow);
  ok(`${slug}: LIVE in the eyebrow is accent orange`,
    r.stateText === "LIVE" && r.stateColour === "rgb(233, 106, 66)",
    `${r.stateText} = ${r.stateColour}`);
}

console.log("\n── footer ──");
{
  await p.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  for (let i = 0; i < 3; i++) {
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(300);
  }
  const f = await p.evaluate(() => {
    const footer = document.querySelector("footer");
    const cols = [...footer.querySelectorAll("nav[aria-label]")].map((n) => ({
      title: n.getAttribute("aria-label"),
      links: [...n.querySelectorAll("a")].map((a) => a.innerText.trim()),
    }));
    const marks = [...footer.querySelectorAll("svg")];
    const big = marks.map((s) => Math.round(s.getBoundingClientRect().width)).sort((a, c) => c - a)[0];
    return {
      cols,
      hrefs: [...footer.querySelectorAll("a")].map((a) => a.getAttribute("href")),
      text: footer.innerText,
      bigMark: big,
      markViewBoxes: marks.map((s) => s.getAttribute("viewBox")).filter(Boolean),
    };
  });
  const company = f.cols.find((c) => c.title === "Company");
  ok("Company column still there", !!company, f.cols.map((c) => c.title).join(" | "));
  ok("Company = About + Blog only", JSON.stringify(company?.links) === JSON.stringify(["About", "Blog"]), (company?.links ?? []).join(" "));
  ok("no Careers link", !f.hrefs.includes("/careers") && !/Careers/.test(f.text));
  // the giant mark must be the real wordmark SVG, not the word typed out
  ok("giant footer wordmark is the real SVG mark",
    f.markViewBoxes.filter((v) => v.startsWith("1522.98")).length >= 2,
    f.markViewBoxes.join(" | "));
  ok("and it is rendered large", f.bigMark > 600, `${f.bigMark}px`);
}

console.log("\n── /careers is gone ──");
{
  collect = false;
  // /careers used to 404, and this asserted that. It now redirects to
  // /about: it was a real route on the old deployment and the only one
  // deleted in a7a97d3 that never got a rule, so a 404 was throwing
  // away the inbound signal (client, 2026-08-09). What still matters is
  // that it does not RENDER a careers page and is not in the sitemap.
  const res = await p.goto(`${BASE}/careers`, { waitUntil: "domcontentloaded" });
  ok("/careers redirects rather than 404ing", res.status() === 200, String(res.status()));
  ok("/careers lands on /about", new URL(p.url()).pathname === "/about", p.url());
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  ok("sitemap has no /careers", !xml.includes("/careers"));
}

await p.close();
console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + [...new Set(errs)].join("\n") : "console clean"));
console.log(fails === 0 ? "ALL NAV/FOOTER CHECKS PASS" : `${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
