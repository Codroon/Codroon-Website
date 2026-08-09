import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE } from "@/config/site";

/**
 * robots.txt, host-aware.
 *
 * WHY THE HOST CHECK. Every Vercel project keeps a permanent
 * <project>.vercel.app alias alongside the real domain, and it serves
 * the identical site. With a blanket Allow that alias is a second
 * crawlable copy of everything. Canonicals normally consolidate the
 * two, but they only work if the canonical target resolves, so during
 * the window before a domain is attached the duplicate is the ONLY
 * live copy. Anything that is not the canonical host now refuses the
 * whole site.
 *
 * WHY /tools/*&#47;estimate IS NO LONGER DISALLOWED. Those pages carry
 * `robots: { index: false }` in their metadata, and a disallowed URL
 * can never be fetched, so the crawler never reads the noindex it is
 * meant to obey. Disallow and noindex on the same URL cancel each
 * other out: the URL can still be indexed from links alone, showing a
 * bare title and no description. They are internally linked, so
 * letting the crawler in to read the noindex is what actually keeps
 * them out of the index.
 *
 * /e/ KEEPS ITS DISALLOW, and that is deliberate even though the same
 * argument applies. A short code is a bearer capability: anyone
 * holding the URL can read the estimate. Those URLs are never linked
 * from the site, so there is no link path to index them from, and the
 * cost of a crawler fetching one is leaking the code into logs and
 * referrers. The route also sends `X-Robots-Tag: noindex, nofollow`
 * (see next.config.mjs) so a crawler that reaches one anyway is told
 * not to index it without having to be let in first.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  // Compare registrable hosts, not literal ones. Whether the domain is
  // attached apex-primary or www-primary is a dashboard choice made at
  // cutover, and a strict string compare would answer "Disallow: /" for
  // the entire real site if that choice went the other way. Delisting
  // by accident is far worse than briefly allowing the www copy, which
  // the canonical tags consolidate anyway.
  const bare = (h: string) => h.split(":")[0].replace(/^www\./, "").toLowerCase();

  const canonicalHost = bare(new URL(SITE.url).hostname);
  const requestHost = bare((await headers()).get("host") ?? "");

  // Only gate when we can actually read a host, so a missing header
  // fails open to the normal rules rather than delisting the site.
  const isPreview = Boolean(requestHost) && requestHost !== canonicalHost;

  if (isPreview) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/e/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
