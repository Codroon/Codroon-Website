import { chromium } from "playwright";

/**
 * /about QA.
 *
 * The imagery rule changed on 2026-08-03. The page is still photo-free
 * and stock-free, but three exceptions are now deliberate and
 * load-bearing: the hero logomark, the Connect panel's media slot, and
 * the two landmark drawings in Where we are. So this asserts "no
 * photographs, and every image is one of the sanctioned ones" rather
 * than "no images".
 */
const BASE = "http://localhost:3000";
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };
const b = await chromium.launch();
const errs = [];

const lum = (c) => {
  const [r, g, bl] = c.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
};
const ratio = (a, c) => { const [x, y] = [lum(a), lum(c)].sort((m, n) => n - m); return +((x + 0.05) / (y + 0.05)).toFixed(2); };

const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
await p.goto(`${BASE}/about`, { waitUntil: "networkidle" });

console.log("── imagery: no photos, only sanctioned graphics ──");
{
  const g = await p.evaluate(() => {
    const main = document.body;
    const imgs = [...main.querySelectorAll("section img")].map((i) => i.getAttribute("src"));
    return {
      imgs,
      raster: imgs.filter((s) => /\.(jpe?g|png|webp|avif|gif)$/i.test(s ?? "")),
      undecorated: [...main.querySelectorAll("section img")].filter((i) => i.getAttribute("aria-hidden") !== "true" && i.getAttribute("alt") !== "").length,
      bg: [...main.querySelectorAll("section *")].filter((e) => getComputedStyle(e).backgroundImage !== "none").length,
    };
  });
  ok("no raster photos or stock imagery", g.raster.length === 0, g.raster.join(" "));
  ok("every image is the logomark", g.imgs.every((s) => /codroon-mark\.svg/.test(s ?? "")), g.imgs.join(" "));
  ok("all decorative images are hidden from AT", g.undecorated === 0, String(g.undecorated));
  ok("no CSS background images", g.bg === 0, String(g.bg));
}

console.log("\n── section order and structure ──");
{
  const h = await p.evaluate(() =>
    [...document.querySelectorAll("section h1, section h2, section h3")].map((e) => ({ lvl: +e.tagName[1], t: e.innerText.trim().slice(0, 40) }))
  );
  ok("exactly one H1", h.filter((x) => x.lvl === 1).length === 1);
  const skips = h.reduce((a, x, i) => (i && x.lvl > h[i - 1].lvl + 1 ? [...a, `h${h[i - 1].lvl}→h${x.lvl}`] : a), []);
  ok("no heading level skips", skips.length === 0, skips.join(" "));
  const order = await p.evaluate(() =>
    [...document.querySelectorAll("section[aria-labelledby], section[aria-label]")]
      .map((s) => s.getAttribute("aria-labelledby") ?? s.getAttribute("aria-label"))
  );
  // ai-native is now an <aside> inside the build section, not a section
  // "What we won't do" was removed entirely on 2026-08-04 (client)
  const want = ["about-h1", "Codroon in numbers", "founders-h", "build-h", "connect-h", "offices-h"];
  ok("sections in brief order", JSON.stringify(order) === JSON.stringify(want), order.join(" | "));
  ok("testimonials left out while unpopulated", !order.includes("testimonials"));
}

console.log("\n── rhythm rule: adjacent sections differ ──");
{
  const secs = await p.evaluate(() =>
    [...document.querySelectorAll("section[aria-labelledby], section[aria-label]")].map((s) => {
      // width that MATTERS is the content measure, not the band
      const inner = s.querySelector("h1, h2");
      return {
        id: s.getAttribute("aria-labelledby") ?? s.getAttribute("aria-label"),
        bg: getComputedStyle(s).backgroundColor,
        w: Math.round((inner?.closest("div") ?? s).getBoundingClientRect().width),
      };
    })
  );
  for (let i = 1; i < secs.length; i++) {
    const same = secs[i].bg === secs[i - 1].bg && secs[i].w === secs[i - 1].w;
    ok(`${secs[i - 1].id} → ${secs[i].id}`, !same, same ? `both ${secs[i].bg}@${secs[i].w}` : "");
  }
}

