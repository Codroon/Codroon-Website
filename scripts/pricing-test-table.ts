/**
 * Pricing sanity-check table. Compiled and run standalone — no UI.
 *   npx tsc scripts/pricing-test-table.ts --outDir <tmp> --module commonjs ...
 */
import { agentConfig } from "../src/pricing/agent.config";
import { mvpConfig } from "../src/pricing/mvp.config";
import {
  estimate,
  fitToBudget,
  formatMoney,
  formatRange,
  encodeAnswers,
  decodeAnswers,
  buildSnapshot,
  recomputeFromSnapshot,
} from "../src/pricing/calculate";
import type { Answers, ToolConfig } from "../src/pricing/types";

const line = (c = "─", n = 78) => console.log(c.repeat(n));
const h = (t: string) => {
  console.log("");
  line("═");
  console.log(t);
  line("═");
};

function row(label: string, value: string) {
  console.log(`  ${label.padEnd(30)}${value}`);
}

function show(config: ToolConfig, name: string, answers: Answers, cuts: string[] = []) {
  const e = estimate(config, answers, cuts);
  const inputs = config.questions
    .filter((q) => answers[q.id] !== undefined)
    .map((q) => `${q.id}=${answers[q.id]}`)
    .join("  ");

  console.log("");
  console.log(`▸ ${name}`);
  console.log(`  ${inputs}`);
  if (e.state === "above-ceiling") {
    row("RANGE", `— above ceiling (computed midpoint ${formatMoney(e.midpoint)})`);
    row("SCREEN", '"Above $50,000 — this one needs a conversation."');
    return e;
  }
  row("RANGE", `${formatRange(e.lo, e.hi)}   ${e.confidenceLabel}`);
  row("TIMELINE", e.timelineLabel);
  if (e.runCost) row("RUN COST", e.runCost.label);
  row("midpoint", formatMoney(e.midpoint));
  console.log(
    `  ledger: ${e.ledger
      .map((l) => `${l.label} ${formatMoney(l.amount)}${l.struck ? " [struck]" : ""}`)
      .join(" · ")}`
  );
  console.log(
    `  cuts offered: ${
      e.cuts.map((c) => `${c.id} (−${formatMoney(c.saves)})`).join(", ") || "none"
    }`
  );
  return e;
}

/* ══════════════ narrowing trace ══════════════ */

h("NARROWING TRACE — the range must tighten, never accumulate upward");
console.log("\nAGENT · workflow agent, acts, 2–3 systems, few docs, high-risk approval");
const traceSteps: Answers[] = [
  {},
  { industry: "ecommerce" },
  { industry: "ecommerce", type: "workflow-agent" },
  { industry: "ecommerce", type: "workflow-agent", access: "takes-actions" },
  { industry: "ecommerce", type: "workflow-agent", access: "takes-actions", systems: "two-or-three" },
  { industry: "ecommerce", type: "workflow-agent", access: "takes-actions", systems: "two-or-three", docs: "few" },
  { industry: "ecommerce", type: "workflow-agent", access: "takes-actions", systems: "two-or-three", docs: "few", approval: "high-risk" },
];
line();
console.log("  after answering        range                    spread   remaining");
line();
const labels = ["(nothing)", "industry", "type", "access", "systems", "docs", "approval"];
traceSteps.forEach((a, i) => {
  const e = estimate(agentConfig, a);
  console.log(
    `  ${labels[i].padEnd(22)}${formatRange(e.lo, e.hi).padEnd(25)}${e.confidenceLabel.padEnd(9)}${e.remaining}`
  );
});

console.log("\nMVP · SaaS, two user types, subscriptions, no designs, 2 integrations");
const mvpTrace: Answers[] = [
  {},
  { type: "saas-mvp" },
  { type: "saas-mvp", users: "two" },
  { type: "saas-mvp", users: "two", money: "subscriptions" },
  { type: "saas-mvp", users: "two", money: "subscriptions", have: "neither" },
  { type: "saas-mvp", users: "two", money: "subscriptions", have: "neither", integrations: 2 },
  { type: "saas-mvp", users: "two", money: "subscriptions", have: "neither", integrations: 2, ai: "none" },
];
const mvpLabels = ["(nothing)", "type", "users", "money", "have", "integrations", "ai"];
line();
mvpTrace.forEach((a, i) => {
  const e = estimate(mvpConfig, a);
  console.log(
    `  ${mvpLabels[i].padEnd(22)}${formatRange(e.lo, e.hi).padEnd(25)}${e.confidenceLabel.padEnd(9)}${e.remaining}`
  );
});

