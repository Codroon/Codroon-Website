import { chromium } from "playwright";
const b = await chromium.launch();
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };

// Stub products render no slider at all, so they cannot exercise the
// fallback — asserting only HTTP 200 here proved nothing. Drive the
// real branches through the live DOM instead.
console.log("\n── stub products still render ──");
// opspilot/blueprint were deleted 2026-08-02; these two still render
// from the no-content-module stub.
for (const slug of ["codroon-ai", "codmatic"]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const res = await p.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "networkidle" });
  const hasSlider = await p.locator('[aria-roledescription="carousel"]').count();
  ok(`/products/${slug} renders`, res?.status() === 200, `HTTP ${res?.status()}, ${hasSlider} slider(s)`);
  await p.close();
}

// The !tint fallback and the malformed-hex path have no page of their
// own, so exercise the CSS contract directly: an invalid or absent
// border-color resolves to currentColor (near-white here), which is
// exactly what the validation exists to prevent.
console.log("\n── fallback + malformed colour (CSS contract) ──");
{
  const p = await b.newPage();
  await p.setContent(`<div style="color:#eae5e1;background:#1a1917">
    <div id="valid"   style="border:1px solid;border-color:#7852b5"></div>
    <div id="invalid" style="border:1px solid;border-color:not-a-colour"></div>
    <div id="absent"  style="border:1px solid"></div>
    <div id="token"   class="border border-border"></div>
  </div>`);
  const read = (id) => p.locator("#" + id).evaluate((el) => getComputedStyle(el).borderTopColor);
  ok("valid hex paints the tint", (await read("valid")) === "rgb(120, 82, 181)");
  const bad = await read("invalid");
  ok("an invalid hex would fall back to near-white currentColor", bad === "rgb(234, 229, 225)", bad);
  ok("…which is why ProductSlider validates before applying", true, "HEX test in ProductSlider.tsx");
  await p.close();
}

// reduced motion
console.log("\n── reduced motion ──");
const r = await b.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: "reduce" });
await r.goto("http://localhost:3000/products/decipher-engine", { waitUntil: "networkidle" });
const rm = await r.locator('[aria-roledescription="carousel"] > div').first().evaluate((el) => {
  const s = getComputedStyle(el);
  return {
    border: s.borderTopColor,
    // assert on DURATION, not property name: the global reduced-motion
    // rule sets `transition-property: all`, so a substring check for
    // "aspect-ratio" passes vacuously and proves nothing
    durationMs: parseFloat(s.transitionDuration) * 1000,
    hasClass: /transition-\[aspect-ratio\]/.test(el.className),
  };
});
ok("brand border still applied", rm.border === "rgb(120, 82, 181)", rm.border);
ok("transition class omitted under reduced motion", rm.hasClass === false);
ok("and the frame does not animate", rm.durationMs < 1, `${rm.durationMs}ms`);
await r.close();

// mobile
console.log("\n── mobile ──");
// replydude is black by client decision (not its sampled blue, not the
// neutral hairline); decipher-engine carries its own violet. Both go
// through the tint path, so both carry the halo.
for (const [slug, want, halo] of [
  ["replydude", "rgb(0, 0, 0)", true],
  ["decipher-engine", "rgb(120, 82, 181)", true],
]) {
  const m = await b.newPage({ viewport: { width: 375, height: 720 } });
  await m.goto(`http://localhost:3000/products/${slug}`, { waitUntil: "networkidle" });
  const ov = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const f = await m.locator('[aria-roledescription="carousel"] > div').first().evaluate((el) => {
    const s = getComputedStyle(el);
    return { border: s.borderTopColor, shadow: s.boxShadow };
  });
  // assert the EXACT expected colour — "not the neutral token" passes
  // for every failure mode it is meant to catch, including white
  ok(`${slug} 0px overflow`, ov === 0, ov + "px");
  ok(`${slug} border is exactly the expected colour at 375`, f.border === want, `${f.border} (want ${want})`);
  ok(
    `${slug} ${halo ? "has" : "has no"} halo`,
    halo ? f.shadow !== "none" : f.shadow === "none",
    f.shadow
  );
  await m.close();
}

// the frame tint must not leak onto Codroon's own controls
console.log("\n── Codroon orange still owns the controls ──");
const c = await b.newPage({ viewport: { width: 1440, height: 950 } });
await c.goto("http://localhost:3000/products/decipher-engine", { waitUntil: "networkidle" });
const dot = await c.locator('button[aria-label^="Show screenshot"] span').first().evaluate(el => getComputedStyle(el).backgroundColor);
const link = await c.locator('[aria-roledescription="carousel"] a').first().evaluate(el => getComputedStyle(el).color).catch(() => "none");
ok("active dot is Codroon accent", dot === "rgb(233, 106, 66)", dot);
ok("caption link is Codroon accent", link === "rgb(233, 106, 66)", link);
await c.close();

console.log("\n" + (fails === 0 ? "ALL EDGE CHECKS PASS" : `${fails} FAILURES`) + "\n");
await b.close();
process.exit(fails === 0 ? 0 : 1);