console.log("\n── §3 the orange anchor ──");
{
  const f = await p.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="founders-h"]');
    const card = sec.querySelector("dl");
    const texts = [...sec.querySelectorAll("p, h2")].filter((e) => !card.contains(e) && e.textContent.trim());
    return {
      bg: getComputedStyle(sec).backgroundColor,
      cardBg: getComputedStyle(card).backgroundColor,
      rows: card.children.length,
      colors: texts.map((e) => ({ t: e.textContent.trim().slice(0, 24), c: getComputedStyle(e).color, size: parseFloat(getComputedStyle(e).fontSize), w: getComputedStyle(e).fontWeight })),
    };
  });
  ok("orange surface", f.bg === "rgb(233, 106, 66)", f.bg);
  // surface-card #232220, NOT the page surface #1a1917 (client, 2026-08-04)
  ok("model card is surface-card, 3 rows", f.cardBg === "rgb(35, 34, 32)" && f.rows === 3, f.cardBg);
  const blend = (fg) => {
    const v = fg.match(/[\d.]+/g).map(Number);
    const a = v.length > 3 ? v[3] : 1;
    return `rgb(${v.slice(0, 3).map((x, i) => Math.round(x * a + [233, 106, 66][i] * (1 - a))).join(",")})`;
  };
  ok("no light text on the orange", !f.colors.some((c) => c.c.match(/[\d.]+/g).slice(0, 3).every((v) => +v > 120)));
  const low = f.colors.filter((c) => ratio(blend(c.c), "rgb(233,106,66)") < (c.size >= 24 || (c.size >= 18.66 && +c.w >= 700) ? 3 : 4.5));
  ok(`all ${f.colors.length} text nodes on orange meet contrast`, low.length === 0, low.map((c) => `"${c.t}"`).join(" "));
  const orangeSurfaces = await p.evaluate(() =>
    [...document.querySelectorAll("section")].filter((s) => getComputedStyle(s).backgroundColor === "rgb(233, 106, 66)").length
  );
  // §3 and §8 both carry it now (client, 2026-08-03); they are not adjacent
  ok("orange used as a surface exactly twice", orangeSurfaces === 2, String(orangeSurfaces));
}

