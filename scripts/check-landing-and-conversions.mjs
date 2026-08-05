import { chromium } from "playwright";
const OUT = "C:/Users/Gaming/AppData/Local/Temp/claude/c--Users-Gaming-Codroon-Web-App/8c53b9e5-c284-4395-9eba-5574a0cc9112/scratchpad";
const b = await chromium.launch();
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const errs = [];
const newPage = async (vp = { width: 1440, height: 950 }) => {
  const p = await b.newPage({ viewport: vp, deviceScaleFactor: 2 });
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  return p;
};

/* ── landing: product cards ── */
console.log("── landing product cards ──");
const p = await newPage();
await p.goto("http://localhost:3000/", { waitUntil: "networkidle" });
{
  const cards = p.locator("#products li:has(h3)");
  const txt = (await p.locator("#products").textContent()) ?? "";
  ok("no 'View project' anywhere", !/View project/i.test(txt.replace(/View Product/g, "")));
  ok("'View Product' present ×2", (txt.match(/View Product/g) ?? []).length === 2);
  const imgs = await p.locator("#products img").evaluateAll((els) => els.map((e) => e.getAttribute("src")));
  ok("both card screenshots wired", imgs.length === 2 && imgs.every((s) => /01-(replydude|decipher)-site/.test(decodeURIComponent(s))), imgs.join(" | "));
  // Two destinations per card (client, 2026-08-04): the heading opens
  // the LIVE product in a new tab, everything else goes to the product
  // page on this site.
  const heads = await p.locator("#products h3 a").evaluateAll((els) =>
    els.map((a) => ({
      // firstChild, not innerText: the link also carries an sr-only span
      text: (a.firstChild?.textContent ?? "").trim(),
      href: a.getAttribute("href"),
      target: a.getAttribute("target"),
      rel: a.getAttribute("rel"),
      z: getComputedStyle(a).zIndex,
    }))
  );
  // the heading IS the live domain, in the client's own capitalisation
  ok("headings read as the live domains",
    heads.map((h) => h.text).sort().join(" | ") === "Decipherengine.ai | Replydude.ai",
    heads.map((h) => h.text).join(" | "));
  ok("headings link to the live products, new tab",
    heads.length === 2 &&
      heads.every((h) => /^https:\/\/(replydude|decipherengine)\.ai$/.test(h.href ?? "")) &&
      heads.every((h) => h.target === "_blank" && /noopener/.test(h.rel ?? "") && /noreferrer/.test(h.rel ?? "")),
    heads.map((h) => `${h.href} ${h.target}`).join(" | "));
  // the heading must sit ABOVE the card-wide overlay or its click is
  // swallowed by the View Product link that casts it
  ok("headings clear the card overlay", heads.every((h) => h.z === "10"), heads.map((h) => h.z).join(" "));
  const views = await p.locator("#products a").evaluateAll((els) =>
    els.filter((a) => /view product/i.test(a.innerText)).map((a) => a.getAttribute("href"))
  );
  ok("View Product goes to the product pages",
    views.length === 2 && views.includes("/products/decipher-engine") && views.includes("/products/replydude"),
    views.join(", "));
  ok("the products index is not linked from the landing page",
    !(await p.locator('#products a[href="/products"]').count()));
  // the section CTA converts now instead of navigating to the hidden index
  const sectionCta = p.locator("#products button", { hasText: "Build something similar?" });
  ok("section CTA reads 'Build something similar?'", (await sectionCta.count()) === 1);
  ok("no 'View all products' left", !/View all products/i.test(txt));
  await sectionCta.first().scrollIntoViewIfNeeded();
  await sectionCta.first().click();
  await p.waitForTimeout(700);
  ok("section CTA opens the contact modal",
    await p.locator('[role="dialog"]').isVisible().catch(() => false));
  await p.keyboard.press("Escape");
  await p.waitForTimeout(400);
  ok("ReplyDude descriptor trimmed", txt.includes("A cross-platform desktop AI agent.") && !txt.includes("agent running reply growth"));
  // whole card still clickable via the stretched link — click raw
  // coordinates over the IMAGE area; the anchor's ::after overlay is
  // what receives it, which is the design working
  const before = p.url();
  const media = p.locator("#products li").filter({ hasText: "ReplyDude" }).locator("div.group > div").first();
  await media.scrollIntoViewIfNeeded();
  const bb = await media.boundingBox();
  await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await p.waitForURL("**/products/replydude");
  ok("clicking the card image area navigates", p.url() !== before);
  await p.goBack({ waitUntil: "networkidle" });
}

