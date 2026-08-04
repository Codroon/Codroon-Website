import type { ServicePageContent } from "./types";

/**
 * /services/generative-ai-development — content from the approved copy
 * deck (codroon-generative-ai-page-copy.md), VERBATIM. Do not edit
 * copy here without an updated deck.
 *
 * Page 2 of 6 — comparison table, sub-services, process and FAQ are
 * written fresh for this page; nothing is reused from the AI agent deck.
 * ⚠️ Zothix sign-off before publishing: $6,000–$30,000 / 2–5 weeks,
 * the API business-tier training claim, framework list, industries.
 */
export const generativeAiDevelopment: ServicePageContent = {
  slug: "generative-ai-development",

  meta: {
    title: "Generative AI Development Services | Dallas, TX | Codroon",
    description:
      "Codroon provides generative AI development services: RAG systems, LLM features, and document processing shipped in 2–5 weeks. Dallas, TX.",
    ogTitle: "Generative AI Development Services | Codroon",
    ogDescription:
      "AI features that ship, not pilots that stall. RAG, document processing, and LLM features in 2–5 weeks. Book a free discovery call.",
  },

  hero: {
    eyebrow: "Generative AI Development",
    h1: "Generative AI Development Services",
    subhead:
      "Codroon provides generative AI development services that put working AI features inside your product. Not demos, not pilots that stall at 80%. RAG systems, document processing, content pipelines, and LLM features that ship in weeks and hold up once real users hit them.",
    cta: "Build your workflow",
  },

  whatIs: {
    heading: "What is generative AI development?",
    paragraphs: [
      "Generative AI development is the work of building product features powered by models that produce new output (text, structured data, summaries, code, images) rather than only classifying or retrieving what already exists. In practice it means wiring a model into your product so it does something useful with your data, reliably, at a cost you can predict.",
      "The model call is the easy part. Everything around it is the work: getting the right context in front of the model, measuring whether the output is actually good, catching the cases where it isn't, and keeping token costs from quietly tripling. Codroon builds that surrounding layer of retrieval, evaluation, guardrails, caching, and monitoring. It's the difference between a demo that impresses and a feature that survives contact with users.",
    ],
  },

  comparison: {
    heading: "RAG vs fine-tuning vs prompt engineering: which one you actually need",
    intro:
      "Almost every generative AI project starts with this decision, and most teams reach for the expensive option first. Here's the honest comparison.",
    columns: ["RAG", "Fine-tuning", "Prompt engineering"],
    rows: [
      {
        label: "What it changes",
        cells: ["What the model knows", "How the model behaves", "What the model is asked"],
      },
      {
        label: "Best for",
        cells: [
          "Answering from your own docs and data",
          "Consistent format, tone, or one narrow task",
          "Almost everything. Try this first",
        ],
      },
      { label: "Setup cost", cells: ["Moderate", "High", "Low"] },
      { label: "Cost to update", cells: ["Add a document", "Retrain the model", "Edit text"] },
      {
        label: "Data you need",
        cells: ["Content you already have", "Hundreds to thousands of examples", "None"],
      },
      {
        label: "Common mistake",
        cells: [
          "Building it before trying prompting",
          "Reaching for it far too early",
          "Stopping here when retrieval was the answer",
        ],
      },
    ],
    closing:
      "Most projects need good prompting plus retrieval. Fine-tuning is right roughly one time in ten, and usually not at the start. We'll tell you which bucket you're in before you spend anything.",
  },

  subServices: {
    heading: "Our generative AI development services",
    intro: "Codroon builds four kinds of generative AI work. Most projects combine the first two.",
    cards: [
      {
        title: "LLM Feature Development",
        body: "AI features inside your existing product: summarisation, drafting, search, classification, structured extraction. Built to your stack, with cost and latency budgets set before we write anything.",
      },
      {
        title: "RAG & Knowledge Systems",
        body: "Retrieval systems that let a model answer from your own documents, tickets, or database instead of guessing. Chunking, embedding, reranking, and the citation layer that lets a user check the answer.",
      },
      {
        title: "Document & Data Extraction",
        body: "Turning unstructured input (PDFs, invoices, emails, contracts, scanned forms) into structured data your systems can use. Schema-validated output with confidence scores, not free text you have to parse again.",
      },
      {
        title: "Evaluation & Model Optimization",
        body: "Eval harnesses, prompt tuning, model selection, and caching. Usually the cheapest work with the biggest effect, because most teams are paying frontier prices for a task a smaller model handles just as well.",
      },
    ],
  },

  // ⚠️ Zothix: confirm timelines before publishing.
  process: {
    heading: "How Codroon builds a generative AI feature",
    intro: "Four steps, two to five weeks, and evaluation starts before the build does.",
    steps: [
      {
        n: "01",
        title: "Discovery and feasibility",
        duration: "Free, 45 minutes",
        body: "We look at what you want the feature to do and whether your data supports it yet. Sometimes it doesn't, and that's worth knowing in 45 minutes rather than four weeks. You leave with a written scope, a recommended approach, and a real number, yours to keep either way.",
        deliverables: ["written scope", "recommended approach", "fixed price and timeline"],
      },
      {
        n: "02",
        title: "Prototype and eval baseline",
        duration: "Week 1",
        body: "We build a rough version and, more importantly, the test set that tells us whether it's working. Generative output is subjective until you measure it, so we agree on what “good” means, in numbers, before tuning anything.",
        deliverables: ["working prototype", "eval set and baseline scores", "cost-per-run estimate"],
      },
      {
        n: "03",
        title: "Build and tune",
        duration: "Weeks 2–4",
        body: "Retrieval, prompts, guardrails, and fallbacks, tuned against the eval set each iteration. Every change gets measured, so improvements are demonstrated rather than asserted. You see output on your real data weekly.",
        deliverables: ["production feature", "eval scores across versions", "guardrail spec"],
      },
      {
        n: "04",
        title: "Ship and measure",
        duration: "Weeks 4–5",
        body: "We deploy into your stack, wire up tracing and cost monitoring, and hand over the repository with documentation. You own all of it, including the eval suite. That's what lets your team keep improving it without us.",
        deliverables: ["production deployment", "observability and cost dashboard", "repo and docs"],
      },
    ],
  },

  // ⚠️ Zothix: cut anything Codroon hasn't shipped with.
  tech: {
    heading: "The stack Codroon builds generative AI on",
    intro: "We pick the right tools, not the trendy ones. Here's what we run in 2026 and why.",
    groups: [
      {
        title: "Models",
        body: "Claude, GPT, and Gemini for frontier work. Open models like Llama, Qwen, and Mistral, served through vLLM or Groq where cost, latency, or data residency makes that the better call. We benchmark on your task rather than assuming.",
      },
      {
        title: "Retrieval",
        body: "pgvector when you're already on Postgres and shouldn't pay for a second database. Pinecone or Qdrant when scale or filtering demands a dedicated one. Reranking on top where recall matters more than speed.",
      },
      {
        title: "Frameworks",
        body: "LlamaIndex Workflows for document-heavy and event-driven pipelines. LangChain where the ecosystem saves real time. Vercel AI SDK for streaming interfaces. Pydantic AI where output has to be type-safe and validated.",
      },
      {
        title: "Evaluation and observability",
        body: "Langfuse and LangSmith for tracing and evals, OpenTelemetry underneath. A generative feature without an eval suite is one you can't improve on purpose. You can only change it and hope.",
      },
      {
        title: "Infrastructure",
        body: "AWS, Docker, Vercel, Python, TypeScript, and PostgreSQL. Boring where boring is correct.",
      },
    ],
  },

  industries: {
    heading: "Where generative AI development pays off fastest",
    intro:
      "Codroon builds generative AI features across four areas where there's a lot of unstructured text and not enough people to read it.",
    rows: [
      {
        title: "SaaS and product teams",
        body: "In-app summarisation, semantic search, drafting, and onboarding. Usually the fastest measurable win, because the data is already structured and the surface to put a feature on already exists.",
      },
      {
        title: "E-commerce and DTC",
        body: "Product descriptions at catalogue scale, review synthesis, support deflection, and merchandising copy. High volume, repetitive, and every item slightly different, which is exactly the shape this work suits.",
      },
      {
        title: "Media, content, and publishing",
        body: "Research assistance, editing support, repurposing across formats, and archive search. Retrieval matters more than generation here. The value is in finding the right source, not inventing one.",
      },
      {
        title: "Professional services",
        body: "Contract review, document intake, report drafting, and knowledge search across years of files. Document-heavy work where extraction accuracy and citations matter more than fluency.",
      },
    ],
  },

  faq: {
    heading: "Generative AI development: common questions",
    quickAnswers:
      "Most generative AI projects take two to five weeks and cost $6,000–$30,000. Most teams need prompting plus retrieval, not fine-tuning. You own the code and the eval suite outright, and the discovery call is free.",
    items: [
      {
        q: "Should we use RAG or fine-tune the model?",
        a: "Usually neither, at first. Good prompting solves more than people expect. When it doesn't, retrieval is the next step: cheaper to build, cheaper to update, and you add knowledge by adding a document rather than retraining. Fine-tuning is right when you need consistent format or tone on a narrow task, and it's the correct answer maybe one time in ten.",
      },
      {
        q: "Will it hallucinate, and what do you do about it?",
        a: "Any model can produce something confident and wrong. The engineering answer is to constrain it: ground answers in retrieved sources, cite what it used so a person can verify, validate output against a schema, and route low-confidence cases to a human. You reduce it to a manageable rate and design for the rest. Anyone promising zero is selling something.",
      },
      {
        q: "Does our data get used to train the model?",
        a: "Not on the API tiers we build on. Anthropic, OpenAI, and Google all offer business terms where inputs and outputs aren't used for training, and that's what we deploy against. If your requirements are stricter, we can run open models on your own infrastructure instead.",
      },
      {
        q: "How do you know if the output is actually good?",
        a: "We build an eval set before tuning anything (real examples from your data with agreed-correct answers) and score every version against it. That turns “this feels better” into a number. Codroon hands the eval suite over with the code, so your team can keep measuring after we're gone.",
      },
      {
        q: "Can you add AI to a product we've already built?",
        a: "Yes, and that's most of this work. We integrate into your existing stack rather than asking you to migrate. The main scoping question is how your data is stored and whether it's reachable, not what framework you're on.",
      },
      {
        q: "What happens when the model we're using gets deprecated?",
        a: "We build model-agnostic wherever possible, so swapping is a config change and a re-run of the eval suite rather than a rewrite. This matters more than it sounds. Model pricing and capability shift every few months, and you shouldn't be locked to a decision made in week one.",
      },
      {
        q: "How much does generative AI development cost?",
        a: "$6,000–$30,000 for most projects, quoted as a fixed price after the discovery call. Codroon doesn't bill hourly. You get a number and a date, and we hold both.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the range and timeline before publishing.
  pricing: {
    heading: "What generative AI development costs",
    paragraphs: [
      "Most generative AI projects with Codroon run $6,000–$30,000 and take two to five weeks. A single feature on clean data sits at the lower end. A RAG system across multiple sources with evaluation and human review sits at the upper.",
      "We quote a fixed price after the discovery call. And if prompting alone solves your problem, we'll say so. That's a cheaper engagement and we'd rather have the honest conversation than sell you a retrieval system you didn't need.",
    ],
  },

  finalCta: {
    heading: "Let's find out what your data can actually support",
    body: "Forty-five minutes, no prep, no commitment. Tell us what you want the feature to do and you'll leave with a scope, a recommended approach, and a real number, even if you build it somewhere else.",
    cta: "Book a free discovery call",
  },
};
