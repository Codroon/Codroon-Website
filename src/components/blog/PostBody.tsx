import { SemanticComparisonTable } from "@/components/services/SemanticComparisonTable";
import type { Block, PostSection } from "@/content/blog/types";

/**
 * PostBody — renders a post's sections.
 *
 * THE OLD TEMPLATE BUG THIS REPLACES: on the current live blog, H2s
 * render AFTER the content they introduce and "By Codroon / Top Author"
 * blocks are injected into the middle of paragraphs. Both were
 * structural. Here a section owns its heading and emits it FIRST, and
 * nothing but the section's own blocks is ever emitted between them —
 * there is no injection point, by construction.
 *
 * Every block is server-rendered. Nothing here is a client component.
 */

/* ---- individual blocks ---- */

function Callout({ paragraphs }: { paragraphs: string[] }) {
  return (
    <aside className="my-10 border-l-2 border-accent bg-surface py-5 pl-6 pr-5">
      {paragraphs.map((p, i) => (
        <p key={i} className={i > 0 ? "text-body mt-4 text-foreground" : "text-body text-foreground"}>
          {p}
        </p>
      ))}
    </aside>
  );
}

function StepList({ steps }: { steps: Array<{ title: string; body: string }> }) {
  return (
    // Numbered, no cards. The numeral is decorative (the <ol> already
    // conveys order to assistive tech), so it is aria-hidden.
    <ol className="my-10 space-y-8">
      {steps.map((s, i) => (
        <li key={s.title} className="flex gap-5">
          <span
            aria-hidden
            className="text-mono mt-1 shrink-0 text-sm text-muted-foreground"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="font-sans text-lg font-semibold text-foreground">{s.title}</h3>
            <p className="text-body mt-2 text-muted-foreground">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "prose":
      return (
        <>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="text-body mt-5 text-muted-foreground first:mt-0">
              {p}
            </p>
          ))}
        </>
      );

    case "subheading":
      // H3 under the section's H2 — no level skip, and never in the TOC
      return (
        <h3 className="mt-10 font-sans text-xl font-semibold text-foreground">
          {block.text}
        </h3>
      );

    case "list":
      return (
        <ul className="mt-5 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-body text-muted-foreground">
              <span aria-hidden className="mt-[0.7em] size-1 shrink-0 rounded-full bg-accent-dim" />
              <span className="min-w-0">{item}</span>
            </li>
          ))}
        </ul>
      );

    case "table":
      return (
        <div className="my-10">
          <SemanticComparisonTable
            caption={block.caption}
            columns={block.columns}
            rows={block.rows}
            cornerHeader={block.cornerHeader}
            highlightColumn={block.highlightColumn ?? -1}
          />
          <p className="text-small mt-3 text-tertiary sm:hidden">
            Scroll the table sideways to see every column.
          </p>
        </div>
      );

    case "callout":
      return <Callout paragraphs={block.paragraphs} />;

    case "steps":
      return <StepList steps={block.steps} />;
  }
}

/* ---- the body ---- */

export function PostBody({ sections }: { sections: PostSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={`${section.id}-h`}
          className="mt-14 scroll-mt-28 first:mt-0"
        >
          {/* heading FIRST, always — see the note at the top of this file */}
          <h2
            id={`${section.id}-h`}
            className="font-sans text-2xl font-semibold leading-snug text-foreground sm:text-[1.75rem]"
          >
            {section.heading}
          </h2>
          <div className="mt-5">
            {section.blocks.map((block, i) => (
              <BlockView key={i} block={block} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default PostBody;
