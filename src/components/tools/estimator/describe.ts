import type { Answers, Estimate } from "@/pricing/types";

/**
 * The display strings for a results screen: eyebrow, meta line, panel
 * label. Pure functions of (answers, estimate), which is the whole
 * point of them living here.
 *
 * They used to sit inside AgentEstimator.tsx and MvpEstimator.tsx. They
 * moved out (client, 2026-08-09) because the shared estimate page at
 * /e/[code] has to call them too, and importing them from the estimator
 * modules would have pulled the entire question flow, both pricing
 * configs and useEstimatorFlow into a read-only page's bundle.
 *
 * Why the share page calls them at all: it recomputes the estimate from
 * the stored snapshot against the visitor's live cut selection, so a
 * frozen `display` string written at save time describes a different
 * estimate than the one on screen. Recomputing the strings from the
 * live estimate is what keeps the meta line and the headline agreeing.
 */

export type EstimateDescription = {
  eyebrow: string;
  metaLine: string;
  panelLabel: string;
};

/* ---------------- agent ---------------- */

const AGENT_INDUSTRY_LABELS: Record<string, string> = {
  ecommerce: "Your e-commerce agent",
  healthcare: "Your healthcare agent",
  finance: "Your finance agent",
  services: "Your services agent",
};

const AGENT_TYPE_LABELS: Record<string, string> = {
  "simple-automation": "automation",
  "single-task": "single-task agent",
  "knowledge-agent": "knowledge agent",
  "workflow-agent": "workflow agent",
  "multi-agent": "multi-agent system",
};

export function describeAgent(
  answers: Answers,
  estimate: Estimate
): EstimateDescription {
  const industry = typeof answers.industry === "string" ? answers.industry : "";
  const type = typeof answers.type === "string" ? answers.type : "";
  return {
    eyebrow: `Your estimate · ${AGENT_TYPE_LABELS[type] ?? "AI agent"}`,
    metaLine: [
      estimate.timelineLabel,
      estimate.runCost ? `${estimate.runCost.label} run cost` : null,
      estimate.confidenceLabel,
    ]
      .filter(Boolean)
      .join(" · "),
    panelLabel:
      answers.type !== undefined
        ? AGENT_INDUSTRY_LABELS[industry] ?? "Your agent"
        : "Your system",
  };
}

/* ---------------- mvp ---------------- */

const MVP_TYPE_LABELS: Record<string, string> = {
  "landing-waitlist": "landing page and waitlist",
  "single-user-tool": "internal tool",
  "saas-mvp": "SaaS MVP",
  "ai-native-mvp": "AI-native MVP",
  "marketplace-mvp": "marketplace MVP",
};

const MVP_USER_LABELS: Record<string, string> = {
  one: "one user type",
  two: "two user types",
  "three-plus": "three or more user types",
};

const MVP_BUILD_LABELS: Record<string, string> = {
  "landing-waitlist": "Your landing page build",
  "single-user-tool": "Your internal tool build",
  "saas-mvp": "Your SaaS build",
  "ai-native-mvp": "Your AI-native build",
  "marketplace-mvp": "Your marketplace build",
};

export function describeMvp(
  answers: Answers,
  estimate: Estimate
): EstimateDescription {
  const type = typeof answers.type === "string" ? answers.type : "";
  const users = typeof answers.users === "string" ? answers.users : "";
  return {
    eyebrow: [
      "Your estimate",
      [MVP_TYPE_LABELS[type] ?? "MVP", MVP_USER_LABELS[users]]
        .filter(Boolean)
        .join(", "),
    ].join(" · "),
    metaLine: [estimate.timelineLabel, "you own the code", estimate.confidenceLabel]
      .filter(Boolean)
      .join(" · "),
    panelLabel:
      answers.type !== undefined
        ? `${MVP_BUILD_LABELS[type] ?? "Your build"}${
            estimate.timelineLabel ? ` · ${estimate.timelineLabel}` : ""
          }`
        : "Your build",
  };
}

/** Pick the right describe() for a stored row's tool. */
export function describeFor(tool: "agent" | "mvp") {
  return tool === "agent" ? describeAgent : describeMvp;
}
