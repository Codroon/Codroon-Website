import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductCard } from "@/components/Home/Products/ProductCard";
import { PRODUCTS } from "@/components/Home/Products/data";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOpenGraph } from "@/lib/seo";

const DESCRIPTION =
  "Products built and shipped by Codroon: ReplyDude and Decipher Engine. Proof the studio ships real software, fast.";

export const metadata: Metadata = {
  title: "Products | Codroon",
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/products") },
  openGraph: pageOpenGraph("/products", "Products | Codroon", DESCRIPTION),
};

/** All products — same 2-up card grid as the homepage section. */
export default function ProductsPage() {
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
