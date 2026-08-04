import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-03-make-to-n8n-v2.md.
 * Excluded as internal scaffolding: the header block above META, the
 * commercial-intent note, and NOTES.
 *
 * relatedLinks corrected by the client (2026-08-03): the deck pointed at
 * /services/ai-automation, a slug that never shipped — an early service
 * list had "AI Automation Services" and it became "Generative AI
 * Development Services" before the pages were built. AI Integration is
 * the right primary here because its sub-services card explicitly covers
 * inheriting and hardening existing n8n, Zapier, or Make stacks.
 *
 * ⚠️ Deck instruction, for the client not the code: "Confirm section 6.
 * It commits you to inheriting and hardening existing automation stacks."
 */
export const makeToN8nMigration: BlogPost = {
  slug: "make-to-n8n-migration",

  title: "Make to n8n Migration: When It's Worth It (2026 Guide)",
  metaTitle: "Make to n8n Migration: When It's Worth It (2026 Guide)",
  metaDescription:
    "Should you migrate from Make to n8n? The honest arithmetic on cost and complexity, when staying put is correct, and how to move without breaking things.",

  category: "AUTOMATION",
  coverHeadline: "Make to n8n.\nWhen it's worth it.\nWhen it isn't.",
  coverSubtitle: "The honest arithmetic on migrating your automation stack",
  watermark: "MIGRATE",

  publishedAt: "2026-07-28",
  updatedAt: "2026-07-28",
  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "The trigger is arithmetic, not features.",
      rest: "Teams migrate when Make's per-operation pricing crosses roughly $100 to $300 a month and a self-hosted n8n instance would do identical work for the cost of a small server.",
    },
    {
      lead: "The second trigger is a ceiling.",
      rest: "Custom logic, deep branching, or data transformation that Make cannot express without calling an external service.",
    },
    {
      lead: "Below $100 a month, do not migrate.",
      rest: "The engineering time will exceed a year of savings, and this is the most common mistake in this decision.",
    },
    {
      lead: "Self-hosting is the entire economic case.",
      rest: "n8n Cloud sits close to Make on price, so if you will not run a server the argument largely disappears.",
    },
    {
      lead: "You are trading a subscription for a responsibility.",
      rest: "Backups, updates, uptime, and monitoring become yours.",
    },
    {
      lead: "Migrate incrementally.",
      rest: "Run both platforms in parallel, move one workflow at a time, verify the outputs match, cancel Make last.",
    },
  ],

  intro: [
    "Automation stacks follow a fairly predictable arc. A team starts on Make or Zapier because it works and requires no thought. It runs well for a year. Then volume grows, workflows get more complicated, and one month the invoice becomes a line item somebody asks about.",
    "That is when people search for this. The question is rarely whether n8n is a better product. It is whether the team is paying rent on something it could own.",
    "We run automation builds and migrations at Codroon, and the honest position is that a significant share of teams asking this question should not migrate yet. What follows is how to work out which group you are in.",
  ],

  sections: [
    {
      id: "pricing-shape-not-quality",
      heading: "The migration is triggered by pricing shape, not product quality",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Make bills per operation, and an operation is a single module execution. A five-step scenario running a thousand times a month consumes five thousand operations rather than one thousand. That arithmetic is entirely reasonable at low volume and becomes uncomfortable at scale, and the discomfort arrives without anything about the workflow having changed. The scenario that cost nine dollars a month at ten thousand credits is the same scenario at five hundred thousand credits, where it costs several hundred.",
            "This is worth stating carefully, because it is not a criticism of Make's pricing. Usage-based pricing is honest pricing. The issue is that it converts a fixed cost into a variable one that scales with your success, which is precisely the property that makes teams want to own the thing instead.",
            "The second trigger is a genuine ceiling. Complex branching, deep data transformation, custom retry logic, structured output validation. At some point a workflow needs code, and Make's answer is to call an external service while n8n's answer is a code node in JavaScript or Python inside the workflow itself.",
            "For AI work the gap is wider. Both platforms ship AI nodes and they are at rough parity for simple agents, meaning call a model, call a tool, return a result. For anything requiring memory persistence, custom retries, or validated structured output, n8n lets you write the missing piece in place. On Make you are building a service to fill the hole, which means you now maintain a service in addition to the automation platform you were trying to avoid maintaining.",
          ],
        },
      ],
    },
    {
      id: "self-hosting-economic-case",
      heading: "Self-hosting is the entire economic case",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "The reason this migration is worth considering is that self-hosted n8n costs almost nothing to run.",
            "A small virtual server from Hetzner, DigitalOcean, or a comparable provider handles most small-to-medium automation loads comfortably for somewhere between a few dollars and fifteen dollars a month. On that instance executions are unlimited. There is no per-operation counter, no credit pack, and no invoice that grows when the business does.",
            "Set against a Make plan running into the hundreds, the payback period on migration engineering is typically eight to twelve weeks. That number is worth holding onto, because it is the thing that determines whether this is a good idea.",
            "The comparison is not quite that clean, however, because self-hosting carries costs that never appear on an invoice. Docker configuration, a reverse proxy, TLS certificates, automated backups, monitoring, and version upgrades that occasionally break something. Somebody owns all of that. If nobody on the team wants to, n8n Cloud exists and sits between the two options on both cost and effort, though it also removes most of the financial argument for moving in the first place.",
          ],
        },
      ],
    },
    {
      id: "make-vs-n8n",
      heading: "Make vs n8n: the practical differences",
      blocks: [
        {
          kind: "table",
          caption:
            "Make compared with n8n across audience, pricing model, hosting, custom code, connectors, support, data ownership, and version control.",
          columns: ["Make", "n8n"],
          rows: [
            {
              label: "Built for",
              cells: ["Operations teams and non-technical users", "Developers and technical teams"],
            },
            {
              label: "Pricing model",
              cells: ["Per operation, credit-based", "Per execution on cloud, free self-hosted"],
            },
            { label: "Cost at scale", cells: ["Grows with volume", "Flat, a server is a server"] },
            {
              label: "Self-hosting",
              cells: ["Not available", "Available, and the main reason to switch"],
            },
            {
              label: "Custom code",
              cells: ["External service calls", "Code nodes in JavaScript or Python"],
            },
            { label: "Complex branching", cells: ["Hits a ceiling", "No practical limit"] },
            {
              label: "Connector library",
              cells: ["Larger and more polished", "Large, plus community nodes"],
            },
            { label: "Learning curve", cells: ["Gentle", "Steep for non-developers"] },
            {
              label: "Support",
              cells: ["Commercial support included", "Community first, paid tiers available"],
            },
            {
              label: "Data sovereignty",
              cells: ["Passes through their cloud", "Entirely yours when self-hosted"],
            },
            {
              label: "Version control",
              cells: ["Limited", "Workflows are JSON, commit them to Git"],
            },
            {
              label: "Best when",
              cells: [
                "Non-technical team, moderate volume",
                "Complex logic, high volume, or compliance",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "most-teams-should-stay",
      heading: "Most teams asking this question should stay on Make",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "This section is missing from most articles on this topic, and the reason is that most articles on this topic are written by people who would like to sell you a migration.",
            "Stay if the bill is under a hundred dollars a month. The engineering time will cost more than a year of savings, and you will have acquired server maintenance in exchange for nothing.",
            "Stay if the team is non-technical. Make's actual product is that somebody in marketing can build and edit an automation without waiting for a developer. n8n does not have that property, and describing it as slightly more technical understates the difference considerably. A migration can create a dependency on your one technical person where none previously existed, which is a real organisational cost that never appears in a cost comparison.",
            "Stay if the workflows are simple notifications and volume is flat. The per-operation model only becomes painful when operations multiply.",
            "Stay if nobody wants to own a server. This is not a minor consideration. Backups, uptime, updates, and the failure at two in the morning are now somebody's responsibility. If the answer to who handles that is a shrug, the migration will quietly decay and you will end up worse off than when you started.",
            "The rule we use is that migration makes sense when the durable cost of Make operations exceeds the cost of a server plus the hours to maintain it, or when a real requirement rather than a preference has hit a wall. Until one of those is true, staying is the correct engineering decision rather than a failure of ambition.",
          ],
        },
      ],
    },
    {
      id: "how-to-migrate",
      heading: "How to migrate without breaking anything",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "If the decision is made, do it incrementally. The failure mode is a single cutover on a Friday afternoon.",
          ],
        },
        {
          kind: "steps",
          steps: [
            {
              title: "Inventory and rank",
              body: "List every scenario, its monthly operation count, and what breaks if it stops running. You will usually find that a small number of workflows account for most of the cost. Migrate those first, so the savings arrive early while the risk stays low.",
            },
            {
              title: "Stand up n8n in parallel",
              body: "Docker on a small server, reverse proxy, TLS, and automated backups configured from the first day rather than added later. Make keeps running throughout. Nothing is at risk yet.",
            },
            {
              title: "Rebuild one workflow and compare outputs",
              body: "Do not assume it works because it looks correct. Run both versions against the same inputs for a week and compare the results. Discrepancies at this stage are almost always subtle differences in how the two platforms handle data shape, and they are dramatically cheaper to find now than after cutover.",
            },
            {
              title: "Cut over one workflow at a time",
              body: "Switch a single trigger. Watch it for a few days. Then move to the next. The temptation after a smooth first migration is to move five at once, and that temptation is where migrations go wrong.",
            },
            {
              title: "Commit the workflows to Git",
              body: "n8n workflows are JSON, so version them. This is a genuine capability upgrade over Make that most teams forget to use. It converts your automation from something living in a dashboard into something living in your repository, which means it can be reviewed, rolled back, and reproduced.",
            },
            {
              title: "Cancel Make last",
              body: "Only after everything has run cleanly for a full billing cycle. A month of overlapping subscriptions costs one month. A premature cancellation costs a weekend.",
            },
          ],
        },
      ],
    },
    {
      id: "what-we-do-at-codroon",
      heading: "What we do at Codroon",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Most of our automation work is not greenfield. It is inheriting something that already exists and has become slow, expensive, or fragile, which is a different problem from building fresh and calls for a different first move.",
            "That work usually starts with an audit rather than a rebuild, and it regularly ends with moving only the parts that hurt. A workflow costing eight dollars a month and working correctly does not need migrating because the rest of the stack is moving. Wholesale migration is satisfying and frequently wasteful.",
            "We build in n8n and will say so plainly. But if a client's problem is solved by staying on Make and fixing three scenarios, that is a smaller engagement and the correct answer, and telling them so costs us less than delivering a migration they did not need.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "Make to n8n: common questions",
    items: [
      {
        q: "Is n8n cheaper than Make?",
        a: "Self-hosted, dramatically so. A small server runs unlimited executions for the price of a coffee. n8n Cloud sits closer to Make and is sometimes higher. The saving comes from self-hosting rather than from n8n itself, so if you will not self-host the economic case mostly disappears.",
      },
      {
        q: "How long does a migration take?",
        a: "For a typical stack of ten to twenty workflows, two to four weeks including parallel running and verification. The rebuild is fast. The verification is what takes time, and skipping it is how migrations fail.",
      },
      {
        q: "Can I import my Make scenarios into n8n?",
        a: "Not directly. There is no official converter, and the node models differ enough that a conversion would not be trustworthy even if one existed. Workflows get rebuilt, which in practice is often useful because rebuilding surfaces the scenarios nobody actually needs any more.",
      },
      {
        q: "What breaks most often after migrating?",
        a: "Data shape. The two platforms handle arrays, nulls, and nested objects differently, so a workflow that appears correct can produce subtly different output. This is exactly what the week of parallel running is for.",
      },
      {
        q: "Do I need a developer to run n8n?",
        a: "To set it up and maintain it, realistically yes. To use it day to day, a technically minded non-developer manages fine. The honest framing is that you are trading a subscription for a small ongoing responsibility.",
      },
      {
        q: "What about Zapier?",
        a: "The same decision with different numbers. Zapier is the most expensive and the most accessible of the three. If you are on Zapier and the bill has become uncomfortable, Make is the gentler step and n8n is the larger one.",
      },
    ],
  },

  finalCta: {
    heading: "Not sure which side of the line you are on",
    body: [
      "The answer usually takes fifteen minutes. Your operation counts, your bill, and whether anything has genuinely hit a wall rather than merely become annoying. If staying on Make is the right call we will say so, which is a smaller engagement for us and a cheaper year for you.",
    ],
    primary: { label: "Book a free automation audit", href: null },
    secondary: {
      label: "See what an automation costs →",
      href: "/tools/ai-agent-cost-calculator",
    },
  },

  relatedLinks: [
    { label: "AI Integration Services", href: "/services/ai-integration" },
    { label: "AI Agent Development Company", href: "/services/ai-agent-development" },
  ],
};

export default makeToN8nMigration;
