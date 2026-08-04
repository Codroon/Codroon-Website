import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-05-google-stitch-vs-figma-v2.md.
 * Excluded as internal scaffolding: the header block above META, the
 * ⚠️ verification note, and NOTES.
 *
 * ⚠️ Deck instruction, for the client not the code: "Verify before
 * publishing. Stitch's Labs status, generation caps, and whether a paid
 * tier has appeared. This is the most volatile topic of the seven."
 */
export const googleStitchVsFigma: BlogPost = {
  slug: "google-stitch-vs-figma",

  title: "Google Stitch vs Figma: What Actually Changed in 2026",
  metaTitle: "Google Stitch vs Figma: What Actually Changed in 2026",
  metaDescription:
    "Google Stitch is free and generates UI in minutes. Figma costs $15 a seat and still wins on finishing. Where each one belongs in a working process.",

  category: "DESIGN TOOLS",
  coverHeadline: "Stitch starts it.\nFigma finishes it.",
  coverSubtitle: "What Google's free AI design tool actually changed",
  watermark: "STITCH",

  publishedAt: "2026-07-31",
  updatedAt: "2026-07-31",
  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "Stitch owns the zero-to-one phase.",
      rest: "Ten UI concepts in the time it takes to set up a Figma file, with no design skill required.",
    },
    {
      lead: "Figma owns the one-to-one-hundred phase.",
      rest: "Design systems, component libraries, tokens, collaboration at scale, and developer handoff.",
    },
    {
      lead: "The market took it seriously.",
      rest: "Figma shares fell roughly eight to twelve percent across two sessions after Google's March 2026 Stitch update, on a stock already down substantially for the year.",
    },
    {
      lead: "Stitch is free and metered.",
      rest: "A Labs experiment with monthly generation caps, no paid tier as of mid-2026, and terms that can change without notice.",
    },
    {
      lead: "The most useful output is not the design.",
      rest: "Stitch produces a structured specification which, fed into Claude Code or Cursor, generates meaningfully better code than starting from a prompt.",
    },
    {
      lead: "Neither produces production-ready interfaces.",
      rest: "They fail in different ways, and knowing which failure you are looking at is most of the skill.",
    },
  ],

  intro: [
    "On March 19, 2026, Google shipped a major update to Stitch, its AI design tool. Figma's stock fell somewhere between eight and twelve percent across two trading sessions, on a stock already down roughly a third for the year.",
    "Investors reacted before anybody had run a side-by-side comparison. Google's name was sufficient. That reaction is worth examining, because it was simultaneously an overreaction to the product and a reasonable reading of the direction, and understanding why requires separating what Stitch does from what Figma sells.",
    "We build interfaces every week at Codroon and have used both in real client work.",
  ],

  sections: [
    {
      id: "google-made-first-eighty-percent-free",
      heading: "Google made the first eighty percent of design free",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Stitch came out of Google's acquisition of Galileo AI and lives inside Google Labs. You describe an interface, or show it an image, and it generates UI for web or mobile with variants, then exports to Figma or to code.",
            "The March 2026 update is what moved the market. Google added what it calls vibe designing, meaning prompt-driven generation of polished interfaces and frontend code without starting from a wireframe, along with a multi-screen prototypes canvas that links screens into flows and Workspace integration for teams already inside Google's ecosystem. It runs on Gemini 3, with better adherence to design systems and more accessible defaults than the original release. Code export covers several frameworks rather than only React, which is unusual in this category.",
            "It is free, capped by monthly generation limits, with no paid tier published as of mid-2026. That combination describes a Labs experiment rather than a product commitment, which is worth remembering before building a process around it.",
            "What Stitch actually changed is narrower than the headlines suggested and more significant than the counterargument allows. It made the exploratory phase of design cost nothing. That phase used to require either a designer's time or a founder's evenings, and it now requires twenty minutes and no particular skill.",
          ],
        },
      ],
    },
    {
      id: "figmas-business-was-never-the-first-eighty",
      heading: "Figma's business was never the first eighty percent",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Figma sells design systems, and design systems are a one-to-one-hundred problem rather than a zero-to-one problem.",
            "Multi-team component libraries, design tokens, branch-based workflows, and governance across an organisation. Figma is built for companies with fifty designers, and nothing about Stitch is aimed at that. Dev Mode remains the industry standard for handoff, letting engineers inspect specifications, copy code for web or native platforms, link to issues, and track implementation status. Stitch's export is good without being woven into engineering workflow in the same way.",
            "Then there is the accumulated ecosystem. A decade of plugins, templates, tutorials, and established practice, against a tool that is roughly a year old. That gap is invisible during a demo and obvious the moment you hit something unusual, which on real projects is weekly.",
            "Figma also has its own AI layer, powered by Claude, generating components directly onto an existing canvas. It moved to credit-based pricing in March 2026, which matters if you generate heavily.",
            "So the question of whether Stitch kills Figma is the wrong question. Concepts were never Figma's business. What the stock reaction priced in was not displacement but direction, and the direction is real. When the free tool from the largest company in search becomes good enough for the first phase, the paid tool has to justify itself entirely on the second. Figma's does today. The ground moved anyway, and it will keep moving.",
          ],
        },
      ],
    },
    {
      id: "where-each-belongs",
      heading: "Stitch vs Figma: where each one belongs",
      blocks: [
        {
          kind: "table",
          caption:
            "Google Stitch compared with Figma across phase, price, skill required, speed, design systems, collaboration, handoff, ecosystem, and product status.",
          columns: ["Google Stitch", "Figma"],
          rows: [
            {
              label: "Phase it suits",
              cells: ["Zero to one, exploring", "One to one hundred, refining"],
            },
            {
              label: "Price",
              cells: ["Free with capped generations", "Around $15 per editor per month"],
            },
            { label: "Design skill required", cells: ["None", "Real"] },
            { label: "Time to first draft", cells: ["Around 20 minutes", "Hours"] },
            { label: "Design systems", cells: ["Not meaningfully", "Best available"] },
            {
              label: "Collaboration",
              cells: ["Small teams, recently added", "Mature multiplayer"],
            },
            {
              label: "Developer handoff",
              cells: ["Code export, several frameworks", "Dev Mode, the standard"],
            },
            { label: "Ecosystem", cells: ["Months old", "A decade of plugins"] },
            {
              label: "Product status",
              cells: ["Google Labs experiment", "Established product"],
            },
            { label: "Best at", cells: ["Ten concepts quickly", "One concept properly"] },
          ],
        },
      ],
    },
    {
      id: "specification-not-the-design",
      heading: "The useful output is the specification, not the design",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "The thing that actually changed our process was not the mockups.",
            "Stitch produces a structured description of what it generated, covering component hierarchy, colour tokens, layout decisions, and spacing. Feeding that into Claude Code or Cursor produces meaningfully better generated code than starting from a prompt, because the model is working from a specification rather than improvising structure and then having to be corrected.",
            "This is easy to miss if you evaluate these tools by looking at screenshots, and looking at screenshots is how most comparisons evaluate them. The question is not whether the mockups look good. It is how close the output gets you to shippable code, and on that measure the specification is worth more than the picture.",
            "Both tools fall short of production-ready and they fall short differently. Stitch generates something plausible that needs structural work. Figma generates something precise that still needs implementing. Knowing which of those two problems you have is most of the skill in using either.",
          ],
        },
      ],
    },
    {
      id: "what-we-use-at-codroon",
      heading: "What we use at Codroon",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Both, at different moments, and neither for very long.",
            "Stitch when a client cannot articulate what they want. Generating six directions in twenty minutes and letting them react is considerably faster than any amount of discussion, because people are much better at criticising something concrete than describing something abstract. This is the actual value of cheap generation and it has little to do with design quality.",
            "Figma once a direction is agreed and it needs to become consistent, real, and handed to whoever builds it.",
            "Then most of the interface gets built in code, from a design system, because that is where it ends up regardless of which tool produced the first picture. The design tool is a way to decide things rather than a way to ship them, and treating it as the latter is how projects accumulate beautiful files nobody implements.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "Google Stitch: common questions",
    items: [
      {
        q: "Is Google Stitch free?",
        a: "Yes, as of mid-2026. It is a Google Labs experiment with monthly generation caps and no published paid tier. Labs products get repriced, changed, or retired, so it is fine to use and unwise to depend on.",
      },
      {
        q: "Can Stitch replace a designer?",
        a: "It replaces the first afternoon of a designer's work. It does not replace judgement about what should be built, consistency across a product, or the accessibility and edge-case work that separates a mockup from an interface people can actually use.",
      },
      {
        q: "Does Stitch export to Figma?",
        a: "Yes, and to code across several frameworks. The Figma export is how most teams use it. Generate in Stitch, refine in Figma, hand off from there.",
      },
      {
        q: "Stitch, v0, or Figma Make?",
        a: "Different jobs. Stitch for exploring interfaces from nothing. v0 for production React components that drop into an existing Next.js codebase. Figma Make if you already live in Figma and would rather not leave. They are complementary more than competitive.",
      },
      {
        q: "Is the output production-ready?",
        a: "No. Neither Stitch's nor Figma's AI output ships without work. Stitch's is a strong starting structure and is best treated as a specification rather than a deliverable.",
      },
    ],
  },

  finalCta: {
    heading: "Tools generate screens, products need decisions",
    body: [
      "The bottleneck on most builds is not producing an interface. It is deciding what belongs in it, which is a different activity that no generation tool performs.",
      "We do that part first and then build, which is why a project takes weeks rather than months.",
    ],
    primary: { label: "See what your MVP would cost →", href: "/tools/mvp-cost-calculator" },
    secondary: { label: "Book a free discovery call", href: null },
  },

  relatedLinks: [
    { label: "MVP Development Services", href: "/services/mvp-development" },
    { label: "SaaS Development Services", href: "/services/saas-development" },
  ],
};

export default googleStitchVsFigma;
