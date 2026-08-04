import { FLOOR_AGENT } from "./constants";
import type { Answers, ToolConfig } from "./types";

/**
 * AI agent cost estimator — pricing table.
 *
 * ⚠️ Zothix: every figure here needs sign-off, and this file is the
 * only place any of them appear.
 *
 * All modifiers are multiplicative so they scale with the base they
 * are applied to. Question order below is canonical: the fold walks
 * it, so the same answers always produce the same estimate and the
 * same ledger regardless of the order they arrived in.
 */

export const AGENT_TYPES = [
  "simple-automation",
  "single-task",
  "knowledge-agent",
  "workflow-agent",
  "multi-agent",
] as const;

export type AgentType = (typeof AGENT_TYPES)[number];

/** Run cost $/month by type × volume. Mid interpolated geometrically
    between the low and high anchors (volume bands are logarithmic). */
export const AGENT_RUN_COST: Record<
  AgentType,
  { low: [number, number]; mid: [number, number]; high: [number, number] }
> = {
  "simple-automation": { low: [10, 40], mid: [20, 80], high: [40, 160] },
  "single-task": { low: [50, 120], mid: [100, 230], high: [200, 450] },
  "knowledge-agent": { low: [150, 350], mid: [320, 720], high: [700, 1500] },
  "workflow-agent": { low: [200, 400], mid: [400, 800], high: [800, 1600] },
  "multi-agent": { low: [400, 800], mid: [690, 1410], high: [1200, 2500] },
};

export const agentConfig: ToolConfig = {
  tool: "agent",
  floor: FLOOR_AGENT,
  typeQuestionId: "type",

  questions: [
    // Q1 sets the panel label and pre-selects likely integrations.
    // It changes no price and does not narrow the band.
    { id: "industry", role: "context", narrows: false },
    {
      id: "type",
      role: "type",
      // "Not sure" lands on the middle of the five types.
      unsureFallback: "knowledge-agent",
      narrows: true,
    },
    { id: "access", role: "modifier", unsureFallback: "takes-actions", narrows: true },
    { id: "systems", role: "modifier", unsureFallback: "two-or-three", narrows: true },
    { id: "docs", role: "modifier", unsureFallback: "few", narrows: true },
    { id: "approval", role: "modifier", unsureFallback: "high-risk", narrows: true },
    // asked after the build cost is shown, on the optional branch
    { id: "volume", role: "context", unsureFallback: "mid", narrows: false },
  ],

  base: {
    "simple-automation": {
      label: "Automation core",
      lo: 2000,
      hi: 5000,
      weeksLo: 1,
      weeksHi: 2,
    },
    "single-task": {
      label: "Single-task agent core",
      lo: 6000,
      hi: 12000,
      weeksLo: 2,
      weeksHi: 3,
    },
    "knowledge-agent": {
      label: "Knowledge agent core",
      lo: 10000,
      hi: 18000,
      weeksLo: 3,
      weeksHi: 4,
    },
    "workflow-agent": {
      label: "Workflow agent core",
      lo: 15000,
      hi: 25000,
      weeksLo: 4,
      weeksHi: 5,
    },
    "multi-agent": {
      label: "Multi-agent system core",
      lo: 22000,
      hi: 38000,
      weeksLo: 5,
      weeksHi: 6,
    },
  },

  modifiers: {
    // reading is cheaper than acting — below 1.00, so no ledger line
    "access.read-only": { multiply: 0.7 },
    "access.takes-actions": { multiply: 1.0 },
    // "Both" prices as acting, but needs its own key: two options
    // sharing one value cannot round-trip through the URL, and both
    // would render selected on Back or a pasted link.
    "access.both": { multiply: 1.0 },

    "systems.one": { multiply: 0.92 },
    "systems.two-or-three": { multiply: 1.0 },
    "systems.four-plus": {
      multiply: 1.18,
      weeks: 0.5,
      label: "Integrations (four or more systems)",
    },
    "systems.many": {
      multiply: 1.18,
      weeks: 0.5,
      label: "Integrations (four or more systems)",
    },

    "docs.none": { multiply: 0.9 },
    "docs.few": { multiply: 1.1, weeks: 0.5, label: "Retrieval over your documents" },
    "docs.large": {
      multiply: 1.28,
      weeks: 1,
      label: "Retrieval over a large document library",
    },

    "approval.always": {
      multiply: 1.14,
      weeks: 0.5,
      label: "Human approval on every action",
    },
    "approval.high-risk": {
      multiply: 1.08,
      label: "Human approval on high-risk actions",
    },
    "approval.never": { multiply: 1.0 },
  },

  cuts: [
    {
      id: "drop-one-integration",
      label: "Drop one integration",
      extraBase: -0.06,
      days: 2,
      appliesWhen: (a: Answers) => a.systems !== "one" && a.systems !== undefined,
    },
    {
      id: "skip-retrieval",
      label: "Skip retrieval",
      reverses: "docs",
      extraBase: -0.05,
      days: 4,
      removesRetrieval: true,
      appliesWhen: (a: Answers) => a.docs !== "none" && a.docs !== undefined,
    },
    {
      id: "remove-approval",
      label: "Remove approval layer",
      reverses: "approval",
      days: 3,
      appliesWhen: (a: Answers) => a.approval !== "never" && a.approval !== undefined,
    },
  ],

  interrupt: {
    id: "automation-not-agent",
    firesAfter: "systems",
    when: (a: Answers) =>
      a.type === "simple-automation" ||
      (a.access === "read-only" && a.systems === "one" && a.type === "single-task"),
    // "Show me that instead" recomputes at the simplest configuration
    smallerConfiguration: {
      type: "simple-automation",
      access: "read-only",
      systems: "one",
      docs: "none",
      approval: "never",
    },
    smallerCuts: [],
  },
};

/** Both ranges quoted in the interrupt copy, interpolated from base. */
export const AGENT_INTERRUPT_COMPARISON = {
  smaller: "simple-automation" as AgentType,
  instead: "knowledge-agent" as AgentType,
};
