import type { ComparisonRow, FaqItem } from "@/content/services/types";

/**
 * Tool landing-page content contract — one typed module per tool.
 * The shell (ToolLandingTemplate) renders whatever sections a module
 * provides. Signature sections are data too: the agent estimator has
 * `runCost`, the MVP estimator has `cutList` — same slot, zero shared
 * content (two near-identical tool pages get discounted like six
 * near-identical service pages would).
 *
 * ALL copy comes verbatim from the approved deck for the page.
 */

export type ToolPreviewCard = {
  exampleLabel: string;
  title: string;
  range: string;
  lines: Array<{ label: string; value: string }>;
  footerRows: Array<{ label: string; value: string }>;
  /** distinctive final row (e.g. LEANER VERSION) — accent treatment */
  leanerRow?: { label: string; value: string };
};

export type CutListItem = {
  title: string;
  /** dollar saving, e.g. "$3,000–$5,000" */
  saves: string;
  /** optional time saving, e.g. "4–5 days" */
  timeSaved?: string;
  body: string;
};

export type ToolLandingContent = {
  slug: string;
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  hero: {
    eyebrow: string;
    h1: string;
    subhead: string;
    cta: string;
    microcopy: string;
    preview: ToolPreviewCard;
  };
  quickAnswer: string;
  howItWorks?: { heading: string; steps: Array<{ title: string; body: string }> };
  costDrivers?: { heading: string; intro: string; items: Array<{ title: string; body: string }> };
  costTable?: {
    heading: string;
    intro: string;
    cornerHeader: string;
    columns: string[];
    rows: ComparisonRow[];
    closing: string;
  };
  /** signature section — agent estimator */
  runCost?: {
    heading: string;
    intro: string;
    components: Array<{ title: string; body: string }>;
    workedExample: string;
  };
  /** signature section — MVP estimator; also feeds the flow's
      "leaner version" output, so it stays config, never JSX */
  cutList?: {
    heading: string;
    intro: string;
    items: CutListItem[];
    whatNotToCut: { heading: string; body: string };
  };
  whenNot?: { heading: string; intro: string; items: Array<{ title: string; body: string }> };
  optionsTable?: {
    heading: string;
    columns: string[];
    rows: ComparisonRow[];
    closing: string;
    highlightColumn?: number;
  };
  glossary?: { heading: string; terms: Array<{ term: string; definition: string }> };
  faq?: { heading: string; items: FaqItem[] };
  /** related-links strip (chrome) rendered above the final CTA */
  related?: Array<{ label: string; href: string }>;
  finalCta?: { heading: string; body: string; cta: string };
};
