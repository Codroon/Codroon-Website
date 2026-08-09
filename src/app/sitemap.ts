import type { MetadataRoute } from "next";
import { SERVICES, serviceHref } from "@/config/services";
import { PRODUCTS, productHref } from "@/components/Home/Products/data";
import { getProductContent } from "@/content/products";
import { getAllPosts, postHref } from "@/content/blog";
import { absoluteUrl } from "@/lib/seo";

/**
 * All indexable routes of the new site.
 *
 * TWO RULES, both learned the hard way:
 *
 * 1. Never list a URL this site tells crawlers not to index. Search
 *    Console reports that as "Submitted URL marked noindex" against the
 *    sitemap, which is a red error on a page nobody wanted indexed
 *    anyway. The product route decides indexability by whether a copy
 *    deck exists, so this file asks the same question rather than
 *    keeping its own list that can drift out of step.
 *
 * 2. lastModified must mean something. It used to be `new Date()` on
 *    every entry, which told crawlers all 18 static, service and
 *    product pages changed on every deploy. A date that is always
 *    "now" carries no signal and trains crawlers to ignore it, so
 *    entries with no real content date simply omit the field. Blog
 *    posts keep theirs because they have a hand-maintained updatedAt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    // /products is hidden for now (client, 2026-08-04) and 404s in
    // production. The individual product pages below are unaffected.
    "/blog",
    "/about",
    // /careers deleted on 2026-08-04 (client) — listing a 404 in the
    // sitemap is a crawl error, so it comes out here too.
    "/tools/ai-agent-cost-calculator",
    "/tools/mvp-cost-calculator",
    "/privacy",
    "/terms",
  ];

  // Same test the route uses at src/app/products/[slug]/page.tsx: a
  // product with no content module renders a stub and sets
  // robots: { index: false }.
  const indexableProducts = PRODUCTS.filter((p) => getProductContent(p.slug));

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      priority: path === "/" ? 1 : 0.6,
    })),
    ...SERVICES.map((s) => ({
      url: absoluteUrl(serviceHref(s.slug)),
      priority: 0.8,
    })),
    ...indexableProducts.map((p) => ({
      url: absoluteUrl(productHref(p.slug)),
      priority: 0.7,
    })),
    // lastModified is the post's own updatedAt, not the build time:
    // a crawler should not be told every post changed on every deploy.
    ...getAllPosts().map((p) => ({
      url: absoluteUrl(postHref(p.slug)),
      lastModified: new Date(`${p.updatedAt}T00:00:00Z`),
      priority: 0.7,
    })),
  ];
}
