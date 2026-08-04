/**
 * FAQ content — edit here; the visible accordion AND the FAQPage
 * JSON-LD are both generated from this array, so they stay in sync.
 *
 * DRAFT answers — verify pricing, code/IP ownership, and support
 * against Codroon's actual policies before publishing.
 */

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "How fast can you actually ship?",
    a: "It depends on scope, but because we're AI-native and already know the tools, most MVPs, automations, and agents go from plan to production in weeks, not months. You'll get a realistic timeline on the discovery call, before you commit to anything.",
  },
  {
    q: "What's the free discovery call?",
    a: "A no-pressure call where you walk us through your business and the workflow you want to fix. We ask the right questions, find where AI actually helps, and you leave with a clear sense of what we'd build. No prep or commitment needed.",
  },
  {
    q: "What kinds of things do you build?",
    a: "SaaS products (web, desktop, mobile), AI/LLM features inside existing products, AI automations for your operations, autonomous AI agents, and integrations across your stack. If you have a use case, we can usually build for it.",
  },
  {
    q: "Do I need a technical background to work with you?",
    a: "Not at all. Many of our clients are non-technical founders and operators. We handle the technical decisions and explain everything in plain language. You stay in control of the product, not the jargon.",
  },
  {
    q: "How do you price projects?",
    a: "Pricing depends on scope, which we define together in the discovery call and the plan that follows. You'll know what you're paying for before any work begins. No surprise invoices.",
  },
  {
    q: "Will I own the code and the product?",
    a: "Yes. You own everything we build: code, designs, and IP. We hand it over cleanly, with documentation, so you're never locked in.",
  },
  {
    q: "What if I only need a small piece, like a single automation or integration?",
    a: "That's completely fine. Not every engagement is a full product. If you just need an automation, an AI agent, or a few integrations wired up, we'll scope exactly that.",
  },
  {
    q: "What happens after you ship?",
    a: "We don't disappear at handover. We provide training and support so your team can run with it, and we're available for iterations as you grow.",
  },
];

export const CALENDLY = "https://calendly.com/codroon-info/30min";