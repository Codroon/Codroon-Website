/**
 * ProductPageContent — the contract every product page's copy module
 * satisfies. Modelled on content/services/types.ts: the template renders
 * a section only when its data exists, so in-development products can
 * ship a legitimately thin page instead of one padded with placeholders.
 *
 * ALL copy comes verbatim from the approved copy deck for the page —
 * never write, rephrase, or extend copy in code. Numbers appear only if
 * they are in the deck.
 */

export type ProductStat = {
  /** the figure itself, e.g. "1,000+" */
  value: string;
  /** what it counts, e.g. "users" */
  label: string;
};

export type ProductSlide = {
  /**
   * Path under /public/products. Undefined until the real screenshot
   * lands — the slider renders a reserved frame, never a fake UI.
   */
  src?: string;
  /** Describes the UI shown, not "product screenshot". */
  alt: string;
  /** Caption printed under the frame. */
  caption: string;
  /**
   * Makes the caption an external link (accent, new tab) — used on the
   * live-site slide so "replydude.ai — …" is clickable. Omit for app
   * screenshots.
   */
  href?: string;
  width: number;
  height: number;
};

export type MetaRailField = {
  label: string;
  /** Plain value, or a list rendered as separated items. */
  value?: string;
  items?: string[];
  /** Renders the value as an external link (new tab, rel=noopener). */
  href?: string;
  /**
   * Renders the whole value in the accent — used on Status so "Live"
   * (and the version after it) reads as live. Client, 2026-08-04.
   */
  accent?: boolean;
};

export type DecisionTab = {
  /** Short tab label. */
  tab: string;
  /** Panel heading — the claim being made. */
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

export type TaughtUsItem = {
  heading: string;
  body: string;
  link: { label: string; href: string };
};

export type ProductPageContent = {
  slug: string;

  /**
   * The product's OWN brand colour, sampled from its live site
   * (scripts/sample-brand-colour.mjs), used to tint the screenshot
   * frame so the panel reads as that product rather than as Codroon.
   *
   * OPTIONAL, and leaving it out is a legitimate design choice rather
   * than an unfinished one: the frame falls back to the neutral --border
   * hairline. It also need not be the product's colour — ReplyDude is
   * set to black by client decision; see the note in replydude.ts.
   *
   * This is the single sanctioned exception to the site's one-accent
   * rule (recorded in globals.css), scoped to the image frame only:
   * Codroon orange still owns every interactive control on the page
   * (caption link, slider dots, CTAs).
   *
   * Must be a literal hex — the slider validates it and silently falls
   * back to the neutral hairline otherwise, because an invalid CSS
   * colour resolves to currentColor, i.e. a near-white frame.
   *
   * A product colour should clear 3:1 against --surface-page (#1a1917);
   * below roughly 2.5:1 it stops reading as deliberate on this dark a
   * page. The halo softens the step, so measure the border against the
   * PAGE, not against the halo. A neutral or black edge is exempt —
   * receding is the point there.
   */
  brandColor?: string;

  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    /** In-development pages stay out of the index until launch. */
    noindex?: boolean;
  };

  hero: {
    eyebrow: string;
    h1: string;
    subhead: string;
    /** Omitted entirely for products with no defensible numbers yet. */
    stats?: ProductStat[];
  };

  /** Auto-advancing screenshot slider. Omitted when there are no shots. */
  slider?: {
    slides: ProductSlide[];
  };

  metaRail: MetaRailField[];

  /**
   * Heading placed above the lead paragraph (the hero subhead) at the
   * top of the body column — e.g. "What is ReplyDude?". Per-product, so
   * a product can open its body column without one.
   */
  leadHeading?: string;

  /** § THE BET — two paragraphs, present tense. Not challenge/solution. */
  bet?: {
    heading: string;
    paragraphs: string[];
  };

  /** § THREE DECISIONS — the tabbed block; the page's strongest content. */
  decisions?: {
    heading: string;
    intro: string;
    tabs: DecisionTab[];
  };

  /**
   * The product's distinctive mechanic — the section that explains how
   * the thing actually works. ReplyDude uses it for the agent loop,
   * Decipher Engine for its multimodal session loop.
   */
  mechanic?: {
    heading: string;
    paragraphs: string[];
  };

  /** § WHERE IT IS NOW — prose, never metric cards (see template note). */
  whereItIsNow?: {
    heading: string;
    paragraphs: string[];
  };

  taughtUs?: {
    heading: string;
    intro: string;
    items: TaughtUsItem[];
  };

  finalCta?: {
    heading: string;
    body: string;
    /** External primary CTA — sending traffic away is deliberate. */
    primary?: { label: string; href: string };
    secondary: string;
  };
};
