import type { BlogPost, Block } from "./types";
import { customEcommerceVsShopify } from "./custom-ecommerce-vs-shopify";
import { googleAntigravityVsCursor } from "./google-antigravity-vs-cursor";
import { googleStitchVsFigma } from "./google-stitch-vs-figma";
import { howToRankInAiSearch } from "./how-to-rank-in-ai-search";
import { makeToN8nMigration } from "./make-to-n8n-migration";
import { saasFounderTools2026 } from "./saas-founder-tools-2026";
import { vercelVsRenderVsAws } from "./vercel-vs-render-vs-aws";

/**
 * Blog registry — the single source of truth for every published post.
 * Pure server-side data: the listing, the post pages, the landing-page
 * teaser and the sitemap all read from here, so nothing about the post
 * list is fetched on the client.
 *
 * Adding a post is one import and one array entry. Order in the array
 * is irrelevant — everything sorts by publishedAt.
 */

/** Registered posts, unsorted. */
const REGISTRY: BlogPost[] = [
  googleAntigravityVsCursor,
  googleStitchVsFigma,
  makeToN8nMigration,
  vercelVsRenderVsAws,
  saasFounderTools2026,
  customEcommerceVsShopify,
  howToRankInAiSearch,
];

/** Newest first, which is the order the listing and teaser render in. */
export const POSTS: BlogPost[] = [...REGISTRY].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

export const getAllPosts = (): BlogPost[] => POSTS;

export const getPost = (slug: string): BlogPost | undefined =>
  POSTS.find((p) => p.slug === slug);

export const postHref = (slug: string) => `/blog/${slug}`;

/** The n most recent posts — the landing teaser (3) and the rail (3). */
export const getRecentPosts = (limit: number): BlogPost[] => POSTS.slice(0, limit);

/**
 * Neighbours in published order. `prev` is the older post and `next`
 * the newer one, matching how a reader moves back through an archive.
 */
export function getAdjacentPosts(slug: string): {
  prev?: BlogPost;
  next?: BlogPost;
} {
  const i = POSTS.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  return { next: POSTS[i - 1], prev: POSTS[i + 1] };
}

/* ------------------------------------------------------------------
   Derived values — never authored in frontmatter
   ------------------------------------------------------------------ */

/** Every human-readable string in a block, for word counting. */
function blockText(block: Block): string[] {
  switch (block.kind) {
    case "prose":
    case "callout":
      return block.paragraphs;
    case "subheading":
      return [block.text];
    case "list":
      return block.items;
    case "steps":
      return block.steps.flatMap((s) => [s.title, s.body]);
    case "table":
      return [...block.columns, ...block.rows.flatMap((r) => [r.label, ...r.cells])];
  }
}

const countWords = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

/**
 * Reading time in whole minutes at 220 wpm, floored at 1. Counts the
 * takeaways, lede, every section, the FAQ and the closing CTA — i.e.
 * everything a reader actually reads.
 */
export function readingMinutes(post: BlogPost): number {
  const strings = [
    post.title,
    ...post.keyTakeaways.flatMap((t) => [t.lead, t.rest]),
    ...post.intro,
    ...post.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap(blockText)]),
    post.faq.heading,
    ...post.faq.items.flatMap((i) => [i.q, i.a]),
    post.finalCta.heading,
    ...post.finalCta.body,
  ];
  return Math.max(1, Math.round(strings.reduce((n, s) => n + countWords(s), 0) / 220));
}

/**
 * OG title = the meta title with the brand suffix stripped. The OG card
 * already shows the domain, so " | Codroon" is wasted preview
 * characters. Derived rather than authored (client, 2026-08-03).
 * Currently a no-op on all seven decks — none carry the suffix — but it
 * keeps later posts consistent without a per-post field.
 */
export const ogTitleFor = (post: BlogPost): string =>
  post.metaTitle.replace(/\s*\|\s*Codroon\s*$/, "");

/** OG description is the meta description verbatim. */
export const ogDescriptionFor = (post: BlogPost): string => post.metaDescription;

/** Section headings drive the right-rail TOC. H2s only, never H3s. */
export const tocFor = (post: BlogPost): Array<{ id: string; heading: string }> =>
  post.sections.map((s) => ({ id: s.id, heading: s.heading }));
