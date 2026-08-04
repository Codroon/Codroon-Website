import "server-only";
import { render } from "@react-email/render";
import { SITE } from "@/config/site";
import { AckCallEmail } from "./AckCallEmail";
import { AckEmailEmail } from "./AckEmailEmail";
import { EstimateEmail } from "./EstimateEmail";
import { estimatorNotification, modalNotification } from "./notifications";
import { ackCallText, ackEmailText, estimateText } from "./text";
import {
  sampleCallLead,
  sampleEmailLead,
  sampleEstimate,
  sampleEstimateAboveCeiling,
  sampleEstimateMvp,
  sampleSummary,
  sampleSummaryWithCuts,
} from "./sampleData";

/**
 * One list of rendered previews, shared by the /dev/emails route and the
 * static exporter, so the page you review and the files you hand to a
 * client-testing tool can never drift apart.
 *
 * Timestamps are passed in rather than taken from the clock: the static
 * exports would otherwise produce a different file on every run and every
 * diff would be noise.
 */

export type PreviewItem = {
  id: string;
  name: string;
  audience: "visitor" | "sales";
  subject: string;
  note: string;
  html: string;
  text: string;
};

/** Fixed instant so exports are reproducible. 14:35 PKT. */
const AT = new Date("2026-08-04T09:35:00Z");

export async function buildPreviews(origin?: string): Promise<PreviewItem[]> {
  // text comes from the hand-written parts, not a plain-text render:
  // the exported .txt must be byte-identical to what actually sends
  const visitor = async (
    id: string,
    name: string,
    subject: string,
    note: string,
    el: React.ReactElement,
    text: string
  ): Promise<PreviewItem> => ({
    id,
    name,
    audience: "visitor",
    subject,
    note,
    html: await render(el),
    text,
  });

  const estimatorNote = estimatorNotification({
    source: "estimator_email",
    receivedAt: AT,
    email: "sarah@northloop.co",
    summary: sampleSummary,
  });

  const estimatorNoteCuts = estimatorNotification({
    source: "estimator_quote",
    receivedAt: AT,
    email: null,
    summary: sampleSummaryWithCuts,
  });

  const callNote = modalNotification({
    source: "modal_call",
    receivedAt: AT,
    ...sampleCallLead,
    estimateUrl: sampleSummary.shareUrl,
  });

  const emailNote = modalNotification({
    source: "modal_email",
    receivedAt: AT,
    ...sampleEmailLead,
    estimateUrl: null,
  });

  return [
    await visitor(
      "1-estimate-agent",
      "1. Estimate — agent",
      "Your Codroon estimate",
      "source: estimator_email",
      <EstimateEmail {...sampleEstimate} origin={origin} />,
      estimateText(sampleEstimate)
    ),
    await visitor(
      "1b-estimate-mvp",
      "1b. Estimate — MVP",
      "Your Codroon estimate",
      "the run-cost clause is dropped entirely",
      <EstimateEmail {...sampleEstimateMvp} origin={origin} />,
      estimateText(sampleEstimateMvp)
    ),
    await visitor(
      "1c-estimate-above-ceiling",
      "1c. Estimate — above ceiling",
      "Your Codroon estimate",
      "no figure, no breakdown box",
      <EstimateEmail {...sampleEstimateAboveCeiling} origin={origin} />,
      estimateText(sampleEstimateAboveCeiling)
    ),
    await visitor(
      "2-ack-email",
      "2. Email acknowledgement",
      "We got your message",
      "source: modal_email",
      <AckEmailEmail firstName="Daniel" origin={origin} />,
      ackEmailText("Daniel", `${SITE.url}/tools/mvp-cost-calculator`)
    ),
    await visitor(
      "2b-ack-email-no-name",
      "2b. Email acknowledgement — no name",
      "We got your message",
      "the name is dropped cleanly",
      <AckEmailEmail firstName={null} origin={origin} />,
      ackEmailText(null, `${SITE.url}/tools/mvp-cost-calculator`)
    ),
    await visitor(
      "3-ack-call",
      "3. Call acknowledgement",
      "We'll call you within 24 hours",
      "source: modal_call, only when an email was given",
      <AckCallEmail
        phone={sampleCallLead.phone}
        bookingUrl={SITE.calendly}
        origin={origin}
      />,
      ackCallText(sampleCallLead.phone, SITE.calendly)
    ),
    {
      id: "4-notify-estimator",
      name: "4. Notification — estimator lead",
      audience: "sales",
      subject: estimatorNote.subject,
      note: "no cuts toggled: they are looking at the full build",
      html: estimatorNote.html,
      text: estimatorNote.text,
    },
    {
      id: "4b-notify-estimator-quote",
      name: "4b. Notification — quote requested, cuts toggled",
      audience: "sales",
      subject: estimatorNoteCuts.subject,
      note: "no email given, and two cuts are on",
      html: estimatorNoteCuts.html,
      text: estimatorNoteCuts.text,
    },
    {
      id: "5-notify-call",
      name: "5. Notification — call request",
      audience: "sales",
      subject: callNote.subject,
      note: "consent flags and the linked estimate",
      html: callNote.html,
      text: callNote.text,
    },
    {
      id: "5b-notify-email",
      name: "5b. Notification — email enquiry",
      audience: "sales",
      subject: emailNote.subject,
      note: "no phone, no estimate",
      html: emailNote.html,
      text: emailNote.text,
    },
  ];
}
