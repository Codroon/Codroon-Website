import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";

/**
 * FONT PRIORITY. Mobile LCP failed on every page while desktop scored
 * 100, and the cause was discovery order, not weight (client,
 * 2026-08-09).
 *
 * Bricolage arrived as a plain CSS import from @fontsource-variable, so
 * the browser could not see it until the stylesheet had been fetched
 * and parsed: it started ~270ms after the two Geist faces and was the
 * largest asset on every run. Meanwhile GeistMono, which sets eyebrows
 * and figures and never the LCP element, was auto-preloaded at high
 * priority because next/font does that by default.
 *
 * Self-hosting through next/font/local inverts that. Next emits the
 * preload link for the display face itself, with a hashed immutable
 * URL, so it is discovered with the document. The mono face keeps its
 * variable but opts out of preloading.
 *
 * "standard" is the multi-axis file: wght 200-800, wdth 75-100 and
 * opsz. The single-axis build is a third of the size but drops the
 * optical-size axis, which is most of the reason for this typeface, so
 * that trade stays a design decision rather than a silent one.
 */
const bricolage = localFont({
  src: "../fonts/bricolage-grotesque-latin-standard-normal.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  // metric-matched fallback: without one the display face swapping in
  // shifted the h1 on every hero page
  adjustFontFallback: "Arial",
});

const GeistMono = localFont({
  src: "../fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  adjustFontFallback: false,
  // never the LCP element: it sets eyebrows, figures and small labels.
  // Preloading it was competing with the face that paints the headline.
  preload: false,
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Roboto Mono",
    "Menlo",
    "Monaco",
    "Liberation Mono",
    "DejaVu Sans Mono",
    "Courier New",
    "monospace",
  ],
});
import Header from "@/components/navbar";
import Footer from "@/components/footer";
import Providers from "@/components/Providers";
import { SITE } from "@/config/site";
import {
  jsonLdString,
  localBusinessJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // ~57 chars: primary service + geo modifier
  title: SITE.title,
  // ~155 chars — unique to the meta description (og/twitter differ)
  description: SITE.description,
  // NOTE: canonical is set per page (layout-level alternates would be
  // inherited as canonical "/" by pages that don't override them).
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    // Same string as <title>. They used to disagree: the tab and the
    // search result said "AI Agent Development & MVP Studio | Dallas,
    // TX | Codroon" while every shared link and preview card said
    // "Codroon | AI-Native Software Studio in Dallas, TX" (client,
    // 2026-08-09). SITE.title wins because it leads with the service
    // rather than the brand, which is what someone is searching for.
    // The DESCRIPTIONS stay deliberately different: a meta description
    // is read in a result list and an og description on a card, and
    // they are doing different jobs at different lengths.
    title: SITE.title,
    description:
      "AI agents, MVPs and custom software for founders and small teams. Planned on a free discovery call and shipped in weeks, not months.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Codroon, an AI-native software studio. Ship your AI product in weeks, not months.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    // matches <title> and og:title, for the same reason
    title: SITE.title,
    description:
      "AI agents, MVPs and custom software for founders, shipped in weeks. Book a free discovery call.",
    images: ["/og.png"],
  },
  // icons come from the app-dir conventions (favicon.ico, icon.png,
  // apple-icon.png beside this file) — the old explicit entry pointed
  // at /cordroon-icon.png, which didn't exist.
};

export const viewport: Viewport = {
  themeColor: "#1a1917",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable} ${bricolage.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(webSiteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(localBusinessJsonLd()) }}
        />
        {/* Skip link. The header has eight controls before the content
            starts, so without this a keyboard or switch user tabs
            through all of them on every single page (client,
            2026-08-09). Visually hidden until focused, then it lands
            in the top-left as a normal accent button.

            First focusable element in the body on purpose: a skip link
            that is not first has nothing to skip. */}
        <a
          href="#main"
          className="sr-only rounded-[var(--radius-sm)] bg-accent px-4 py-2 font-medium text-accent-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200]"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          {/* tabIndex={-1} so the skip link can move focus here, not
              just scroll to it: without it the browser scrolls but
              focus stays in the header and the next Tab goes back to
              the nav. */}
          <main id="main" tabIndex={-1} className="min-h-screen outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
