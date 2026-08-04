/** GATE 12: internal links + all six service routes healthy. */
const BASE = "http://localhost:3000";
const SLUGS = [
  "ai-agent-development",
  "generative-ai-development",
  "ai-integration",
  "mvp-development",
  "saas-development",
  "custom-software-development",
];

// 1) all six routes return 200
for (const slug of SLUGS) {
  const res = await fetch(`${BASE}/services/${slug}`);
  console.log(`/services/${slug}: ${res.status}`);
}

// 2) the rich page links sideways to the other five + up to home
const html = await (await fetch(`${BASE}/services/ai-agent-development`)).text();
const main = html.split(/<footer/)[0]; // exclude footer chrome
const others = SLUGS.slice(1).filter((s) => main.includes(`href="/services/${s}"`));
console.log(`rich page sideways links (excl. footer): ${others.length}/5`);
console.log(`rich page links home: ${main.includes('href="/"')}`);
