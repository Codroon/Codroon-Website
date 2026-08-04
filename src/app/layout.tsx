import "./globals.css";
// The DISPLAY face. "standard" is the multi-axis file: wght 200-800,
// wdth 75-100 and opsz. The single-axis index.css would drop the
// optical-size axis, which is most of the reason for this font.
import "@fontsource-variable/bricolage-grotesque/standard.css";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
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
    title: "Codroon | AI-Native Software Studio in Dallas, TX",
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
    title: "Codroon | AI-Native Software Studio in Dallas, TX",
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
      className={`${GeistSans.variable} ${GeistMono.variable}`}
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
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
