import type { ServicePageContent } from "./types";

/**
 * /services/custom-software-development — content from the approved
 * copy deck (codroon-custom-software-page-copy.md), VERBATIM. Do not
 * edit copy here without an updated deck.
 *
 * Page 6 of 6 — the hub page. Section 5 (categoryHub) distributes
 * authority to the five specific pages; the deck says never cut it.
 * ⚠️ Zothix sign-off before publishing: $15,000–$50,000 / 6–12 weeks,
 * user training promise (step 04), staged legacy replacement with data
 * sync, SSO via existing IdP, standalone paid discovery.
 */
export const customSoftwareDevelopment: ServicePageContent = {
  slug: "custom-software-development",

  meta: {
    title: "Custom Software Development Company | Dallas, TX | Codroon",
    description:
      "Codroon is a custom software development company building internal tools, bespoke applications, and legacy replacements. Fixed price, 6–12 weeks. Dallas.",
    ogTitle: "Custom Software Development Company | Codroon",
    ogDescription:
      "Software built around how your business actually works. Internal tools, bespoke applications, legacy replacement. Book a free discovery call.",
  },

  hero: {
    eyebrow: "Custom Software Development",
    h1: "Custom Software Development Company",
    subhead:
      "Codroon is a custom software development company that builds software around how your business actually works: internal tools, bespoke applications, and replacements for systems that stopped fitting years ago. Fixed price, weekly demos, and a codebase your team can maintain without us.",
    cta: "Build your software",
  },

  whatIs: {
    heading: "What is custom software development?",
    paragraphs: [
      "Custom software development is building an application specifically for one organisation's process, rather than adapting that process to fit a product built for everyone. It's the right call when the way you work is a genuine advantage, or when what's available off the shelf gets you sixty percent of the way and the remaining forty is where the value lives.",
      "It's the wrong call more often than most agencies will admit. If a $50-a-month tool does ninety percent of it, buy the tool. Codroon builds custom software when the alternative is worse: when the spreadsheet has become critical infrastructure, when the system that runs your operation is a decade past fitting, or when the workaround costs a person a week every month. We'll tell you which side of that line you're on before you spend anything.",
    ],
  },

  comparison: {
    heading: "Fixed price vs time and materials vs hiring developers",
    intro:
      "Three ways to buy custom software. The difference isn't cost. It's who carries the risk when the project takes longer than anyone expected.",
    columns: ["Fixed price", "Time & materials", "Staff augmentation"],
    // Codroon works fixed price — first column
    highlightColumn: 0,
    rows: [
      {
        label: "How you pay",
        cells: ["One agreed number", "Hourly or daily, as it goes", "Monthly per developer"],
      },
      {
        label: "Who carries overrun risk",
        cells: ["The vendor", "You", "You"],
      },
      {
        label: "You're actually buying",
        cells: ["An outcome", "Effort", "Capacity"],
      },
      {
        label: "Best when",
        cells: [
          "Scope can be defined up front",
          "Scope genuinely can't be",
          "You have the management to direct them",
        ],
      },
      {
        label: "Falls apart when",
        cells: [
          "Requirements shift constantly",
          "Nobody's watching the burn",
          "You have no technical lead",
        ],
      },
      {
        label: "Change costs",
        cells: [
          "A change order, discussed",
          "Invisible until the invoice",
          "Absorbed, and the deadline moves",
        ],
      },
      {
        label: "Typical of",
        cells: ["Studios that scope properly", "Most agencies", "Offshore dev shops"],
      },
    ],
    closing:
      "Codroon works fixed price. It requires more discovery work up front and it means we carry the risk of our own estimates, which is the point. If your scope genuinely can't be defined yet, the honest first step is a paid discovery, not a build.",
  },

  subServices: {
    heading: "Our custom software development services",
    intro:
      "Codroon builds four kinds of custom software. Most engagements start with the first or the last.",
    cards: [
      {
        title: "Internal Tools & Operations Software",
        body: "The systems your team uses to actually run the business: dashboards, approvals, scheduling, inventory, reporting. Usually replacing a spreadsheet that three people depend on and one person understands.",
      },
      {
        title: "Bespoke Business Applications",
        body: "Customer-facing software that isn't a SaaS product: portals, booking systems, quoting tools, marketplaces. Built around your process rather than bent into someone else's template.",
      },
      {
        title: "Legacy Modernisation",
        body: "Replacing or extending a system that still works but has become the thing holding you back. Done in stages, with the old system running until the new one has earned the switch.",
      },
      {
        title: "Technical Discovery & Scoping",
        body: "For when you know something's broken but not what to build. A structured engagement producing a specification, an architecture, and a real cost, which you can then build with us or take to anyone.",
      },
    ],
  },

  // The hub — the deck's most valuable block for the whole set. Never cut.
  categoryHub: {
    heading: "Looking for something more specific?",
    body: "Custom software is the broad answer. If your project has a shape, these are more specific:",
    links: [
      {
        label: "AI Agent Development",
        href: "/services/ai-agent-development",
        descriptor: "software that decides and acts on its own",
      },
      {
        label: "Generative AI Development",
        href: "/services/generative-ai-development",
        descriptor: "AI features inside an existing product",
      },
      {
        label: "AI Integration",
        href: "/services/ai-integration",
        descriptor: "connecting AI to systems you already run",
      },
      {
        label: "MVP Development",
        href: "/services/mvp-development",
        descriptor: "proving an idea before committing to it",
      },
      {
        label: "SaaS Development",
        href: "/services/saas-development",
        descriptor: "multi-tenant products with billing",
      },
    ],
    closing: "Not sure which? That's a normal place to start. The discovery call sorts it.",
  },

  // ⚠️ Zothix: confirm timelines before publishing.
  process: {
    heading: "How Codroon builds custom software",
    intro:
      "Four steps, six to twelve weeks, and it starts with the problem rather than the solution you came in describing.",
    steps: [
      {
        n: "01",
        title: "Problem definition",
        duration: "Free, 45 minutes",
        body: "Most people arrive describing software. We go back one step and ask what's actually breaking, because the answer is frequently a different build, or a much smaller one. You leave with a written problem statement, a recommended approach, and a real number, yours to keep either way.",
        deliverables: ["problem statement", "recommended approach", "fixed price and timeline"],
      },
      {
        n: "02",
        title: "Discovery and specification",
        duration: "Weeks 1–2",
        body: "We sit with the people who'll use it and map how the work happens now, including the workarounds nobody documented. That's where the requirements actually live. You get a specification you could hand to any developer, not just us.",
        deliverables: ["process map", "written specification", "screens and data model"],
      },
      {
        n: "03",
        title: "Build in weekly demos",
        duration: "Weeks 3–8",
        body: "Working software every week, in front of the people who'll use it. Internal tools fail on adoption more often than on engineering, so the users see it early and often rather than at a launch meeting.",
        deliverables: ["weekly working builds", "integrations", "test coverage"],
      },
      {
        n: "04",
        title: "Deploy, train, hand over",
        duration: "Weeks 8–12",
        body: "We deploy, run training with the actual users, and hand over the repository with documentation written for whoever maintains it next. Software nobody was taught to use is shelfware, however well it was built.",
        deliverables: ["production deployment", "user training", "repo, docs, runbook"],
      },
    ],
  },

  // ⚠️ Zothix: cut anything Codroon hasn't shipped with; SSO scope note.
  tech: {
    heading: "The stack Codroon builds on",
    intro:
      "Chosen for how easy they'll be to hire for in three years, not for how interesting they are today.",
    groups: [
      {
        title: "Application",
        body: "Next.js, React, and TypeScript. Standard, well-documented, and familiar to any developer you bring in later. That matters more for custom software than for anything else we build, because you'll own it for years.",
      },
      {
        title: "Backend and data",
        body: "Node and Python, PostgreSQL as the default. We also work against databases you already have rather than insisting on a migration you didn't ask for.",
      },
      {
        title: "Integration",
        body: "REST, GraphQL, webhooks, and queues for connecting to the systems already running your business: accounting, CRM, ERP, warehouse. Most custom software is only useful if it talks to what's already there.",
      },
      {
        title: "Auth and access",
        body: "SSO through your existing identity provider, with role and permission models built to match how your organisation actually delegates authority.",
      },
      {
        title: "Reliability",
        body: "Sentry for errors, structured logging, automated backups, and monitoring. Internal tools become critical faster than anyone plans for, so they get treated as critical from the start.",
      },
      {
        title: "Infrastructure",
        body: "AWS and Docker, deployed to your accounts under your name. Infrastructure as code, so it's reproducible rather than clicked together once and forgotten.",
      },
    ],
  },

  industries: {
    heading: "When custom software is the right answer",
    intro:
      "Four situations where building beats buying. If yours isn't one of these, Codroon will probably tell you to buy something instead.",
    rows: [
      {
        title: "The spreadsheet that became infrastructure",
        body: "It started as a tracker. Now four departments depend on it, one person understands the formulas, and everyone is quietly afraid of the day they leave. This is the most common custom software project there is.",
      },
      {
        title: "Software that no longer fits the business",
        body: "It was right when you bought it. The business changed and it didn't. Your team now spends real hours a week working around it, and the workaround has become the process.",
      },
      {
        title: "A process nobody can hire fast enough for",
        body: "The work scales linearly with headcount and you're out of headcount. Usually a data-entry, reconciliation, or coordination bottleneck that software handles in a fraction of the time.",
      },
      {
        title: "A system only one person understands",
        body: "Built by a contractor years ago, undocumented, and still load-bearing. The risk isn't that it breaks. It's that nobody can change it. Replacement here is as much about documentation as code.",
      },
    ],
  },

  faq: {
    heading: "Custom software development: common questions",
    quickAnswers:
      "Most custom software projects take six to twelve weeks and cost $15,000–$50,000, quoted as a fixed price. You own the code and the documentation, and it's built on a standard stack any developer can maintain. The problem definition call is free.",
    items: [
      {
        q: "Should we build custom software or buy something off the shelf?",
        a: "Buy, if a product does eighty percent or more of what you need. The cost of custom software isn't the build. It's owning it forever. Building makes sense when your process is genuinely a competitive advantage, when nothing available fits, or when the licensing cost of the thing that almost works exceeds building your own. Codroon will tell you which applies before you commit.",
      },
      {
        q: "We don't have a spec. Where do we start?",
        a: "That's normal and it's what discovery is for. You need to know what's breaking and who it's breaking for. We handle turning that into a process map, a specification, and screens. You can run a discovery engagement with us and take the output to any developer. It isn't contingent on us building it.",
      },
      {
        q: "What happens if requirements change mid-build?",
        a: "Some change is expected and absorbed. Real scope changes get discussed as a change order with a number attached, before the work happens rather than on an invoice afterwards. That's the trade-off of fixed price: less flexibility than time and materials, and no surprises.",
      },
      {
        q: "Can you replace a system we depend on without downtime?",
        a: "Yes, by staging it. The old system keeps running while the new one takes over one workflow at a time, with data syncing between them during the crossover. It's slower than a cutover and dramatically less likely to take your operation offline for a day.",
      },
      {
        q: "Who maintains it after you're done?",
        a: "Your team, or whoever you hire. That's the intention: standard stack, real documentation, a runbook, and training at handover. If you'd rather Codroon maintain it, that's an optional retainer, never a requirement. Software you can't leave isn't software you own.",
      },
      {
        q: "Only one person understands our current system. Is that a problem?",
        a: "It's the reason to act, not a blocker. Part of discovery is extracting what that person knows into something written down, which has value even if you never build anything. We've found it's usually the first time anyone has documented how the business actually runs.",
      },
      {
        q: "How much does custom software development cost?",
        a: "$15,000–$50,000 for most projects, quoted as a fixed price after discovery. Codroon doesn't bill hourly. You get a number and a date, and we hold both.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the range before publishing.
  pricing: {
    heading: "What custom software development costs",
    paragraphs: [
      "Most custom software projects with Codroon run $15,000–$50,000 and take six to twelve weeks. A focused internal tool replacing one process sits at the lower end. Multiple user roles, integrations with existing systems, and a staged legacy replacement sit at the upper.",
      "We work fixed price, quoted after discovery. Not hourly, and not a rate card that grows with the project. If discovery shows an off-the-shelf product does the job, we'll say so and you'll have spent nothing.",
    ],
  },

  finalCta: {
    heading: "Let's work out what's actually broken",
    body: "Forty-five minutes, no prep, no commitment. Tell us what isn't working and you'll leave with a problem statement, a recommended approach, and a real number, even if the answer turns out to be buying something instead.",
    cta: "Book a free discovery call",
  },
};