/* ── stats strip count-up ── */
console.log("── stats strip ──");
{
  const strip = p.locator("section.bg-accent").first();
  await strip.scrollIntoViewIfNeeded();
  await p.waitForTimeout(350); // mid-flight
  const mid = (await strip.textContent()) ?? "";
  await p.waitForTimeout(2200); // settled
  const done = (await strip.textContent()) ?? "";
  ok("figures settle on the sanctioned strings",
    done.includes("100+") && done.includes("$300K+") && done.includes("500K+"));
  ok("count was actually animating mid-flight", mid !== done, "midpoint differed");
}

/* ── testimonials: auto-advance + stat count-up ── */
console.log("── testimonials ──");
{
  await p.locator("#testimonials").scrollIntoViewIfNeeded();
  await p.waitForTimeout(2000);
  const q1 = (await p.locator("#testimonials blockquote").textContent()) ?? "";
  await p.waitForTimeout(7600);
  const q2 = (await p.locator("#testimonials blockquote").textContent()) ?? "";
  ok("quote auto-advanced after ~7s", q1 !== q2, q1.slice(0, 30) + " → " + q2.slice(0, 30));
  // pause handlers live on the QUOTE column — hover the quote itself
  await p.locator("#testimonials blockquote").hover();
  const q3 = (await p.locator("#testimonials blockquote").textContent()) ?? "";
  await p.waitForTimeout(7600);
  const q4 = (await p.locator("#testimonials blockquote").textContent()) ?? "";
  ok("hover on the quote pauses the rotation", q3 === q4);
  const stats = (await p.locator("#testimonials ul").last().textContent()) ?? "";
  ok("stat tiles settled on real figures", stats.includes("100+") && stats.includes("99%") && stats.includes("40+"));
  await p.screenshot({ path: `${OUT}/v-testimonials.png`, clip: (await p.locator("#testimonials").boundingBox()) });
}
await p.close();

/* ── reduced motion: figures render at rest, no rotation ── */
console.log("── reduced motion ──");
{
  const r = await b.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: "reduce" });
  await r.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  const strip = r.locator("section.bg-accent").first();
  await strip.scrollIntoViewIfNeeded();
  await r.waitForTimeout(250);
  const txt = (await strip.textContent()) ?? "";
  ok("reduced motion: final figures immediately", txt.includes("100+") && txt.includes("$300K+"));
  await r.locator("#testimonials").scrollIntoViewIfNeeded();
  const a = (await r.locator("#testimonials blockquote").textContent()) ?? "";
  await r.waitForTimeout(7600);
  const bq = (await r.locator("#testimonials blockquote").textContent()) ?? "";
  ok("reduced motion: no auto-advance", a === bq);
  await r.close();
}

/* ── nav dropdown ── */
console.log("── nav products dropdown ──");
{
  const n = await newPage();
  await n.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await n.locator("nav button", { hasText: "Products" }).hover();
  await n.waitForTimeout(400);
  const menu = (await n.locator('[id="nav-panel-products"]').textContent()) ?? "";
  ok("dropdown = ReplyDude + Decipher only",
    menu.includes("ReplyDude") && menu.includes("Decipher Engine") && !menu.includes("Opspilot") && !menu.includes("Blueprint"));
  ok("Decipher subtitle removed", !menu.includes("RPG storytelling"));
  const foot = (await n.locator("footer").textContent()) ?? "";
  ok("footer purged too", !foot.includes("Opspilot") && !foot.includes("Blueprint"));
  await n.close();
}

/* ── product page: stats band + slider intact ── */
console.log("── product page band ──");
{
  const d = await newPage();
  await d.goto("http://localhost:3000/products/replydude", { waitUntil: "networkidle" });
  const band = d.locator("section.bg-accent").last();
  await band.scrollIntoViewIfNeeded();
  await d.waitForTimeout(2200);
  const t = (await band.textContent()) ?? "";
  ok("band settled on real figures", /\d/.test(t), t.replace(/\s+/g, " ").slice(0, 80));
  await d.close();
}

