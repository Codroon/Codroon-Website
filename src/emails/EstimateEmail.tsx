import { Section } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import {
  BreakdownBox,
  Eyebrow,
  PrimaryButton,
  SmallPrint,
  Text,
} from "./components";
import { email } from "./theme";

/**
 * TEMPLATE 1 — the estimate, to the visitor.
 * Trigger: source `estimator_email`. Subject: "Your Codroon estimate".
 *
 * The breakdown box is the point of this email. Without it the message
 * is a number and a link, which reads like a receipt; with it the
 * visitor can see what the figure is made of before deciding whether to
 * open anything.
 *
 * The run-cost clause is dropped entirely for MVP estimates — an MVP has
 * no standing model spend, so "$0 a month to run" would be a claim we
 * have not made.
 */

export type EstimateEmailProps = {
  /** "$18,000 to $26,000", or the above-ceiling sentence */
  range: string;
  /** "6 to 8 weeks" */
  timeline: string;
  /** "$180 to $400" — null for MVP estimates and when there is none */
  runCost: string | null;
  /** one line describing what they configured */
  configured: string | null;
  /** the visible ledger, struck lines already removed */
  ledger: { label: string; figure: string }[];
  /** https://codroon.com/e/{shortCode} */
  shareUrl: string;
  /** the estimator declined to price it */
  aboveCeiling?: boolean;
  origin?: string;
};

export function EstimateEmail({
  range,
  timeline,
  runCost,
  configured,
  ledger,
  shareUrl,
  aboveCeiling = false,
  origin,
}: EstimateEmailProps) {
  return (
    <EmailLayout
      preview={
        aboveCeiling
          ? "Your build came out above the estimator's ceiling"
          : `${range} — ${timeline}`
      }
      origin={origin}
      footer={
        <SmallPrint>
          The link stays live, so you can come back to it or send it to whoever
          else needs to see it. If you would rather talk it through, just reply
          to this email.
        </SmallPrint>
      }
    >
      <Eyebrow>Your estimate</Eyebrow>

      {aboveCeiling ? (
        <>
          <p style={rangeStyle}>Above the ceiling</p>
          <Text>
            What you configured came out beyond what a six-answer estimator can
            price honestly, so we have not put a number on it. A build that size
            deserves a conversation rather than a guess.
          </Text>
        </>
      ) : (
        <>
          <p style={rangeStyle}>{range}</p>
          <p style={metaStyle}>
            {timeline} to build
            {runCost ? ` · ${runCost} a month to run` : ""}
          </p>
        </>
      )}

      {configured && <Text>{configured}</Text>}

      {ledger.length > 0 && (
        <BreakdownBox
          label="What's in it"
          rows={ledger.map((l) => ({ name: l.label, figure: l.figure }))}
        />
      )}

      <Text>
        The full breakdown is on the page, along with the list of what you could
        cut to bring the number down and what each cut saves.
      </Text>

      <Section style={buttonRow}>
        <PrimaryButton href={shareUrl}>View your estimate →</PrimaryButton>
      </Section>
    </EmailLayout>
  );
}

/* ---------------- styles ---------------- */

const rangeStyle: React.CSSProperties = {
  margin: "10px 0 0 0",
  fontFamily: email.font,
  fontSize: "34px",
  lineHeight: "1.15",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: email.heading,
};

const metaStyle: React.CSSProperties = {
  margin: "8px 0 0 0",
  fontFamily: email.font,
  fontSize: "14px",
  lineHeight: "1.5",
  color: email.muted,
};

const buttonRow: React.CSSProperties = {
  paddingTop: "28px",
};

export default EstimateEmail;
