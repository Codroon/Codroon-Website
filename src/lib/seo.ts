import { SITE } from "@/config/site";
import { SERVICES, serviceHref, type Service } from "@/config/services";

/** Absolute URL on the canonical origin (consistent non-www). */
export const absoluteUrl = (path = "/") =>
  new URL(path, SITE.url).toString();

/* ------------------------------------------------------------------
   JSON-LD builders. Render with:
   <script type="application/ld+json"
     dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }} />
   ------------------------------------------------------------------ */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    logo: absoluteUrl("/codroon-logo.png"),
    // telephone and streetAddress appear the moment the real values land
    // in config/site.ts. They are NEVER faked: a wrong NAP is worse for
    // local ranking than an absent one.
    ...(SITE.phone ? { telephone: SITE.phone } : null),
    address: {
      "@type": "PostalAddress",
      ...(SITE.address.street ? { streetAddress: SITE.address.street } : null),
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    // ProfessionalService is a LocalBusiness subtype, so this IS the
    // site's LocalBusiness markup. Emitted from the root layout, which
    // means /about carries it without a second, duplicate node.
    "@type": "ProfessionalService",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    // ⚠️ TODO: a verified Google Business Profile, a US phone number,
    // consistent NAP across directories, and reviews are what actually
    // drive local ranking. None exist yet, and no amount of on-page
    // repetition substitutes for them.
    ...(SITE.phone ? { telephone: SITE.phone } : null),
    // primary address = the head office
    address: {
      "@type": "PostalAddress",
      ...(SITE.address.street ? { streetAddress: SITE.address.street } : null),
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    // every office, so the second location is discoverable too. Street
    // lines appear the moment they exist in config/site.ts.
    location: SITE.offices.map((o) => ({
      "@type": "Place",
      name: o.headOffice ? `${SITE.name} (head office)` : SITE.name,
      address: {
        "@type": "PostalAddress",
        ...(o.street ? { streetAddress: o.street } : null),
        addressLocality: o.locality,
        ...(o.region ? { addressRegion: o.region } : null),
        addressCountry: o.country,
      },
    })),
    areaServed: "US",
    makesOffer: SERVICES.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.name, url: absoluteUrl(serviceHref(s.slug)) },
    })),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(serviceHref(service.slug)),
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    areaServed: "US",
  };
}

/** WebApplication schema for free on-site tools. */
export function webApplicationJsonLd(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

/** DefinedTermSet schema — MUST be fed the same terms the page renders. */
export function definedTermSetJsonLd(opts: {
  name: string;
  path: string;
  terms: Array<{ term: string; definition: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: opts.name,
    url: absoluteUrl(opts.path),
    hasDefinedTerm: opts.terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
    })),
  };
}

/** FAQPage schema — MUST be fed the same objects the page renders. */
export function faqPageJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Article schema for a single post. Author is required for E-E-A-T. */
export function articleJsonLd(opts: {
  headline: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt: string;
  imagePath: string;
  author: { name: string; url?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(opts.path) },
    url: absoluteUrl(opts.path),
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt,
    image: [absoluteUrl(opts.imagePath)],
    author: {
      "@type": "Person",
      name: opts.author.name,
      ...(opts.author.url ? { url: opts.author.url } : null),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/codroon-logo.png") },
    },
  };
}

/**
 * Blog schema for /blog. `blogPost` carries the listing entries so the
 * index describes its own contents rather than being an empty node.
 */
export function blogJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  posts: Array<{
    title: string;
    description: string;
    path: string;
    publishedAt: string;
    updatedAt: string;
    /** omitted until the author system lands; Article schema carries it */
    authorName?: string;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
    blogPost: opts.posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: absoluteUrl(p.path),
      datePublished: p.publishedAt,
      dateModified: p.updatedAt,
      ...(p.authorName
        ? { author: { "@type": "Person", name: p.authorName } }
        : null),
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Serialize JSON-LD for a <script> tag (escapes `<` to be safe). */
export const jsonLdString = (data: unknown) =>
  JSON.stringify(data).replace(/</g, "\\u003c");

/* ------------------------------------------------------------------
   Open Graph — Next.js REPLACES the layout's openGraph object wholesale
   (no deep merge), so every page-level openGraph must carry the full
   set including images. Use pageOpenGraph() to avoid dropping og:image.
   ------------------------------------------------------------------ */

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Codroon, an AI-native software studio. Ship your AI product in weeks, not months.",
};

export function pageOpenGraph(path: string, title: string, description: string) {
  return {
    type: "website" as const,
    url: absoluteUrl(path),
    siteName: SITE.name,
    title,
    description,
    images: [OG_IMAGE],
  };
}
