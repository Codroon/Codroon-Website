import type { ServicePageContent } from "./types";

/**
 * /services/mvp-development — content from the approved copy deck
 * (codroon-mvp-development-page-copy.md), VERBATIM. Do not edit copy
 * here without an updated deck.
 *
 * Page 4 of 6 — positioned at the VALIDATE stage (SaaS page = scale).
 * ⚠️ Zothix sign-off before publishing: $10,000–$40,000 / 2–6 weeks,
 * the "2–6 week MVPs" landing-tag inconsistency (deck recommends 3–6
 * everywhere), naming Claude Code in the tech section, Clerk/Auth.js/
 * Stripe.
 */
export const mvpDevelopment: ServicePageContent = {
  slug: "mvp-development",

  meta: {
    title: "MVP Development Services for Startups | Dallas | Codroon",
    description:
      "Codroon provides MVP development services for founders: a working product in 2–6 weeks, scoped to prove one thing. Fixed price. Dallas, TX.",
    ogTitle: "MVP Development Services | Codroon",
    ogDescription:
      "A real product in 2–6 weeks, scoped to answer one question. Fixed price, you own the code. Book a free discovery call.",
  },

  hero: {
    eyebrow: "MVP Development",
    h1: "MVP Development Services",
    subhead:
      "Codroon provides MVP development services for founders who need a real product in front of real users, fast. We scope hard, cut everything that isn't the core loop, and ship something people can actually use in 2 to 6 weeks. Fixed price, you own the code.",
    cta: "Build your MVP",
  },

  whatIs: {
    heading: "What is MVP development?",
    paragraphs: [
      "MVP development is building the smallest version of a product that still answers the question you're actually asking, usually “will anyone use this, and will they pay?” It is not a cheap version of the full product. It's a different product, scoped around one bet, built to be thrown away or built on depending on what users tell you.",
      "The hard part isn't engineering. It's deciding what not to build. Most MVPs fail by being too big: six months in, three features deep, and still no evidence anyone wants it. Codroon's job on an MVP is to argue you down to the one thing worth proving, ship it in weeks, and get you real signal before your runway does the deciding for you.",
    ],
  },

  comparison: {
    heading: "Prototype vs MVP vs V1: which one you should be building",
    intro:
      "These get used interchangeably and they cost very different amounts. Building the wrong one is the most expensive mistake at this stage.",
    columns: ["Prototype", "MVP", "V1"],
    // our offering is the middle column
    highlightColumn: 1,
    rows: [
      {
        label: "The question it answers",
        cells: ["Does this make sense?", "Will people use and pay for it?", "Can this scale?"],
      },
      {
        label: "Who sees it",
        cells: ["You, your team, a few advisors", "Real users, in the wild", "Everyone"],
      },
      {
        label: "Real data",
        cells: ["No. Clickable, faked", "Yes", "Yes"],
      },
      {
        label: "Typical timeline",
        cells: ["Days to 2 weeks", "2–6 weeks", "3–6 months"],
      },
      {
        label: "What you skip",
        cells: ["Almost everything", "Admin panels, edge cases, polish", "Very little"],
      },
      {
        label: "If the answer is no",
        cells: ["You lost a week", "You lost a month, and learned why", "You lost a year"],
      },
      {
        label: "What comes next",
        cells: ["Build the MVP, or don't", "Iterate, or kill it honestly", "Grow it"],
      },
    ],
    closing:
      "Most founders asking for an MVP describe a V1. That conversation is the single most valuable part of the discovery call, and it's free.",
  },

  subServices: {
    heading: "Our MVP development services",
    intro:
      "Codroon works with founders at four points in the early build. Most start at the first two.",
    cards: [
      {
        title: "MVP Scoping & Roadmap",
        body: "The cut. We take everything you want to build and separate the one loop that proves the bet from the twelve things that can wait. You get a written scope, a sequence, and a fixed number.",
      },
      {
        title: "Full-Stack MVP Build",
        body: "A working product (frontend, backend, database, auth, payments) deployed to your infrastructure and ready for real users. Not a demo, not a Figma file with a waitlist behind it.",
      },
      {
        title: "AI-Native MVP",
        body: "For products where the AI is the product, not a feature bolted on. Agent loops, generative features, and model costs designed in from the start so unit economics work before you have users, not after.",
      },
      {
        title: "Launch & Iterate",
        body: "The first weeks after launch, when the signal arrives. Analytics wired up, feedback loop running, and weekly changes based on what users actually do rather than what they said in an interview.",
      },
    ],
  },

  // ⚠️ Zothix: confirm timelines; resolve the 2–6 vs 3–6 week landing-tag
  // inconsistency before this ships.
  process: {
    heading: "How Codroon builds an MVP",
    intro: "Four steps, two to six weeks, and the first one is mostly deleting things.",
    steps: [
      {
        n: "01",
        title: "Scope and cut",
        duration: "Free, 45 minutes",
        body: "You tell us everything the product should do. We find the one loop that proves the bet and argue for cutting the rest. Not forever, just for now. You leave with a written scope, a build sequence, and a real number, and you keep it whether you hire us or not.",
        deliverables: ["scoped feature set", "build sequence", "fixed price and timeline"],
      },
      {
        n: "02",
        title: "Design and foundation",
        duration: "Week 1",
        body: "Screens, data model, and the skeleton in place. You see something clickable in the first week. Not a mockup, the actual application shell running on real infrastructure. Changes are cheap here and expensive later, so this is where we want you opinionated.",
        deliverables: ["core screens", "data model", "deployed app shell"],
      },
      {
        n: "03",
        title: "Build in weekly demos",
        duration: "Weeks 2–5",
        body: "We build the core loop and show you working software every week. You use it, you tell us what's wrong, we adjust. No status reports, no waiting until the end to find out we understood the wrong thing.",
        deliverables: ["working build each week", "auth, payments, and core flows"],
      },
      {
        n: "04",
        title: "Launch and learn",
        duration: "Weeks 5–6",
        body: "We deploy to production, wire up analytics so you can see what users actually do, and hand over the repository with documentation. You own everything. If you want us to keep building, that's a new conversation, not an assumption.",
        deliverables: ["production launch", "analytics", "repo and docs"],
      },
    ],
  },

  // ⚠️ Zothix: cut anything Codroon hasn't shipped with; confirm naming
  // Claude Code and Clerk/Auth.js/Stripe.
  tech: {
    heading: "The stack Codroon builds MVPs on",
    intro:
      "Boring, proven, and fast to hire for later. An MVP is not the place to be interesting about infrastructure.",
    groups: [
      {
        title: "Frontend",
        body: "Next.js, React, TypeScript, and Tailwind. The most hireable stack in the world, which matters when you bring engineering in-house in six months.",
      },
      {
        title: "Backend and data",
        body: "Node and Python, PostgreSQL underneath. Managed Postgres for speed at this stage, with no infrastructure work you'd have to justify to a future CTO.",
      },
      {
        title: "Auth, payments, and the parts nobody should rebuild",
        body: "Clerk or Auth.js for authentication, Stripe for payments. These are solved problems. Building them yourself at MVP stage costs two weeks and buys nothing.",
      },
      {
        title: "AI, where the product needs it",
        body: "Claude, GPT, or Gemini, with cost per user modelled before launch rather than discovered on the first invoice.",
      },
      {
        title: "How we build it",
        body: "Claude Code runs through our whole build process. It's a real part of why a 2026 MVP takes weeks rather than months, and it's why our fixed prices are lower than agencies doing the same work by hand.",
      },
      {
        title: "Infrastructure",
        body: "Vercel and AWS, Docker where it earns its place. Deployed to your accounts, under your name, from day one.",
      },
    ],
  },

  industries: {
    heading: "Who we build MVPs for",
    intro: "Codroon works with founders at four different starting points.",
    rows: [
      {
        title: "Solo and first-time founders",
        body: "You have the idea and the domain knowledge, not the engineering. The main risk here is building too much, so most of our value is in the argument about scope before anything gets written.",
      },
      {
        title: "Funded startups, pre-seed to seed",
        body: "You have a deadline shaped like a board meeting. The MVP has to be real enough to demo and honest enough that the metrics mean something.",
      },
      {
        title: "Agencies productising a service",
        body: "You already deliver this manually and know exactly where it hurts. Usually the highest hit rate of any MVP we build, because the demand is already proven. You just haven't automated it yet.",
      },
      {
        title: "Established businesses launching a new line",
        body: "You have customers and revenue but this is a new bet. It needs to be built separately from the main product so it can fail without taking anything with it.",
      },
    ],
  },

  faq: {
    heading: "MVP development: common questions",
    quickAnswers:
      "Most MVPs take two to six weeks and cost $10,000–$40,000, quoted as a fixed price. You own the code outright and it's built on a standard stack any team can pick up. The scoping call is free and you keep the scope document either way.",
    items: [
      {
        q: "What should actually be in an MVP?",
        a: "One loop, done properly. The single path a user takes to get the value you're promising, plus auth and payments if money is part of the bet. Everything else is a guess about what users will want, and guesses are what the MVP exists to replace.",
      },
      {
        q: "Can you really build an MVP in a few weeks?",
        a: "Yes, if the scope is honest. The constraint is almost never engineering speed. It's how much you're willing to leave out. A tightly scoped MVP ships in two to three weeks. The same idea with an admin panel, three user roles, and a settings page takes three months, and you learn the same thing from both.",
      },
      {
        q: "Do I need a technical co-founder?",
        a: "Eventually, probably. Not to get a first version in front of users. Plenty of companies raise their first round on an MVP built by a studio and hire engineering after there's something worth hiring around. What matters is owning the code and building on a stack that's normal to hire for, both of which Codroon does by default.",
      },
      {
        q: "What if I don't have a spec or designs?",
        a: "Most founders don't, and that's what the scoping call is for. You need to know what problem you're solving and who has it. We handle turning that into screens, a data model, and a build sequence.",
      },
      {
        q: "Do I own the code, and can another team pick it up?",
        a: "Yes to both. The repository, infrastructure config, and documentation transfer to you at handover, deployed under your accounts from day one. We build on Next.js, TypeScript, and PostgreSQL specifically because any engineer you hire later will already know them.",
      },
      {
        q: "What if the MVP shows the idea doesn't work?",
        a: "Then it did its job, and it cost you a month instead of a year. That's the actual point. We'd rather help you learn that in six weeks for $20,000 than help you build the wrong thing beautifully for nine months. And we'll tell you what the data suggests, not just what you hoped for.",
      },
      {
        q: "How much does MVP development cost?",
        a: "$10,000–$40,000 for most MVPs, quoted as a fixed price after the scoping call. Codroon doesn't bill hourly. You get a number and a date, and we hold both.",
      },
    ],
  },

  // ⚠️ Zothix: confirm the range before publishing.
  pricing: {
    heading: "What MVP development costs",
    paragraphs: [
      "Most MVPs with Codroon run $10,000–$40,000 and take two to six weeks. A single core loop with auth and payments sits at the lower end. Multiple user types, AI features, and third-party integrations sit at the upper.",
      "We quote a fixed price after the scoping call, not an hourly rate that grows with the project. And if what you actually need is a prototype or a landing page with a waitlist, we'll say so. That's a smaller engagement and sometimes it's the honest answer.",
    ],
  },

  finalCta: {
    heading: "Let's find out what's actually worth building first",
    body: "Forty-five minutes, no prep, no commitment. Tell us the idea and you'll leave with a scoped feature set, a build sequence, and a real number, even if you build it somewhere else.",
    cta: "Book a free discovery call",
  },
};
