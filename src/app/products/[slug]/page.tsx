import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CtaButton } from "@/components/contact/CtaButton";
import {
  PRODUCTS,
  getProduct,
  productHref,
} from "@/components/Home/Products/data";
import { getProductContent } from "@/content/products";
import { ProductPageTemplate } from "@/components/products/ProductPageTemplate";
import { absoluteUrl, breadcrumbJsonLd, jsonLdString, pageOpenGraph } from "@/lib/seo";

/**
 * Product route — two tiers, same shape as services:
 *  - a slug WITH a copy module (content/products/*) renders the full
 *    ProductPageTemplate;
 *  - a slug without one renders the stub below and stays out of the
 *    index until its deck exists.
 *
 * TODO (per in-development product): copy deck, screenshots, live link.
 */

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  // Full copy module → meta comes verbatim from the page's deck
  // (title/description and OG title/description differ by design).
  const content = getProductContent(slug);
  if (content && !content.meta.noindex) {
    return {
      title: content.meta.title,
      description: content.meta.description,
      alternates: { canonical: absoluteUrl(productHref(slug)) },
      openGraph: pageOpenGraph(
        productHref(slug),
        content.meta.ogTitle,
        content.meta.ogDescription
      ),
      twitter: {
        card: "summary_large_image",
        title: content.meta.ogTitle,
        description: content.meta.ogDescription,
        images: ["/og.png"],
      },
    };
  }

  // No deck yet (or explicitly held back) → routed, but never indexed.
  const description =
    product.descriptor ?? `${product.name} — a product built and shipped by Codroon.`;
  return {
    title: `${product.name} | Codroon`,
    description,
    robots: { index: false },
    alternates: { canonical: absoluteUrl(productHref(product.slug)) },
    openGraph: pageOpenGraph(
      productHref(product.slug),
      `${product.name} | Codroon`,
      description
    ),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const content = getProductContent(slug);
  if (content) {
    return <ProductPageTemplate product={product} content={content} />;
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            // No "Products" crumb while /products is hidden — see the
            // note in ProductPageTemplate.
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: product.name, path: productHref(product.slug) },
            ])
          ),
        }}
      />
      <Section as="article" className="pt-36 sm:pt-40">
        <nav aria-label="Breadcrumb" className="text-small text-tertiary">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </li>
            {/* the Products crumb is gone while the index is hidden —
                it would have been a link to a 404 */}
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-muted-foreground">
              {product.name}
            </li>
          </ol>
        </nav>

        <h1 className="text-h1 mt-8 text-foreground">{product.name}</h1>
        {product.descriptor && (
          <p className="text-body-lg mt-5 max-w-2xl text-muted-foreground">
            {product.descriptor}
          </p>
        )}

        {/* TODO: full product page — real copy, screenshots, metrics. */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          {product.liveUrl && (
            <Button
              href={product.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Visit the live product
              <ArrowUpRight className="size-[1.1em]" aria-hidden />
            </Button>
          )}
          <CtaButton size="lg" variant={product.liveUrl ? "secondary" : "primary"}>
            Build something like this
            <ArrowRight className="size-[1.1em]" aria-hidden />
          </CtaButton>
        </div>
      </Section>
    </>
  );
}
