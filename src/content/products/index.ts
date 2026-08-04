import type { ProductPageContent } from "./types";
import { replydude } from "./replydude";
import { decipherEngine } from "./decipher-engine";

/**
 * Product content registry — slug → copy module.
 *
 * Same two-tier split as services: routing/identity lives in
 * components/Home/Products/data.ts (PRODUCTS), long-form copy lives here.
 * A slug with no module still routes; it renders the lightweight stub in
 * app/products/[slug]/page.tsx instead of 404ing.
 */
const REGISTRY: Record<string, ProductPageContent> = {
  [replydude.slug]: replydude,
  [decipherEngine.slug]: decipherEngine,
};

export const getProductContent = (slug: string): ProductPageContent | null =>
  REGISTRY[slug] ?? null;

export type { ProductPageContent } from "./types";
