import { Container } from "@/components/ui/Container";
import { CountUp } from "@/components/ui/CountUp";

import type { ProductStat } from "@/content/products/types";

/**
 * ProductStatsBand — full-bleed accent band carrying a product's
 * headline figures, mirroring the homepage Stats section.
 *
 * The brand sheet permits orange as a surface; ALL text on it is
 * --accent-foreground (#232220) — light-on-orange fails contrast.
 *
 * Only figures that are in the page's copy deck appear here. A product
 * with no defensible numbers renders no band at all, never a band of
 * placeholders.
 */
export function ProductStatsBand({
  stats,
  label,
}: {
  stats: ProductStat[];
  label: string;
}) {
  return (
    <section className="bg-accent py-16 sm:py-20">
      <h2 className="sr-only">{label}</h2>
      <Container width="wide">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.label} className="text-center">
              <span className="text-mono block text-4xl font-medium text-accent-foreground sm:text-5xl">
                {/* counts up on first view, same as the homepage strip
                    (client, 2026-08-02) */}
                <CountUp value={stat.value} />
              </span>
              <span className="mt-2 block text-[0.95rem] text-accent-foreground">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default ProductStatsBand;
