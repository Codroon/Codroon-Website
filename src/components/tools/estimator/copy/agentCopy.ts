import { UNSURE } from "@/pricing/types";
import type { EstimatorCopy } from "./types";

/**
 * AI agent estimator — question copy.
 *
 * ⚠️ Copy sign-off needed on the questions marked NEW below. The type
 * question was rewritten so its options map one-to-one onto the five
 * priced agent types (the previous options covered only three, and
 * left simple automation unreachable — which the interrupt depends on).
 */

export const agentCopy: EstimatorCopy = {
  title: "AI agent cost estimator",

  privacyNote:
    "We save your answers so you can come back to this. Nothing personal until you tell us.",

  questions: [
    {
      id: "industry",
      question: "What industry are you in?",
      hint: "Industry sets compliance and integration norms. It nudges the range, it doesn't set it.",
      options: [
        { label: "E-commerce & retail", value: "ecommerce" },
        { label: "Healthcare", value: "healthcare" },
        { label: "Finance & insurance", value: "finance" },
        { label: "Professional services", value: "services" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW options — one per priced type
      id: "type",
      question: "What should the agent do?",
      hint: "This is the biggest single factor in the estimate.",
      options: [
        { label: "Trigger one action when something happens", value: "simple-automation" },
        { label: "Own one workflow from start to finish", value: "single-task" },
        { label: "Answer questions from your own documents", value: "knowledge-agent" },
        { label: "Run a multi-step process across your systems", value: "workflow-agent" },
        { label: "Coordinate several agents on one job", value: "multi-agent" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      id: "access",
      question: "Does it read, or does it act?",
      hint: "Acting needs approval and rollback paths. That's where cost concentrates.",
      options: [
        { label: "Reads: answers questions, drafts replies", value: "read-only" },
        { label: "Acts: updates records, sends messages", value: "takes-actions" },
        { label: "Both", value: "both" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      id: "systems",
      question: "How many systems does it touch?",
      hint: "Each integration is scoped and priced on its own.",
      options: [
        { label: "1", value: "one" },
        { label: "2–3", value: "two-or-three" },
        { label: "4–6", value: "four-plus" },
        { label: "More than 6", value: "many" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW third option — the config prices document volume three ways
      id: "docs",
      question: "Does it need your own documents?",
      hint: "Retrieval over your docs adds indexing and testing time.",
      options: [
        { label: "No, general knowledge is enough", value: "none" },
        { label: "A few: policies, product data, past tickets", value: "few" },
        { label: "A large library: hundreds of documents or more", value: "large" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW question
      id: "approval",
      question: "Should a person approve what it does?",
      hint: "Approval steps are the cheapest insurance an agent can carry.",
      options: [
        { label: "Yes, every action", value: "always" },
        { label: "Only the high-risk ones", value: "high-risk" },
        { label: "No, let it run", value: "never" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW question — the optional branch, drives monthly run cost
      id: "volume",
      question: "How often will it run?",
      hint: "Volume moves the monthly bill more than anything else does.",
      options: [
        { label: "Under 100 times a day", value: "low" },
        { label: "100 to 1,000 times a day", value: "mid" },
        { label: "More than 1,000 times a day", value: "high" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
  ],

  interstitialAfter: "approval",

  interstitial: {
    heading: "That's your build cost.",
    body: "One more answer gets you monthly running cost.",
    keepGoing: "Keep going",
    show: "Show my estimate",
  },

  interrupt: {
    heading: "This looks like automation, not an agent.",
    body: ({ smaller, instead }) =>
      `${smaller} instead of ${instead}. Keep going, or see what we'd build instead?`,
    smaller: "Show me that instead",
    keepGoing: "Keep going",
  },

  aboveCeiling: {
    heading: (ceiling) => `Above ${ceiling}. This one needs a conversation.`,
    body: "Six questions can't scope a build this size honestly, and a number we can't stand behind is worse than no number. Tell us what you're trying to do and we'll come back with a real one.",
    cta: "Book a free discovery call",
  },

  results: {
    ledgerLabel: "What's in it",
    sandboxLabel: "Bring it down",
    closingLine: (saved, days) =>
      `You've taken ${saved} and about ${days} days off. We'd add these back once the agent is earning.`,
    primaryCta: "Get a fixed price quote",
    secondaryCta: "Email me this estimate",
    comparisonLabel: "How this compares",
    runCost: {
      label: "What it costs to run",
      covers:
        "Model usage, hosting, retrieval if the agent uses it, tracing, and maintenance. Model usage is the biggest share and scales with volume. Routing simple steps to a cheaper model typically cuts the bill by more than half.",
      totalLabel: "Monthly total",
    },
    // ⚠️ Zothix: the two right-hand columns are typical market bands,
    // not quotes (the table caption says so). Hire-someone build cost
    // = 3–6 months of the same loaded salary its run-cost row cites;
    // no-code build cost = consultant setup, with the subscription
    // moved to the run-cost row where it belongs. ($0 upfront was
    // read as an error — client, 2026-08-02.)
    comparison: {
      columns: ["This estimate", "Hire someone", "No-code platform"],
      rows: [
        {
          header: "Build cost",
          derived: "range",
          cells: ["$25,000–$60,000", "$2,000–$10,000 setup"],
        },
        {
          header: "Timeline",
          derived: "timeline",
          cells: ["2–4 months to hire", "1–2 weeks"],
        },
        {
          header: "Run cost",
          derived: "runCost",
          cells: ["$60,000–$120,000 / yr loaded", "$50–$500 / mo, climbs with usage"],
        },
        {
          header: "Who maintains it",
          derived: "literal",
          literal: "Codroon",
          cells: ["Them, until they leave", "The platform"],
        },
      ],
    },
  },
};