console.log("\n── §4 hanging numerals, §5 narrower aside ──");
{
  const n = await p.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="build-h"]');
    const items = [...sec.querySelectorAll("h3")].map((h) => h.closest("div").parentElement);
    const num = sec.querySelector("span[aria-hidden]");
    const h3 = sec.querySelector("h3");
    return {
      numerals: [...sec.querySelectorAll("span[aria-hidden]")].map((s) => s.textContent.trim()),
      color: getComputedStyle(num).color,
      hangs: Math.round(num.getBoundingClientRect().x) < Math.round(h3.getBoundingClientRect().x),
      count: items.length,
    };
  });
  // "You own everything" removed 2026-08-03, so two claims remain
  ok("numerals are 01, 02", JSON.stringify(n.numerals) === JSON.stringify(["01", "02"]), n.numerals.join(" "));
  // --accent-dim was demoted to decoration on 2026-08-09: it could not
  // reach 4.5:1 on either surface, and no dimmer accent value can.
  // Informative numerals use --text-secondary now.
  ok("numerals meet contrast (text-secondary, not accent-dim)",
     n.color === "rgb(200, 197, 185)", n.color);
  ok("numerals hang outside the text column", n.hangs);

  const aside = await p.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="build-h"]');
    const el = document.querySelector('aside[aria-labelledby="ai-native-h"]');
    const claims = sec.querySelector("h3");
    const h2 = sec.querySelector("h2");
    return {
      w: Math.round(el.getBoundingClientRect().width),
      x: Math.round(el.getBoundingClientRect().x),
      y: Math.round(el.getBoundingClientRect().y),
      claimX: Math.round(claims.getBoundingClientRect().x),
      claimY: Math.round(claims.getBoundingClientRect().y),
      h2Bottom: Math.round(h2.getBoundingClientRect().bottom),
      h2Lines: Math.round(h2.getBoundingClientRect().height / parseFloat(getComputedStyle(h2).lineHeight)),
      bg: getComputedStyle(el).backgroundColor,
      sticky: getComputedStyle(el).position,
    };
  });
  ok("AI-native sits to the RIGHT of the claims", aside.x > aside.claimX, `${aside.x} vs ${aside.claimX}`);
  // the card carries the brand orange (client, 2026-08-04)
  ok("AI-native card is the accent orange", aside.bg === "rgb(233, 106, 66)", aside.bg);
  {
    const t = await p.evaluate(() =>
      [...document.querySelectorAll('aside[aria-labelledby="ai-native-h"] p, aside[aria-labelledby="ai-native-h"] h2')]
        .map((e) => ({ t: e.textContent.trim().slice(0, 22), c: getComputedStyle(e).color, size: parseFloat(getComputedStyle(e).fontSize), w: getComputedStyle(e).fontWeight })));
    const blendOnAccent = (fg) => {
      const v = fg.match(/[\d.]+/g).map(Number);
      const a = v.length > 3 ? v[3] : 1;
      return `rgb(${v.slice(0, 3).map((x, i) => Math.round(x * a + [233, 106, 66][i] * (1 - a))).join(",")})`;
    };
    ok("no light text on the AI-native card", !t.some((c) => c.c.match(/[\d.]+/g).slice(0, 3).every((v) => +v > 120)),
      t.map((c) => c.c).join(" "));
    const low = t.filter((c) => ratio(blendOnAccent(c.c), "rgb(233,106,66)") < (c.size >= 24 || (c.size >= 18.66 && +c.w >= 700) ? 3 : 4.5));
    ok(`all ${t.length} text nodes on the AI-native card meet contrast`, low.length === 0, low.map((c) => `"${c.t}"`).join(" "));
  }
  ok("AI-native is sticky beside the tall column", aside.sticky === "sticky", aside.sticky);
  // dropped down so it starts level with the first claim, not the eyebrow
  ok("AI-native starts below the H2", aside.y > aside.h2Bottom, `${aside.y} vs ${aside.h2Bottom}`);
  ok("AI-native starts within 40px of the first claim", Math.abs(aside.y - aside.claimY) <= 40, `${aside.y} vs ${aside.claimY}`);
  // the H2 lost its 20ch cap, so it must not stack into stubs
  ok("build H2 wraps to at most 2 lines", aside.h2Lines <= 2, `${aside.h2Lines} lines`);
}

console.log("\n── §8 connect ──");
{
  const c = await p.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="connect-h"]');
    const panel = sec.querySelector("div.aspect-\\[4\\/3\\]");
    const btns = [...sec.querySelectorAll("button")];
    return {
      twoCol: getComputedStyle(sec.querySelector("div.grid")).gridTemplateColumns.split(" ").filter(Boolean).length,
      panelRatio: panel ? +(panel.getBoundingClientRect().width / panel.getBoundingClientRect().height).toFixed(2) : null,
      options: btns.map((x) => x.innerText.replace(/\s+/g, " ").trim()),
      icons: sec.querySelectorAll("button svg").length,
      fabricated: /["“].+["”]/.test(panel?.innerText ?? ""),
    };
  });
  ok("two columns", c.twoCol === 2, String(c.twoCol));
  ok("media slot at 4:3", c.panelRatio === 1.33, String(c.panelRatio));
  ok("three options, exact labels and descriptors",
    JSON.stringify(c.options) === JSON.stringify([
      "Get a Call We'll call you back within 24 hours",
      "Send an Email Drop us a message and we'll respond soon",
      "Schedule a Meeting Book a time that works for you",
    ]), c.options.join(" | "));
  ok("one icon tile per option", c.icons === 3, String(c.icons));
  ok("no fabricated quote in the panel", !c.fabricated);
}

