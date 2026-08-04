import "server-only";
import { render } from "@react-email/render";
import { SITE } from "@/config/site";
import type { EstimateSummary } from "@/lib/email/estimateSummary";
import { AckCallEmail } from "./AckCallEmail";
import { AckEmailEmail } from "./AckEmailEmail";
import { EstimateEmail, type EstimateEmailProps } from "./EstimateEmail";
import { ackCallText, ackEmailText, estimateText } from "./text";

/**
 * The three visitor templates, rendered to the {subject, html, text}
 * shape sendEmail() takes.
 *
 * Every one carries a real text/plain part. Transactional mail without
 * one is filtered aggressively, and these are exactly the messages that
 * must not land in spam. The text parts are hand-written in text.ts
 * rather than derived from the components — see the note there.
 *
 * Rendering happens at send time rather than being pre-built: the
 * templates carry per-lead data, so there is nothing to cache.
 */

type Rendered = { subject: string; html: string; text: string };

/** Template 1 — source estimator_email. */
export async function renderEstimateEmail(
  summary: EstimateSummary
): Promise<Rendered> {
  const props: EstimateEmailProps = {
    range: summary.range,
    timeline: summary.timeline,
    // MVP estimates have no standing run cost, and the clause is
    // dropped entirely rather than shown as zero
    runCost: summary.tool === "mvp" ? null : summary.runCost,
    configured: summary.configured,
    ledger: summary.ledger,
    shareUrl: summary.shareUrl,
    aboveCeiling: summary.aboveCeiling,
  };
  return {
    subject: "Your Codroon estimate",
    html: await render(<EstimateEmail {...props} />),
    text: estimateText(props),
  };
}

/** Template 2 — source modal_email. */
export async function renderAckEmailEmail(name?: string | null): Promise<Rendered> {
  // first name only: "Got it, Sarah." reads like a person wrote it,
  // "Got it, Sarah Whitfield-Brown." does not
  const firstName = name?.trim().split(/\s+/)[0] || null;
  return {
    subject: "We got your message",
    html: await render(<AckEmailEmail firstName={firstName} />),
    text: ackEmailText(firstName, `${SITE.url}/tools/mvp-cost-calculator`),
  };
}

/** Template 3 — source modal_call, ONLY when an email was given. */
export async function renderAckCallEmail(phone: string): Promise<Rendered> {
  return {
    subject: "We'll call you within 24 hours",
    html: await render(<AckCallEmail phone={phone} bookingUrl={SITE.calendly} />),
    text: ackCallText(phone, SITE.calendly),
  };
}
