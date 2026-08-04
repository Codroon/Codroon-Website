/** Verify the two GATE 13 fixes. */
import { chromium } from "playwright";

const URL = "http://localhost:3000/services/ai-agent-development";
const b = await chromium.launch();

// 1) focused pill keeps its radius
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(URL, { waitUntil: "networkidle" });
await p.waitForTimeout(1000);
const radius = await p.evaluate(() => {
  const pill = [...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "ChatGPT");
  pill.focus();
  return getComputedStyle(pill).borderRadius;
});
console.log(`focused pill border-radius: ${radius} (expect 9999px / calc(infinity...)`);
await p.close();

// 2) reduced motion: delayed hero elements immediately visible
const ctx = await b.newContext({ reducedMotion: "reduce" });
const p2 = await ctx.newPage();
await p2.setViewportSize({ width: 1440, height: 900 });
await p2.goto(URL, { waitUntil: "commit" });
// probe as early as possible after first paint
await p2.waitForSelector("h1", { state: "attached" });
const opacity = await p2.evaluate(() => {
  const h1 = document.querySelector("h1");
  const cta = [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Build your agent"));
  return {
    h1: getComputedStyle(h1).opacity,
    cta: cta ? getComputedStyle(cta.closest(".anim-rise") ?? cta).opacity : "n/a",
    delay: getComputedStyle(document.querySelector(".anim-delay-3") ?? h1).animationDelay,
  };
});
console.log(`reduced-motion: h1 opacity=${opacity.h1}, cta wrapper opacity=${opacity.cta}, anim-delay-3 computed delay=${opacity.delay}`);
await ctx.close();
await b.close();
console.log("done");