console.log("\n── §9 offices ──");
{
  const o = await p.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="offices-h"]');
    const cards = [...sec.querySelectorAll("li")];
    return {
      count: cards.length,
      text: cards.map((x) => x.innerText.replace(/\s+/g, " ").trim()),
      svgs: cards.map((x) => x.querySelectorAll("svg").length),
      strokes: cards.map((x) => { const s = x.querySelector("svg"); return { stroke: getComputedStyle(s).color, fill: s.getAttribute("fill") }; }),
      intro: sec.innerText.includes("We are a Dallas studio."),
      centred: [...sec.querySelectorAll("h2, p")].map((e) => getComputedStyle(e).textAlign),
      onlyCentred: [...document.querySelectorAll("section")]
        .filter((s) => [...s.querySelectorAll("h2")].some((h) => getComputedStyle(h).textAlign === "center"))
        .map((s) => s.getAttribute("aria-labelledby")),
    };
  });
  ok("exactly two office cards", o.count === 2, String(o.count));
  ok("USA head office and Pakistan", o.text[0].startsWith("USA head office") && o.text[1].startsWith("Pakistan"), o.text.join(" | "));
  ok("cities shown", o.text[0].includes("Dallas, TX") && o.text[1].includes("Islamabad, Pakistan"));
  ok("one landmark drawing per card", o.svgs.every((n) => n === 1), o.svgs.join(","));
  ok("drawn in a single accent stroke, no fill", o.strokes.every((s) => s.stroke === "rgb(233, 106, 66)" && s.fill === "none"), JSON.stringify(o.strokes[0]));
  ok("existing Dallas prose leads into the cards", o.intro);
  // centred on the client's instruction (2026-08-04): heading, prose, cards
  ok("heading and all prose centred", o.centred.every((a) => a === "center"), [...new Set(o.centred)].join(" "));
  ok("Where we are is the ONLY centred section", JSON.stringify(o.onlyCentred) === JSON.stringify(["offices-h"]), o.onlyCentred.join(" "));
  ok("no fabricated street address", !/\d{2,}\s+\w+\s+(St|Ave|Rd|Blvd|Road|Street)/i.test(o.text.join(" ")), o.text.join(" | "));
}

console.log("\n── schema ──");
{
  const biz = await p.evaluate(() =>
    [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)).find((x) => x["@type"] === "ProfessionalService"));
  ok("LocalBusiness subtype present", !!biz);
  ok("head office address is Dallas", biz.address.addressLocality === "Dallas" && biz.address.addressRegion === "TX");
  ok("both offices in schema", biz.location?.length === 2, JSON.stringify(biz.location?.map((l) => l.address.addressLocality)));
  ok("Islamabad present", biz.location?.some((l) => l.address.addressLocality === "Islamabad"));
  ok("no fabricated phone", !("telephone" in biz));
  ok("no fabricated street lines", !biz.location?.some((l) => "streetAddress" in l.address));
  const m = await p.evaluate(() => ({ t: document.title, c: document.querySelector('link[rel="canonical"]')?.href }));
  ok("canonical set", m.c === "https://codroon.com/about");
  ok("no em dash in title", !m.t.includes("—"), m.t);
}

