import { SITE } from "@/config/site";
import type { EstimateSummary } from "./estimateSummary";
import type { LeadSource } from "@/lib/supabase/types";

/**
 * Email templates — plain HTML with a text part.
 *
 * Deliberately boring: no images, no web fonts, no dark-mode tricks,
 * table-free where possible. These are transactional sends read on a
 * phone between meetings, and every clever thing an email template
 * does is another way it renders wrong in Outlook.
 */

const esc = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!
  );

const shell = (title: string, inner: string) => `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f2;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(title)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f2;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e1dd;border-radius:12px;">
<tr><td style="padding:28px 28px 8px 28px;font:600 15px/1.3 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a857a;">
Codroon
</td></tr>
<tr><td style="padding:0 28px 28px 28px;font:400 16px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#232220;">
${inner}
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

const row = (label: string, value: string) => `
<tr>
  <td style="padding:7px 12px 7px 0;vertical-align:top;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;white-space:nowrap;">${esc(label)}</td>
  <td style="padding:7px 0;vertical-align:top;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#232220;">${esc(value)}</td>
</tr>`;

const sectionLabel = (text: string) => `
<p style="margin:26px 0 8px 0;font:600 12px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8a857a;">${esc(text)}</p>`;

const button = (href: string, label: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px 0;">
  <tr><td style="background:#e96a42;border-radius:999px;">
    <a href="${esc(href)}" rel="noreferrer" style="display:inline-block;padding:13px 26px;font:600 15px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#232220;text-decoration:none;">${esc(label)}</a>
  </td></tr>
</table>`;

/* ==================================================================
   VISITOR EMAIL — estimator_email and modal_email only
   Under 100 words, no marketing, no attachments, no sequence.
   ================================================================== */

export function visitorEmail(summary: EstimateSummary): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = "Your Codroon estimate";

  const body = summary.aboveCeiling
    ? `<p style="margin:0 0 14px 0;">Your configuration came out above our estimator's ceiling, so we haven't put a number on it. A build that size deserves a conversation rather than a guess.</p>
       <p style="margin:0 0 14px 0;">Everything you answered is saved at the link below.</p>`
    : `<p style="margin:0 0 6px 0;">Here's the estimate you built:</p>
       <p style="margin:14px 0 4px 0;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:#232220;">${esc(summary.range)}</p>
       <p style="margin:0 0 14px 0;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">${esc(summary.timeline)}${summary.runCost ? ` · ${esc(summary.runCost)} to run` : ""}</p>
       <p style="margin:0 0 14px 0;">It's a range, not a quote. We narrow it to a fixed price after a scoping call. Your answers and the version you can cut down to are both saved at the link below.</p>`;

  const html = shell(
    subject,
    `${body}${button(summary.shareUrl, "View your estimate")}
     <p style="margin:20px 0 0 0;font:400 13px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#8a857a;">You're getting this because you asked us to send it. We won't add you to anything.</p>`
  );

  const text = summary.aboveCeiling
    ? `Your Codroon estimate

Your configuration came out above our estimator's ceiling, so we haven't
put a number on it. A build that size deserves a conversation rather
than a guess. Everything you answered is saved here:

${summary.shareUrl}

You're getting this because you asked us to send it. We won't add you to anything.
`
    : `Your Codroon estimate

${summary.range}
${summary.timeline}${summary.runCost ? ` · ${summary.runCost} to run` : ""}

It's a range, not a quote. We narrow it to a fixed price after a
scoping call. Your answers and the version you can cut down to are both
saved here:

${summary.shareUrl}

You're getting this because you asked us to send it. We won't add you to anything.
`;

  return { subject, html, text };
}

/* ==================================================================
   NOTIFICATION EMAIL — every lead, to sales@
   Everything needed to decide whether to call back, in the body.
   ================================================================== */

export type NotificationInput = {
  source: LeadSource;
  receivedAt: Date;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  /** TCPA flags, call form only */
  callConsent?: boolean;
  smsConsent?: boolean;
  summary?: EstimateSummary | null;
};

const SOURCE_LABEL: Record<LeadSource, string> = {
  modal_call: "Call request",
  modal_email: "Email enquiry",
  modal_meeting: "Meeting booking started",
  estimator_email: "Estimate emailed to visitor",
  estimator_quote: "Fixed-price quote requested",
};

const stamp = (d: Date) =>
  d.toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  }) + " UTC";

