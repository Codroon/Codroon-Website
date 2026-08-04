import { Section } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { GhostButton, Heading, Rule, SubHeading, Text } from "./components";

/**
 * TEMPLATE 3 — acknowledgement of a call request, to the visitor.
 * Trigger: source `modal_call`, and ONLY when an email address was
 * given. Subject: "We'll call you within 24 hours".
 *
 * The number is echoed back on purpose. A digit typed wrong is the
 * quietest way to lose a lead: nobody finds out until the call does not
 * happen. Printing it makes the mistake catchable by the one person who
 * can correct it.
 *
 * Nothing is sent for `modal_meeting` — Calendly already confirms those,
 * and two confirmations for one booking reads as a system that does not
 * know what it has done.
 */

export type AckCallEmailProps = {
  /** as the visitor typed it, not normalised — they need to recognise it */
  phone: string;
  /** the Calendly booking URL */
  bookingUrl: string;
  origin?: string;
};

export function AckCallEmail({ phone, bookingUrl, origin }: AckCallEmailProps) {
  return (
    <EmailLayout
      preview={`Within 24 hours, on ${phone}`}
      origin={origin}
      footer={
        <p style={footerNote}>
          You are getting this because you asked us to call. It is a one-off,
          not a list.
        </p>
      }
    >
      <Heading>We&rsquo;ll call you.</Heading>

      <Text>
        Within 24 hours, on <strong style={strong}>{phone}</strong>.
      </Text>
      <Text>
        If that number is wrong, or a different time suits you better, just
        reply to this email and we will sort it out.
      </Text>

      <Rule />

      <SubHeading>Want to skip the wait?</SubHeading>
      <Text>
        Pick a slot that works for you and we will call then instead.
      </Text>

      <Section style={buttonRow}>
        <GhostButton href={bookingUrl}>Book a time →</GhostButton>
      </Section>
    </EmailLayout>
  );
}

const strong: React.CSSProperties = { fontWeight: 600, color: "#232220" };
const buttonRow: React.CSSProperties = { paddingTop: "24px" };
const footerNote: React.CSSProperties = {
  margin: 0,
  fontFamily: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  fontSize: "12px",
  lineHeight: "1.6",
  color: "#8A857A",
};

export default AckCallEmail;
