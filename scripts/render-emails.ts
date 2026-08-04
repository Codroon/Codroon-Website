/**
 * Renders the email templates against a real estimate so they can be
 * eyeballed before anything is wired. Writes HTML to scripts/shots/ and
 * prints the text parts.
 */
import fs from "node:fs";
import { buildSnapshot, estimate } from "../src/pricing/calculate";
import { mvpConfig } from "../src/pricing/mvp.config";
import { agentConfig } from "../src/pricing/agent.config";
import { summariseEstimate } from "../src/lib/email/estimateSummary";
import { notificationEmail, visitorEmail } from "../src/lib/email/templates";
import type { Answers } from "../src/pricing/types";

/** Build the stored row exactly as the estimator would have written it. */
function storedRow(
  tool: "agent" | "mvp",
  answers: Answers,
  cuts: string[],
  shortCode: string
) {
  const config = tool === "agent" ? agentConfig : mvpConfig;
  const snapshot = buildSnapshot(config, answers)!;
  const est = estimate(config, answers, cuts);
  return {
    tool,
    short_code: shortCode,
    answers,
    computed: {
      midpoint: est.midpoint,
      lo: est.lo,
      hi: est.hi,
      state: est.state,
      timelineLabel: est.timelineLabel,
      confidenceLabel: est.confidenceLabel,
      cuts,
      snapshot,
    },
  };
}

/* ---- the case the brief asked to see ---- */
const quoteRow = storedRow(
  "mvp",
  {
    industry: "b2b",
    type: "saas-mvp",
    users: "two",
    money: "subscriptions",
    have: "neither",
    integrations: 2,
    ai: "none",
    budget: "20-40k",
  },
  ["skip-admin-panel"],
  "k7m2xq"
);

const quoteSummary = summariseEstimate(quoteRow)!;
const quote = notificationEmail({
  source: "estimator_quote",
  receivedAt: new Date("2026-08-01T14:32:00Z"),
  summary: quoteSummary,
});

fs.writeFileSync("scripts/shots/email-notification-quote.html", quote.html);

/* ---- a few others, to check the shape holds ---- */
const agentRow = storedRow(
  "agent",
  {
    industry: "finance",
    type: "workflow-agent",
    access: "takes-actions",
    systems: "four-plus",
    docs: "large",
    approval: "always",
    volume: "high",
  },
  [],
  "q9wt4b"
);
const agentSummary = summariseEstimate(agentRow)!;

fs.writeFileSync(
  "scripts/shots/email-notification-agent.html",
  notificationEmail({
    source: "estimator_email",
    receivedAt: new Date("2026-08-01T09:05:00Z"),
    email: "founder@example.com",
    summary: agentSummary,
  }).html
);

fs.writeFileSync(
  "scripts/shots/email-notification-call.html",
  notificationEmail({
    source: "modal_call",
    receivedAt: new Date("2026-08-01T16:40:00Z"),
    name: "Dana Whitfield",
    phone: "+1 214 555 0184",
    message: "We have a Shopify store and want to automate refund triage.",
    callConsent: true,
    smsConsent: false,
  }).html
);

fs.writeFileSync(
  "scripts/shots/email-visitor.html",
  visitorEmail(quoteSummary).html
);

/* ---- text parts ---- */
console.log("=".repeat(72));
console.log("SUBJECT:", quote.subject);
console.log("=".repeat(72));
console.log(quote.text);
console.log("\n" + "=".repeat(72));
console.log("VISITOR EMAIL — SUBJECT:", visitorEmail(quoteSummary).subject);
console.log("=".repeat(72));
console.log(visitorEmail(quoteSummary).text);
console.log(
  "\nword count (visitor body):",
  visitorEmail(quoteSummary)
    .text.split(/\s+/)
    .filter(Boolean).length
);
console.log("\nwrote 4 html files to scripts/shots/");
