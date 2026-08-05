import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductCard } from "@/components/Home/Products/ProductCard";
import { PRODUCTS } from "@/components/Home/Products/data";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOpenGraph } from "@/lib/seo";

const DESCRIPTION =
  "Products built and shipped by Codroon: ReplyDude and Decipher Engine. Proof the studio ships real software, fast.";

/**
 * ⚠️ HIDDEN IN PRODUCTION (client, 2026-08-04) — "hide the products page
 * for now". The page still builds and works in development; it 404s on
 * the live site, the same gate as /styleguide and /dev/emails.
 *
 * Nothing points here any more: the landing CTA opens the contact modal
 * instead, the two legacy redirects (/case-studies, /codroon-ninja-ai)
 * go to /#products, the sitemap entry is gone, and the product pages'
 * breadcrumbs no longer carry a Products crumb. Un-hiding is deleting
 * the notFound() line and putting those four back.
 *
 * The individual product pages are NOT affected — they stay live and in
 * the nav.
 */
export const metadata: Metadata = {
  title: "Products | Codroon",
  description: DESCRIPTION,
  // hidden, so it must not be indexed even if someone reaches it
  robots: { index: false, follow: false },
  alternates: { canonical: absoluteUrl("/products") },
  openGraph: pageOpenGraph("/products", "Products | Codroon", DESCRIPTION),
};

/** All products — same 2-up card grid as the homepage section. */
export default function ProductsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
            ])
          ),
        }}
      />
      <Section className="pt-36 sm:pt-40">
        <Eyebrow>Products</Eyebrow>
        <h1 className="text-h1 mt-5 max-w-2xl text-foreground">
          Products we&apos;ve shipped.
        </h1>

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </ul>
      </Section>
    </>
  );
}