/* ══════════════ agent table ══════════════ */

h("AGENT — five configurations");

show(agentConfig, "A1  Simple automation, read-only, 1 system, no docs, no approval", {
  industry: "ecommerce", type: "simple-automation", access: "read-only",
  systems: "one", docs: "none", approval: "never", volume: "low",
});

show(agentConfig, "A2  Single-task agent, acts, 2–3 systems, no docs, high-risk approval", {
  industry: "b2b", type: "single-task", access: "takes-actions",
  systems: "two-or-three", docs: "none", approval: "high-risk", volume: "low",
});

show(agentConfig, "A3  Knowledge agent (RAG), read-only, 2–3 systems, large library", {
  industry: "healthcare", type: "knowledge-agent", access: "read-only",
  systems: "two-or-three", docs: "large", approval: "never", volume: "mid",
});

show(agentConfig, "A4  Workflow agent, acts, 2–3 systems, few docs, high-risk  ← hero card case", {
  industry: "ecommerce", type: "workflow-agent", access: "takes-actions",
  systems: "two-or-three", docs: "few", approval: "high-risk", volume: "mid",
});

show(agentConfig, "A5  Multi-agent, acts, 4+ systems, large library, approval always  ← max", {
  industry: "finance", type: "multi-agent", access: "takes-actions",
  systems: "four-plus", docs: "large", approval: "always", volume: "high",
});

/* ══════════════ mvp table ══════════════ */

h("MVP — five configurations");

// users / money / integrations are SKIPPED for a waitlist page — the
// stale values below are deliberately present to prove they're ignored.
show(mvpConfig, "M1  Landing page + waitlist (users/money/integrations skipped)", {
  industry: "consumer", type: "landing-waitlist", users: "two",
  money: "subscriptions", have: "neither", integrations: 3, ai: "none",
});

show(mvpConfig, "M2  Single-user tool, subscriptions, has a spec, 1 integration", {
  industry: "b2b", type: "single-user-tool", users: "one",
  money: "subscriptions", have: "spec", integrations: 1, ai: "none",
});

show(mvpConfig, "M3  SaaS MVP, two user types, subscriptions, 2 integrations  ← hero card case", {
  industry: "b2b", type: "saas-mvp", users: "two", money: "subscriptions",
  have: "neither", integrations: 2, ai: "none",
});

show(mvpConfig, "M4  AI-native MVP, two users, subscriptions, has designs, AI is the product", {
  industry: "consumer", type: "ai-native-mvp", users: "two",
  money: "subscriptions", have: "designs", integrations: 1, ai: "is-the-product",
});

show(mvpConfig, "M5  Marketplace, 3+ user types, payments between users, 3 integrations, AI product", {
  industry: "ecommerce", type: "marketplace-mvp", users: "three-plus",
  money: "between-users", have: "neither", integrations: 3, ai: "is-the-product",
});

/* ══════════════ edge cases ══════════════ */

h("EDGE CASES");

console.log('\n▸ "Not sure" widens the band instead of narrowing it');
const sure: Answers = { type: "saas-mvp", users: "two", money: "subscriptions" };
const unsure: Answers = { type: "saas-mvp", users: "unsure", money: "subscriptions" };
const eS = estimate(mvpConfig, sure);
const eU = estimate(mvpConfig, unsure);
row("users = two", `${formatRange(eS.lo, eS.hi)}  ${eS.confidenceLabel}`);
row("users = not sure", `${formatRange(eU.lo, eU.hi)}  ${eU.confidenceLabel}  (falls back to 'two')`);

console.log("\n▸ Cuts recompute range, timeline and run cost");
const withCuts: Answers = {
  type: "workflow-agent", access: "takes-actions", systems: "two-or-three",
  docs: "few", approval: "high-risk", volume: "mid",
};
const before = estimate(agentConfig, withCuts);
const after = estimate(agentConfig, withCuts, ["skip-retrieval", "remove-approval"]);
row("no cuts", `${formatRange(before.lo, before.hi)}  ${before.timelineLabel}  ${before.runCost?.label}`);
row("skip retrieval + approval", `${formatRange(after.lo, after.hi)}  ${after.timelineLabel}  ${after.runCost?.label}`);

