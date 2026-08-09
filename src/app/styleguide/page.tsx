import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Display, H1, H2, H3 } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

/**
 * DEV ONLY — gated with notFound() in production, the same treatment as
 * /dev/emails (client, 2026-08-04). An unlinked design-system page is
 * an information leak about the build, and noindex alone still serves
 * it to anyone who guesses the URL.
 */
export const metadata = {
  title: "Styleguide — Codroon Design System",
  robots: { index: false, follow: false },
};

const colorTokens = [
  { name: "--surface-page", value: "#1A1917", use: "page base (derived)" },
  { name: "--surface-card", value: "#232220", use: "cards / sections (brand)" },
  { name: "--surface-raised", value: "#2E2C28", use: "nested / hover (derived)" },
  { name: "--border", value: "#403D36", use: "hairlines (brand)" },
  { name: "--border-strong", value: "#524E45", use: "emphasized lines (derived)" },
  { name: "--text-tertiary", value: "#8A857A", use: "meta — page bg only (derived)" },
  { name: "--text-secondary", value: "#C8C5B9", use: "body copy (brand)" },
  { name: "--text-primary", value: "#EAE5E1", use: "headings / emphasis (brand)" },
  { name: "--accent", value: "#E96A42", use: "ACTIONS ONLY (brand)" },
  { name: "--accent-hover", value: "#F08557", use: "action hover (derived)" },
  { name: "--accent-dim", value: "#A04A2E", use: "decoration only — fails 4.5:1, never for meaningful text" },
  { name: "--accent-foreground", value: "#232220", use: "the ONLY text on accent" },
  { name: "--success", value: "#5E9A6B", use: "with icon + text, never alone" },
  { name: "--error", value: "#B4453E", use: "with icon + text, never alone" },
  { name: "--info", value: "#5B8FB8", use: "with icon + text, never alone" },
];

const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160];

function Block({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) {
  return (
    <Section spacing="compact" className="border-t border-border first:border-t-0">
      <Eyebrow number={number} className="mb-8">
        {title}
      </Eyebrow>
      {children}
    </Section>
  );
}

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="pt-28">
      {/* Header */}
      <Section spacing="compact">
        <Eyebrow number="00" className="mb-6">
          Codroon Design System
        </Eyebrow>
        <Display>
          The foundation. <span className="text-muted-foreground">Calm, warm, deliberate.</span>
        </Display>
        <p className="text-body-lg mt-6 max-w-2xl text-muted-foreground">
          Every token, type step and atom that the rest of the site is built
          from. Dark is the default theme; light is a token swap away.
        </p>
      </Section>

      {/* Colors */}
      <Block number="01" title="Color tokens">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {colorTokens.map((t) => (
            <div
              key={t.name}
              className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface"
            >
              <div
                className="h-24 w-full border-b border-border"
                style={{ background: `var(${t.name})` }}
              />
              <div className="p-4">
                <p className="text-mono text-small text-foreground">{t.name}</p>
                <p className="text-mono text-small mt-1 text-muted-foreground">
                  {t.value}
                </p>
                <p className="text-small mt-2 text-muted-foreground">{t.use}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      {/* Typography */}
      <Block number="02" title="Type scale">
        <div className="space-y-10">
          <ScaleRow label="Display · serif · clamp(2.75→5.5rem)">
            <p className="text-display text-foreground">Where code becomes conscious</p>
          </ScaleRow>
          <ScaleRow label="H1 · serif">
            <p className="text-h1 text-foreground">Ship in weeks, not months</p>
          </ScaleRow>
          <ScaleRow label="H2 · serif">
            <p className="text-h2 text-foreground">AI-native by default</p>
          </ScaleRow>
          <ScaleRow label="H3 · sans · 600">
            <p className="text-h3 text-foreground">Production-grade, not prototypes</p>
          </ScaleRow>
          <ScaleRow label="Body-lg · sans">
            <p className="text-body-lg max-w-2xl text-foreground">
              We pick the right tools and move with judgment — MVPs, AI
              automations, agents and integrations that hold up in production.
            </p>
          </ScaleRow>
          <ScaleRow label="Body · sans">
            <p className="text-body max-w-2xl text-foreground">
              We pick the right tools and move with judgment — MVPs, AI
              automations, agents and integrations that hold up in production.
            </p>
          </ScaleRow>
          <ScaleRow label="Small · sans">
            <p className="text-small max-w-2xl text-muted-foreground">
              Secondary metadata and captions sit at this size in muted grey.
            </p>
          </ScaleRow>
          <ScaleRow label="Eyebrow · mono · uppercase · tracked">
            <Eyebrow>Selected work</Eyebrow>
          </ScaleRow>
          <ScaleRow label="Mono numerals · tabular">
            <p className="text-mono text-accent text-2xl">01 / 02 / 03 / 04</p>
          </ScaleRow>
        </div>
      </Block>

      {/* Buttons */}
      <Block number="03" title="Buttons">
        <div className="space-y-10">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Explore our services</Button>
            <Button variant="secondary">Schedule a call</Button>
            <Button variant="ghost">Learn more</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" disabled magnetic={false}>
              Disabled
            </Button>
            <Button variant="secondary" disabled magnetic={false}>
              Disabled
            </Button>
          </div>
          <p className="text-small text-muted-foreground">
            Primary &amp; secondary buttons track the cursor (magnetic) on
            hover and show an amber focus ring on keyboard focus. Try tabbing.
          </p>
        </div>
      </Block>

      {/* Spacing */}
      <Block number="04" title="Spacing scale (4px base)">
        <div className="space-y-3">
          {spacingScale.map((px) => (
            <div key={px} className="flex items-center gap-4">
              <span className="text-mono text-small w-12 text-muted-foreground">
                {px}
              </span>
              <span
                className="h-4 rounded-sm bg-accent"
                style={{ width: `${px}px` }}
              />
            </div>
          ))}
        </div>
      </Block>

      {/* Card */}
      <Block number="05" title="Card primitive">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <Eyebrow number="A1" className="mb-4">
              Solution
            </Eyebrow>
            <H3>AI-powered web development</H3>
            <p className="text-body mt-3 text-muted-foreground">
              Hover me — the card lifts and the border warms to accent.
            </p>
          </Card>
          <Card>
            <Eyebrow number="A2" className="mb-4">
              Solution
            </Eyebrow>
            <H3>Agentic AI</H3>
            <p className="text-body mt-3 text-muted-foreground">
              Surface background, hairline border, generous padding.
            </p>
          </Card>
          <Card hover={false}>
            <Eyebrow number="A3" className="mb-4">
              Static
            </Eyebrow>
            <H3>No-hover variant</H3>
            <p className="text-body mt-3 text-muted-foreground">
              Same surface, hover lift disabled.
            </p>
          </Card>
        </div>
      </Block>

      <div className="h-24" />
    </div>
  );
}

function ScaleRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 lg:grid-cols-[200px_1fr] lg:gap-10">
      <p className="text-mono text-small pt-1 text-muted-foreground">{label}</p>
      <div>{children}</div>
    </div>
  );
}