export function notificationEmail(input: NotificationInput): {
  subject: string;
  html: string;
  text: string;
} {
  const { source, summary } = input;
  const subject = `[Lead] ${source} — ${summary ? summary.range : "contact form"}`;

  /* ---- html ---- */

  const headline = summary
    ? `<p style="margin:0 0 4px 0;font:400 30px/1.15 Georgia,'Times New Roman',serif;color:#232220;">${esc(summary.range)}</p>
       <p style="margin:0;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">${esc(
         [summary.timeline, summary.runCost ? `${summary.runCost} to run` : null]
           .filter(Boolean)
           .join(" · ")
       )}</p>`
    : `<p style="margin:0;font:400 22px/1.3 Georgia,'Times New Roman',serif;color:#232220;">${esc(
        SOURCE_LABEL[source]
      )}</p>`;

  const meta = `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:6px;">
${row("Source", `${source} — ${SOURCE_LABEL[source]}`)}
${row("Received", stamp(input.receivedAt))}
${summary ? row("Tool", summary.toolLabel) : ""}
${summary?.industry ? row("Industry", summary.industry) : ""}
</table>`;

  const contactRows = [
    input.name ? row("Name", input.name) : "",
    input.email ? row("Email", input.email) : "",
    input.phone ? row("Phone", input.phone) : "",
    input.callConsent !== undefined
      ? row("Call consent", input.callConsent ? "yes" : "no")
      : "",
    input.smsConsent !== undefined
      ? row("SMS consent", input.smsConsent ? "yes" : "no")
      : "",
  ]
    .filter(Boolean)
    .join("");

  const contact = contactRows
    ? `${sectionLabel("Contact")}<table role="presentation" cellpadding="0" cellspacing="0">${contactRows}</table>`
    : `${sectionLabel("Contact")}<p style="margin:0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#6b675e;">None given — this is a bare signal from someone with a configured estimate.</p>`;

  const messageBlock = input.message
    ? `${sectionLabel("Message")}<p style="margin:0;white-space:pre-wrap;font:400 15px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#232220;">${esc(
        input.message
      )}</p>`
    : "";

  const answersBlock = summary?.answers.length
    ? `${sectionLabel("What they answered")}<table role="presentation" cellpadding="0" cellspacing="0">${summary.answers
        .map((a) => row(a.question, a.answer))
        .join("")}</table>`
    : "";

  const cutsBlock = summary
    ? `${sectionLabel("Cuts toggled")}<p style="margin:0;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${
        summary.cuts.length ? "#232220" : "#6b675e"
      };">${
        summary.cuts.length
          ? summary.cuts.map(esc).join("<br>")
          : "None — they're looking at the full build."
      }</p>`
    : "";

  const html = shell(
    subject,
    `${headline}${meta}${contact}${messageBlock}${answersBlock}${cutsBlock}${
      summary ? button(summary.shareUrl, "Open their estimate") : ""
    }`
  );

  /* ---- text ---- */

  const pad = (s: string, n: number) => s + " ".repeat(Math.max(1, n - s.length));
  const lines: string[] = [];
  lines.push(summary ? summary.range : SOURCE_LABEL[source]);
  if (summary) {
    lines.push(
      [summary.timeline, summary.runCost ? `${summary.runCost} to run` : null]
        .filter(Boolean)
        .join(" · ")
    );
  }
  lines.push("");
  lines.push(`${pad("Source", 12)}${source} — ${SOURCE_LABEL[source]}`);
  lines.push(`${pad("Received", 12)}${stamp(input.receivedAt)}`);
  if (summary) lines.push(`${pad("Tool", 12)}${summary.toolLabel}`);
  if (summary?.industry) lines.push(`${pad("Industry", 12)}${summary.industry}`);

  lines.push("", "CONTACT");
  if (contactRows) {
    if (input.name) lines.push(`${pad("  Name", 12)}${input.name}`);
    if (input.email) lines.push(`${pad("  Email", 12)}${input.email}`);
    if (input.phone) lines.push(`${pad("  Phone", 12)}${input.phone}`);
    if (input.callConsent !== undefined)
      lines.push(`${pad("  Call", 12)}${input.callConsent ? "yes" : "no"}`);
    if (input.smsConsent !== undefined)
      lines.push(`${pad("  SMS", 12)}${input.smsConsent ? "yes" : "no"}`);
  } else {
    lines.push("  None given — a bare signal from a configured estimate.");
  }

  if (input.message) lines.push("", "MESSAGE", input.message);

  if (summary?.answers.length) {
    lines.push("", "WHAT THEY ANSWERED");
    for (const a of summary.answers) lines.push(`  ${a.question}`, `    ${a.answer}`);
  }

  if (summary) {
    lines.push("", "CUTS TOGGLED");
    if (summary.cuts.length) for (const c of summary.cuts) lines.push(`  ${c}`);
    else lines.push("  None — they're looking at the full build.");
    lines.push("", summary.shareUrl);
  }

  lines.push("", `— ${SITE.name}`);

  return { subject, html, text: lines.join("\n") };
}
