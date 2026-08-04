import { FLOOR_MVP } from "./constants";
import type { Answers, ToolConfig } from "./types";

/**
 * MVP cost estimator — pricing table.
 *
 * ⚠️ Zothix: every figure here needs sign-off, and this file is the
 * only place any of them appear.
 *
 * All modifiers are multiplicative so they scale with the base.
 */

export const MVP_TYPES = [
  "landing-waitlist",
  "single-user-tool",
  "saas-mvp",
  "ai-native-mvp",
  "marketplace-mvp",
] as const;

export type MvpType = (typeof MVP_TYPES)[number];

/**
 * Q7 budget bands — they never change the estimate, only which cuts
 * arrive pre-toggled. `cap` is the top of the band, `label` is the
 * prose form used in the fit message, and `option` is the short form
 * shown on the answer button. All three live here so retuning a cap
 * can never leave a button advertising the old figure.
 */
export const MVP_BUDGET_BANDS: Record<
  string,
  { cap: number; label: string; option: string }
> = {
  "under-10k": { cap: 10000, label: "under $10,000", option: "Under $10k" },
  "10-20k": { cap: 20000, label: "$10,000–$20,000", option: "$10–20k" },
  "20-40k": { cap: 40000, label: "$20,000–$40,000", option: "$20–40k" },
};

/** A waitlist page has no user types, no billing and no integrations —
    asking produces nonsense estimates, so those questions are skipped. */
const isWaitlist = (a: Answers) => a.type === "landing-waitlist";

export const mvpConfig: ToolConfig = {
  tool: "mvp",
  floor: FLOOR_MVP,
  typeQuestionId: "type",

  questions: [
    { id: "industry", role: "context", narrows: false },
    {
      id: "type",
      role: "type",
      // "Not sure" lands on the middle of the five types.
      unsureFallback: "saas-mvp",
      narrows: true,
    },
    {
      id: "users",
      role: "modifier",
      unsureFallback: "two",
      narrows: true,
      skipWhen: isWaitlist,
    },
    {
      id: "money",
      role: "modifier",
      unsureFallback: "subscriptions",
      narrows: true,
      skipWhen: isWaitlist,
    },
    { id: "have", role: "modifier", unsureFallback: "neither", narrows: true },
    {
      id: "integrations",
      role: "count",
      perUnitMultiply: 1.1,
      max: 3,
      unsureFallback: 1,
      label: "Integrations",
      narrows: true,
      skipWhen: isWaitlist,
    },
    { id: "ai", role: "modifier", unsureFallback: "none", narrows: true },
    // optional, serves rather than qualifies — pre-toggles cuts only
    { id: "budget", role: "context", narrows: false },
  ],

  base: {
    "landing-waitlist": {
      label: "Landing page and waitlist",
      lo: 3000,
      hi: 4500,
      weeksLo: 0.5,
      weeksHi: 1,
    },
    "single-user-tool": {
      label: "Single-user tool core",
      lo: 8000,
      hi: 14000,
      weeksLo: 2,
      weeksHi: 3,
    },
    "saas-mvp": {
      label: "SaaS MVP core",
      lo: 12000,
      hi: 18000,
      weeksLo: 3,
      weeksHi: 4,
    },
    "ai-native-mvp": {
      label: "AI-native MVP core",
      lo: 16000,
      hi: 26000,
      weeksLo: 4,
      weeksHi: 5,
    },
    "marketplace-mvp": {
      label: "Marketplace MVP core",
      lo: 20000,
      hi: 32000,
      weeksLo: 5,
      weeksHi: 6,
    },
  },

  modifiers: {
    "users.one": { multiply: 1.0 },
    "users.two": { multiply: 1.3, weeks: 1, label: "Second user type" },
    "users.three-plus": {
      multiply: 1.6,
      weeks: 2,
      label: "Three or more user types",
    },

    "money.none": { multiply: 1.0 },
    "money.subscriptions": { multiply: 1.18, label: "Subscriptions and billing" },
    "money.between-users": {
      multiply: 1.42,
      weeks: 0.5,
      label: "Payments between users",
    },

    // both are discounts — below 1.00, so no ledger line
    "have.designs": { multiply: 0.88, weeks: -0.5 },
    "have.spec": { multiply: 0.94 },
    "have.neither": { multiply: 1.0 },

    "ai.none": { multiply: 1.0 },
    "ai.feature": { multiply: 1.2, weeks: 0.5, label: "AI feature" },
    "ai.is-the-product": { multiply: 1.45, weeks: 1, label: "AI as the product" },
  },

  // An AI-native MVP already prices the model in; stacking
  // "AI is the product" on top would double-count it.
  neutralizedModifiers: (a: Answers) =>
    a.type === "ai-native-mvp" ? ["ai.is-the-product"] : [],

  cuts: [
    {
      id: "drop-second-user-type",
      label: "Drop the second user type",
      reverses: "users",
      extraBase: -0.04,
      days: 7,
      appliesWhen: (a: Answers) => a.users === "two" || a.users === "three-plus",
    },
    {
      id: "skip-admin-panel",
      label: "Skip the admin panel",
      extraBase: -0.12,
      days: 4,
      appliesWhen: (a: Answers) => !isWaitlist(a) && a.type !== undefined,
    },
    {
      id: "use-component-system",
      label: "Use the component system",
      reverses: "have",
      extraBase: -0.06,
      days: 7,
      // only meaningful if you brought designs to implement; with no
      // designs we're already using the component system
      appliesWhen: (a: Answers) => a.have === "designs",
    },
    {
      id: "defer-onboarding",
      label: "Defer the onboarding flow",
      extraBase: -0.08,
      days: 3,
      appliesWhen: (a: Answers) => !isWaitlist(a) && a.type !== undefined,
    },
  ],

  interrupt: {
    id: "v1-not-mvp",
    // Fires after `have`, the earliest point at which both halves of
    // the condition are known. Approved: firing on three-plus alone
    // would hit legitimate three-role MVPs.
    firesAfter: "have",
    when: (a: Answers) => a.users === "three-plus" && a.have === "neither",
    smallerConfiguration: { users: "one" },
    smallerCuts: ["skip-admin-panel", "defer-onboarding"],
  },
};
