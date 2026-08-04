import type { EstimateSummary } from "@/lib/email/estimateSummary";
import type { EstimateEmailProps } from "./EstimateEmail";

/**
 * Realistic sample data for the preview route and the static exports.
 * Figures and labels are shaped like the estimator's real output so the
 * previews show the spacing the templates will actually have to hold.
 *
 * Preview-only. Nothing here is imported by a send path.
 */

export const sampleEstimate: EstimateEmailProps = {
  range: "$18,000 to $26,000",
  timeline: "6 to 8 weeks",
  runCost: "$180 to $400",
  configured:
    "Own one workflow from start to finish, for professional services.",
  ledger: [
    { label: "Agent core and reasoning loop", figure: "$7,200" },
    { label: "Three system integrations", figure: "$5,400" },
    { label: "Retrieval over your documents", figure: "$3,600" },
    { label: "Human approval step", figure: "$2,400" },
    { label: "Evaluation suite and guardrails", figure: "$3,400" },
  ],
  shareUrl: "https://codroon.com/e/k7m2xq",
};

/** The MVP variant: no run cost clause at all. */
export const sampleEstimateMvp: EstimateEmailProps = {
  range: "$24,000 to $34,000",
  timeline: "8 to 11 weeks",
  runCost: null,
  configured: "A marketplace with two sides, for e-commerce and retail.",
  ledger: [
    { label: "Core product and data model", figure: "$11,000" },
    { label: "Two user types with separate flows", figure: "$6,500" },
    { label: "Payments and payouts", figure: "$5,200" },
    { label: "Admin and moderation", figure: "$4,300" },
  ],
  shareUrl: "https://codroon.com/e/p4w9tz",
};

/** The estimator declined to price it. */
export const sampleEstimateAboveCeiling: EstimateEmailProps = {
  range: "Above the ceiling",
  timeline: "",
  runCost: null,
  configured:
    "A multi-agent system across five departments, for finance and insurance.",
  ledger: [],
  shareUrl: "https://codroon.com/e/b8n3vc",
  aboveCeiling: true,
};

/** The full summary the notification templates take. */
export const sampleSummary: EstimateSummary = {
  toolLabel: "AI Agent Cost Estimator",
  tool: "agent",
  range: "$18,000 to $26,000",
  timeline: "6 to 8 weeks",
  runCost: "$180 to $400",
  industry: "Professional services",
  midpoint: 22000,
  aboveCeiling: false,
  answers: [
    { question: "What industry are you in?", answer: "Professional services" },
    { question: "What should the agent do?", answer: "Own one workflow from start to finish" },
    { question: "Does it read, or does it act?", answer: "It acts: writes, sends, updates" },
    { question: "How many systems does it touch?", answer: "Three" },
    { question: "Does it need your own documents?", answer: "Yes, it answers from our documents" },
    { question: "Should a person approve what it does?", answer: "Yes, on anything it sends" },
    { question: "How often will it run?", answer: "Continuously, on a trigger" },
  ],
  cuts: [],
  shareUrl: "https://codroon.com/e/k7m2xq",
  ledger: sampleEstimate.ledger,
  configured: sampleEstimate.configured,
};

/** Same lead, but with cuts toggled — the contrast is the buying signal. */
export const sampleSummaryWithCuts: EstimateSummary = {
  ...sampleSummary,
  range: "$13,500 to $19,000",
  cuts: ["Drop retrieval over your own documents", "Ship without the approval step"],
  shareUrl: "https://codroon.com/e/k7m2xq",
};

export const sampleCallLead = {
  name: "Sarah Whitfield",
  email: "sarah@northloop.co",
  phone: "+1 (214) 555 0148",
  message:
    "We run quotes through three spreadsheets and a shared inbox. Want to know if an agent can own the whole thing end to end.",
  callConsent: true,
  smsConsent: false,
};

export const sampleEmailLead = {
  name: "Daniel Okafor",
  email: "daniel@harborlane.io",
  message:
    "Looking at a two-sided marketplace MVP. We have designs already and a rough spec. What would a build like that cost and how long?",
};
