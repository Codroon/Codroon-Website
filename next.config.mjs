import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray package-lock.json in the home dir
  // otherwise makes Turbopack guess wrong).
  turbopack: { root: __dirname },

  async redirects() {
    return [
      // Permanent redirects — these URLs exist on the current live site
      // and must not 404 after deploy. (`permanent: true` issues a 308,
      // the modern equivalent of a 301; search engines treat both as
      // permanent.)
      // /products is hidden for now (client, 2026-08-04) and 404s in
      // production, so these two land on the landing page's products
      // section instead — the browser keeps the fragment across a
      // redirect. Point them back at /products if the index returns.
      { source: "/case-studies", destination: "/#products", permanent: true },
      { source: "/codroon-ninja-ai", destination: "/#products", permanent: true },

      // ---- old-build pages deleted in the 2026-08-04 cleanup. Each was
      // a live URL (or plausibly one — the old deployment's nav can no
      // longer be inspected, and a redirect for a URL that never existed
      // costs nothing, while a 404 on one that did costs the signal).
      { source: "/contact-us", destination: "/", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
      { source: "/industries", destination: "/services", permanent: true },
      { source: "/solutions", destination: "/services", permanent: true },
      { source: "/our-solutions", destination: "/services", permanent: true },
      { source: "/technologies", destination: "/services", permanent: true },
      { source: "/process", destination: "/about", permanent: true },
      { source: "/how-we-work", destination: "/about", permanent: true },
      // /careers was a real route on the old deployment: a7a97d3
      // deleted src/app/careers/page.js along with its assets. Every
      // other route deleted in that commit got a redirect and this one
      // was missed, so it was the only old URL still 404ing. /about is
      // the closest live page; there is no careers page in the rebuild.
      { source: "/careers", destination: "/about", permanent: true },

      // /services has NO index page in the rebuild (only /services/[slug]),
      // so the four rules above would land on a 404 without this. It sends
      // people to the services section of the landing page — the browser
      // keeps the fragment across the redirect. If a real /services index
      // is ever built, delete this line and the page takes over.
      { source: "/services", destination: "/#services", permanent: true },

      // The old About lived at /who-we-are and was serving 200. The
      // route was deleted 2026-08-03 in favour of /about; deleting an
      // indexed URL without a redirect just moves the 404 somewhere new.
      { source: "/who-we-are", destination: "/about", permanent: true },

      // ---- old /blogs URLs. All indexed; without these the rewrite
      // ships 404s on live pages. Slugs supplied by the client and
      // cross-checked against each deck's "Replaces:" line.
      {
        source: "/blogs/antigravity-google-vs-cursor-ai-the-future-of-coding-feels-different-now",
        destination: "/blog/google-antigravity-vs-cursor",
        permanent: true,
      },
      {
        source: "/blogs/vercel-render-aws-a-developer-s-honest-deployment-guide",
        destination: "/blog/vercel-vs-render-vs-aws",
        permanent: true,
      },
      {
        source: "/blogs/why-developers-are-moving-from-make-to-n8n-and-when-you-shouldn-t",
        destination: "/blog/make-to-n8n-migration",
        permanent: true,
      },
      {
        source:
          "/blogs/custom-ecommerce-vs-shopify-wordpress-choosing-the-right-canvas-for-your-store",
        destination: "/blog/custom-ecommerce-vs-shopify",
        permanent: true,
      },
      {
        source: "/blogs/stitch-by-google-and-figma-what-it-gets-right-and-where-it-s-just-fine",
        destination: "/blog/google-stitch-vs-figma",
        permanent: true,
      },
      {
        source: "/blogs/top-10-tools-every-saas-founder-should-know-in-2026",
        destination: "/blog/saas-founder-tools-2026",
        permanent: true,
      },
      {
        source: "/blogs/auto-seo-explained-how-ai-learns-who-you-are-and-markets-you-better",
        destination: "/blog/how-to-rank-in-ai-search",
        permanent: true,
      },
      {
        source: "/blogs/inside-codroon-the-texas-software-studio-that-builds-with-purpose",
        destination: "/about",
        permanent: true,
      },
      { source: "/blogs", destination: "/blog", permanent: true },

      // Catch-all LAST, so the eight specific rules above win. Any old
      // post not in that list still lands on the index instead of a
      // 404. ⚠️ At least one such post exists ("Emergent Labs vs
      // Lovable AI"); the client decides whether it gets its own
      // destination, and until then this is the safe default.
      { source: "/blogs/:slug", destination: "/blog", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        /* Site-wide baseline. Cheap, no behaviour change, and none of
           them can break a third party the way a CSP can.
           CSP is deliberately NOT here yet: the site embeds Calendly
           and loads three analytics vendors, so it needs a
           report-only run first to find what it would break. */
        source: "/:path*",
        headers: [
          // stop a browser second-guessing a declared Content-Type,
          // which is how a served file becomes an executed script
          { key: "X-Content-Type-Options", value: "nosniff" },
          // send the origin cross-site, the full path same-site. Keeps
          // referral analytics working without leaking paths, which
          // matters most for /e/<code>: the code IS the capability.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // nothing here is meant to be framed
          { key: "X-Frame-Options", value: "DENY" },
          // decline hardware the site never asks for, so an embedded
          // third party cannot prompt for it in our name
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()",
          },
        ],
      },
      {
        // A short code is a bearer capability, so these must never be
        // indexed. robots.txt still disallows /e/, but a Disallow only
        // stops a well-behaved crawler that reads robots.txt first, and
        // it cannot stop a URL being indexed from a link elsewhere. The
        // header travels with the response and needs no cooperation.
        //
        // This backs up the per-page `robots` metadata rather than
        // replacing it: the metadata covers the rendered page, the
        // header covers every response from the route including
        // redirects and errors.
        source: "/e/:shortCode",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
