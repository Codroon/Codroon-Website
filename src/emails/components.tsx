import { Button, Hr, Row, Column, Section } from "@react-email/components";
import type { ReactNode } from "react";
import { email } from "./theme";

/**
 * The shared pieces the visitor templates build from. Kept here rather
 * than repeated per template so the spacing rhythm is defined once.
 */

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p style={eyebrow}>{children}</p>;
}

export function Heading({ children }: { children: ReactNode }) {
  return <h1 style={heading}>{children}</h1>;
}

export function SubHeading({ children }: { children: ReactNode }) {
  return <h2 style={subHeading}>{children}</h2>;
}

export function Text({
  children,
  muted = false,
  style,
}: {
  children: ReactNode;
  muted?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <p style={{ ...text, ...(muted ? { color: email.muted } : null), ...style }}>
      {children}
    </p>
  );
}

export function SmallPrint({ children }: { children: ReactNode }) {
  return <p style={smallPrint}>{children}</p>;
}

export function Rule() {
  return <Hr style={rule} />;
}

/** Accent fill. Text on it is ALWAYS #232220, never white. */
export function PrimaryButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button href={href} style={primaryButton}>
      {children}
    </Button>
  );
}

/** Outlined, for the secondary action in templates 2 and 3. */
export function GhostButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button href={href} style={ghostButton}>
      {children}
    </Button>
  );
}

/**
 * The breakdown box: the element that makes the estimate email feel
 * substantial rather than like a receipt. Warm panel, accent rule down
 * the left edge, a ledger inside.
 */
export function BreakdownBox({
  label,
  rows,
}: {
  label: string;
  rows: { name: string; figure: string }[];
}) {
  return (
    <Section style={box}>
      <p style={boxLabel}>{label}</p>
      {rows.map((r, i) => (
        <Row key={r.name} style={i === 0 ? ledgerRowFirst : ledgerRow}>
          <Column style={ledgerName}>{r.name}</Column>
          <Column style={ledgerFigure}>{r.figure}</Column>
        </Row>
      ))}
    </Section>
  );
}

/* ---------------- styles ---------------- */

const base: React.CSSProperties = { fontFamily: email.font, margin: 0 };

const eyebrow: React.CSSProperties = {
  ...base,
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: email.smallPrint,
};

const heading: React.CSSProperties = {
  ...base,
  marginTop: "10px",
  fontSize: "26px",
  lineHeight: "1.2",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: email.heading,
};

const subHeading: React.CSSProperties = {
  ...base,
  fontSize: "16px",
  lineHeight: "1.3",
  fontWeight: 600,
  color: email.heading,
};

const text: React.CSSProperties = {
  ...base,
  marginTop: "14px",
  fontSize: "15px",
  lineHeight: "1.6",
  color: email.body,
};

const smallPrint: React.CSSProperties = {
  ...base,
  marginTop: "18px",
  fontSize: "12px",
  lineHeight: "1.6",
  color: email.smallPrint,
};

const rule: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid ${email.rule}`,
  margin: "28px 0",
};

const primaryButton: React.CSSProperties = {
  backgroundColor: email.accent,
  color: email.onAccent,
  fontFamily: email.font,
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  // no radius, per the brand: the site's pills do not survive Outlook
  padding: "14px 30px",
  display: "inline-block",
};

const ghostButton: React.CSSProperties = {
  backgroundColor: "transparent",
  border: `1px solid ${email.heading}`,
  color: email.heading,
  fontFamily: email.font,
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  padding: "13px 29px",
  display: "inline-block",
};

const box: React.CSSProperties = {
  marginTop: "26px",
  backgroundColor: email.footer,
  borderLeft: `3px solid ${email.accent}`,
  padding: "20px 22px",
};

const boxLabel: React.CSSProperties = {
  ...eyebrow,
  marginBottom: "12px",
};

const ledgerRowBase: React.CSSProperties = {
  width: "100%",
};

const ledgerRowFirst: React.CSSProperties = { ...ledgerRowBase };
const ledgerRow: React.CSSProperties = {
  ...ledgerRowBase,
  borderTop: `1px solid ${email.rule}`,
};

const ledgerName: React.CSSProperties = {
  ...base,
  padding: "9px 12px 9px 0",
  fontSize: "14px",
  lineHeight: "1.5",
  color: email.body,
  verticalAlign: "top",
};

const ledgerFigure: React.CSSProperties = {
  ...base,
  padding: "9px 0",
  fontSize: "14px",
  lineHeight: "1.5",
  fontWeight: 600,
  color: email.heading,
  textAlign: "right",
  whiteSpace: "nowrap",
  verticalAlign: "top",
};