/* ── estimator results: buttons gone, modal opens ── */
console.log("── estimator results ──");
{
  const e = await newPage();
  await e.goto(
    "http://localhost:3000/tools/ai-agent-cost-calculator/estimate?at=results&type=knowledge-agent&access=takes-actions&systems=two-or-three&docs=few&approval=high-risk&volume=mid",
    { waitUntil: "networkidle" }
  );
  await e.waitForTimeout(800);
  const txt = (await e.locator("main").textContent()) ?? "";
  ok("copy-link gone", !txt.includes("Copy link to this estimate"));
  ok("download gone", !/Download (diagram|build plan)/.test(txt));
  ok("comparison: hire-someone upfront is real", txt.includes("$25,000–$60,000"));
  ok("comparison: no-code setup band", txt.includes("$2,000–$10,000 setup"));
  ok("comparison: no-code run cost carries the sub", txt.includes("$50–$500 / mo, climbs with usage"));
  // quote CTA → in-page Calendly modal, not a new tab
  let popup = null;
  e.context().on("page", (pg) => { popup = pg; });
  await e.locator("button", { hasText: "Get a fixed price quote" }).click();
  await e.waitForTimeout(1200);
  const dialog = e.locator('[role="dialog"]');
  ok("modal opened on the meeting view", (await dialog.count()) === 1 && ((await dialog.textContent()) ?? "").includes("Schedule a meeting"));
  const iframeSrc = await dialog.locator("iframe").getAttribute("src");
  ok("Calendly iframe themed", iframeSrc?.includes("calendly.com") && iframeSrc?.includes("background_color=232220"), iframeSrc ?? "none");
  ok("no new tab opened", popup === null);
  await e.screenshot({ path: `${OUT}/v-quote-modal.png` });
  await e.keyboard.press("Escape");
  await e.waitForTimeout(400);
  ok("Escape closes it", (await dialog.count()) === 0);
  await e.close();
}

/* ── MVP estimator table ── */
console.log("── MVP comparison ──");
{
  const m = await newPage();
  await m.goto(
    "http://localhost:3000/tools/mvp-cost-calculator/estimate?at=results&type=saas-mvp&users=two&money=subscriptions&have=neither&integrations=1&ai=none",
    { waitUntil: "networkidle" }
  );
  await m.waitForTimeout(800);
  const txt = (await m.locator("main").textContent()) ?? "";
  ok("no-code cell upgraded", txt.includes("$8,000–$25,000 with an agency"));
  ok("freelance band unchanged", txt.includes("$15,000–$40,000"));
  ok("copy-link gone here too", !txt.includes("Copy link to this estimate"));
  await m.close();
}

/* ── mobile: nothing overflows on the changed surfaces ── */
console.log("── 375px overflow ──");
for (const path of ["/", "/products/replydude"]) {
  const mo = await b.newPage({ viewport: { width: 375, height: 720 } });
  await mo.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
  const ov = await mo.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`${path} 0px overflow`, ov === 0, ov + "px");
  await mo.close();
}

/**
 * The closing CTA card. Its buttons are whitespace-nowrap and the product
 * labels are long, so they used to run past the card padding on every
 * product page (worst on Decipher: +71px at 1440, +230px at 1024).
 * Measured against the card's padding box, not the viewport — the page
 * itself never overflowed, which is why the 375 check above missed it.
 */
console.log("\n── closing CTA card: buttons inside the card ──");
for (const w of [375, 768, 1024, 1440]) {
  const v = await b.newPage({ viewport: { width: w, height: 900 } });
  for (const path of ["/", "/products/replydude", "/products/decipher-engine"]) {
    await v.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
    const btns = await v.evaluate(() => {
      const card = [...document.querySelectorAll("section")]
        .map((s) => s.querySelector('div[class*="--radius-lg"]'))
        .filter(Boolean).pop();
      if (!card) return null;
      const cr = card.getBoundingClientRect();
      const cs = getComputedStyle(card);
      const [pl, pr] = [parseFloat(cs.paddingLeft), parseFloat(cs.paddingRight)];
      return [...card.querySelectorAll("a, button")].map((e) => {
        const r = e.getBoundingClientRect();
        return {
          t: e.innerText.replace(/\s+/g, " ").trim().slice(0, 22),
          over: Math.round(Math.max(r.right - (cr.right - pr), cr.left + pl - r.left)),
        };
      });
    });
    ok(`${w} ${path}`, btns && btns.every((x) => x.over <= 1),
      (btns ?? []).filter((x) => x.over > 1).map((x) => `"${x.t}" +${x.over}px`).join(" "));
  }
  await v.close();
}

console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + errs.join("\n") : "console clean"));
console.log(fails === 0 ? "ALL CHECKS PASS" : `${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
