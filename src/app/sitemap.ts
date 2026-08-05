import type { MetadataRoute } from "next";
import { SERVICES, serviceHref } from "@/config/services";
import { PRODUCTS, productHref } from "@/components/Home/Products/data";
import { getAllPosts, postHref } from "@/content/blog";
import { absoluteUrl } from "@/lib/seo";

/** All routes of the new site. */
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

  return [
    ...staticPaths.map((path) => ({
      url: absoluteUrl(path),
      lastModified: new Date(),
      priority: path === "/" ? 1 : 0.6,
    })),
    ...SERVICES.map((s) => ({
      url: absoluteUrl(serviceHref(s.slug)),
      lastModified: new Date(),
      priority: 0.8,
    })),
    ...PRODUCTS.map((p) => ({
      url: absoluteUrl(productHref(p.slug)),
      lastModified: new Date(),
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
