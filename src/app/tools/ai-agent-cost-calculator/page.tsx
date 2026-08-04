import type { Metadata } from "next";
import { ToolLandingTemplate } from "@/components/tools/ToolLandingTemplate";
import { aiAgentCostCalculator as content } from "@/content/tools/ai-agent-cost-calculator";
import { absoluteUrl, pageOpenGraph } from "@/lib/seo";

/**
 * AI Agent Cost Calculator — LANDING page (the estimator flow lives at
 * ./estimate). All copy verbatim from the approved deck; the product
 * is branded "Estimator" (H1) while the URL/title/H2s keep
 * "calculator", both on purpose.
 */

const PATH = "/tools/ai-agent-cost-calculator";

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  alternates: { canonical: absoluteUrl(PATH) },
  openGraph: pageOpenGraph(PATH, content.meta.ogTitle, content.meta.ogDescription),
  twitter: {
    card: "summary_large_image",
    title: content.meta.ogTitle,
    description: content.meta.ogDescription,
    images: ["/og.png"],
  },
};

export default function AgentCostCalculatorPage() {
  return <ToolLandingTemplate path={PATH} content={content} />;
}
