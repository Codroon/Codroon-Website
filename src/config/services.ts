/**
 * Services — canonical names and slugs. These strings must match the
 * nav dropdown, the homepage Services grid, the footer and the URLs
 * EXACTLY. Do not paraphrase.
 *
 * Every description follows the entity-first pattern: it opens with
 * "Codroon" plus the exact service phrase.
 */

export type Service = {
  /** Canonical display name — used verbatim everywhere. */
  name: string;
  slug: string;
  /** Entity-first description (2–3 sentences). */
  description: string;
  /** lucide-react icon name, resolved in the card component. */
  icon: "bot" | "sparkles" | "plug" | "rocket" | "layers" | "code";
};

export const SERVICES: Service[] = [
  {
    name: "AI Agent Development Company",
    slug: "ai-agent-development",
    icon: "bot",
    description:
      "Codroon is an AI agent development company that designs and ships production agents around your real workflow, not demos. We handle the reasoning, the tools, the guardrails and the integrations, so the agent does dependable work from day one.",
  },
  {
    name: "Generative AI Development Services",
    slug: "generative-ai-development",
    icon: "sparkles",
    description:
      "Codroon provides generative AI development services that turn models into product features your users actually touch. From retrieval and prompting to evaluation and cost control, we build the full pipeline, grounded in your data.",
  },
  {
    name: "AI Integration Services",
    slug: "ai-integration",
    icon: "plug",
    description:
      "Codroon provides AI integration services that connect AI into the systems you already run: CRMs, help desks, databases and internal tools. Your existing stack stays; the manual steps between systems go.",
  },
  {
    name: "MVP Development Services",
    slug: "mvp-development",
    icon: "rocket",
    description:
      "Codroon provides MVP development services that take founders from idea to a product users can pay for in weeks. We scope ruthlessly, build production-grade from the start, and you own every line of the code.",
  },
  {
    name: "SaaS Development Services",
    slug: "saas-development",
    icon: "layers",
    description:
      "Codroon provides SaaS development services for teams that need multi-tenant products built right: auth, billing, admin and the AI features that set you apart. Architected to scale past the first hundred customers.",
  },
  {
    name: "Custom Software Development Company",
    slug: "custom-software-development",
    icon: "code",
    description:
      "Codroon is a custom software development company for the problems off-the-shelf tools can't solve. We build the internal platforms, automations and integrations that fit how your business actually works.",
  },
];

export const serviceHref = (slug: string) => `/services/${slug}`;

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
