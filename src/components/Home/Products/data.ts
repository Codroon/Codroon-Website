/**
 * Products data — real content only. Anything missing is a TODO, never
 * placeholder text:
 *  - descriptor: real one-liner or undefined (card omits the line)
 *  - screenshot: file in /public + path, or undefined (card omits media)
 *  - metrics: real, verified numbers only, or undefined (row omitted)
 *  - liveUrl: verified live URL only
 */

export type ProductMetric = { value: string; label: string };

export type Product = {
  name: string;
  slug: string;
  /** TODO where undefined: real one-line descriptor */
  descriptor?: string;
  /** 3–4 line card description. Current values are DUMMY drafts. */
  description?: string;
  /** TODO where undefined: real product screenshot in /public/products */
  screenshot?: string;
  /** TODO: real metrics — do not invent numbers */
  metrics?: ProductMetric[];
  liveUrl?: string;
  /**
   * How the live domain is written when it is used AS the card heading
   * (client, 2026-08-04). Spelled out rather than derived from liveUrl
   * so the capitalisation is the client's, not a transform's.
   */
  liveLabel?: string;
  /** featured products appear on the homepage grid */
  featured?: boolean;
};

/**
 * DUMMY COPY WARNING: every `description` below is a placeholder draft
 * written to shape the card design. The client will supply the real
 * descriptions — replace all four before launch.
 */
export const PRODUCTS: Product[] = [
  {
    name: "Decipher Engine",
    slug: "decipher-engine",
    // Descriptor + description are deck copy (see content/products/decipher-engine.ts).
    descriptor: "An AI storytelling platform that remembers.",
    description:
      "An AI storytelling platform that remembers. Retrieval-backed narrative memory, 20+ models across text and image, 5,000+ users.",
    // Same lead image as the product page's slider (client, 2026-08-02).
    screenshot: "/products/decipher-engine/01-decipher-site.png",
    // Deck § META RAIL gives decipherengine.ai as the live product URL
    // (was pointing at the decipher-beta.vercel.app preview).
    liveUrl: "https://decipherengine.ai",
    liveLabel: "Decipherengine.ai",
    featured: true,
    // TODO: real metrics
  },
  {
    name: "ReplyDude",
    slug: "replydude",
    // Descriptor is deck copy, cut after "agent" for the card (client,
    // 2026-08-02); description carries the platform/spec detail so the
    // pair doesn't read as the same sentence twice.
    descriptor: "A cross-platform desktop AI agent.",
    description:
      "Runs reply growth on X and Instagram. Four models, real browser automation, non-custodial billing.",
    // Same lead image as the product page's slider (client, 2026-08-02).
    screenshot: "/products/replydude/01-replydude-site.png",
    liveUrl: "https://replydude.ai",
    liveLabel: "Replydude.ai",
    featured: true,
    // TODO: real metrics
  },
  // Opspilot and Blueprint deleted 2026-08-02 (client) — different
  // product names will take their place later.
  /**
   * In development — routed so nothing 404s, and noindex until launch
   * (any product without a content module in content/products/ is
   * excluded from the index). Deliberately no description: the house
   * rule is real copy or nothing, never filler.
   * TODO: copy deck, descriptor, screenshot, live URL per product.
   */
  {
    name: "Codroon.ai",
    slug: "codroon-ai",
  },
  {
    name: "Codmatic",
    slug: "codmatic",
  },
  {
    name: "AdMultiply",
    slug: "admultiply",
  },
];

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const productHref = (slug: string) => `/products/${slug}`;