console.log("\n▸ Cuts are only offered when they apply");
const noApproval = estimate(agentConfig, {
  type: "single-task", access: "read-only", systems: "one", docs: "none", approval: "never",
});
row("read-only, 1 system, no docs", noApproval.cuts.map((c) => c.id).join(", ") || "none offered");

console.log("\n▸ Run cost cap");
const bigRun = estimate(agentConfig, {
  type: "multi-agent", access: "takes-actions", systems: "four-plus",
  docs: "large", approval: "always", volume: "high",
});
row("multi-agent, high volume", bigRun.runCost!.label);

console.log("\n▸ MVP budget fitting (serves, never qualifies)");
for (const band of ["20-40k", "10-20k", "under-10k"]) {
  const answers: Answers = {
    type: "saas-mvp", users: "two", money: "subscriptions",
    have: "neither", integrations: 2, ai: "none", budget: band,
  };
  const fit = fitToBudget(mvpConfig, answers)!;
  const e = estimate(mvpConfig, answers, fit.cuts);
  row(
    `budget ${band}`,
    fit.fits
      ? `fits → ${formatRange(e.lo, e.hi)} with [${fit.cuts.join(", ") || "no cuts"}]`
      : `does NOT fit → leanest ${formatMoney(fit.leanest)} with all cuts applied`
  );
}

console.log("\n▸ Interrupt conditions");
row("agent: simple-automation", String(agentConfig.interrupt.when({ type: "simple-automation" })));
row("agent: read-only+1+single", String(agentConfig.interrupt.when({ type: "single-task", access: "read-only", systems: "one" })));
row("agent: workflow agent", String(agentConfig.interrupt.when({ type: "workflow-agent", access: "takes-actions", systems: "two-or-three" })));
row("mvp: 3+ users, nothing yet", String(mvpConfig.interrupt.when({ users: "three-plus", have: "neither" })));
row("mvp: 3+ users, has designs", String(mvpConfig.interrupt.when({ users: "three-plus", have: "designs" })));

console.log("\n▸ URL round-trip (a pasted link reproduces the estimate exactly)");
const original: Answers = {
  type: "saas-mvp", users: "two", money: "subscriptions",
  have: "neither", integrations: 2, ai: "none",
};
const params = encodeAnswers(original);
const restored = decodeAnswers(mvpConfig, new URLSearchParams(params.toString()));
const a1 = estimate(mvpConfig, original);
const a2 = estimate(mvpConfig, restored);
row("query string", params.toString());
row("identical estimate", String(a1.lo === a2.lo && a1.hi === a2.hi && a1.midpoint === a2.midpoint));

console.log("\n▸ Answer order does not change the estimate");
const reversed: Answers = {
  ai: "none", integrations: 2, have: "neither",
  money: "subscriptions", users: "two", type: "saas-mvp",
};
const a3 = estimate(mvpConfig, reversed);
row("reversed key order", `${formatRange(a3.lo, a3.hi)} — matches: ${a1.lo === a3.lo && a1.hi === a3.hi}`);

/* ══════════════ deck cross-check ══════════════ */

h("CROSS-CHECK against the figures already published on the pages");

const checks: Array<[string, string, string]> = [];

const initAgent = estimate(agentConfig, {});
checks.push(["agent tool span", `${formatRange(initAgent.lo, initAgent.hi)}`, "$2,000–$50,000"]);
const initMvp = estimate(mvpConfig, {});
checks.push(["mvp tool span", `${formatRange(initMvp.lo, initMvp.hi)}`, "$3,000–$50,000"]);

const heroAgent = estimate(agentConfig, {
  type: "workflow-agent", access: "takes-actions", systems: "two-or-three",
  docs: "few", approval: "high-risk", volume: "mid",
});
checks.push(["agent hero card", `${formatRange(heroAgent.lo, heroAgent.hi)} · ${heroAgent.timelineLabel}`, "$18,000–$24,000 (deck: keep)"]);

