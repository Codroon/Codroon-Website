import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { productHref, type Product } from "./data";

/**
 * ProductCard — screenshot filling the card top, inline metric row
 * beneath the image, bold title, short descriptor, "VIEW PRODUCT →".
 * Real content only: missing screenshot/descriptor/metrics are omitted
 * (TODOs live in data.ts), never faked.
 *
 * TWO destinations per card (client, 2026-08-04):
 *   · the HEADING is the live domain — "Replydude.ai",
 *     "Decipherengine.ai" — and opens that site in a new tab
 *   · everything else, including "View Product", goes to the product
 *     page on this site
 *
 * The heading is the domain rather than the product name because the
 * card already says what the product is twice below it, in the
 * descriptor and the description. The product name still reaches
 * assistive tech through the screenshot alt text and the View Product
 * link's accessible name.
 *
 * That is why the stretched anchor moved. It used to hang off the name;
 * a card-wide overlay belonging to the external link would have sent
 * every click — "View Product" included — off-site. Now "View Product"
 * carries the ::after overlay, so the whole card still navigates to the
 * product page, and the name sits above it on z-10 with its own link.
 *
 * When a product has no verified liveUrl the name falls back to the
 * product page, so the card never renders a dead external link.
 */
export function ProductCard({ product }: { product: Product }) {
  const href = productHref(product.slug);

  return (
    <li className="h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition-colors duration-300 hover:border-border-strong">
        {/* media — screenshot fills the card top */}
        <div className="relative aspect-[16/9] w-full border-b border-border bg-surface-raised">
          {product.screenshot ? (
            <Image
              src={product.screenshot}
              alt={`${product.name} product screenshot`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-top"
            />
          ) : (
            /* TODO: real screenshot — empty media frame until one exists */
            <div aria-hidden className="hero-dotgrid !inset-0" />
          )}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          {/* metric row — real, verified numbers only */}
          {product.metrics && product.metrics.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-5">
              {product.metrics.map((m) => (
                <li key={m.label}>
                  <span className="text-mono block text-xl text-foreground">{m.value}</span>
                  <span className="text-small block text-muted-foreground">{m.label}</span>
                </li>
              ))}
            </ul>
          )}

          <h3 className="font-sans text-2xl font-semibold text-foreground">
            {product.liveUrl ? (
              // relative z-10 lifts the name above the card-wide overlay
              // that "View Product" casts, so this link stays clickable
              <a
                href={product.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex w-fit items-center gap-1.5 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                {/* the domain, exactly as the client writes it */}
                {product.liveLabel ?? product.name}
                <ArrowUpRight
                  size={18}
                  aria-hidden
                  className="shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-70"
                />
                {/* the visible text is already the domain, so this only
                    has to say where the link goes */}
                <span className="sr-only">
                  {` — visit the live ${product.name}, opens in a new tab`}
                </span>
              </a>
            ) : (
              product.name
            )}
          </h3>

          {product.descriptor && (
            <p className="mt-2 text-[0.95rem] font-medium text-foreground/90">
              {product.descriptor}
            </p>
          )}
          {product.description && (
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {/* the card's own link: covers every pixel via ::after, and the
              name above it opts out with z-10 */}
          <Link
            href={href}
            className="text-eyebrow mt-auto inline-flex w-fit items-center gap-2 pt-6 text-accent transition-colors after:absolute after:inset-0 group-hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            View Product
            <ArrowRight
              size={13}
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            />
            <span className="sr-only">{` — ${product.name}`}</span>
          </Link>
        </div>
      </div>
    </li>
  );
}

export default ProductCard;
