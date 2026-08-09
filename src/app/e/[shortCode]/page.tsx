import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SharedEstimate } from "@/components/tools/estimator/SharedEstimate";
import { fetchEstimate, isShortCode } from "@/lib/supabase/estimates";
import type { PricingSnapshot } from "@/pricing/calculate";
import type { Answers } from "@/pricing/types";

/**
 * A shared estimate, server-rendered from the stored snapshot.
 *
 * noindex/nofollow: a short code is a bearer capability — anyone
 * holding it can read and write that estimate — so these must never
 * reach a search index. Every outbound link on this page carries
 * rel="noreferrer" for the same reason: a code sitting in a Referer
 * header is the same leak by a quieter route.
 */

export const metadata: Metadata = {
  title: "Shared estimate | Codroon",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

// always read the current stored row
export const dynamic = "force-dynamic";

type StoredComputed = {
  snapshot?: PricingSnapshot;
  display?: { eyebrow: string; metaLine: string; panelLabel: string } | null;
  /**
   * The cut selection in force when the estimate was saved.
   * useEstimatorFlow has always written this; this page simply never
   * read it, so every share link rendered at zero cuts and quoted a
   * higher price than the one the sender saw.
   */
  cuts?: string[];
};

export default async function SharedEstimatePage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;

  // Malformed codes never reach the database.
  if (!isShortCode(shortCode.toLowerCase())) notFound();

  const row = await fetchEstimate(shortCode.toLowerCase());
  if (!row) notFound();

  const computed = (row.computed ?? {}) as StoredComputed;
  // An estimate that was abandoned before the type question has no
  // snapshot to render — treat it as not found rather than showing an
  // empty shell.
  if (!computed.snapshot) notFound();

  return (
    <Container>
      <SharedEstimate
        tool={row.tool}
        snapshot={computed.snapshot}
        answers={row.answers as Answers}
        display={computed.display ?? null}
        initialCuts={Array.isArray(computed.cuts) ? computed.cuts : []}
        // Without this the CTAs on a forwarded estimate posted no short
        // code: the quote lead was rejected by the empty-row guard and
        // the estimate email could not be built, so the visitor was
        // told it had been sent when nothing was.
        shortCode={shortCode.toLowerCase()}
      />
    </Container>
  );
}