const heroMvp = estimate(mvpConfig, {
  type: "saas-mvp", users: "two", money: "subscriptions",
  have: "neither", integrations: 2, ai: "none",
});
checks.push(["mvp hero card", `${formatRange(heroMvp.lo, heroMvp.hi)} · ${heroMvp.timelineLabel}`, "$24,000–$30,000 · 4–5 weeks"]);

for (const [k, computed, published] of checks) {
  const ok = published.startsWith(computed.split(" · ")[0]) || published.includes(computed);
  console.log(`  ${ok ? "OK  " : "DIFF"}  ${k.padEnd(18)} computed ${computed.padEnd(30)} published ${published}`);
}

console.log(
  "\n▸ Type-only answer must reproduce the published cost table EXACTLY"
);
let allExact = true;
for (const [tool, cfg] of [["agent", agentConfig], ["mvp", mvpConfig]] as const) {
  for (const [key, b] of Object.entries(cfg.base)) {
    const e = estimate(cfg, { type: key });
    const exact = e.lo === b.lo && e.hi === b.hi;
    if (!exact) allExact = false;
    console.log(
      `  ${exact ? "EXACT" : "DIFF "}  ${tool.padEnd(6)}${key.padEnd(19)}published ${formatRange(b.lo, b.hi).padEnd(20)}computed ${formatRange(e.lo, e.hi).padEnd(20)}${e.timelineLabel}`
    );
  }
}
console.log(
  `\n  ${allExact ? "✔ every published row reproduced exactly" : "✘ some rows differ"}`
);

console.log("\n▸ Ladder holds — no cheaper type outranks a dearer one");
const ladder: Array<[string, string]> = [
  ["simple-automation, read-only, 1 system, no docs", "simple-automation"],
  ["single-task, read-only, 1 system, no docs", "single-task"],
];
for (const [label, type] of ladder) {
  const e = estimate(agentConfig, {
    type, access: "read-only", systems: "one", docs: "none", approval: "never",
  });
  console.log(`  ${label.padEnd(50)}midpoint ${formatMoney(e.midpoint)}`);
}

console.log("\n▸ Ledger lines always sum to the midpoint");
for (const [name, cfg, ans, cuts] of [
  ["A4", agentConfig, { type: "workflow-agent", access: "takes-actions", systems: "two-or-three", docs: "few", approval: "high-risk" }, []],
  ["A4+cuts", agentConfig, { type: "workflow-agent", access: "takes-actions", systems: "two-or-three", docs: "few", approval: "high-risk" }, ["skip-retrieval", "remove-approval"]],
  ["M3", mvpConfig, { type: "saas-mvp", users: "two", money: "subscriptions", have: "neither", integrations: 2, ai: "none" }, []],
  ["M4", mvpConfig, { type: "ai-native-mvp", users: "two", money: "subscriptions", have: "designs", integrations: 1, ai: "is-the-product" }, []],
] as Array<[string, ToolConfig, Answers, string[]]>) {
  const e = estimate(cfg, ans, cuts);
  const sum = e.ledger.filter((l) => !l.struck).reduce((s, l) => s + l.amount, 0);
  console.log(
    `  ${name.padEnd(10)}Σ visible lines ${formatMoney(sum).padEnd(12)}midpoint ${formatMoney(e.midpoint).padEnd(12)}${sum === e.midpoint ? "OK" : "MISMATCH"}`
  );
}

h("REBUILT HERO CARDS — derived, not hand-written (for the decks)");

function card(title: string, cfg: ToolConfig, ans: Answers, leanCuts?: string[]) {
  const e = estimate(cfg, ans);
  console.log(`\n${title}`);
  console.log(`  YOUR ESTIMATED BUILD`);
  console.log(`  ${formatRange(e.lo, e.hi)}`);
  console.log("");
  for (const l of e.ledger) {
    console.log(`    ${l.label.padEnd(42)}${formatMoney(l.amount)}`);
  }
  console.log("");
  console.log(`  TIMELINE${" ".repeat(34)}${e.timelineLabel}`);
  if (e.runCost) console.log(`  MONTHLY RUN COST${" ".repeat(26)}${e.runCost.label}`);
  if (leanCuts) {
    const lean = estimate(cfg, ans, leanCuts);
    console.log(
      `  LEANER VERSION${" ".repeat(28)}${formatMoney(lean.midpoint)} · ${lean.timelineLabel}`
    );
    console.log(`    (cuts: ${leanCuts.join(", ")})`);
  }
}

