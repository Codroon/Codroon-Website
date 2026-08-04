import type { ServicePageContent } from "./types";

/**
 * /services/ai-agent-development — content from the approved copy deck
 * (codroon-ai-agent-page-copy.md), VERBATIM. Do not edit copy here
 * without an updated deck.
 *
 * Sections land gate by gate; only shipped sections exist below.
 * ⚠️ Zothix sign-off required before publishing: pricing figures
 * ($6,000–$38,000 / 2–6 weeks), the free scope-document promise,
 * framework list, industries.
 */
export const aiAgentDevelopment: ServicePageContent = {
  slug: "ai-agent-development",

  meta: {
    title: "AI Agent Development Company | Dallas, TX | Codroon",
    description:
      "Codroon is an AI agent development company building production AI agents in 2–6 weeks. Custom agents that take real actions in your systems. Dallas, TX.",
    ogTitle: "AI Agent Development Company | Codroon",
    ogDescription:
      "We build AI agents that do the work, not agents that describe it. Production-ready in 2–6 weeks. Book a free discovery call.",
  },

  hero: {
    eyebrow: "AI Agent Development",
    h1: "AI Agent Development Company",
    subhead:
      "Codroon is an AI agent development company that builds and ships production AI agents in weeks, not months. We build agents that take real actions inside your systems: update the record, send the invoice, route the ticket, run the report. Not chatbots that tell you what you should do next.",
    cta: "Build your agent",
  },

  whatIs: {
    heading: "What is AI agent development?",
    paragraphs: [
      "AI agent development is the process of building software that can decide and act on its own: reading context, picking the right tool, and completing multi-step work without a person driving each step. An agent doesn't wait to be asked. It observes a trigger, plans a path, executes across your systems, and checks whether the result was actually correct.",
      "That last part is what separates an agent from a script. A script follows the path you wrote. An agent chooses a path, and changes it when reality doesn't match the plan. Codroon builds these systems end to end: the reasoning loop, the tool integrations, the guardrails that stop an agent doing something expensive, and the monitoring that tells you when it drifts.",
    ],
  },

  comparison: {
    heading: "AI agents vs chatbots vs RPA: what's actually different",
    intro:
      "These three get sold interchangeably and they solve different problems. Here's where each one belongs.",
    columns: ["AI Agents", "Chatbots", "RPA"],
    rows: [
      {
        label: "What it does",
        cells: ["Decides, then acts", "Responds in conversation", "Repeats a fixed script"],
      },
      {
        label: "Unexpected input",
        cells: [
          "Reasons a new path",
          "Falls back to “I didn't get that”",
          "Fails, waits for a human",
        ],
      },
      {
        label: "Multi-step work",
        cells: ["Chains tools across systems", "One question, one answer", "Fixed sequence only"],
      },
      {
        label: "How it connects",
        cells: [
          "Calls APIs, databases, and tools directly",
          "Sits on top of a chat window",
          "Clicks the interface like a person",
        ],
      },
      {
        label: "When something changes",
        cells: ["Re-plans around it", "Needs new intents written", "Breaks when a button moves"],
      },
      {
        label: "Best for",
        cells: [
          "Work with judgement in it",
          "Answering known questions",
          "High-volume identical tasks",
        ],
      },
    ],
    closing:
      "Most teams asking for a chatbot want an agent. Most teams asking for an agent need one workflow automated first, then a second. We'll tell you which on the call.",
  },

  subServices: {
    heading: "Our AI agent development services",
    intro:
      "Codroon builds agents at four levels of scope. Most projects start at the first and grow into the second.",
    cards: [
      {
        title: "Custom AI Agent Development",
        body: "A single agent that owns one workflow end to end. Scoped to a specific job like qualifying leads, reconciling invoices, or triaging support, with the tool access and guardrails that job needs, and nothing it doesn't.",
      },
      {
        title: "Multi-Agent System Architecture",
        body: "Several specialised agents coordinating on work too broad for one. A planner that breaks the task down, workers that execute in parallel, and a reviewer that checks output before anything reaches production.",
      },
      {
        title: "Agent Integration & Deployment",
        body: "Connecting agents to the systems you already run (your CRM, database, warehouse, ticketing, and internal tools) over MCP where a server exists and direct API integration where one doesn't.",
      },
      {
        title: "Agent Monitoring & Optimization",
        body: "Tracing, evals, and cost tracking after launch. Agents drift as models update and data changes. We instrument yours so you find out from a dashboard rather than from a customer.",
      },
    ],
  },

  // ⚠️ Zothix: confirm timelines before publishing.
  process: {
    heading: "How Codroon builds an AI agent",
    intro: "Four steps, two to six weeks, and you see working software in the first two.",
    steps: [
      {
        n: "01",
        title: "Discovery and scoping",
        duration: "Free, 45 minutes",
        body: "We walk through the workflow you want handled and find where an agent actually pays off, which is often not where you expected. You leave with a written scope, an architecture sketch, and a real number. No commitment, and you keep the scope whether you hire us or not.",
        deliverables: ["written scope", "architecture sketch", "fixed price and timeline"],
      },
      {
        n: "02",
        title: "Architecture and agent design",
        duration: "Week 1",
        body: "We decide the shape before writing the agent: single agent or multi-agent, which model, which framework, where the human approval steps go, and what the agent is explicitly not allowed to do. Guardrails get designed here, not bolted on later.",
        deliverables: ["system design", "tool and data map", "guardrail and escalation spec"],
      },
      {
        n: "03",
        title: "Build and iterate",
        duration: "Weeks 2–5",
        body: "We build in weekly increments and you see a working agent at the end of each one. Evals run from day one, so “it feels better” gets replaced with a number. You give feedback on real output, not mockups.",
        deliverables: ["working agent each week", "eval suite", "integration tests"],
      },
      {
        n: "04",
        title: "Deploy, monitor, hand over",
        duration: "Weeks 5–6",
        body: "We ship it to your infrastructure, wire up tracing and cost monitoring, and hand over the repository with documentation. You own all of it. If you want us to keep running it, that's a separate conversation, not a lock-in.",
        deliverables: ["production deployment", "observability dashboard", "repo and docs"],
      },
    ],
  },

  // ⚠️ Zothix: cut anything Codroon hasn't shipped with. Names are
  // current as of 2026 and verified — do not substitute from memory.
  tech: {
    heading: "The stack Codroon builds agents on",
    intro:
      "We pick the right tools, not the trendy ones. Here's what we actually run in 2026 and why.",
    groups: [
      {
        title: "Models",
        body: "Claude, GPT, and Gemini. We're model-agnostic by default and benchmark on your task rather than assuming. The best model for extraction is often not the best one for planning.",
      },
      {
        title: "Agent frameworks",
        body: "LangGraph for stateful workflows that need auditability and human approval steps. CrewAI where role-based multi-agent setups fit the problem. The OpenAI Agents SDK and Claude Agent SDK for provider-native builds. Pydantic AI where type safety matters more than flexibility.",
      },
      {
        title: "Protocols",
        body: "MCP and A2A. MCP is the vertical bus, how an agent reaches your tools and data. A2A is the horizontal one, how agents delegate to each other. Both now sit under Linux Foundation governance, which means building on them is a safe bet rather than a wager on a vendor.",
      },
      {
        title: "Retrieval",
        body: "pgvector when you're already on Postgres and shouldn't be paying for a second database. Pinecone or Qdrant when scale or filtering demands a dedicated one.",
      },
      {
        title: "Observability and evals",
        body: "LangSmith, Langfuse, and OpenTelemetry. An agent without tracing is an agent you can't debug, and evals are the only honest way to know a change made things better.",
      },
      {
        title: "Automation and infrastructure",
        body: "n8n, AWS, Docker, Vercel, Python, TypeScript, and PostgreSQL. Boring where boring is correct.",
      },
    ],
  },

  // Each row later becomes its own page — set `href` to turn the row
  // into a link (⚠️ Zothix: swap any industry you can't speak to).
  industries: {
    heading: "Where AI agent development pays off fastest",
    intro:
      "Codroon builds agents across four areas where the work is repetitive enough to automate and variable enough to need judgement.",
    rows: [
      {
        title: "E-commerce and DTC",
        body: "Order triage, returns handling, supplier follow-up, and product data cleanup. Agents work well here because volume is high and every case is slightly different.",
      },
      {
        title: "SaaS and software teams",
        body: "Support ticket routing, onboarding flows, churn signals, and internal tooling. Usually the fastest path to a measurable result because the data is already structured.",
      },
      {
        title: "Agencies and marketing teams",
        body: "Reporting, content pipelines, lead qualification, and inbox triage. Work that scales linearly with headcount today, and shouldn't.",
      },
      {
        title: "Operations and internal tools",
        body: "Reconciliation, document processing, approval routing, and reporting. The unglamorous work that quietly consumes a week a month.",
      },
    ],
  },

  faq: {
    heading: "AI agent development: common questions",
    quickAnswers:
      "Most AI agent projects take two to six weeks and cost $6,000–$38,000. You own the code and the agent outright. The discovery call is free and you keep the scope document whether you hire us or not.",
    items: [
      {
        q: "What's the difference between an AI agent and a chatbot?",
        a: "A chatbot answers. An agent acts. A chatbot can tell your customer their order shipped; an agent can check the carrier, spot the delay, issue the refund, and email them about it. If the outcome you want ends in something changing in a system, you want an agent.",
      },
      {
        q: "How long does it take to build an AI agent?",
        a: "Two to six weeks for most projects. A single-workflow agent is usually live in two to three. Multi-agent systems with several integrations run closer to six. You see working software at the end of week two either way.",
      },
      {
        q: "How much does AI agent development cost?",
        a: "$6,000–$38,000 for most projects, quoted as a fixed price after the discovery call. Codroon doesn't bill hourly. You get a number and a date, and we hold both.",
      },
      {
        q: "Do I own the agent and the code?",
        a: "Yes, entirely. Repository, prompts, evals, infrastructure config: all of it transfers to you at handover. No license, no per-seat fee, no dependency on us to keep running it.",
      },
      {
        q: "What if our data is messy or spread across systems?",
        a: "That's the normal starting point, and it's a scoping question rather than a blocker. Part of discovery is finding out whether your data supports the agent you want yet. Sometimes the honest answer is that a smaller agent on cleaner data beats the ambitious version, and we'll tell you which.",
      },
      {
        q: "Which model do you use: Claude, GPT, or Gemini?",
        a: "Whichever benchmarks best on your task. We build model-agnostic where we can, so switching later is a config change and not a rewrite. Model pricing and capability move every few months and you shouldn't be locked to a decision made in week one.",
      },
      {
        q: "What happens after the agent goes live?",
        a: "You get tracing, evals, and cost monitoring wired up at handover, so you can see how it's performing without asking us. Agents drift as models update and data changes. If you want Codroon to keep tuning it, that's an optional retainer, never a requirement.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the range and timeline before publishing.
  pricing: {
    heading: "What AI agent development costs",
    paragraphs: [
      "Most AI agent projects with Codroon run $6,000–$38,000 and take two to six weeks. A single agent owning one workflow sits at the lower end. A multi-agent system with several integrations and human approval steps sits at the upper.",
      "We quote a fixed price after the discovery call, not an hourly rate that grows. If your project doesn't need an agent, we'll say so. A well-built automation is cheaper and we'd rather tell you that up front than six weeks in.",
    ],
  },

  finalCta: {
    heading: "Let's find out if an agent is the right answer",
    body: "Forty-five minutes, no prep, no commitment. Walk us through the workflow and you'll leave with a scope, an architecture sketch, and a real number, even if you build it somewhere else.",
    cta: "Book a free discovery call",
  },
};
