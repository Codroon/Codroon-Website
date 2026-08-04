import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

/**
 * A short code that does not resolve. Estimates expire after 24 months,
 * and codes get mistyped — either way, point at the tools rather than
 * at a dead end.
 */
export default function SharedEstimateNotFound() {
  return (
    <Section className="pt-36 sm:pt-40">
      <Eyebrow>Shared estimate</Eyebrow>
      <h1 className="text-h1 mt-5 max-w-3xl text-foreground">
        That estimate isn&rsquo;t here.
      </h1>
      <p className="text-body-lg mt-6 max-w-xl text-muted-foreground">
        The link may be mistyped, or the estimate may have expired. We keep
        anonymous estimates for 24 months. Running a fresh one takes about three
        minutes.
      </p>
      {/* noreferrer: the mistyped code is still in this page's URL */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button href="/tools/mvp-cost-calculator/estimate" rel="noreferrer">
          Estimate an MVP
        </Button>
        <Button
          href="/tools/ai-agent-cost-calculator/estimate"
          variant="secondary"
          rel="noreferrer"
        >
          Estimate an AI agent
        </Button>
      </div>
    </Section>
  );
}
