import { ArrowUpRight } from "lucide-react";

import type { MetaRailField } from "@/content/products/types";

/**
 * ProductMetaRail — the label-above-value spec rail. Sticky beside the
 * content on desktop, stacked underneath it on mobile (the parent grid
 * handles the placement; this only renders the list).
 *
 * Deliberately has no Client or Date field: what matters on a product
 * page is what it's built from, whether it's live, and what Codroon's
 * stake in it is.
 */
export function ProductMetaRail({ fields }: { fields: MetaRailField[] }) {
  return (
    <dl className="divide-y divide-border border-y border-border">
      {fields.map((field) => (
        <div key={field.label} className="py-5">
          <dt className="text-eyebrow text-tertiary">{field.label}</dt>
          <dd className="mt-2.5">
            {field.items ? (
              <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
                {field.items.map((item, i) => (
                  <li
                    key={item}
                    className="text-small text-muted-foreground"
                  >
                    {item}
                    {i < field.items!.length - 1 && (
                      <span aria-hidden className="ml-2 text-border-strong">
                        ·
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : field.href ? (
              <a
                href={field.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-small inline-flex items-center gap-1 text-accent transition-colors hover:text-accent-hover"
              >
                {field.value}
                <ArrowUpRight className="size-[1.1em]" aria-hidden />
              </a>
            ) : field.accent ? (
              // Status: the whole value is accent, version included
              // ("Live · v7.6.1") — client, 2026-08-04.
              <span className="text-small text-accent">{field.value}</span>
            ) : (
              <span className="text-small text-muted-foreground">
                {field.value}
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default ProductMetaRail;
