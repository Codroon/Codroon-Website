import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "./ProductCard";
import { FEATURED_PRODUCTS } from "./data";

/**
 * Products — proof that Codroon ships its own real products, as a 2-up
 * card grid (screenshot top, metrics, title, descriptor, VIEW PROJECT).
 * Featured: Decipher Engine + ReplyDude. id="products" — the hero's
 * "See our work" CTA points here. Server-rendered.
 */
export function Products() {
  return (
    <Section id="products" containerWidth="wide">
      <div className="max-w-2xl">
        <Eyebrow>Our products</Eyebrow>
        <h2 className="text-h2 mt-5 text-foreground">
          We ship our own products, too.
        </h2>
        <p className="mt-5 text-body-lg text-muted-foreground">
          Real products, live in the world. Proof that we build fast, and
          build things that last.
        </p>
      </div>

      {/* 2-up grid */}
      <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </ul>

      <div className="mt-12">
        <Button href="/products" variant="secondary" size="lg">
          View all products
        </Button>
      </div>
    </Section>
  );
}

export default Products;
