/**
 * Verifies the pricing/timeline alignment edits against the SERVER-RENDERED
 * pages (not just source), and re-checks JSON-LD parity for the FAQ answers
 * that changed.
 */
const BASE = "http://localhost:3000";

const PAGES = {
  mvpService: "/services/mvp-development",
  agentService: "/services/ai-agent-development",
  mvpTool: "/tools/mvp-cost-calculator",
  agentTool: "/tools/ai-agent-cost-calculator",
};

const html = {};
for (const [k, path] of Object.entries(PAGES)) {
  const r = await fetch(BASE + path);
  html[k] = await r.text();
  if (!r.ok) console.log(`!! ${path} -> ${r.status}`);
}

// strings that must be GONE everywhere
const STALE = [
  "3–6 weeks",
  "3 to 6 weeks",
  "three to six weeks",
  "Three to six weeks",
  "6–8 weeks",
  "six to eight",
  "$8,000–$35,000",
  "$8,000 to $35,000",
  "$50–$1,500",
  "$50 to $1,500",
  "$3,000 to $6,000",
  "ships in three weeks",
];

// strings that must be PRESENT, per page
const REQUIRED = {
  mvpService: [
    "a working product in 2–6 weeks",
    "A real product in 2–6 weeks",
    "use in 2 to 6 weeks",
    "Four steps, two to six weeks",
    "take two to six weeks",
    "ships in two to three weeks",
  ],
  agentService: [
    "in 2–6 weeks",
    "Four steps, two to six weeks",
    "$6,000–$38,000",
    "Two to six weeks for most projects",
    "usually live in two to three",
  ],
  mvpTool: [
    "take two to six weeks to build",
    // new §5 table
    "$3,000–$4,500",
    "$8,000–$14,000",
    "$12,000–$18,000",
    "$16,000–$26,000",
    "$20,000–$32,000",
    "2–3 weeks",
    "5–6 weeks",
    // new FAQ answer
    "Two to six weeks for most products",
    "A single-user tool with one core workflow ships in two to three.",
    // new hero card
    "$24,000–$30,000",
    "$17,000",
    "4–5 weeks",
    "$17,000 · 3–4 weeks",
  ],
  agentTool: [
    "$6,000 to $38,000",
    "$50 to $2,500",
    "$2,000 to $5,000",
    // new §5 table
    "$2,000–$5,000",
    "$6,000–$12,000",
    "$10,000–$18,000",
    "$15,000–$25,000",
    "$22,000–$38,000",
    "$10–$40",
    "$600–$1,500",
    // §8 table
    "$6,000–$38,000",
    "$50–$2,500 / mo",
    // §6 worked example
    "typically runs $300–$650 a month",
    "roughly three times the cost",
    // hero card unchanged
    "$18,000–$24,000",
  ],
};

let fails = 0;
for (const [k, h] of Object.entries(html)) {
  for (const s of STALE) {
    if (h.includes(s)) {
      console.log(`STALE  ${k}: still contains "${s}"`);
      fails++;
    }
  }
  for (const s of REQUIRED[k]) {
    if (!h.includes(s)) {
      console.log(`MISSING ${k}: "${s}"`);
      fails++;
    }
  }
}

// FAQPage JSON-LD must still match the visible answers exactly
for (const [k, h] of Object.entries(html)) {
  const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const faq = blocks
    .map((m) => {
      try {
        return JSON.parse(m[1].replace(/\\u003c/g, "<"));
      } catch {
        return null;
      }
    })
    .find((j) => j && j["@type"] === "FAQPage");
  if (!faq) continue;
  for (const item of faq.mainEntity) {
    const a = item.acceptedAnswer.text;
    for (const s of STALE) {
      if (a.includes(s)) {
        console.log(`STALE  ${k} JSON-LD: "${s}" in "${item.name}"`);
        fails++;
      }
    }
  }
  console.log(`${k}: FAQPage JSON-LD ok (${faq.mainEntity.length} Q&As)`);
}

console.log(fails === 0 ? "\nALL CHECKS PASS" : `\n${fails} FAILURES`);
