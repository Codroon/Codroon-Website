import { Section } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { GhostButton, Heading, Rule, SubHeading, Text } from "./components";
import { assetBase } from "./theme";

/**
 * TEMPLATE 2 — acknowledgement of a written enquiry, to the visitor.
 * Trigger: source `modal_email`. Subject: "We got your message".
 *
 * The job is to stop them wondering whether it arrived, and to give
 * them something useful to do in the gap. The estimator is that
 * something: it answers the question most of them are really asking
 * before we have replied at all.
 *
 * The name is optional and the heading drops it cleanly when it is
 * missing — "Got it," with a dangling comma is worse than no name.
 */

export type AckEmailEmailProps = {
  /** first name only, or null when the form did not collect one */
  firstName?: string | null;
  origin?: string;
};

export function AckEmailEmail({ firstName, origin }: AckEmailEmailProps) {
  const estimatorUrl = `${assetBase(origin)}/tools/mvp-cost-calculator`;

  return (
    <EmailLayout
      preview="We will read it properly and reply within one working day"
      origin={origin}
    >
      <Heading>{firstName ? `Got it, ${firstName}.` : "Got it."}</Heading>

      <Text>
        Your message has landed. We will read it properly rather than skim it,
        and reply within one working day. If talking would be quicker than
        typing, the reply will include a booking link.
      </Text>

      <Rule />

      <SubHeading>While you wait</SubHeading>
      <Text>
        Our estimator gives you a build range and a timeline in about three
        minutes. No email required to see the number, and nothing you enter
        there commits you to anything.
      </Text>

      <Section style={buttonRow}>
        <GhostButton href={estimatorUrl}>Estimate your build →</GhostButton>
      </Section>
    </EmailLayout>
  );
}

const buttonRow: React.CSSProperties = { paddingTop: "24px" };

export default AckEmailEmail;