console.log("\n── copy is unchanged ──");
{
  const text = await p.evaluate(() => document.body.innerText);
  for (const s of [
    "We build products. Sometimes we co-found them.",
    "We'd rather own part of what we build.",
    "Two things we do differently, and the proof for each.",
    "It changes the price, not the standard.",
    "Built in Dallas, working with founders anywhere.",
    "Tell us what you are building.",
    "Live products with real users, not case studies.",
    "Small enough that you talk to whoever builds it.",
  ]) ok(`verbatim: "${s.slice(0, 42)}…"`, text.includes(s));
  ok("no em dash in body copy", !text.includes("—"));
  ok("no semicolon in body copy", !text.includes(";"));
  ok("removed claim is gone", !text.includes("You own everything"));
  ok("heading count matches the items shown", !text.includes("Three things we do differently"));
  // §7 removed entirely (client, 2026-08-04) — heading AND all four items
  for (const s of [
    "Four things we turn down",
    "What we won't do",
    "We won't take a project we would advise against",
    "We won't bill by the hour",
    "We won't build something you cannot leave",
    "We won't promise a number we cannot hold",
  ]) ok(`removed section: "${s.slice(0, 34)}…" is gone`, !text.includes(s));
  for (const banned of ["Brands that build with us", "Our story", "Our values", "Meet the team", "Milestones"])
    ok(`no "${banned}"`, !text.includes(banned));
}
await p.close();

console.log("\n── 375 / 768 / 1440 ──");
for (const w of [375, 768, 1440]) {
  const v = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  v.on("console", (m) => { if (m.type() === "error") errs.push(`${w}: ${m.text()}`); });
  await v.goto(`${BASE}/about`, { waitUntil: "networkidle" });
  await v.waitForTimeout(700);
  const ov = await v.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  ok(`${w} no horizontal overflow`, ov === 0, ov + "px");
  const small = await v.evaluate(() =>
    [...document.querySelectorAll("section a, section button")]
      .map((e) => ({ t: e.innerText.slice(0, 18), h: e.getBoundingClientRect().height }))
      .filter((x) => x.h > 0 && x.h < 44).map((x) => `${x.t}(${Math.round(x.h)})`)
  );
  ok(`${w} interactive targets ≥44px`, small.length === 0, small.join(" "));

  // the CTA buttons are whitespace-nowrap; the long secondary label used
  // to run past the card padding instead of wrapping (client, 2026-08-04)
  const cta = await v.evaluate(() => {
    const card = document.querySelector("#final-cta div");
    const r = card.getBoundingClientRect();
    const cs = getComputedStyle(card);
    const [pl, pr] = [parseFloat(cs.paddingLeft), parseFloat(cs.paddingRight)];
    return [...card.querySelectorAll("a, button")].map((e) => {
      const b = e.getBoundingClientRect();
      return {
        t: e.innerText.replace(/\s+/g, " ").trim().slice(0, 20),
        over: Math.round(Math.max(b.right - (r.right - pr), r.left + pl - b.left)),
      };
    });
  });
  ok(`${w} CTA buttons stay inside the card`, cta.every((x) => x.over <= 1),
    cta.filter((x) => x.over > 1).map((x) => `"${x.t}" +${x.over}px`).join(" "));
  // side by side from sm up, like the product-page CTA (client, 2026-08-04)
  if (w >= 768) {
    const row = await v.evaluate(() => {
      const ys = [...document.querySelectorAll("#final-cta a, #final-cta button")]
        .map((e) => Math.round(e.getBoundingClientRect().y));
      return { ys, same: new Set(ys).size === 1 };
    });
    ok(`${w} CTA buttons sit on one row`, row.same, row.ys.join(" / "));
  }
  await v.close();
}

console.log("\n── no-JS ──");
{
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const np = await ctx.newPage();
  await np.goto(`${BASE}/about`, { waitUntil: "domcontentloaded" });
  const t = await np.evaluate(() => document.body.innerText);
  ok("every section server-rendered",
    ["We build products", "products shipped", "We'd rather own", "Two things we do", "It changes the price",
     "How to connect", "Built in Dallas", "Tell us what you are building"].every((s) => t.includes(s)));
  ok("removed section absent without JS too", !t.includes("Four things we turn down"));
  await ctx.close();
}

console.log("\n" + (errs.length ? "CONSOLE ERRORS:\n" + [...new Set(errs)].join("\n") : "console clean"));
console.log(fails === 0 ? "ALL ABOUT CHECKS PASS" : `${fails} FAILURES`);
await b.close();
process.exit(fails === 0 ? 0 : 1);