card("AGENT — workflow agent, acts, 2–3 systems, light retrieval, high-risk approval, mid volume", agentConfig, {
  type: "workflow-agent", access: "takes-actions", systems: "two-or-three",
  docs: "few", approval: "high-risk", volume: "mid",
});

card("MVP — SaaS MVP, two user types, subscriptions, two integrations", mvpConfig, {
  type: "saas-mvp", users: "two", money: "subscriptions",
  have: "neither", integrations: 2, ai: "none",
}, ["drop-second-user-type", "skip-admin-panel", "defer-onboarding"]);

h("SNAPSHOT PARITY — a stored estimate must replay identically");

const PARITY: Array<[string, ToolConfig, Answers]> = [
  ["agent workflow", agentConfig, { type: "workflow-agent", access: "takes-actions", systems: "two-or-three", docs: "few", approval: "high-risk", volume: "mid" }],
  ["agent knowledge", agentConfig, { type: "knowledge-agent", access: "read-only", systems: "two-or-three", docs: "large", approval: "never", volume: "high" }],
  ["mvp saas", mvpConfig, { type: "saas-mvp", users: "two", money: "subscriptions", have: "neither", integrations: 2, ai: "none" }],
  ["mvp ai-native", mvpConfig, { type: "ai-native-mvp", users: "two", money: "subscriptions", have: "designs", integrations: 1, ai: "is-the-product" }],
  ["mvp waitlist", mvpConfig, { type: "landing-waitlist", have: "neither", ai: "none" }],
];

let parityFails = 0;
let combos = 0;
for (const [name, cfg, ans] of PARITY) {
  const snap = buildSnapshot(cfg, ans);
  if (!snap) {
    console.log(`  FAIL  ${name}: no snapshot`);
    parityFails++;
    continue;
  }
  const ids = snap.cuts.map((c) => c.id);
  // every subset of the applicable cuts
  const subsets: string[][] = [[]];
  for (const id of ids) {
    for (const s of [...subsets]) subsets.push([...s, id]);
  }
  let bad = 0;
  for (const subset of subsets) {
    combos++;
    const live = estimate(cfg, ans, subset);
    const replayed = recomputeFromSnapshot(snap, subset);
    const same =
      live.lo === replayed.lo &&
      live.hi === replayed.hi &&
      live.midpoint === replayed.midpoint &&
      live.saved === replayed.saved &&
      live.timelineLabel === replayed.timelineLabel &&
      live.runCost?.label === replayed.runCost?.label &&
      JSON.stringify(live.ledger) === JSON.stringify(replayed.ledger) &&
      JSON.stringify(live.cuts) === JSON.stringify(replayed.cuts);
    if (!same) {
      bad++;
      if (bad === 1) {
        console.log(`  FAIL  ${name} [${subset.join(",") || "no cuts"}]`);
        console.log(`        live     ${formatRange(live.lo, live.hi)} ${live.timelineLabel} ${live.runCost?.label ?? ""}`);
        console.log(`        replayed ${formatRange(replayed.lo, replayed.hi)} ${replayed.timelineLabel} ${replayed.runCost?.label ?? ""}`);
      }
    }
  }
  if (bad === 0) console.log(`  OK    ${name.padEnd(16)}${subsets.length} cut combinations replay identically`);
  parityFails += bad;
}
console.log(
  `\n  ${parityFails === 0 ? `✔ all ${combos} combinations identical` : `✘ ${parityFails} of ${combos} differ`}`
);

console.log("\n▸ Guard: AI-native must not double-count 'AI is the product'");
const guarded = estimate(mvpConfig, { type: "ai-native-mvp", users: "one", money: "none", have: "neither", integrations: 0, ai: "is-the-product" });
const unguarded = estimate(mvpConfig, { type: "saas-mvp", users: "one", money: "none", have: "neither", integrations: 0, ai: "is-the-product" });
row("ai-native + AI-is-product", `${formatMoney(guarded.midpoint)}  (base midpoint $21,000 — modifier neutralised)`);
row("saas + AI-is-product", `${formatMoney(unguarded.midpoint)}  (base $15,000 × 1.45 — modifier applied)`);

console.log("");
