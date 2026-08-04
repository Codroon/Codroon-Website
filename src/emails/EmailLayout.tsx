import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
} from "@react-email/components";
import type { ReactNode } from "react";
import { assetBase, email } from "./theme";

/**
 * EmailLayout — the shell every VISITOR email shares. The three
 * notification emails to sales@ deliberately do NOT use it: their job is
 * to be readable on a lock screen, and branding fights that.
 *
 * Structure, top to bottom:
 *   warm page background → white 600px card → dark header band with the
 *   logo → 3px accent rule → 36px body → footer band
 *
 * Everything is tables and inline styles, which is what React Email
 * emits. No flexbox, no grid, no custom properties, no SVG, no web
 * fonts: each of those is stripped or mis-rendered by at least one of
 * Gmail, Outlook and Yahoo.
 *
 * The card stays LIGHT. A dark email would match the site, but client
 * dark-mode inversion is unpredictable and the near-black goes muddy in
 * exactly the clients that invert.
 */

export type EmailLayoutProps = {
  /** the inbox line-two snippet, before anything is opened */
  preview: string;
  children: ReactNode;
  /**
   * Origin for absolute asset URLs. The preview route passes its own so
   * the logo resolves before this is deployed.
   */
  origin?: string;
  /** replaces the default footer line when a template needs its own */
  footer?: ReactNode;
};

export function EmailLayout({ preview, children, origin, footer }: EmailLayoutProps) {
  const logo = `${assetBase(origin)}/email/logo-light.png`;

  return (
    <Html lang="en">
      <Head>
        {/*
          Opt out of forced dark mode where the client honours it (Apple
          Mail, Outlook.com). Gmail ignores both and inverts anyway,
          which is why the card is light to begin with — see the note in
          the docblock and the dark-mode finding in the preview route.
        */}
        <meta name="color-scheme" content="light only" />
        <meta name="supported-color-schemes" content="light only" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={card}>
          {/* header band */}
          <Section style={header}>
            {/*
              width and height as ATTRIBUTES as well as CSS: Outlook
              ignores CSS dimensions and will render the image at its
              intrinsic 480px otherwise.

              display:block removes the baseline gap some clients add
              under an image.

              The alt text carries the brand for the many readers who
              have images blocked by default.
            */}
            <Img
              src={logo}
              alt="Codroon"
              width="120"
              height="31"
              style={logoStyle}
            />
          </Section>

          {/* accent rule, directly under the header */}
          <Section style={accentRule} />

          {/* body */}
          <Section style={bodyPad}>{children}</Section>

          {/* footer band */}
          <Section style={footerBand}>
            {footer ?? (
              <p style={footerText}>
                You are getting this because you asked us to send it. It is a
                one-off, and we have not added you to anything.
              </p>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ---------------- styles ---------------- */

const body: React.CSSProperties = {
  margin: 0,
  padding: "24px 12px",
  backgroundColor: email.page,
  fontFamily: email.font,
  // stops iOS from inflating small text
  WebkitTextSizeAdjust: "100%",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: email.card,
  // no radius: Outlook squares it anyway, so the corner would differ
  // between clients for no gain
};

const header: React.CSSProperties = {
  backgroundColor: email.header,
  padding: "22px 36px",
};

const logoStyle: React.CSSProperties = {
  display: "block",
  border: 0,
  // height is set as an attribute too; this keeps the ratio if a client
  // reflows the image
  width: "120px",
  height: "31px",
};

const accentRule: React.CSSProperties = {
  backgroundColor: email.accent,
  // a 3px-tall row: fontSize/lineHeight 0 stops Outlook padding it out
  height: "3px",
  fontSize: "1px",
  lineHeight: "3px",
};

const bodyPad: React.CSSProperties = {
  padding: "36px",
};

const footerBand: React.CSSProperties = {
  backgroundColor: email.footer,
  padding: "22px 36px",
  borderTop: `1px solid ${email.rule}`,
};

const footerText: React.CSSProperties = {
  margin: 0,
  fontFamily: email.font,
  fontSize: "12px",
  lineHeight: "1.6",
  color: email.smallPrint,
};

export default EmailLayout;
