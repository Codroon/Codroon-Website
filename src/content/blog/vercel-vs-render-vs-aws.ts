import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-02-vercel-render-aws-v2.md.
 * Excluded as internal scaffolding: the header block above META and NOTES.
 *
 * ⚠️ Deck instruction, for the client not the code: "Confirm section 6 and
 * the final FAQ answer describe what you actually do, particularly
 * deploying to client accounts."
 */
export const vercelVsRenderVsAws: BlogPost = {
  slug: "vercel-vs-render-vs-aws",

  title: "Vercel vs Render vs AWS: An Honest Deployment Guide 2026",
  metaTitle: "Vercel vs Render vs AWS: An Honest Deployment Guide 2026",
  metaDescription:
    "Which deployment platform for your stack? An honest comparison of Vercel, Render, and AWS, including the bills that surprise people after launch.",

  category: "INFRASTRUCTURE",
  coverHeadline: "Vercel, Render,\nAWS. Where\neach belongs.",
  coverSubtitle: "A deployment guide that admits what each one costs you",
  watermark: "DEPLOY",

  publishedAt: "2026-07-24",
  updatedAt: "2026-07-24",
  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "These are not really competitors.",
      rest: "Most production stacks end up using two of the three, and that is the correct outcome rather than an indecision.",
    },
    {
      lead: "Vercel sells developer experience and bills for traffic.",
      rest: "The bandwidth and function-invocation costs are what catch teams out after a successful launch.",
    },
    {
      lead: "Render occupies the space Heroku left behind,",
      rest: "with backend services, workers, cron, and managed Postgres that require no infrastructure knowledge.",
    },
    {
      lead: "AWS is not more powerful so much as less decided.",
      rest: "Everything is configurable, which means everything must be configured, and that cost is paid in engineering hours rather than invoice lines.",
    },
    {
      lead: "The relevant number is the bill plus the hours spent managing it.",
      rest: "AWS frequently wins on the first and loses on the second.",
    },
    {
      lead: "Build so the application does not know where it runs.",
      rest: "That turns a permanent decision into a reversible one.",
    },
  ],

  intro: [
    "Deployment used to be a skill you acquired. You learned nginx, you learned systemd, you developed opinions about configuration management. Now you push to a branch and something happens.",
    "That is better, but it moved the difficulty rather than removing it. The question is no longer how to deploy an application. It is which platform will still make sense at a hundred times the current traffic, and what it will cost to find out.",
    "We deploy on all three at Codroon, across client work and our own products. What follows is where each one actually belongs, including the parts that do not appear on the pricing pages.",
  ],

  sections: [
    {
      id: "vercel-developer-experience",
      heading: "Vercel sells developer experience and bills for traffic",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "There is a reason every Next.js tutorial ends with a deploy to Vercel. The company builds Next.js, so the platform understands the framework at a level nothing else does. Server components, streaming, incremental static regeneration, edge middleware, and image optimisation all work without configuration because the people who designed the framework also designed the place it runs.",
            "Preview deployments alone justify the platform for a lot of teams. Every pull request gets its own URL, which changes the shape of client review. Instead of asking for a screenshot, a client clicks a link and uses the thing. On projects where feedback velocity determines timeline, and that is most projects, this is worth more than any performance benchmark.",
            "The complication is the billing model. Vercel charges for bandwidth, function invocations, and build minutes, and none of those are quantities a developer naturally thinks about while building. A site that costs nothing during development can produce a surprising invoice after a traffic spike or an API route that was never properly cached. This is not a trap, because the pricing is public and it is fair. It is that the cost is variable on a line item most founders assume is fixed, and the variability correlates with success.",
            "Our rule is Vercel for anything frontend-heavy, with a caching review before launch rather than after the first invoice.",
          ],
        },
      ],
    },
    {
      id: "render-fills-heroku-space",
      heading: "Render fills the space Heroku's decline created",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Render does what Heroku did, on modern infrastructure, at current prices.",
            "Web services, background workers, cron jobs, managed Postgres, and Redis, all configured from one dashboard or from a YAML file committed to the repository. You can stand up an Express API, a worker queue, and a database in an afternoon without touching a VPC or writing an IAM policy.",
            "That last clause is the actual product. Render's value is not a feature list, it is the absence of AWS's configuration surface. For a team of two to five people building a backend that needs to work rather than one that needs to serve a million concurrent users, removing decisions is worth more than adding options. Most infrastructure choices made by small teams are made badly, not because the teams are careless but because the decisions require context those teams have not yet acquired.",
            "Render stops fitting at high traffic, at specialised networking requirements, and at compliance obligations that demand specific regions and audit controls. At that point you are working around the abstraction rather than benefiting from it, and the abstraction has become the problem it was hired to solve.",
          ],
        },
      ],
    },
    {
      id: "aws-less-decided",
      heading: "AWS is not more powerful, it is less decided",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "The common framing is that AWS is the serious option and the others are convenient. That is not quite right. AWS is the option that has made fewer decisions on your behalf.",
            "VPCs, security groups, IAM roles, load balancers, autoscaling policies, CloudWatch alarms. Each is configurable, which means each is now something you own. A team without infrastructure experience will spend weeks on things Render handles by default, and will get some of them wrong in ways that stay invisible until they are expensive.",
            "But when the requirement is real, nothing else will do. Data residency in a named region. Access control granular enough for an audit. Cost optimisation at a scale where twenty percent is a salary. Services with no genuine equivalent elsewhere, particularly around storage, queuing, and managed databases with real failover.",
            "We run AWS underneath heavier workloads and reach for it deliberately rather than by default. The instinct to start on AWS because it is what real companies use is one of the more expensive instincts in early-stage engineering, because it front-loads a configuration burden at exactly the moment a team has the least capacity to carry it.",
          ],
        },
      ],
    },
    {
      id: "practical-comparison",
      heading: "Vercel vs Render vs AWS: the practical comparison",
      blocks: [
        {
          kind: "table",
          caption:
            "Vercel, Render, and AWS compared across strengths, setup time, configuration, cost shape, databases, jobs, compliance, and scaling limits.",
          columns: ["Vercel", "Render", "AWS"],
          rows: [
            {
              label: "Best at",
              cells: ["Frontend, Next.js, edge", "Backend services and workers", "Everything, eventually"],
            },
            { label: "Time to first deploy", cells: ["Minutes", "Under an hour", "Days"] },
            {
              label: "Configuration surface",
              cells: ["Almost none", "A YAML file", "Effectively unlimited"],
            },
            {
              label: "Cost shape",
              cells: ["Variable with traffic", "Mostly fixed per service", "Variable and itemised"],
            },
            {
              label: "Where bills surprise",
              cells: [
                "Traffic spikes, uncached routes",
                "Idle staging services",
                "Data transfer, forgotten resources",
              ],
            },
            { label: "Managed database", cells: ["Via partners", "Built in", "RDS, Aurora, others"] },
            {
              label: "Background jobs",
              cells: ["Limited", "First class", "Any approach you like"],
            },
            { label: "Compliance control", cells: ["Limited", "Region choice", "Complete"] },
            {
              label: "You outgrow it when",
              cells: ["Backend needs grow", "Traffic or compliance grows", "You do not, you just pay"],
            },
            {
              label: "Hardest part",
              cells: ["Forecasting the bill", "Nothing until you outgrow it", "The first month"],
            },
          ],
        },
      ],
    },
    {
      id: "cost-not-on-pricing-page",
      heading: "The cost that does not appear on any pricing page",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Each of these platforms has an expense that is invisible during evaluation and obvious in retrospect.",
            "On Vercel it is egress. Bandwidth and function invocations scale with success, which means a moment of unexpected attention produces an invoice an order of magnitude above the previous month. The mitigations are boring and effective. Cache aggressively, keep heavy media on object storage rather than serving it through the platform, and check your function invocation counts before launch rather than after.",
            "On Render it is idle services. Everything runs whether or not anything is using it, and three environments multiplied by four services is twelve things generating cost. Staging environments are where money quietly disappears, because nobody deletes them and nobody is watching them.",
            "On AWS it is engineering time. The invoice is frequently lower and the total cost is frequently higher, because someone has to own the configuration and keep owning it. If that person is also your only backend engineer, you have traded infrastructure spend for roadmap velocity. That trade is sometimes correct. It should be made knowingly rather than discovered in a retrospective.",
            "The number that actually matters is not the monthly bill. It is the bill plus the hours spent managing it, and that second term is the one nobody puts in a comparison table.",
          ],
        },
      ],
    },
    {
      id: "most-teams-use-two",
      heading: "Most teams end up using two of the three",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "After enough projects a pattern appears, and it is not that one platform wins.",
            "Frontend on Vercel, because the developer experience and preview deployments genuinely change iteration speed. Backend services and jobs on Render, because it handles what Vercel does not and asks nothing of you in return. AWS underneath for storage, queues, and anything carrying a compliance requirement.",
            "The separation is clean. Vercel owns the experience, Render owns the logic, AWS owns the durable state. Each scales independently and none locks you into the others.",
            "The decision that matters more than any of this is made in the first week and is almost never discussed. Keep the application unaware of where it runs. Environment variables rather than platform detection, no platform-specific APIs inside business logic, infrastructure defined in code. Teams that do this can migrate in a week. Teams that do not are looking at a quarter, and the difference has nothing to do with the platforms and everything to do with choices made before any of them mattered.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "Deployment platforms: common questions",
    items: [
      {
        q: "Which is cheapest, Vercel, Render, or AWS?",
        a: "At small scale Render is usually the most predictable and AWS the most expensive once engineering time is counted. At large scale AWS wins on raw cost and loses on complexity. Vercel is the cheapest to start with and the hardest to forecast, because its pricing scales with traffic rather than with instances.",
      },
      {
        q: "Can I use Vercel for a backend?",
        a: "For API routes and serverless functions, yes. For long-running processes, background workers, WebSocket servers, or scheduled jobs, no. Those require Render, AWS, or something comparable, and most real applications eventually need at least one of them.",
      },
      {
        q: "Is Render just Heroku again?",
        a: "It is the same shape on better infrastructure at current prices. If what you miss about Heroku is the developer experience, Render is the closest available equivalent, with managed Postgres, workers, and cron built in rather than added through add-ons.",
      },
      {
        q: "When should we move to AWS?",
        a: "When a specific requirement forces it. Data residency, compliance, a service with no equivalent elsewhere, or a cost curve where the savings exceed the engineering time required to capture them. Moving because AWS feels more professional is the wrong reason and an expensive one.",
      },
      {
        q: "How hard is it to migrate between them later?",
        a: "Days to weeks if the application was built portably, months if it was not. The difficulty is determined almost entirely by decisions made in week one rather than by any difference between the platforms.",
      },
      {
        q: "What do you use at Codroon?",
        a: "Vercel for frontends, Render for backend services on smaller builds, AWS underneath anything involving storage, queues, or compliance. On client work we deploy to the client's own accounts from day one, whichever platform that turns out to be.",
      },
    ],
  },

  finalCta: {
    heading: "Deployment is a decision, not a default",
    body: [
      "Most infrastructure regret traces back to a platform chosen before anyone knew what the product needed. It is a fifteen-minute conversation that saves a quarter.",
      "We build SaaS products and MVPs and make this call at the start of every one, then deploy to your accounts so that the result is yours regardless of what happens next.",
    ],
    primary: { label: "See what your build would cost →", href: "/tools/mvp-cost-calculator" },
    secondary: { label: "Talk through your architecture", href: null },
  },

  relatedLinks: [
    { label: "SaaS Development Services", href: "/services/saas-development" },
    { label: "MVP Development Services", href: "/services/mvp-development" },
  ],
};

export default vercelVsRenderVsAws;
