import type { ToolLandingContent } from "./types";

/**
 * /tools/mvp-cost-calculator — LANDING page content from the approved
 * copy deck (codroon-mvp-cost-estimator-copy.md), VERBATIM. Do not
 * edit copy here without an updated deck.
 *
 * Sibling of the agent estimator: same shell, ZERO shared content
 * (table, drivers, signature section, comparison, glossary, FAQ all
 * unique). Signature section = the cut list, which also feeds the
 * estimator flow's "leaner version" output — keep it config, not JSX.
 *
 * ⚠️ Zothix: every number needs sign-off (cost table + timelines, all
 * cut-list figures, freelancer/no-code comparison, the $5,000 FAQ,
 * and $10,000–$40,000 parity with the MVP service page). Timelines
 * are 2–6 weeks site-wide per the confirmed pricing/timeline
 * alignment; the marketplace 6–8 week exception is gone.
 */
export const mvpCostCalculator: ToolLandingContent = {
  slug: "mvp-cost-calculator",

  meta: {
    title: "MVP Cost Calculator: Free Estimate in 3 Minutes | Codroon",
    description:
      "Free MVP cost calculator. Get a build range, a timeline, and a list of what to cut to ship sooner, in about three minutes. No signup, no email required.",
    ogTitle: "MVP Cost Estimator: Free, No Signup",
    ogDescription:
      "Most MVPs cost $10,000–$40,000 and take 2–6 weeks. Find out where yours lands, and what you could cut to ship faster.",
  },

  hero: {
    eyebrow: "Free Tool · No Signup Required",
    h1: "MVP Cost Estimator",
    subhead:
      "See what your MVP costs to build, how long it takes, and the part nobody shows you: what you could cut to ship sooner and cheaper. Six questions, about three minutes. If what you're describing is really a V1, it'll tell you that too.",
    cta: "Start estimate",
    microcopy: "No email required to see your number.",
    // Static illustrative mockup — labelled as an example, never a quote.
    preview: {
      exampleLabel: "Example",
      title: "Your estimated build",
      range: "$24,000–$30,000",
      lines: [
        { label: "Core product, 2 user types", value: "$17,000" },
        { label: "Subscriptions", value: "$3,000" },
        { label: "Integrations × 2", value: "$4,000" },
      ],
      footerRows: [{ label: "Timeline", value: "4–5 weeks" }],
      // the page's most distinctive output — visible from the hero
      leanerRow: { label: "Leaner version", value: "$17,000 · 3–4 weeks" },
    },
  },

  quickAnswer:
    "Most MVPs cost $10,000 to $40,000 and take two to six weeks to build. A single-user tool with one core workflow sits at the low end. A two-sided marketplace with payments sits at the top. The biggest cost driver isn't the feature list. It's how many types of user the product has, because each one means its own screens, permissions, and flows. This MVP cost calculator gives you a build range, a timeline, and a list of what to cut if the number comes back higher than you hoped.",

  howItWorks: {
    heading: "How this MVP cost calculator works",
    steps: [
      {
        title: "Tell us what you're building",
        body: "Product type and how many kinds of user it has. These two answers move the number more than everything else combined.",
      },
      {
        title: "Tell us what's involved",
        body: "Payments, integrations, whether AI is part of it, and what design you already have.",
      },
      {
        title: "See the cost, the timeline, and the cut list",
        body: "A build range, a realistic timeline, and a leaner version with what we'd drop to get there. No email, no call required.",
      },
    ],
  },

  costDrivers: {
    heading: "What actually drives MVP development cost",
    intro:
      "Six things move the number. Founders usually assume it's the feature count. It isn't. It's these, in rough order of impact:",
    items: [
      {
        title: "How many types of user it has",
        body: "The most underestimated driver by a wide margin. Every user type is its own set of screens, its own permission rules, and its own flows to design, build, and test. Going from one user type to two doesn't add fifty percent. It often adds closer to eighty. A marketplace has two by definition, which is why marketplaces are the most expensive MVP shape.",
      },
      {
        title: "Whether money moves through it",
        body: "No payments is simplest. Subscriptions add Stripe, plan logic, trials, and failed-payment handling. Marketplace payouts, where money moves between users, add compliance, escrow logic, and dispute handling, and roughly double the payments work.",
      },
      {
        title: "How much of it is genuinely new",
        body: "Auth, file upload, email, search, and notifications are solved problems with good libraries behind them. The parts specific to your idea are where the real hours go. A product that's ninety percent standard machinery and ten percent novel is cheap. The reverse isn't.",
      },
      {
        title: "What design you already have",
        body: "Finished designs speed things up. No designs is normal and we handle it, using a component system rather than designing from scratch. Partial designs are occasionally the slowest option, because reconciling half a system with a new one costs more than starting clean.",
      },
      {
        title: "Third-party integrations",
        body: "Each one is auth, error handling, rate limits, and testing. A documented API is a day. A system with no real API is a week and a workaround you'll want to revisit later.",
      },
      {
        title: "Whether AI is a feature or the product",
        body: "An AI feature bolted onto a normal product adds moderately. An AI-native MVP, where the model is the product, needs evaluation, guardrails, and cost modelling from day one, and prices closer to an agent build.",
      },
    ],
  },

  // ⚠️ Zothix: confirm every figure and timeline.
  costTable: {
    heading: "Typical MVP cost by product type",
    intro:
      "Base ranges before heavy integrations or custom design. The last column is what we'd cut first if the number needs to come down.",
    cornerHeader: "Product type",
    columns: ["What's included", "Build cost", "Timeline", "Cut first"],
    rows: [
      {
        label: "Landing page + waitlist",
        cells: ["One page, email capture, analytics", "$3,000–$4,500", "3–5 days", "—"],
      },
      {
        label: "Single-user tool",
        cells: ["One user type, core loop, no payments", "$8,000–$14,000", "2–3 weeks", "Admin panel"],
      },
      {
        label: "SaaS MVP",
        cells: ["Auth, subscriptions, one user type", "$12,000–$18,000", "3–4 weeks", "Second user type"],
      },
      {
        label: "AI-native MVP",
        cells: ["The model is the product", "$16,000–$26,000", "4–5 weeks", "Multi-model support"],
      },
      {
        label: "Marketplace MVP",
        cells: ["Two sides, payments, matching", "$20,000–$32,000", "5–6 weeks", "Ratings and messaging"],
      },
    ],
    closing:
      "The first row isn't an MVP and it's here on purpose. If you haven't spoken to thirty potential users yet, a waitlist page proves more in a fortnight than a product does in two months, and it costs about a tenth as much.",
  },

  // ⚠️ Zothix: the cut list is the most quotable content here — every
  // figure needs to be one you'd stand behind. This config also feeds
  // the estimator flow's "leaner version" output.
  cutList: {
    heading: "What you can cut, and what it saves",
    intro:
      "Nobody publishes this, and it's the most useful thing we can tell you. If the estimate comes back higher than your budget, these are the first six things to go, in the order we'd drop them.",
    items: [
      {
        title: "Admin panel",
        saves: "$3,000–$5,000",
        timeSaved: "4–5 days",
        body: "You'll have a handful of users at launch. Manage them from the database, a spreadsheet, or a Retool screen. Build a real admin panel when the manual version starts costing you hours.",
      },
      {
        title: "Second user type",
        saves: "$5,000–$8,000",
        timeSaved: "1–2 weeks",
        body: "Launch for whichever side you can reach first. If it's a marketplace, run the other side manually. Matching people yourself teaches you more about the product than software would.",
      },
      {
        title: "Custom design",
        saves: "$3,000–$6,000",
        timeSaved: "1 week",
        body: "A well-implemented component system looks professional and ships fast. Custom design earns its cost once you know who you're designing for, which by definition you don't yet.",
      },
      {
        title: "Onboarding flow",
        saves: "$2,000–$4,000",
        body: "At ten users you can onboard them personally, over a call. You'll learn where people get stuck, which is exactly what the automated flow would have needed to know.",
      },
      {
        title: "Settings and preferences",
        saves: "$1,500–$3,000",
        body: "Every toggle is a branch to build and test. Pick sensible defaults and add options when users ask for specific ones.",
      },
      {
        title: "Notifications beyond email",
        saves: "$2,000–$3,000",
        body: "Email covers it at MVP scale. Push, SMS, and in-app notification centres are V1 features.",
      },
    ],
    whatNotToCut: {
      heading: "What not to cut",
      body: "Three things stay regardless: authentication done properly, payments if money is part of the bet, and analytics. Skipping auth creates a security problem you'll pay for later. Skipping analytics means you ship, get users, and still can't tell whether it worked, which defeats the entire point of building an MVP.",
    },
  },

  whenNot: {
    heading: "When you don't need an MVP yet",
    intro:
      "Three situations where the honest answer is something smaller. Codroon would rather say it here than in week four.",
    items: [
      {
        title: "You haven't talked to enough people",
        body: "If you haven't had thirty conversations with people who have the problem, an MVP is an expensive way to have the thirty-first. A landing page with a waitlist tests demand in a fortnight for a fraction of the cost.",
      },
      {
        title: "You're describing a V1",
        body: "Admin panels, three user roles, a settings page, and integrations usually means you're describing the product you want in year one, not the smallest thing that proves the bet. The estimator will flag it, and that conversation saves more money than any discount we could offer.",
      },
      {
        title: "A no-code tool would answer the same question",
        body: "If your idea is a form, a database, and some logic, build it in Bubble or Airtable in a week. Once it's straining under real users, real volume, and real limitations, that's the signal to build properly, and you'll have a much better specification for it.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the freelancer and no-code figures.
  optionsTable: {
    heading: "How building with a studio compares",
    columns: ["Build with Codroon", "Freelance developers", "No-code platform"],
    highlightColumn: 0,
    rows: [
      // No-code upfront matches the estimator's results table: an
      // agency-built no-code MVP, not a bare subscription (client,
      // 2026-08-02: the $/mo figure read as implausibly low).
      { label: "Upfront", cells: ["$10,000–$40,000", "$5,000–$30,000", "$8,000–$25,000 with an agency"] },
      {
        label: "Time to launch",
        cells: ["2–6 weeks", "2–4 months, typically", "1–3 weeks"],
      },
      {
        label: "Who holds the plan",
        cells: ["Us, and it's written down", "You", "You"],
      },
      {
        label: "You end up owning",
        cells: ["Code, infrastructure, docs", "Code, quality varies", "Nothing"],
      },
      {
        label: "When it breaks",
        cells: ["Documented, any dev can pick it up", "Depends who wrote it", "Wait for the platform"],
      },
      {
        label: "Can you hire on top of it",
        cells: ["Yes, standard hireable stack", "Sometimes", "No, rebuild required"],
      },
      {
        label: "Best when",
        cells: [
          "The bet is worth building properly",
          "You can manage engineering yourself",
          "You're testing whether anyone wants it",
        ],
      },
    ],
    closing:
      "No-code first is genuinely good advice and we give it often. The reason to build properly is when you already have signal and the ceiling is costing you, not because building feels more like a real company.",
  },

  glossary: {
    heading: "Terms used in this MVP cost calculator",
    terms: [
      {
        term: "MVP (minimum viable product)",
        definition:
          "The smallest version of a product that still answers the question you're asking, usually whether people will use it and pay. Not a cheap version of the full product; a different product, scoped around one bet.",
      },
      {
        term: "Core loop",
        definition:
          "The single path a user takes to get the value you're promising. Everything outside it is a candidate for cutting.",
      },
      {
        term: "V1",
        definition:
          "The first real version: polish, edge cases, admin tooling, multiple roles. Comes after an MVP has proved something, and typically costs three to five times as much.",
      },
      {
        term: "Product-market fit",
        definition:
          "The point where people who try it keep using it and tell others. What an MVP exists to test for, and what a feature list can't tell you.",
      },
      {
        term: "Technical debt",
        definition:
          "Shortcuts taken to ship faster that cost time later. Some is correct at MVP stage. The mistake is taking it accidentally rather than deliberately.",
      },
      {
        term: "Runway",
        definition:
          "How long your money lasts at current burn. The real constraint on MVP scope, and the reason a four-week build often beats a better twelve-week one.",
      },
    ],
  },

  faq: {
    heading: "MVP cost: common questions",
    items: [
      {
        q: "How much does it cost to build an MVP?",
        a: "Most MVPs cost $10,000 to $40,000. A single-user tool with one core workflow sits at the low end; a two-sided marketplace with payments sits at the top. The number is driven less by how many features you list and more by how many types of user the product serves. Each one is its own set of screens, permissions, and flows.",
      },
      {
        q: "How long does an MVP take to build?",
        a: "Two to six weeks for most products. A single-user tool with one core workflow ships in two to three. A marketplace or an AI-native product runs closer to five or six, because you're effectively building two things that have to work together. The constraint is almost never engineering speed. It's how much you're willing to leave out.",
      },
      {
        q: "How accurate is this estimate?",
        a: "It's a range, not a quote. It's built from what Codroon has actually charged for comparable work and tuned to come in slightly conservative. Integration difficulty is the main variable we can't see from six questions: a documented API and a system without one produce very different weeks.",
      },
      {
        q: "Do I need to give you my email to see the estimate?",
        a: "No. The number appears immediately. If you want the full breakdown as a PDF, including the cut list for your specific build, that's where we ask for an email, and it's optional.",
      },
      {
        q: "Can I build an MVP with no-code instead?",
        a: "Often yes, and it's frequently the better first move. If your idea is a form, a database, and some logic, Bubble or Airtable will test it in a week. Build properly when you have signal and the platform's ceiling is costing you real money or real users.",
      },
      {
        q: "What if my budget is $5,000?",
        a: "Then don't build an MVP yet. Build a landing page with a waitlist, or a no-code version, and spend the rest talking to users. $5,000 buys a partial product, and a partial product answers no questions at all. We'd rather tell you that than take the project and both of us regret it.",
      },
      {
        q: "Why is the estimate a range rather than one number?",
        a: "Because the honest version has a range in it. Six questions can't see how messy your integrations are or how firm your requirements really are. We narrow it to a fixed price after the scoping call, and that price is the one we hold.",
      },
      {
        q: "What's not included in the build cost?",
        a: "Hosting and third-party services after launch, typically $50 to $300 a month at MVP scale. Ongoing changes after handover, unless you want a retainer. And anything the scoping call reveals that six questions couldn't, which is why the estimate is a range and the quote is a number.",
      },
    ],
  },

  related: [
    { label: "MVP Development Services", href: "/services/mvp-development" },
    { label: "SaaS Development Services", href: "/services/saas-development" },
    { label: "AI Agent Cost Calculator", href: "/tools/ai-agent-cost-calculator" },
  ],

  finalCta: {
    heading: "See what your MVP would cost",
    body: "Three minutes, six questions, no email needed to see the number. You'll get a build range, a timeline, and a leaner version with exactly what we'd cut to get there.",
    cta: "Start estimate",
  },
};
