import type { ServicePageContent } from "./types";

/**
 * /services/ai-integration — content from the approved copy deck
 * (codroon-ai-integration-page-copy.md), VERBATIM. Do not edit copy
 * here without an updated deck.
 *
 * Page 3 of 6 — table, sub-services, process and FAQ written fresh;
 * no overlap with the AI agent or generative AI decks.
 * ⚠️ Zothix sign-off before publishing: $4,000–$20,000 / 2–4 weeks,
 * browser-automation last resort, framework list, inheriting n8n/Zapier.
 */
export const aiIntegration: ServicePageContent = {
  slug: "ai-integration",

  meta: {
    title: "AI Integration Services & MCP Development | Dallas | Codroon",
    description:
      "Codroon provides AI integration services that connect AI to the systems you already run: CRM, helpdesk, database, internal tools. Live in 2–4 weeks.",
    ogTitle: "AI Integration Services | Codroon",
    ogDescription:
      "Connect AI to the stack you already have. API integrations, MCP servers, and automation pipelines shipped in 2–4 weeks. Book a free discovery call.",
  },

  hero: {
    eyebrow: "AI Integration",
    h1: "AI Integration Services",
    subhead:
      "Codroon provides AI integration services that connect AI to the systems you already run: your CRM, helpdesk, database, warehouse, and internal tools. No migration, no rebuild, no asking your team to work somewhere new. We meet your stack where it is.",
    cta: "Integrate with AI",
  },

  whatIs: {
    heading: "What is AI integration?",
    paragraphs: [
      "AI integration is the work of connecting AI capability to the software a business already depends on, so it acts on real data in real systems instead of in a separate tab. It covers the API connections, authentication, data mapping, and error handling that sit between a model and the tools your team uses every day.",
      "It's the least glamorous category we sell and often the highest return. Most companies don't need new AI capability. They need the AI they already pay for to reach the systems where the work actually happens. Codroon builds that connective layer: the integrations, the MCP servers, the sync jobs, and the retry logic that keeps it standing when an upstream API has a bad morning.",
    ],
  },

  comparison: {
    heading: "Off-the-shelf AI tool vs no-code vs custom integration",
    intro:
      "Three ways to get AI into your stack, and most teams pick the wrong one for where they are. Here's the trade-off, plainly.",
    columns: ["Off-the-shelf AI tool", "No-code (Zapier, Make)", "Custom integration"],
    // our offering is the third column
    highlightColumn: 2,
    rows: [
      {
        label: "Time to first result",
        cells: ["Same day", "Days", "2–4 weeks"],
      },
      {
        label: "Cost at low volume",
        cells: ["Low", "Low", "Higher upfront"],
      },
      {
        label: "Cost at high volume",
        cells: ["Per-seat, climbs fast", "Per-task, climbs faster", "Flat. You own it"],
      },
      {
        label: "Fits your process",
        cells: ["You fit its process", "Partly", "Exactly"],
      },
      {
        label: "When it breaks",
        cells: ["Wait for the vendor", "Silent failures, manual retries", "Alerts, retries, logs"],
      },
      {
        label: "Ceiling",
        cells: ["Whatever they built", "Simple linear flows", "None"],
      },
      {
        label: "Best for",
        cells: [
          "Proving the idea is worth anything",
          "Low-volume glue between two apps",
          "Work that's core to how you operate",
        ],
      },
    ],
    closing:
      "Start with the cheapest thing that could work. When the per-task bill or the silent failures start hurting, that's the signal to build it properly, not before.",
  },

  subServices: {
    heading: "Our AI integration services",
    intro: "Codroon does four kinds of integration work. Most engagements are one or two of them.",
    cards: [
      {
        title: "LLM & AI Tool Integration",
        body: "Wiring Claude, GPT, or Gemini into your product and internal systems, with auth, rate limiting, retries, caching, and cost controls handled properly rather than left to a first draft.",
      },
      {
        title: "MCP Server Development",
        body: "Custom MCP servers that expose your internal tools and data to AI assistants over the open standard, instead of a brittle wrapper per tool. Schema-native, self-describing, and reusable across every model you run.",
      },
      {
        title: "Workflow & Automation Integration",
        body: "Event pipelines connecting your apps, queues, and webhooks, including inheriting and hardening whatever exists in n8n, Zapier, or Make today rather than making you throw it away.",
      },
      {
        title: "Data Pipeline & Sync",
        body: "Getting data to where the AI needs it: ETL jobs, change-data-capture, scheduled syncs, and the mapping layer between systems that were never designed to talk to each other.",
      },
    ],
  },

  // ⚠️ Zothix: confirm timelines before publishing.
  process: {
    heading: "How Codroon builds an integration",
    intro:
      "Four steps, two to four weeks. It starts with an audit because integrations fail on the things nobody documented.",
    steps: [
      {
        n: "01",
        title: "Systems audit",
        duration: "Free, 45 minutes",
        body: "We map what you run, what already talks to what, and where data actually lives, which is regularly not where the org chart says it is. You leave with a written integration map, a recommended approach, and a real number. Yours to keep whether you hire us or not.",
        deliverables: ["systems and data map", "recommended approach", "fixed price and timeline"],
      },
      {
        n: "02",
        title: "Integration design and access",
        duration: "Week 1",
        body: "We settle the shape before writing connectors: which direction data flows, what happens on conflict, where the retries and dead-letter queues go, and how authentication is handled. Access and credentials get sorted here, because that's the step that quietly eats a week on most projects.",
        deliverables: ["integration architecture", "auth and permissions plan", "failure-handling spec"],
      },
      {
        n: "03",
        title: "Build and harden",
        duration: "Weeks 2–3",
        body: "Connectors, transforms, and error handling, tested against your real data and real rate limits. We build for the bad day: the API that times out, the schema that changes, the record that arrives malformed. That's when integrations actually matter.",
        deliverables: ["working integrations", "retry and fallback logic", "integration tests"],
      },
      {
        n: "04",
        title: "Deploy and monitor",
        duration: "Weeks 3–4",
        body: "We ship it into your infrastructure with logging, alerting, and a dashboard that shows what ran and what failed. You get the repository and the docs. When something upstream changes six months from now, your team can see it and fix it without calling us.",
        deliverables: ["production deployment", "monitoring and alerts", "repo and runbook"],
      },
    ],
  },

  // ⚠️ Zothix: cut anything Codroon hasn't shipped with.
  tech: {
    heading: "The stack Codroon integrates on",
    intro: "We pick the right tools, not the trendy ones. Here's what we run in 2026 and why.",
    groups: [
      {
        title: "Protocols and standards",
        body: "MCP for exposing tools and data to AI over an open standard rather than a custom wrapper per tool. It's now under Linux Foundation governance, so building on it isn't a bet on one vendor. A2A where agents from different systems need to delegate. OAuth 2.1 for access, webhooks and Streamable HTTP for transport.",
      },
      {
        title: "Automation and orchestration",
        body: "n8n for workflow automation, including hardening setups you already have. Queues and durable execution for anything long-running, so a job that fails at step seven resumes rather than restarting.",
      },
      {
        title: "APIs and data",
        body: "REST, GraphQL, and gRPC on the connector side. PostgreSQL, Redis, and S3 underneath. Change-data-capture where systems need to stay in sync rather than being polled every fifteen minutes.",
      },
      {
        title: "Reliability and observability",
        body: "OpenTelemetry for tracing across services, structured logging, alerting, and dead-letter queues. An integration you can't observe is one you find out about from a customer.",
      },
      {
        title: "Infrastructure",
        body: "AWS, Docker, Vercel, Python, TypeScript. Boring where boring is correct.",
      },
    ],
  },

  industries: {
    heading: "Where AI integration pays off fastest",
    intro:
      "Integration work is shaped by function more than by industry. Codroon sees the fastest return in four places.",
    rows: [
      {
        title: "Customer support and success",
        body: "Connecting AI to your helpdesk so it drafts replies against real order and account data instead of generic suggestions. Ticket routing, tagging, and escalation wired to the systems that hold the answer.",
      },
      {
        title: "Sales and revenue operations",
        body: "CRM enrichment, lead scoring against your own closed-won history, meeting notes that actually land on the right record, and pipeline hygiene that doesn't depend on a rep remembering.",
      },
      {
        title: "Finance and back office",
        body: "Invoice and receipt intake, reconciliation across systems, approval routing, and reporting. Usually the highest-volume repetitive work in a company and the least likely to have been automated.",
      },
      {
        title: "Agencies and client services",
        body: "Reporting pulled from a dozen client platforms, onboarding workflows, and inbox triage. Work that scales linearly with headcount today, and shouldn't.",
      },
    ],
  },

  faq: {
    heading: "AI integration: common questions",
    quickAnswers:
      "Most AI integration projects take two to four weeks and cost $4,000–$20,000. We work with the systems you already run rather than replacing them, including existing Zapier or n8n setups. You own the code and the systems audit is free.",
    items: [
      {
        q: "What's the difference between AI integration and building an AI feature?",
        a: "Building a feature creates new capability. Integration connects capability you already have to the systems where the work happens. If you're already paying for AI tools and they don't talk to your CRM, database, or helpdesk, that's an integration problem, and it's usually cheaper to fix than people assume.",
      },
      {
        q: "Can you integrate with a system that has no public API?",
        a: "Usually, yes. Options in order of preference: an undocumented but stable internal API, a database or warehouse connection, scheduled file exports, or browser automation as a last resort. We'll tell you which tier your system falls into during the audit, and be honest if the answer is fragile.",
      },
      {
        q: "What's an MCP server and do we need one?",
        a: "MCP is an open standard for exposing your tools and data to AI models. Instead of writing a custom wrapper for every model you use, you build one MCP server and every compatible assistant can reach it. You need one if more than one AI tool needs the same internal data. If it's a single connection to a single tool, a direct integration is simpler and Codroon will say so.",
      },
      {
        q: "What happens when an API we depend on changes?",
        a: "That's when integrations break, so it's designed for from the start: versioned connectors, schema validation on ingest, alerts that fire on unexpected shapes rather than on a customer complaint. You get a runbook at handover so your team can handle routine changes without us.",
      },
      {
        q: "Do you work with our existing Zapier or n8n setup?",
        a: "Yes, and we usually start there. Most teams have working automation that's become slow, expensive, or fragile at their current volume. Often the right move is hardening what exists and migrating only the parts that hurt, not a rebuild.",
      },
      {
        q: "How do you handle authentication and access to our systems?",
        a: "Least-privilege by default: scoped credentials for exactly what the integration needs, nothing more. OAuth where a system supports it, secrets in a managed store rather than in code, and audit logging on anything that writes. Codroon never asks for admin access when a scoped role will do.",
      },
      {
        q: "How much does AI integration cost?",
        a: "$4,000–$20,000 for most projects, quoted as a fixed price after the free systems audit. We don't bill hourly. You get a number and a date, and we hold both.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the range and timeline before publishing.
  pricing: {
    heading: "What AI integration costs",
    paragraphs: [
      "Most AI integration projects with Codroon run $4,000–$20,000 and take two to four weeks. A single well-documented system connected properly sits at the lower end. Several systems, custom MCP servers, and two-way sync with conflict handling sit at the upper.",
      "We quote a fixed price after the systems audit. And if a no-code tool solves your problem at your current volume, we'll tell you. It's a smaller engagement for us and the right call for you until the numbers change.",
    ],
  },

  finalCta: {
    heading: "Let's map what you're actually running",
    body: "Forty-five minutes, no prep, no commitment. Walk us through your systems and you'll leave with an integration map, a recommended approach, and a real number, even if you build it somewhere else.",
    cta: "Book a free discovery call",
  },
};
