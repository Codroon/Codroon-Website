import { AccordionRows } from "./AccordionRows";
import { faqPageJsonLd, jsonLdString } from "@/lib/seo";
import type { FaqItem } from "@/content/services/types";

/**
 * FaqSection — heading + optional quick-answers prose + accordion,
 * with FAQPage JSON-LD generated from the SAME items the accordion
 * renders (drift is impossible). Shared by service pages and tool
 * landing pages; the caller wraps it in a <Section>.
 */
export function FaqSection({
  heading,
  quickAnswers,
  items,
}: {
  heading: string;
  quickAnswers?: string;
  items: FaqItem[];
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqPageJsonLd(items)) }}
      />
      <h2 className="text-h2 max-w-2xl text-foreground">{heading}</h2>
      {quickAnswers && (
        <p className="text-body-lg mt-6 max-w-3xl text-muted-foreground">{quickAnswers}</p>
      )}
      <div className="mt-10">
        <AccordionRows
          items={items.map((item) => ({
            id: item.q,
            heading: item.q,
            content: item.a,
          }))}
        />
      </div>
    </>
  );
}

export default FaqSection;
