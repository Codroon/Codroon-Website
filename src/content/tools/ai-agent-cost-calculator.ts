import type { ToolLandingContent } from "./types";

/**
 * /tools/ai-agent-cost-calculator — LANDING page content from the
 * approved copy deck (codroon-agent-cost-estimator-copy.md), VERBATIM.
 * Do not edit copy here without an updated deck.
 *
 * Branding: the product is the "AI Agent Cost Estimator" (H1); the URL,
 * title tag and several H2s use "calculator" (the searched term). Both
 * appear on purpose — never normalise them to one word.
 *
 * The multi-step estimator flow lives at ./estimate and is a separate
 * build; every "Start estimate" CTA routes there.
 *
 * ⚠️ Zothix: EVERY number on this page needs sign-off (cost table, run
 * costs, worked example, loaded-salary figure, $6,000–$38,000 parity
 * with the AI agent service page, and the no-email promise ×4).
 */

export type { ToolLandingContent } from "./types";

export const aiAgentCostCalculator: ToolLandingContent = {
  slug: "ai-agent-cost-calculator",

  meta: {
    title: "AI Agent Cost Calculator: Free Estimate in 3 Minutes | Codroon",
    description:
      "Free AI agent cost calculator. Get build cost, monthly run cost, and payback period in about three minutes. No signup, no email required to see your number.",
    ogTitle: "AI Agent Cost Estimator: Free, No Signup",
    ogDescription:
      "Most AI agents cost $6,000–$38,000 to build and $50–$2,500 a month to run. Find out where yours lands in three minutes.",
  },

  hero: {
    eyebrow: "Free Tool · No Signup Required",
    h1: "AI Agent Cost Estimator",
    subhead:
      "See what an AI agent actually costs to build, what it costs to run every month after that, and how long before it pays for itself. Six questions, about three minutes. And if your answers point to something simpler than an agent, it'll tell you that too.",
    cta: "Start estimate",
    microcopy: "No email required to see your number.",
    // Static illustrative mockup — labelled as an example, never a quote.
    preview: {
      exampleLabel: "Example",
      title: "Your estimated build",
      range: "$18,000–$24,000",
      lines: [
        { label: "Workflow agent", value: "$14,000" },
        { label: "Integrations × 3", value: "$6,000" },
        { label: "Human approval layer", value: "$2,000" },
      ],
      footerRows: [
        { label: "Monthly run cost", value: "$180–$420" },
        { label: "Payback period", value: "~7 months" },
      ],
    },
  },

  quickAnswer:
    "Most AI agents cost $6,000 to $38,000 to build and $50 to $2,500 a month to run. A single-task agent that owns one workflow sits at the low end. A multi-agent system coordinating several workflows across your stack sits at the top. Build cost is only half the picture though. Every agent carries a monthly cost for model usage, hosting, and maintenance, and that's the number most teams forget to budget for. This AI agent cost calculator gives you both, plus how long the agent takes to pay for itself.",

  howItWorks: {
    heading: "How this AI agent cost calculator works",
    steps: [
      {
        title: "Tell us what it should do",
        body: "Single task, multi-step workflow, or several agents coordinating. This is the biggest driver of cost.",
      },
      {
        title: "Tell us what it touches",
        body: "How many systems, whether it reads or writes, and whether it needs your own documents to answer from.",
      },
      {
        title: "See build cost, run cost, and payback",
        body: "A real range, a monthly estimate, and the time it takes to earn back what it cost. No email, no call required.",
      },
    ],
  },

  costDrivers: {
    heading: "What actually drives AI agent development cost",
    intro: "Six things move the number, and they don't move it equally. In rough order of impact:",
    items: [
      {
        title: "Whether it decides, or just does",
        body: "An agent that follows a fixed sequence is closer to automation and costs like it. An agent that reasons about which path to take needs evaluation, guardrails, and fallback handling, and that's where the engineering hours are.",
      },
      {
        title: "Read access or write access",
        body: "The single most underestimated factor. An agent that reads your data and reports back is straightforward. An agent that changes records, sends messages, or moves money needs permissions design, approval steps, audit logging, and rollback. Write access can double the build.",
      },
      {
        title: "How many systems it touches",
        body: "Every integration is auth, error handling, rate limits, and testing. One well-documented API is a day. Four systems, one of which has no real API, is two weeks.",
      },
      {
        title: "Whether it needs your knowledge",
        body: "Answering from general capability is cheap. Answering from your documents, tickets, or database means retrieval: chunking, embedding, reranking, and a citation layer so answers can be checked. Adds meaningfully to both build and run cost.",
      },
      {
        title: "Human approval steps",
        body: "A review layer before the agent acts adds build cost and removes risk. Almost always worth it for anything customer-facing or financial. This is a cost you should want.",
      },
      {
        title: "Volume",
        body: "Volume barely affects build cost and drives run cost almost entirely. Ten runs a day and ten thousand runs a day are the same build and very different invoices.",
      },
    ],
  },

  // ⚠️ Zothix: every figure needs sign-off.
  costTable: {
    heading: "Typical AI agent cost by type",
    intro:
      "Base ranges before integrations, compliance requirements, or heavy volume. Run cost assumes moderate usage.",
    cornerHeader: "Agent type",
    columns: ["What it does", "Build cost", "Run cost / mo", "Timeline"],
    rows: [
      {
        label: "Simple automation",
        cells: ["One trigger, one action, no reasoning", "$2,000–$5,000", "$10–$40", "1–2 weeks"],
      },
      {
        label: "Single-task agent",
        cells: ["Owns one workflow end to end", "$6,000–$12,000", "$80–$250", "2–3 weeks"],
      },
      {
        label: "Knowledge agent (RAG)",
        cells: ["Answers from your own documents", "$10,000–$18,000", "$250–$700", "3–4 weeks"],
      },
      {
        label: "Workflow agent",
        cells: [
          "Multi-step, takes actions across systems",
          "$15,000–$25,000",
          "$300–$800",
          "4–5 weeks",
        ],
      },
      {
        label: "Multi-agent system",
        cells: [
          "Several agents coordinating on one job",
          "$22,000–$38,000",
          "$600–$1,500",
          "5–6 weeks",
        ],
      },
    ],
    closing:
      "The top row isn't really an agent, and we've included it on purpose. A good share of the people who arrive here asking about agents need that row instead, and it's better to find that out from a table than from an invoice.",
  },

  runCost: {
    heading: "What does it cost to run an AI agent each month?",
    intro:
      "Almost nobody publishes this, and it's the number that surprises teams three months in. Monthly cost breaks into five parts:",
    components: [
      {
        title: "Model usage",
        body: "Usually the largest share, and it scales with volume and context size. The lever most teams miss: routing simple steps to a cheaper model and reserving the frontier model for the reasoning. That alone often cuts the bill by more than half.",
      },
      {
        title: "Hosting and compute",
        body: "Where the agent runs. Modest for most workloads. This is rarely what makes the number big.",
      },
      {
        title: "Vector database",
        body: "Only if the agent uses retrieval. If you're already on Postgres, pgvector usually means this line is close to zero rather than a second subscription.",
      },
      {
        title: "Observability",
        body: "Tracing and evals. Small, and cutting it is a false economy: an agent you can't observe is an agent you can't debug.",
      },
      {
        title: "Maintenance",
        body: "Models get deprecated, APIs change, prompts drift. Budget for a few hours a month, or a retainer if you'd rather not think about it.",
      },
    ],
    workedExample:
      "A knowledge agent handling roughly 500 questions a day, answering from a 2,000-document library, with tracing enabled, typically runs $300–$650 a month. The same agent at 5,000 questions a day runs closer to $900–$1,600. Same build, ten times the volume, roughly three times the cost, because caching and model routing absorb some of it.",
  },

  whenNot: {
    heading: "When you don't need an AI agent",
    intro:
      "Three situations where the honest answer is something cheaper. Codroon would rather tell you here than six weeks into a build.",
    items: [
      {
        title: "It's one trigger and one action",
        body: "“When a form is submitted, add a row and send an email” is automation, not an agent. n8n or a similar tool does it for a fraction of the cost and you can maintain it yourself.",
      },
      {
        title: "Nothing needs deciding",
        body: "If every case follows the same path with no judgement involved, you want a script. Agents earn their cost through variability, when the right next step depends on what just happened.",
      },
      {
        title: "The volume isn't there yet",
        body: "An agent saving twenty minutes a week takes years to pay back. The maths works when the task is frequent, or when it's rare but slow and expensive. If yours is neither, the estimator will say so.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the loaded-salary figure.
  optionsTable: {
    heading: "How an AI agent compares to your other options",
    columns: ["Build with Codroon", "Hire someone", "No-code platform"],
    highlightColumn: 0,
    rows: [
      // Same bands as the estimator's results table: hire-someone
      // upfront is salary during the build, no-code is consultant
      // setup. ($0 upfront read as an error — client, 2026-08-02.)
      { label: "Upfront", cells: ["$6,000–$38,000", "$25,000–$60,000", "$2,000–$10,000 setup"] },
      {
        label: "Ongoing",
        cells: [
          "$50–$2,500 / mo",
          "$60,000–$120,000 / yr loaded",
          "$50–$800 / mo, climbs with usage",
        ],
      },
      {
        label: "Time to live",
        cells: ["2–6 weeks", "1–3 months to hire, then ramp", "Days, if the template fits"],
      },
      {
        label: "You end up owning",
        cells: [
          "The code, prompts, and infrastructure",
          "Nothing. It leaves when they do",
          "Nothing",
        ],
      },
      {
        label: "Breaks when",
        cells: ["An upstream API changes", "They resign", "You outgrow the template"],
      },
      {
        label: "Best when",
        cells: [
          "The task is repetitive and has judgement in it",
          "The work needs a human relationship",
          "You're testing whether the idea works at all",
        ],
      },
    ],
    closing:
      "We're not going to pretend hiring is never right. If the work needs relationships, negotiation, or accountability someone has to own, hire. Agents are for the repetitive middle: frequent enough to matter, structured enough to automate, variable enough that a script won't do.",
  },

  glossary: {
    heading: "Terms used in this AI agent cost calculator",
    terms: [
      {
        term: "AI agent",
        definition:
          "Software that decides and acts on its own: reading context, choosing a tool, and completing multi-step work without a person at each step. Distinct from a chatbot, which responds, and a script, which repeats.",
      },
      {
        term: "RAG (retrieval-augmented generation)",
        definition:
          "Giving a model access to your documents or database so it answers from your information rather than from what it was trained on. Adds accuracy and citations, and adds cost.",
      },
      {
        term: "Multi-agent orchestration",
        definition:
          "Several specialised agents working on different parts of one job, coordinated by a planner. Used when the work is too broad for a single agent to hold.",
      },
      {
        term: "Human-in-the-loop",
        definition:
          "A person reviewing or approving the agent's output before it takes effect. Standard for anything customer-facing or financial.",
      },
      {
        term: "MCP (Model Context Protocol)",
        definition:
          "An open standard for connecting agents to tools and data. Build one MCP server and every compatible AI assistant can use it, instead of a custom wrapper per model. Now under Linux Foundation governance.",
      },
      {
        term: "Payback period",
        definition:
          "How many months of saved time it takes for an agent to earn back what it cost to build. Under twelve months is generally a good sign.",
      },
    ],
  },

  faq: {
    heading: "AI agent cost: common questions",
    items: [
      {
        q: "How much does an AI agent cost to build?",
        a: "Most production AI agents cost $6,000 to $38,000. A single-task agent owning one workflow sits at the low end; a multi-agent system with retrieval, several integrations, and human approval sits at the top. Simple automations (one trigger, one action) fall below that at $2,000 to $5,000, and a fair number of people who ask about agents actually need one of those.",
      },
      {
        q: "What does it cost to run an AI agent each month?",
        a: "$50 to $2,500 for most agents, depending on volume, covering model usage, hosting, retrieval if used, observability, and maintenance. Model usage is usually the biggest share and scales with volume. Routing simple steps to a cheaper model and reserving the frontier model for reasoning typically cuts the bill by more than half.",
      },
      {
        q: "How accurate is this estimate?",
        a: "It's a range, not a quote, which is why it's called an estimator. It's built from what Codroon has actually charged for comparable work, and it's tuned to come in slightly conservative. If your real quote lands above the estimate, something in the scope changed, and we'd rather explain that than surprise you with it.",
      },
      {
        q: "Do I need to give you my email to see the estimate?",
        a: "No. The number appears immediately. If you want the full breakdown as a PDF, including what we'd suggest cutting to bring the cost down, that's where we ask for an email, and it's optional.",
      },
      {
        q: "Is an AI agent cheaper than hiring someone?",
        a: "For repetitive, structured work with judgement in it, usually yes. A loaded salary runs $60,000 to $120,000 a year against an agent's one-time build plus a monthly bill. But an agent doesn't handle relationships, negotiation, or accountability. The right comparison isn't agent versus person; it's agent versus the specific hours that person spends on the repetitive part.",
      },
      {
        q: "Why is the estimate a range rather than one number?",
        a: "Because the honest version has a range in it. Integration difficulty is the main variable: a documented API and a system with no real API produce very different weeks. We narrow it to a fixed price after the discovery call, and that price is the one we hold.",
      },
      {
        q: "What if the estimator says I don't need an agent?",
        a: "Then that's the useful answer and it cost you three minutes. It'll point you at automation or a simpler build instead. Codroon would rather lose a project at the estimate stage than deliver something you didn't need.",
      },
      {
        q: "What's included in the build cost?",
        a: "Scoping, architecture, the agent itself, integrations, guardrails, evaluation, deployment to your infrastructure, and handover with documentation. You own the code, the prompts, and the eval suite. Ongoing hosting and model usage are the monthly cost, quoted separately.",
      },
    ],
  },

  finalCta: {
    heading: "See what your agent would cost",
    body: "Three minutes, six questions, no email needed to see the number. You'll get a build range, a monthly run cost, and a payback period, plus an honest answer if an agent isn't what you need.",
    cta: "Start estimate",
  },
};
