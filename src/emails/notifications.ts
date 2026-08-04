import type { EstimateSummary } from "@/lib/email/estimateSummary";
import type { LeadSource } from "@/lib/supabase/types";

/**
 * TEMPLATES 4 AND 5 — the notifications to sales@.
 *
 * Deliberately NOT React Email and deliberately not branded. These are
 * read on a lock screen while deciding whether to call someone back
 * within the hour, and every branded element pushes the useful line
 * further down. No logo, no colour, no buttons, no card.
 *
 * They are written as plain strings rather than components because the
 * text part is the real payload here and its column alignment has to
 * survive exactly; a renderer's plain-text pass would reflow it.
 *
 * The HTML part is a monospace echo of the text part, so both read the
 * same whichever one the client shows.
 *
 * Timestamps are Asia/Karachi, never UTC: the person triaging these is
 * in Islamabad and "was this an hour ago or nine?" should not require
 * arithmetic.
 */

const esc = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[c]!
  );

/** Human-readable, for the subject line and the Source row. */
export const SOURCE_LABEL: Record<LeadSource, string> = {
  modal_call: "Call request",
  modal_email: "Email enquiry",
  modal_meeting: "Meeting booking",
  estimator_email: "Estimate emailed to visitor",
  estimator_quote: "Fixed price quote (Calendly opening)",
};

export function karachi(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
  return `${parts} PKT`;
}

/** Label column padded so the values line up in a monospace column. */
const pad = (label: string, width: number) =>
  label + " ".repeat(Math.max(1, width - label.length));

const wrap = (title: string, text: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title></head>
<body style="margin:0;padding:16px;background:#ffffff;">
<pre style="margin:0;white-space:pre-wrap;word-break:break-word;font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#111111;">${esc(
  text
)}</pre>
</body></html>`;

/* ==================================================================
   TEMPLATE 4 — estimator lead
   ================================================================== */

export type EstimatorNotificationInput = {
  source: Extract<LeadSource, "estimator_email" | "estimator_quote">;
  receivedAt: Date;
  email?: string | null;
  summary: EstimateSummary;
};

export function estimatorNotification(input: EstimatorNotificationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const { summary } = input;
  const industry = summary.industry ?? "industry not given";

  // The subject carries the money and the industry so triage happens in
  // the notification list, without opening anything.
  const subject = `[Lead] ${SOURCE_LABEL[input.source]} — ${summary.range} — ${industry}`;

  const type = summary.tool === "agent" ? "AI AGENT" : "MVP";
  const headline = `${industry.toUpperCase()} · ${type}`;
  const figures = [
    summary.range,
    summary.timeline,
    summary.runCost ? `${summary.runCost}/mo to run` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const W = 11;
  const meta = [
    `${pad("Source", W)}${SOURCE_LABEL[input.source]}`,
    `${pad("When", W)}${karachi(input.receivedAt)}`,
    `${pad("Email", W)}${input.email || "not given"}`,
    `${pad("Estimate", W)}${summary.shareUrl}`,
  ].join("\n");

  // the answer labels get their own column width, from the longest one
  const qWidth = Math.min(
    46,
    Math.max(...summary.answers.map((a) => a.question.length), 10) + 2
  );
  const answers = summary.answers
    .map((a) => `${pad(a.question, qWidth)}${a.answer}`)
    .join("\n");

  const cuts = summary.cuts.length
    ? summary.cuts.map((c) => `  - ${c}`).join("\n")
    : "  none toggled";

  const text = `${headline}
${figures}

${meta}

ANSWERS
${answers || "  none recorded"}

CUTS
${cuts}
`;

  return { subject, html: wrap(subject, text), text };
}

/* ==================================================================
   TEMPLATE 5 — modal lead
   ================================================================== */

export type ModalNotificationInput = {
  source: Extract<LeadSource, "modal_call" | "modal_email" | "modal_meeting">;
  receivedAt: Date;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  /** TCPA flags, captured on the call form only */
  callConsent?: boolean;
  smsConsent?: boolean;
  /** the estimate they had open when they filled the form, if any */
  estimateUrl?: string | null;
};

export function modalNotification(input: ModalNotificationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const who = input.name || input.phone || input.email || "no contact given";
  const subject = `[Lead] ${SOURCE_LABEL[input.source]} — ${who}`;

  const W = 11;
  const lines: string[] = [];
  if (input.name) lines.push(`${pad("Name", W)}${input.name}`);
  if (input.email) lines.push(`${pad("Email", W)}${input.email}`);
  if (input.phone) lines.push(`${pad("Phone", W)}${input.phone}`);
  if (input.callConsent !== undefined)
    lines.push(`${pad("Call OK", W)}${input.callConsent ? "yes" : "no"}`);
  if (input.smsConsent !== undefined)
    lines.push(`${pad("SMS OK", W)}${input.smsConsent ? "yes" : "no"}`);
  lines.push(`${pad("Estimate", W)}${input.estimateUrl || "none"}`);

  const message = input.message
    ? `\nMESSAGE\n${input.message.trim()}\n`
    : "";

  const text = `${SOURCE_LABEL[input.source].toUpperCase()}
${karachi(input.receivedAt)}

${lines.join("\n")}
${message}`;

  return { subject, html: wrap(subject, text), text };
}
