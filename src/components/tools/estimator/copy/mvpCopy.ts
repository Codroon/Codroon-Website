import { MVP_BUDGET_BANDS } from "@/pricing/mvp.config";
import { UNSURE } from "@/pricing/types";
import type { EstimatorCopy } from "./types";

/**
 * MVP estimator — question copy.
 *
 * ⚠️ Copy sign-off needed where marked. "Anything else involved?" was
 * split into two questions because the config prices integrations as a
 * count and AI depth separately; the type question gained a landing-page
 * option so all five priced types are reachable.
 *
 * If the visitor picks the landing page, the users / money /
 * integrations questions are skipped by the pricing config — a waitlist
 * page has none of those, and answering produces nonsense.
 */

export const mvpCopy: EstimatorCopy = {
  title: "MVP cost estimator",

  privacyNote:
    "We save your answers so you can come back to this. Nothing personal until you tell us.",

  questions: [
    {
      id: "industry",
      question: "What industry are you in?",
      hint: "Industry shapes compliance and integrations. It nudges the range, it doesn't set it.",
      options: [
        { label: "E-commerce & retail", value: "ecommerce" },
        { label: "Healthcare", value: "healthcare" },
        { label: "B2B services", value: "b2b" },
        { label: "Consumer apps", value: "consumer" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW first option — the landing page is a priced type
      id: "type",
      question: "What are you building?",
      hint: "Product type sets the shape of the build. Marketplaces carry two sides from day one.",
      options: [
        { label: "Landing page with a waitlist", value: "landing-waitlist" },
        { label: "Internal tool", value: "single-user-tool" },
        { label: "SaaS tool", value: "saas-mvp" },
        { label: "AI-native product", value: "ai-native-mvp" },
        { label: "Marketplace", value: "marketplace-mvp" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      id: "users",
      question: "How many kinds of user does it have?",
      hint: "The biggest driver of cost, by a wide margin.",
      options: [
        { label: "One", value: "one" },
        { label: "Two", value: "two" },
        { label: "Three or more", value: "three-plus" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      id: "money",
      question: "Does money move through it?",
      hint: "Payments between users need escrow-grade care. One-way billing is far simpler.",
      options: [
        { label: "No", value: "none" },
        { label: "Subscriptions", value: "subscriptions" },
        { label: "Payments between users", value: "between-users" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      id: "have",
      question: "What do you already have?",
      hint: "Most founders arrive with neither. It adds a few days, not weeks.",
      options: [
        { label: "Designs", value: "designs" },
        { label: "A written spec", value: "spec" },
        { label: "Neither, and that's normal", value: "neither" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW question — split out of "Anything else involved?"
      id: "integrations",
      question: "How many other systems does it connect to?",
      hint: "A documented API is a day. A system without one is a week.",
      options: [
        { label: "None", value: 0 },
        { label: "One", value: 1 },
        { label: "Two", value: 2 },
        { label: "Three or more", value: 3 },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      // NEW question — split out of "Anything else involved?"
      id: "ai",
      question: "How much AI is in it?",
      hint: "AI as the product is a different build from AI as a feature.",
      options: [
        { label: "None", value: "none" },
        { label: "AI is a feature", value: "feature" },
        { label: "AI is the product", value: "is-the-product" },
        { label: "Not sure", value: UNSURE, quiet: true },
      ],
    },
    {
      id: "budget",
      question: "What's your budget?",
      suffix: "(optional)",
      hint: "Optional. It pre-selects the leaner version on your results. It never changes the estimate.",
      // derived from the pricing config — the figures live there
      options: [
        ...Object.entries(MVP_BUDGET_BANDS).map(([value, band]) => ({
          label: band.option,
          value,
        })),
        { label: "Not sure yet", value: UNSURE, quiet: true },
      ],
    },
  ],

  // the last question that moves the build cost; budget follows it
  interstitialAfter: "ai",

  interstitial: {
    heading: "That's your build cost and timeline.",
    body: "One more answer and we'll show you a leaner version.",
    keepGoing: "Keep going",
    show: "Show my estimate",
  },

  interrupt: {
    heading: "This sounds closer to a V1 than an MVP.",
    body: () =>
      "A tighter scope ships in half the time and answers the same question. Want to see what we'd build first?",
    smaller: "Show me the smaller version",
    keepGoing: "Keep going anyway",
  },

  aboveCeiling: {
    heading: (ceiling) => `Above ${ceiling}. This one needs a conversation.`,
    body: "Seven questions can't scope a build this size honestly, and a number we can't stand behind is worse than no number. Tell us what you're trying to do and we'll come back with a real one.",
    cta: "Book a free discovery call",
  },

  results: {
    ledgerLabel: "What's in it",
    sandboxLabel: "Bring it down",
    closingLine: (saved, days) =>
      `You've taken ${saved} and about ${days} days off. These are the first things we'd add back once you have users.`,
    primaryCta: "Get a fixed price quote",
    secondaryCta: "Email me this estimate",
    comparisonLabel: "How this compares",
    // ⚠️ Zothix: the two right-hand columns are typical market bands,
    // not quotes (the table caption says so). No-code build cost is an
    // agency-built MVP, not a bare subscription — the $500–$2,000/mo
    // figure read as implausibly low (client, 2026-08-02).
    comparison: {
      columns: ["Build with Codroon", "Freelance developers", "No-code platform"],
      rows: [
        {
          header: "Build cost",
          derived: "range",
          cells: ["$15,000–$40,000", "$8,000–$25,000 with an agency"],
        },
        { header: "Timeline", derived: "timeline", cells: ["8–16 weeks", "1–2 weeks"] },
        {
          header: "Who owns the code",
          derived: "literal",
          literal: "You",
          cells: ["You, eventually", "The platform"],
        },
        {
          header: "Scales past the MVP",
          derived: "literal",
          literal: "Yes",
          cells: ["Depends", "Rarely"],
        },
      ],
    },
  },
};

/** Prose counterweight under the sandbox — deliberately not a toggle. */
export const MVP_WHAT_NOT_TO_CUT = {
  label: "What not to cut",
  body: "Three things we'd never cut: authentication done properly, payments if money is part of the bet, and analytics. Skipping analytics means you ship, get users, and still can't tell whether it worked.",
};
