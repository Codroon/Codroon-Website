/**
 * Service page content contract — ONE typed content module per service
 * page. The shell (ServicePageTemplate) renders whatever sections a
 * module provides; missing sections simply don't render. This is what
 * keeps the six service pages structurally identical but never
 * duplicate in content: comparison table, sub-services, process and
 * FAQ are data, written from scratch per page.
 *
 * ALL copy comes verbatim from the approved copy deck for the page —
 * never write or rephrase copy in code.
 */

export type ServiceMeta = {
  /** <title> tag */
  title: string;
  /** meta description */
  description: string;
  /** OG title (differs from the title tag on purpose) */
  ogTitle: string;
  /** OG description (differs from the meta description on purpose) */
  ogDescription: string;
};

export type ComparisonColumn = { label: string };

export type ComparisonRow = {
  /** row header — rendered as <th scope="row"> */
  label: string;
  /** one cell per column, same order as `columns` */
  cells: string[];
};

export type ComparisonTable = {
  heading: string;
  intro: string;
  /** column headers — rendered as <th scope="col"> */
  columns: string[];
  rows: ComparisonRow[];
  closing: string;
  /** which data column represents OUR offering (highlighted); default 0 */
  highlightColumn?: number;
};

export type SubServiceCard = { title: string; body: string };

export type ProcessStep = {
  /** "01" … */
  n: string;
  title: string;
  /** e.g. "Free, 45 minutes" / "Week 1" — verbatim from the deck */
  duration: string;
  body: string;
  deliverables: string[];
};

export type TechGroup = { title: string; body: string };

export type IndustryRow = {
  title: string;
  body: string;
  /** set when this industry gets its own page — row becomes a link */
  href?: string;
};

export type FaqItem = { q: string; a: string };

export type CategoryHubLink = {
  label: string;
  href: string;
  descriptor: string;
};

export type ServicePageContent = {
  slug: string;
  meta: ServiceMeta;
  hero: {
    eyebrow: string;
    h1: string;
    subhead: string;
    /** single CTA — opens the shared contact modal */
    cta: string;
  };
  whatIs?: { heading: string; paragraphs: string[] };
  comparison?: ComparisonTable;
  subServices?: { heading: string; intro: string; cards: SubServiceCard[] };
  /** internal-links hub (custom-software page) — renders after sub-services */
  categoryHub?: {
    heading: string;
    body: string;
    links: CategoryHubLink[];
    closing: string;
  };
  process?: { heading: string; intro: string; steps: ProcessStep[] };
  tech?: { heading: string; intro: string; groups: TechGroup[] };
  industries?: { heading: string; intro: string; rows: IndustryRow[] };
  pricing?: { heading: string; paragraphs: string[] };
  faq?: {
    heading: string;
    /** plain prose above the accordion — snippet / LLM extraction */
    quickAnswers: string;
    items: FaqItem[];
  };
  finalCta?: { heading: string; body: string; cta: string };
};
