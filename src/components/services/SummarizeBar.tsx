import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";

/**
 * SummarizeBar — icon row under the hero. Each button deep-links to an
 * AI assistant with a prefilled prompt containing this page's
 * canonical URL. Server-rendered plain links (target=_blank).
 *
 * NOTE: Gemini has no public prompt-prefill deep link, so the Gemini
 * button uses Google AI Mode (udm=50), which is the Google-side
 * equivalent that accepts a prefilled query.
 */

const TARGETS = [
  { name: "ChatGPT", url: (p: string) => `https://chatgpt.com/?q=${p}` },
  { name: "Claude", url: (p: string) => `https://claude.ai/new?q=${p}` },
  { name: "Perplexity", url: (p: string) => `https://www.perplexity.ai/search?q=${p}` },
  { name: "Gemini", url: (p: string) => `https://www.google.com/search?udm=50&q=${p}` },
];

function Targets({ prompt }: { prompt: string }) {
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {TARGETS.map((t) => (
        <li key={t.name}>
          <a
            href={t.url(prompt)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Summarize this page with ${t.name}`}
            className="text-small inline-flex min-h-[44px] items-center rounded-full bg-accent px-4 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            {t.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

/**
 * `variant="rail"` is the same links in a narrow column, for the blog
 * post rail. These deep links are the point rather than decoration —
 * a visitor handing a post to an assistant is the distribution channel
 * — so it sits high on the page where it gets used, not at the foot.
 */
export function SummarizeBar({
  canonicalUrl,
  variant = "bar",
}: {
  canonicalUrl: string;
  variant?: "bar" | "rail";
}) {
  const prompt = encodeURIComponent(`Summarize this page: ${canonicalUrl}`);

  if (variant === "rail") {
    return (
      <section aria-labelledby="summarize-h">
        <h2 id="summarize-h" className="text-eyebrow flex items-center gap-2 text-tertiary">
          <Sparkles size={14} className="text-accent-dim" aria-hidden />
          Summarize with AI
        </h2>
        <div className="mt-4">
          <Targets prompt={prompt} />
        </div>
      </section>
    );
  }

  return (
    <div className="border-y border-border">
      <Container width="wide" className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
        <span className="text-small inline-flex items-center gap-2 text-muted-foreground">
          <Sparkles size={15} className="text-accent-dim" aria-hidden />
          Summarize with AI
        </span>
        <Targets prompt={prompt} />
      </Container>
    </div>
  );
}

export default SummarizeBar;
