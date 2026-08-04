import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-06-saas-founder-stack-v2.md.
 * Excluded as internal scaffolding: the header block above META and NOTES.
 *
 * ⚠️ Deck instruction, for the client not the code: "Confirm every tool
 * named. The post claims this is what you actually run, which makes it
 * credible and also checkable. Cut anything you do not use. Specifically
 * confirm Clerk, PostHog, Sentry, Render, Resend, and Supabase."
 */
export const saasFounderTools2026: BlogPost = {
  slug: "saas-founder-tools-2026",

  title: "The SaaS Founder Stack: What We Actually Run in 2026",
  metaTitle: "The SaaS Founder Stack: What We Actually Run in 2026",
  metaDescription:
    "Not a list of every tool. The specific stack we use to ship SaaS products in weeks, what each one replaced, and the two we were wrong about.",

  category: "BUILDING",
  coverHeadline: "The stack.\nWhat we run.\nWhat it cost.",
  coverSubtitle: "Not the top ten. The ones that survived",
  watermark: "STACK",

  publishedAt: "2026-07-20",
  updatedAt: "2026-07-20",
  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "Tool sprawl is the problem, not tool selection.",
      rest: "Most early stacks carry twelve subscriptions doing the work of six.",
    },
    {
      lead: "Boring is a hiring decision.",
      rest: "Next.js, TypeScript, and Postgres matter because the next engineer already knows them.",
    },
    {
      lead: "Never build authentication or payments.",
      rest: "Two solved problems that each cost about two weeks to rebuild worse.",
    },
    {
      lead: "Observability goes in before the first user,",
      rest: "not after the first outage. The point is knowing before somebody tells you.",
    },
    {
      lead: "Choose tools you can leave.",
      rest: "Anything holding your data with no export path is a decision you will regret at the worst possible moment.",
    },
    {
      lead: "Almost all of this is free",
      rest: "at the scale where budget is the binding constraint.",
    },
  ],

  intro: [
    "Every article of this kind has the same defect. It lists ten individually good things and never establishes whether they work together, what they cost once the product is real, or whether the author uses any of them.",
    "So this is not a top ten. It is the stack we run at Codroon across our own products and most client builds, what each thing replaced, and the two choices we got wrong and reversed.",
  ],

  sections: [
    {
      id: "boring-is-a-hiring-decision",
      heading: "Boring is a hiring decision",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Next.js with TypeScript and Tailwind is the most hireable frontend stack that exists, and that property matters more than any technical argument anyone can make about alternatives.",
            "The reasoning is about year two rather than week one. When you bring engineering in-house, or hand a codebase to somebody else, you want a stack the next developer already knows. Choosing something more interesting means choosing a smaller hiring pool and a longer onboarding period, and both of those costs arrive precisely when the company can least afford them.",
            "This is the general principle behind most of the choices below. The question is rarely which tool is best. It is which tool leaves you with the fewest problems eighteen months from now, and those are different questions with different answers.",
            "Cost is zero. You pay for hosting rather than for the framework.",
          ],
        },
      ],
    },
    {
      id: "auth-and-payments-are-solved",
      heading: "Authentication and payments are solved, and rebuilding them is the common mistake",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Two categories where building your own is the most frequent early error we see, and both fail for the same reason. They appear simple and are not.",
            "Authentication means Clerk or Auth.js. Sessions, password resets, social login, multi-factor, organisations, and the security implications of getting any of it slightly wrong. Clerk handles it with a component you drop in. Auth.js gives you more control and less magic. Building it yourself is a two-week estimate that becomes six weeks and produces something worse than the thing you would have installed in an afternoon.",
            "Payments means Stripe, and not only checkout. Subscriptions, trials, proration when somebody upgrades mid-cycle, failed card recovery, invoicing, and tax. Stripe Billing covers all of it. The part teams skip is webhook reconciliation, which keeps your database and Stripe agreeing about what happened, and skipping it produces billing bugs that cost real money and are discovered by customers rather than by you.",
            "Both have free tiers that last well past launch, which means the case for building your own is not even a cost argument. It is an instinct, and it is an expensive one.",
          ],
        },
      ],
    },
    {
      id: "postgres-does-more",
      heading: "Postgres does more than people reach for other databases to do",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Postgres for anything relational, which in practice is nearly everything. It is the most capable open database available and it handles jobs that regularly send teams looking for a second system. JSON documents, full-text search, and vector search through pgvector, which means an AI feature frequently does not require a separate vector database at all. That is one fewer service, one fewer bill, and one fewer thing to keep in sync.",
            "Supabase if you want Postgres with an API layer, authentication, storage, and row-level security without standing up infrastructure. It is Postgres underneath, so there is no proprietary query language to learn and no migration to fear later, which is the property that makes it a safe default rather than a lock-in.",
            "We use it on smaller builds and reach for raw Postgres on AWS when scale or compliance demands it. The free tier is generous. Note that inactive projects pause, which surprises people who leave a project alone for a fortnight and return to a slow first request.",
          ],
        },
      ],
    },
    {
      id: "observability-before-first-user",
      heading: "Observability goes in before the first user",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "This is the section founders skip and it is the one that separates a product from a demonstration.",
            "Sentry for errors, because you want to know a user hit an exception before they email you, and you want the stack trace when they do.",
            "PostHog for product analytics, meaning where people abandon onboarding, which feature nobody opens, and whether the change you shipped last week helped. It replaces three or four separate tools and has a genuinely usable free tier.",
            "Grafana when you depend on external services. If your product calls model providers or third-party APIs, you want a dashboard showing degradation before a support ticket does. We learned this building Decipher Engine, which calls around twenty external providers, where the practical reality is that one of them is having a bad day most weeks.",
            "The argument against doing this early is that there is nothing to measure yet, and the argument is wrong. Early users are where the sharpest signal exists, because there are few enough of them that individual behaviour is legible. Adding observability after something breaks means spending a day reconstructing what happened from logs that were not designed to answer the question.",
          ],
        },
      ],
    },
    {
      id: "ai-if-part-of-the-product",
      heading: "AI, if it is part of the product",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Claude, GPT, and Gemini behind a single abstraction, so that switching is a configuration change rather than a rewrite. This matters more than it sounds, because model pricing and capability shift every few months and being locked to a decision made in week one is a genuine cost.",
            "OpenRouter if you want many models behind one API. Replicate for image models. Langfuse or LangSmith for tracing and evaluations, because a generative feature without an evaluation suite is one you can change and hope about but cannot improve deliberately.",
            "The lever most teams miss is routing. Send simple steps to a cheaper model and reserve the frontier model for actual reasoning. It routinely halves the bill, and it is the first thing we examine on any AI build that has become expensive.",
          ],
        },
      ],
    },
    {
      id: "the-stack-and-what-it-costs",
      heading: "The stack, and what it costs to start",
      blocks: [
        {
          kind: "table",
          caption:
            "The tools Codroon runs by job, with the free tier available and the point at which each one starts costing money.",
          columns: ["What we use", "Free tier", "When you start paying"],
          cornerHeader: "Job",
          rows: [
            {
              label: "Frontend",
              cells: ["Next.js, TypeScript, Tailwind", "Free permanently", "Never"],
            },
            { label: "Hosting", cells: ["Vercel", "Yes", "Real traffic"] },
            {
              label: "Backend services",
              cells: ["Render", "Yes", "First always-on service"],
            },
            {
              label: "Database",
              cells: ["Postgres or Supabase", "Yes", "Storage and connections"],
            },
            {
              label: "Authentication",
              cells: ["Clerk or Auth.js", "Yes", "Past a few thousand users"],
            },
            {
              label: "Payments",
              cells: ["Stripe", "No fee, percentage per transaction", "First sale"],
            },
            { label: "Errors", cells: ["Sentry", "Yes", "Event volume"] },
            { label: "Analytics", cells: ["PostHog", "Generous", "Event volume"] },
            { label: "Monitoring", cells: ["Grafana", "Yes", "Rarely"] },
            { label: "Email", cells: ["Resend", "Thousands per month", "Real volume"] },
            {
              label: "AI models",
              cells: ["Claude, GPT, Gemini", "Pay as you go", "Immediately"],
            },
            {
              label: "CI and deployment",
              cells: ["GitHub Actions", "Yes", "Heavy build minutes"],
            },
          ],
        },
      ],
    },
    {
      id: "two-we-were-wrong-about",
      heading: "Two we were wrong about",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "We built our own authentication once, on an early product, because it looked straightforward. It is straightforward until password reset, then session invalidation, then somebody asks for Google login, then multi-factor. Two weeks became six and the result was worse than a component we could have installed in an afternoon. We do not do it any more, and the lesson generalises. The features that look simple in authentication are the ones you have thought about, and the expensive ones are the ones you have not.",
            "We also skipped analytics until launch, reasoning that there was nothing to measure before there were users. The consequence was launching, acquiring users, and having no idea which part of onboarding was losing them. The instrumentation you want is the instrumentation that was already running when the interesting thing happened, which means it has to be in place before you know what the interesting thing will be.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "The SaaS stack: common questions",
    items: [
      {
        q: "What does this stack cost to run at launch?",
        a: "Close to nothing. Most of it has a free tier covering a product's first months. Realistically zero to fifty dollars a month until real traffic arrives, with Stripe's percentage on transactions being the first genuine cost and one that only exists once you have revenue.",
      },
      {
        q: "Is this not a lot of separate tools?",
        a: "Twelve jobs, each of which you would otherwise build. The failure mode is subscribing to twelve tools that each do part of a job rather than twelve that each do a whole one. Add a tool when something is broken, never because it was recommended.",
      },
      {
        q: "Supabase or plain Postgres?",
        a: "Supabase when you want to move quickly without managing infrastructure. Plain Postgres on AWS when scale, compliance, or data residency demands it. Supabase is Postgres underneath, so moving later is a migration rather than a rewrite, which is why it is a safe starting point.",
      },
      {
        q: "Do I need observability before I have users?",
        a: "Yes, and that is precisely the point. You want the error report before the email and funnel data from your first ten users rather than your first thousand, since early users produce the clearest signal.",
      },
      {
        q: "What would you cut if the budget were zero?",
        a: "Nothing on this list, because almost all of it is free at the scale where budget is zero. If you are paying for tools before you have users, that is the thing to examine rather than the list.",
      },
    ],
  },

  finalCta: {
    heading: "The stack is not the hard part",
    body: [
      "None of these choices explains why a build takes three weeks rather than three months. That comes from cutting scope hard before anybody opens an editor, and no tool substitutes for that decision.",
      "If you want to know what your product would actually cost and take, the estimator is free and does not ask for your email.",
    ],
    primary: { label: "Estimate your MVP →", href: "/tools/mvp-cost-calculator" },
    secondary: { label: "Book a free discovery call", href: null },
  },

  relatedLinks: [
    { label: "SaaS Development Services", href: "/services/saas-development" },
    { label: "MVP Development Services", href: "/services/mvp-development" },
    { label: "Decipher Engine, built on this stack", href: "/products/decipher-engine" },
  ],
};

export default saasFounderTools2026;
