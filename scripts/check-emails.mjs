import { readFileSync, readdirSync } from "node:fs";
import { chromium } from "playwright";

/**
 * Email QA. Everything the brief forbids is asserted against the
 * RENDERED html, not the source, because the failures that matter are
 * what a client receives.
 *
 * Nothing here sends. It reads the dev export endpoint, which is the
 * same renderer the send path uses.
 */
const BASE = "http://localhost:3000";
let fails = 0;
const ok = (l, p, d = "") => { if (!p) fails++; console.log(`  ${p ? "PASS" : "FAIL"}  ${l}${d ? "  — " + d : ""}`); };

const items = await (await fetch(`${BASE}/dev/emails/export`)).json();
const visitor = items.filter((t) => t.audience === "visitor");
const sales = items.filter((t) => t.audience === "sales");

console.log("── the whole set ──");
ok("ten previews render", items.length === 10, String(items.length));
ok("six visitor, four notifications", visitor.length === 6 && sales.length === 4,
  `${visitor.length}/${sales.length}`);
ok("every template has a text part", items.every((t) => t.text.trim().length > 120),
  items.filter((t) => t.text.trim().length <= 120).map((t) => t.id).join(" "));

console.log("\n── the DO NOT list, against rendered html ──");
for (const t of items) {
  const h = t.html;
  const bad = [];
  if (/<svg/i.test(h)) bad.push("svg");
  if (/@font-face|fonts\.googleapis|fonts\.gstatic/i.test(h)) bad.push("web font");
  if (/display:\s*flex|display:\s*grid/i.test(h)) bad.push("flex/grid");
  if (/var\(--/.test(h)) bad.push("css variable");
  if (/src=["']\/(?!\/)/.test(h)) bad.push("relative image path");
  if (/unsubscribe/i.test(h)) bad.push("unsubscribe link");
  ok(`${t.id}`, bad.length === 0, bad.join(", "));
}

console.log("\n── visitor emails ──");
for (const t of visitor) {
  const h = t.html;
  // white on the accent is the one contrast rule that cannot slip
  const onAccent = [...h.matchAll(/background-color:\s*#E96A42[^"]*?color:\s*(#[0-9a-f]{6})/gi)]
    .map((m) => m[1].toLowerCase());
  ok(`${t.id}: text on the accent is #232220`,
    onAccent.every((c) => c === "#232220"), onAccent.join(" "));
  ok(`${t.id}: logo is an absolute URL`,
    /src="https?:\/\/[^"]+\/email\/logo-light\.png"/.test(h));
  ok(`${t.id}: logo has width AND height attributes`,
    /<img[^>]+width="120"[^>]+height="31"/.test(h) || /<img[^>]+height="31"[^>]+width="120"/.test(h));
  ok(`${t.id}: logo is display:block`, /<img[^>]+display:block/.test(h.replace(/\s*:\s*/g, ":")));
  ok(`${t.id}: alt text carries the brand`, /<img[^>]+alt="Codroon"/.test(h));
  ok(`${t.id}: opts out of forced dark mode`,
    /name="color-scheme"[^>]*content="light only"/.test(h));
  ok(`${t.id}: card is light, not dark`, /#ffffff/i.test(h) && !/background-color:\s*#1a1917/i.test(h));
}

console.log("\n── notifications stay plain ──");
for (const t of sales) {
  const h = t.html;
  ok(`${t.id}: no logo`, !/<img/i.test(h));
  ok(`${t.id}: no brand colour`, !/E96A42/i.test(h));
  ok(`${t.id}: no buttons or links`, !/<a\s/i.test(h));
  ok(`${t.id}: monospace`, /monospace/i.test(h));
  ok(`${t.id}: timestamp is Karachi, not UTC`,
    /PKT/.test(t.text) && !/UTC/.test(t.text), t.text.split("\n")[1]);
}
{
  const est = sales.find((t) => t.id === "4-notify-estimator");
  ok("estimator subject carries the money", /\$18,000 to \$26,000/.test(est.subject), est.subject);
  ok("estimator subject carries the industry", /Professional services/.test(est.subject));
  ok('"none toggled" is stated, not omitted', /none toggled/.test(est.text));
  const cuts = sales.find((t) => t.id === "4b-notify-estimator-quote");
  ok("toggled cuts are listed", /Drop retrieval/.test(cuts.text));
  ok("missing email says so", /Email\s+not given/.test(cuts.text));
  const call = sales.find((t) => t.id === "5-notify-call");
  ok("consent flags captured", /Call OK\s+yes/.test(call.text) && /SMS OK\s+no/.test(call.text));
  const mail = sales.find((t) => t.id === "5b-notify-email");
  ok("empty fields omitted, not blank", !/Phone/.test(mail.text));
}

console.log("\n── template rules ──");
{
  const mvp = visitor.find((t) => t.id === "1b-estimate-mvp");
  ok("MVP drops the run-cost clause entirely",
    !/a month to run/.test(mvp.html) && !/a month to run/.test(mvp.text));
  const agent = visitor.find((t) => t.id === "1-estimate-agent");
  ok("agent estimate keeps it", /a month to run/.test(agent.html));
  ok("breakdown figures survive into the text part",
    /Agent core and reasoning loop\s{2,}\$7,200/.test(agent.text));
  const ceiling = visitor.find((t) => t.id === "1c-estimate-above-ceiling");
  ok("above-ceiling shows no breakdown box", !/WHAT'S IN IT/i.test(ceiling.text));
  const named = visitor.find((t) => t.id === "2-ack-email");
  const anon = visitor.find((t) => t.id === "2b-ack-email-no-name");
  ok("greeting uses the first name only", /Got it, Daniel\./.test(named.html));
  ok("greeting drops cleanly with no name",
    /Got it\./.test(anon.html) && !/Got it,/.test(anon.html));
  const call = visitor.find((t) => t.id === "3-ack-call");
  ok("the phone number is echoed back", /\+1 \(214\) 555 0148/.test(call.html));
  ok("call ack points at Calendly", /calendly\.com/.test(call.html));
}

console.log("\n── nothing sends, and the lead write cannot be blocked ──");
{
  const route = readFileSync("src/app/api/lead/route.ts", "utf8");
  ok("modal_meeting gets no acknowledgement",
    !/modal_meeting["']?\s*\)?\s*\{[^}]*sendEmail/s.test(route));
  ok("the email step is wrapped in try/catch", /try \{[\s\S]*sendEmail[\s\S]*catch/.test(route));
  ok("Reply-To is set on every send",
    (route.match(/sendEmail\(\{/g) ?? []).length === (route.match(/replyTo: EMAIL\.replyTo/g) ?? []).length,
    `${(route.match(/sendEmail\(\{/g) ?? []).length} sends`);
  const send = readFileSync("src/lib/email/send.ts", "utf8");
  ok("no key means no request is made", /if \(!apiKey\)[\s\S]{0,200}return \{ ok: true, delivered: false \}/.test(send));
  ok("RESEND_API_KEY is not set in this environment", !process.env.RESEND_API_KEY);
}

console.log("\n── the exported files ──");
{
  const files = readdirSync("email-previews");
  ok("an .html and a .txt per template",
    items.every((t) => files.includes(`${t.id}.html`) && files.includes(`${t.id}.txt`)));
  ok("checklist is there", files.includes("CHECKLIST.md"));
  ok("exports use the production origin, not localhost",
    !readFileSync("email-previews/1-estimate-agent.html", "utf8").includes("localhost"));
}

console.log("\n── the preview route ──");
{
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 900 } });
  const errs = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto(`${BASE}/dev/emails`, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const frames = await p.evaluate(() => document.querySelectorAll("iframe").length);
  ok("renders every template", frames === 10, String(frames));
  const logo = await p.evaluate(() => {
    const img = document.querySelector("iframe").contentDocument.querySelector("img");
    return { w: img?.naturalWidth, rendered: Math.round(img?.getBoundingClientRect().width ?? 0) };
  });
  ok("the logo actually loads in the preview", logo.w === 480 && logo.rendered === 120, JSON.stringify(logo));
  await p.getByRole("button", { name: "Light background" }).click();
  await p.waitForTimeout(500);
  const dark = await p.evaluate(() => {
    const wrap = [...document.body.querySelectorAll("div")].find((d) => d.querySelector("header"));
    return getComputedStyle(wrap).backgroundColor;
  });
  ok("dark toggle switches the page", /27, 27, 27/.test(dark), dark);
  ok("console clean", errs.length === 0, errs.slice(0, 2).join(" | "));
  await b.close();
}

console.log("\n" + (fails === 0 ? "ALL EMAIL CHECKS PASS" : `${fails} FAILURES`));
process.exit(fails === 0 ? 0 : 1);
