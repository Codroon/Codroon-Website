import type { ComparisonRow, FaqItem } from "@/content/services/types";

/**
 * BlogPost — the contract every post module satisfies.
 *
 * ALL copy is VERBATIM from the approved post deck (the `-v2.md`
 * files). Never write, rephrase, shorten, or extend it here. Internal
 * scaffolding in the decks (the header block above META, SOURCES,
 * NOTES, VOICE NOTES, and the ⚠️ pre-publish callouts) is editorial
 * instruction and never ships.
 *
 * TWO FIELDS DO TWO DIFFERENT JOBS, and confusing them is the mistake
 * this file exists to prevent:
 *   title         long, keyword-loaded. The H1 and the listing link.
 *   coverHeadline short, punchy, 2–3 lines. ONLY on the cover card.
 * PostCover never receives the title. The listing never renders the
 * cover headline as text.
 */

/* ------------------------------------------------------------------
   Body blocks
   ------------------------------------------------------------------ */

/** A run of paragraphs. One string per paragraph, no markdown. */
export type ProseBlock = { kind: "prose"; paragraphs: string[] };

/**
 * An H3 inside a section. Body structure only: the right-rail TOC is
 * built from H2s alone, so these never appear in it. Always follows an
 * H2, so there is no heading-level skip.
 */
export type SubheadingBlock = { kind: "subheading"; text: string };

/** Unordered list. Used by the "earns its place" blocks. */
export type ListBlock = { kind: "list"; items: string[] };

/**
 * Comparison table. Feeds the shared SemanticComparisonTable, so the
 * markup is a real <table> with scope="col"/scope="row" — featured
 * snippet eligibility depends on it. `columns` excludes the corner
 * cell; `ComparisonRow.label` becomes the <th scope="row">.
 */
export type TableBlock = {
  kind: "table";
  /** sr-only <caption> */
  caption: string;
  columns: string[];
  rows: ComparisonRow[];
  /** visible corner-cell header; omit for an sr-only one */
  cornerHeader?: string;
  /** which data column is highlighted; posts are neutral, so default off */
  highlightColumn?: number;
};

/** Distinct surface with an accent hairline on the left edge. */
export type CalloutBlock = { kind: "callout"; paragraphs: string[] };

/** Numbered steps. Number in accent-dim, title, body. Never cards. */
export type StepsBlock = {
  kind: "steps";
  steps: Array<{ title: string; body: string }>;
};

export type Block =
  | ProseBlock
  | SubheadingBlock
  | ListBlock
  | TableBlock
  | CalloutBlock
  | StepsBlock;

/** One H2 and everything under it, up to the next H2. */
export type PostSection = {
  /** stable anchor id — the TOC and scroll-spy target */
  id: string;
  /** the H2, verbatim from the deck */
  heading: string;
  blocks: Block[];
};

/* ------------------------------------------------------------------
   Supporting shapes
   ------------------------------------------------------------------ */

/**
 * A takeaway, stored pre-split rather than as a markdown string.
 * The decks write these as "**lead** rest"; keeping the two apart
 * makes the bold lead-in structural instead of something a markdown
 * parser has to be trusted with, and it preserves the decks' own
 * inconsistency about whether the lead ends in a full stop.
 */
export type Takeaway = { lead: string; rest: string };

/**
 * `href: null` means "open the shared contact modal" rather than
 * navigate. Encoded in the data so no component has to pattern-match
 * on a label like "Book a free discovery call".
 */
export type PostCta = { label: string; href: string | null };

export type RelatedLink = { label: string; href: string };

/* ------------------------------------------------------------------
   The post
   ------------------------------------------------------------------ */

export type BlogPost = {
  /** URL segment. Canonical path is /blog/<slug>. */
  slug: string;

  /** H1 and listing link. Long and keyword-loaded. NEVER on the cover. */
  title: string;

  /** deck § META, verbatim */
  metaTitle: string;
  metaDescription: string;

  /* ---- cover card (see PostCover) ---- */
  /** the chip, e.g. "AI DEVELOPMENT TOOLS" */
  category: string;
  /** 2–3 short lines, newline-separated. NOT the title. */
  coverHeadline: string;
  coverSubtitle: string;
  /**
   * Ghosted word behind the cover headline. AUTHORED, not derived:
   * deriving from the category produced weak results ("AI", "SEO"),
   * and the choice is editorial — the Vercel post uses DEPLOY rather
   * than VERCEL because naming one platform implies a verdict the
   * post does not reach.
   */
  watermark: string;

  /** ISO dates, YYYY-MM-DD */
  publishedAt: string;
  updatedAt: string;

  /** key into AUTHORS in src/content/blog/authors.ts */
  author: string;

  /** Above the body, before the first H2. Never behind an accordion. */
  keyTakeaways: Takeaway[];

  /** the lede, before the first H2 */
  intro: string[];

  sections: PostSection[];

  faq: { heading: string; items: FaqItem[] };

  finalCta: {
    heading: string;
    body: string[];
    primary: PostCta;
    secondary: PostCta;
  };

  relatedLinks: RelatedLink[];
};
