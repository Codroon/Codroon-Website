import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Shared estimates and in-progress estimator sessions are one
      // visitor's answers, not pages. Both also carry a short code,
      // which is a bearer capability — it must not be indexed.
      disallow: ["/e/", "/tools/*/estimate"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
