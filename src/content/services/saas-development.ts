import type { ServicePageContent } from "./types";

/**
 * /services/saas-development — content from the approved copy deck
 * (codroon-saas-development-page-copy.md), VERBATIM. Do not edit copy
 * here without an updated deck.
 *
 * Page 5 of 6 — positioned at the SCALE stage (MVP page = validate).
 * ⚠️ Zothix sign-off before publishing: $20,000–$60,000 / 6–12 weeks
 * (highest band), WorkOS/Clerk/Auth.js/Stripe Billing list, row-level
 * security claim, taking on existing codebases + in-house teams.
 */
export const saasDevelopment: ServicePageContent = {
  slug: "saas-development",

  meta: {
    title: "SaaS Development Services for Founders | Dallas | Codroon",
    description:
      "Codroon provides SaaS development services: multi-tenant architecture, billing, and products built to hold up as you grow. Fixed scope. Dallas, TX.",
    ogTitle: "SaaS Development Services | Codroon",
    ogDescription:
      "Multi-tenant architecture, billing that works, and a codebase your team can inherit. Book a free discovery call.",
  },

  hero: {
    eyebrow: "SaaS Development",
    h1: "SaaS Development Services",
    subhead:
      "Codroon provides SaaS development services for teams past the guessing stage. Multi-tenant architecture, billing that survives real customers, and a codebase your own engineers can take over. The decisions you make in week one are the ones you live with in year two, so we make them deliberately.",
    cta: "Build your SaaS",
  },

  whatIs: {
    heading: "What is SaaS development?",
    paragraphs: [
      "SaaS development is building software delivered as a subscription service: one codebase serving many customers, each seeing only their own data, billed automatically, updated continuously. The product surface looks like any web application. What makes it SaaS is everything underneath: tenancy, billing, permissions, and an upgrade path that doesn't require touching each customer individually.",
      "That underneath is where SaaS projects go wrong. A product that works beautifully for one customer can be structurally unable to serve fifty, and by the time you find out, the fix is a rewrite. Codroon builds the tenancy model, billing, and data architecture deliberately at the start, because those are the three decisions that are cheap in week one and brutally expensive in month nine.",
    ],
  },

  comparison: {
    heading: "Single-tenant vs multi-tenant vs hybrid architecture",
    intro:
      "This is the first real decision in any SaaS build, and it constrains everything after it. Here's what each one costs you.",
    columns: ["Single-tenant", "Multi-tenant", "Hybrid"],
    // deck recommendation: most products should start multi-tenant
    highlightColumn: 1,
    rows: [
      {
        label: "Data separation",
        cells: [
          "Separate database per customer",
          "Shared database, isolated by row",
          "Shared by default, separate on request",
        ],
      },
      {
        label: "Cost per customer",
        cells: ["High, scales with headcount", "Low, scales with usage", "Moderate"],
      },
      {
        label: "Onboarding a customer",
        cells: ["Provision infrastructure", "Create a record", "Depends on their tier"],
      },
      {
        label: "Per-customer customisation",
        cells: ["Easy", "Hard, and usually a mistake", "Possible for top tier"],
      },
      {
        label: "Blast radius of a bug",
        cells: ["One customer", "Everyone", "Everyone, or one"],
      },
      {
        label: "Compliance story",
        cells: ["Simplest to explain", "Needs real controls", "Strongest sales answer"],
      },
      {
        label: "Best for",
        cells: [
          "A handful of large contracts",
          "Self-serve and volume",
          "Self-serve now, enterprise later",
        ],
      },
    ],
    closing:
      "Most products should start multi-tenant with row-level isolation and add a hybrid tier only when a customer pays enough to justify it. Starting single-tenant because it feels safer is the most common expensive mistake at this stage.",
  },

  subServices: {
    heading: "Our SaaS development services",
    intro:
      "Codroon works on four kinds of SaaS engagement. Most start with the first or the last.",
    cards: [
      {
        title: "SaaS Product Development",
        body: "The full build: application, tenancy, auth, billing, admin, and deployment. Scoped and priced up front, delivered in weekly releases you can actually use rather than a reveal at the end.",
      },
      {
        title: "Multi-Tenant Architecture",
        body: "The data model and isolation strategy that decides what your product can become. Row-level security, tenant-scoped queries, and migrations that don't require downtime per customer.",
      },
      {
        title: "Billing & Subscription Systems",
        body: "Plans, trials, proration, usage metering, failed-payment recovery, and the webhook handling that keeps your database and Stripe agreeing with each other. The part every team underestimates.",
      },
      {
        title: "Performance & Scale Engineering",
        body: "For products that work but are straining: slow queries, timeouts, rising infrastructure bills. We find where it actually hurts and fix that, rather than rewriting things that were fine.",
      },
    ],
  },

  // ⚠️ Zothix: confirm timelines before publishing.
  process: {
    heading: "How Codroon builds a SaaS product",
    intro:
      "Four steps, six to twelve weeks, and the architecture is settled before the first feature.",
    steps: [
      {
        n: "01",
        title: "Product and architecture review",
        duration: "Free, 45 minutes",
        body: "We go through what the product does, who the customers are, and what you expect year two to look like, because tenancy and billing decisions are made against that, not against today. You leave with an architecture recommendation, a scope, and a real number, yours to keep either way.",
        deliverables: ["architecture recommendation", "scoped build", "fixed price and timeline"],
      },
      {
        n: "02",
        title: "Architecture, data model, and tenancy",
        duration: "Weeks 1–2",
        body: "Tenancy model, data schema, permissions, and billing structure decided and documented before feature work starts. This is the fortnight that determines whether year two is comfortable or a rewrite. We do it in the open, so you'll understand the trade-offs, not just receive them.",
        deliverables: ["data model and tenancy design", "permissions model", "billing architecture"],
      },
      {
        n: "03",
        title: "Build in weekly releases",
        duration: "Weeks 3–10",
        body: "Features shipped weekly to a real environment you can use. Billing and permissions get built alongside features rather than bolted on at the end, which is the difference between a demo and a product you can charge for.",
        deliverables: ["weekly deployed releases", "billing integration", "admin tooling"],
      },
      {
        n: "04",
        title: "Harden and hand over",
        duration: "Weeks 10–12",
        body: "Load testing, monitoring, error tracking, and documentation. We hand over the repository, the infrastructure, and a runbook written for whoever you hire next. Codroon builds so your team can take over, not so they need us.",
        deliverables: ["production deployment", "monitoring and alerting", "repo, docs, runbook"],
      },
    ],
  },

  // ⚠️ Zothix: cut anything Codroon hasn't shipped with.
  tech: {
    heading: "The stack Codroon builds SaaS on",
    intro:
      "Proven, hireable, and boring where boring is correct. Your future engineering team inherits these decisions.",
    groups: [
      {
        title: "Application",
        body: "Next.js, React, and TypeScript. Server-rendered where it matters for SEO and first load, which for a SaaS marketing surface is most of it.",
      },
      {
        title: "Data and tenancy",
        body: "PostgreSQL with row-level security for tenant isolation, enforced at the database rather than trusted to application code, so one missed WHERE clause isn't a data breach. Redis for caching and sessions, read replicas when traffic earns them.",
      },
      {
        title: "Billing",
        body: "Stripe Billing with proper webhook reconciliation, usage metering where the pricing model needs it, and dunning for failed payments. Built to survive plan changes, proration, and refunds without manual intervention.",
      },
      {
        title: "Auth and permissions",
        body: "Clerk or Auth.js for standard needs, WorkOS when enterprise customers start asking for SAML SSO and directory sync. Role and permission models designed against your actual org structures, not a generic admin/user split.",
      },
      {
        title: "Reliability and observability",
        body: "Sentry for errors, OpenTelemetry for tracing, structured logging, and alerting that fires before a customer notices. CI/CD with real tests, because at this stage a broken deploy affects everyone at once.",
      },
      {
        title: "Infrastructure",
        body: "AWS and Docker, deployed to your accounts under your name. Infrastructure as code so it's reproducible and reviewable rather than clicked together once and forgotten.",
      },
    ],
  },

  industries: {
    heading: "Where teams bring us in",
    intro: "Codroon joins SaaS projects at four different points.",
    rows: [
      {
        title: "Building a SaaS from scratch",
        body: "You've validated demand through consulting, a waitlist, or a manual version you've been running by hand, and now it needs to be a product. The architecture conversation matters most here because nothing is set yet.",
      },
      {
        title: "An MVP that outgrew itself",
        body: "It works, people pay, and the code is fighting you. Usually the tenancy model or the data schema was right for ten customers and wrong for a hundred. We scope what actually has to change rather than proposing a rewrite by reflex.",
      },
      {
        title: "Productising an internal tool",
        body: "You built something for yourself, other companies asked for it, and now it needs tenancy, billing, and onboarding. The highest hit rate of any SaaS work we do, because demand is already proven.",
      },
      {
        title: "A product that's working but straining",
        body: "Slow queries, rising bills, timeouts under load. This is diagnostic work before it's engineering work. Most performance problems live in three places, and finding them beats rebuilding.",
      },
    ],
  },

  faq: {
    heading: "SaaS development: common questions",
    quickAnswers:
      "Most SaaS builds take six to twelve weeks and cost $20,000–$60,000. We build multi-tenant with database-level isolation by default, integrate Stripe Billing properly, and hand over a codebase your own team can maintain. The architecture review is free.",
    items: [
      {
        q: "Should we build multi-tenant from day one?",
        a: "Almost always yes. Multi-tenant with row-level isolation costs slightly more upfront and vastly less later. Going the other direction means a migration under load with customers watching. The exception is if your entire business is three large contracts with strict data-residency terms. Codroon will tell you which case you're in during the review.",
      },
      {
        q: "Can you work with our existing codebase?",
        a: "Yes, and it's a lot of what we do. We start by reading it and telling you honestly what's fine, what's risky, and what actually needs to change. Plenty of “we need a rewrite” conversations end with a two-week fix instead. A rewrite is the most expensive advice an agency can give and the easiest to give carelessly.",
      },
      {
        q: "How do you handle billing and subscriptions?",
        a: "Stripe Billing, with the parts teams usually skip: webhook reconciliation so your database and Stripe don't drift, proration on plan changes, usage metering where pricing needs it, and dunning for failed cards. Billing bugs cost real money and are found by customers, so we build them alongside features rather than at the end.",
      },
      {
        q: "Our first big customer wants SSO. Can you add that?",
        a: "Yes. SAML SSO and directory sync through WorkOS or an equivalent, which is how most SaaS products handle it without building an identity system. This is a normal moment in a company's life rather than a crisis, and it's a scoped piece of work, usually one to two weeks.",
      },
      {
        q: "We already have an in-house team. How does that work?",
        a: "Fine, and it's common. We work inside your repo, your standards, and your review process. Sometimes we take a workstream your team doesn't have capacity for; sometimes we do the architecture and your engineers build against it. We write documentation as we go specifically so handover isn't an event.",
      },
      {
        q: "How do you make sure it actually scales?",
        a: "By deciding the things that constrain scale early (tenancy, indexes, query patterns, background jobs) and by load testing before launch rather than discovering limits in production. We're not going to promise it handles a million users; we'll show you where the next bottleneck is and what it costs to move it.",
      },
      {
        q: "How much does SaaS development cost?",
        a: "$20,000–$60,000 for most builds, quoted as a fixed scope after the free architecture review. Codroon doesn't bill hourly. You get a number and a date, and we hold both.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the range before publishing — highest band of the six.
  pricing: {
    heading: "What SaaS development costs",
    paragraphs: [
      "Most SaaS builds with Codroon run $20,000–$60,000 and take six to twelve weeks. A focused product with one user type and standard billing sits at the lower end. Multiple roles, usage-based pricing, integrations, and enterprise auth sit at the upper.",
      "Performance and architecture work on an existing product is scoped separately and usually much smaller, often two to three weeks. If that's what you need, we'll say so rather than quoting you a rebuild.",
    ],
  },

  finalCta: {
    heading: "Let's settle the architecture before you build on it",
    body: "Forty-five minutes, no prep, no commitment. Tell us what the product does and where you expect it to be in a year, and you'll leave with an architecture recommendation, a scope, and a real number, even if you build it somewhere else.",
    cta: "Book a free discovery call",
  },
};