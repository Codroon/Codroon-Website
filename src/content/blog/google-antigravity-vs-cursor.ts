import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-01-antigravity-vs-cursor-v2.md.
 * Excluded as internal scaffolding: the header block above META, the
 * ⚠️ pre-publish verification note, and VOICE NOTES.
 *
 * ⚠️ Deck instruction, for the client not the code: "Verify pricing on
 * publish day. This category repriced four times in six months."
 */
export const googleAntigravityVsCursor: BlogPost = {
  slug: "google-antigravity-vs-cursor",

  // ASSUMPTION — the deck supplies no H1 separate from the title tag,
  // so title mirrors metaTitle. Confirm or supply a distinct H1.
  title: "Google Antigravity vs Cursor: An Honest 2026 Comparison",

  metaTitle: "Google Antigravity vs Cursor: An Honest 2026 Comparison",
  metaDescription:
    "Antigravity is free but rate-limited. Cursor costs $20 and does not lock you out. A comparison from a studio that ships production code every week.",

  category: "AI DEVELOPMENT TOOLS",
  coverHeadline: "Antigravity\nvs Cursor.\nHonestly.",
  coverSubtitle: "Which AI IDE earns a place in a working studio",
  watermark: "ANTIGRAVITY",

  publishedAt: "2026-08-03",
  updatedAt: "2026-08-03",

  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "Antigravity is agent first and Cursor is editor first.",
      rest: "Antigravity treats the editor, terminal, and browser as one surface that agents act across. Cursor keeps you in control and makes you faster at what you were already doing.",
    },
    {
      lead: "The price difference is not really about money.",
      rest: "Antigravity's individual preview costs nothing. Cursor Pro is $20 a month. What you are actually buying for $20 is the guarantee that the tool works when you open it.",
    },
    {
      lead: "Quota instability has been Antigravity's defining problem.",
      rest: "Google reduced the preview's usage limits four times between December 2025 and March 2026, then introduced credit packs at $25 for 2,500 credits.",
    },
    {
      lead: "Cursor has the compliance story that client work requires.",
      rest: "SOC 2 certification and a team wide Privacy Mode. Antigravity's preview terms are still preview terms and can change.",
    },
    {
      lead: "The Browser Subagent is the most genuinely new feature in this category.",
      rest: "A Chromium instance that clicks through your application while the agent builds it.",
    },
    {
      // the deck's bold stops mid-sentence here, with no full stop
      lead: "Most teams that use both settle into a split",
      rest: "where Cursor handles daily work and Antigravity handles tasks where an agent should own the entire loop.",
    },
  ],

  intro: [
    "Google announced Antigravity on November 18, 2025, alongside the Gemini 3 model family. By February 2026 searches for it had gone from nothing to breakout status on Google Trends, and a large share of those searches were people typing some version of the question that brought you here, which is whether this thing is worth switching to.",
    "The answer depends almost entirely on what you are optimising for, and the usual comparisons are not much help because they compare feature lists. Feature lists are the least interesting thing about these two products. They are built on genuinely different assumptions about what a developer is supposed to be doing, and that difference is what determines which one belongs in your workflow.",
    "We build production software at Codroon every week and have run both in real client work. This is what we found.",
  ],

  sections: [
    {
      id: "antigravity-developers-become-managers",
      heading: "Antigravity is a bet that developers become managers",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "The pitch behind Antigravity is not that it is a better editor. Google's argument is that the editor, the terminal, and the browser should be one surface that an agent can act across, planning a task, executing it, and verifying the result without a human approving each individual step.",
            "In practice this shows up as Manager View, sometimes called Mission Control, where you dispatch several agents at once and watch them work in parallel rather than supervising a single chat pane. The mental model is closer to delegation than to pair programming.",
            "The most interesting piece is Artifacts. As agents work they leave a reviewable trail of task lists, plans, screenshots, and browser recordings, so you can go back and see what the agent actually did rather than what it reported doing. Anyone who has had to explain to a client why a particular change was made will recognise the value of that trail, and it is a feature that follows directly from the agent first premise. If agents are doing the work unsupervised, you need a record.",
            "At Google I/O in May 2026 the product became Antigravity 2.0, which added a desktop application, a command line interface, an SDK, and the Browser Subagent. The Browser Subagent is a Chromium instance that clicks through your web application while the agent builds it, and as far as we can tell nothing else in the category ships anything comparable. Watching an agent fill in a form it wrote ninety seconds earlier, notice its own validation bug, and fix it is a meaningfully different experience from reading a diff.",
            "Antigravity runs Gemini 3 Pro by default and will route to Claude Sonnet, Claude Opus, and open weight GPT-OSS models depending on the task.",
          ],
        },
      ],
    },
    {
      id: "cursor-developers-stay-developers",
      heading: "Cursor is a bet that developers stay developers",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Cursor came out of Anysphere in March 2023, when GitHub Copilot had the category more or less to itself. It is a VS Code fork, which means your keybindings, themes, and extensions come with you and the migration cost for an existing VS Code user is close to zero.",
            "The premise is the opposite of Google's. Rather than turning the developer into an orchestrator, Cursor makes the developer faster at the work they were already doing. Codebase level understanding, inline editing, and a conversation that knows what your project actually contains. You remain the person writing the software.",
            "That premise has aged well, and the product has matured around it. SOC 2 certification, a team wide Privacy Mode that keeps code out of training data, subagents, the Composer agent, and Bugbot for agentic code review. The company reports $500 million in annual recurring revenue, which tells you nothing about the product but a fair amount about whether it will still exist when you need support in two years.",
            "Cursor is also model agnostic in a way Antigravity is not. You choose between frontier models from Anthropic, OpenAI, and Google per request, rather than working with a default that the rest of the product has been tuned around. In a market where model pricing and capability shift every few months, that flexibility has real value.",
          ],
        },
      ],
    },
    {
      id: "practical-comparison",
      heading: "Antigravity vs Cursor: the practical comparison",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Pricing verified as of August 2026. Both companies have changed their terms repeatedly, so check before committing a team.",
          ],
        },
        {
          kind: "table",
          caption:
            "Google Antigravity compared with Cursor across premise, pricing, models, features, compliance, and suitability.",
          columns: ["Google Antigravity", "Cursor"],
          rows: [
            { label: "Core premise", cells: ["You manage agents", "You write code faster"] },
            { label: "Individual price", cells: ["Free in public preview", "$20 per month"] },
            { label: "Team price", cells: ["Not published", "$40 per user per month"] },
            {
              label: "What limits you",
              cells: ["Usage quotas, tightened repeatedly", "Included API spend, then metered"],
            },
            { label: "Default model", cells: ["Gemini 3 Pro", "Chosen per request"] },
            {
              label: "Other models",
              cells: ["Claude Sonnet, Claude Opus, GPT-OSS", "Anthropic, OpenAI, Google"],
            },
            { label: "Standout feature", cells: ["Browser Subagent", "Composer, Bugbot review"] },
            {
              label: "Audit trail",
              cells: ["Artifacts with screenshots and recordings", "Conversation history"],
            },
            { label: "Compliance", cells: ["Preview terms only", "SOC 2, team wide Privacy Mode"] },
            { label: "Migration cost", cells: ["Extensions carry over", "Near zero from VS Code"] },
            {
              label: "Best suited to",
              cells: ["Multi step work an agent should own", "Daily production coding"],
            },
          ],
        },
      ],
    },
    {
      id: "quota-problem",
      heading: "The quota problem that launch coverage did not mention",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "This is the part most comparisons omit, and it is the single most important thing to understand before building a workflow around Antigravity.",
            "Between December 2025 and March 2026 Google reduced the preview's usage quotas on four separate occasions. Developers who had built habits around the tool found themselves locked out for hours and in some cases days, with the problem concentrated during United States working hours. In March 2026 Google introduced credit packs at $25 for 2,500 credits so that people could keep working after hitting a wall, which reads less like a feature and more like an admission.",
            "Things have improved since. In early June 2026 Google reset quota counters for all Gemini users and pushed a refreshed model build to address post launch issues. But the pattern matters more than the current state, because a free preview is a product Google has no obligation to keep stable, and it has demonstrated that it will change the terms when the economics demand it.",
            "This reframes the pricing comparison entirely. The relevant question is not whether $20 a month is worth paying for capability, because on capability these two are close enough that the answer varies by task. The question is whether $20 a month is worth paying for availability at three in the afternoon on a deadline, and for most teams that ship on commitments, it clearly is.",
          ],
        },
        {
          kind: "callout",
          paragraphs: [
            "If you do adopt Antigravity, keep a second tool installed. Cursor or Claude Code as a command line option both work as fallbacks. Given the lockout reports, this is practical rather than paranoid.",
          ],
        },
      ],
    },
    {
      id: "where-each-earns-its-place",
      heading: "Where each one earns its place",
      blocks: [
        { kind: "subheading", text: "Antigravity earns it when" },
        {
          kind: "list",
          items: [
            "The task is multi step and you want an agent to own the entire loop",
            "You need a verifiable record of what changed and why",
            "You are working inside Google Cloud, Firebase, or Vertex",
            "The agent needs to see the running application rather than only the code",
            "You are evaluating rather than depending, in which case free is generous",
          ],
        },
        { kind: "subheading", text: "Cursor earns it when" },
        {
          kind: "list",
          items: [
            "You write code every day and need the tool to be available every time",
            "You have compliance requirements, or clients who will ask about them",
            "You want to select the model per task rather than accept a default",
            "You are already in VS Code and would rather not relearn anything",
            "You prefer a fixed $20 to managing a credit budget",
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
            "Both, for different work, with Claude Code doing most of the actual building.",
            "Cursor is what stays open during a normal day. Antigravity comes out for tasks where the loop matters more than the keystrokes, which in practice means refactors touching many files, bugs that need reproducing in a browser before they can be understood, and anything where we want the trail afterwards.",
            "The Browser Subagent has been the most surprising part. We expected it to be a demo feature and it has turned out to be genuinely useful on frontend work, because a large share of frontend bugs are only visible when something is actually running.",
            "The honest summary, though, is that neither of these tools is why our builds take weeks rather than months. That comes from the scoping conversation before anyone opens an editor. A faster editor applied to the wrong feature set gets you to the wrong place sooner, and in our experience the second most expensive thing you can do on a software project is build the right thing slowly. The most expensive is building the wrong thing quickly.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "Antigravity and Cursor: common questions",
    items: [
      {
        q: "Is Google Antigravity free?",
        a: "The individual public preview is free as of August 2026 and requires no credit card. It is metered by usage quotas rather than by a dollar amount, and those quotas have been reduced several times since launch. Google has not published a stable standalone paid tier, so treat any pricing as provisional.",
      },
      {
        q: "Is Antigravity better than Cursor?",
        a: "They solve different problems. Antigravity is better when you want an agent to own a multi step task and leave a verifiable record of what it did. Cursor is better for daily production coding where predictability and availability matter more than autonomy. Most teams that adopt both end up splitting their work along exactly that line.",
      },
      {
        q: "Can I use Claude models in Antigravity?",
        a: "Yes. Antigravity defaults to Gemini 3 Pro but routes to Claude Sonnet, Claude Opus, and open weight GPT-OSS models. Model quality is not the meaningful difference between these two products. Architecture and reliability are.",
      },
      {
        q: "How hard is it to switch from VS Code?",
        a: "Not hard for either. Cursor is a VS Code fork with near total extension compatibility, and Antigravity carries extensions across as well. The switching cost is habit rather than configuration, which means the first two days feel slower than they are.",
      },
      {
        q: "Which is safer for client code?",
        a: "Cursor, at least today. It has SOC 2 certification and a team wide Privacy Mode that keeps code out of training data. Antigravity's preview terms should be read carefully before any sensitive code touches it, and preview terms are by definition subject to change.",
      },
      {
        q: "Should a small team pay for Cursor or use Antigravity for free?",
        a: "If the team ships on deadlines, pay for Cursor and run Antigravity alongside it for the work it is better at. The $20 buys availability rather than capability. If you are experimenting rather than shipping, the free preview is the better place to start.",
      },
    ],
  },

  finalCta: {
    heading: "Tools do not ship products",
    body: [
      "We build AI agents and MVPs at Codroon and we use these tools daily, but the reason a build takes three weeks instead of three months is almost never the editor. It is how hard the scope was cut before anyone started writing code.",
      "If you are weighing an AI build and want to know what it would actually cost and how long it would take, the estimator is free and does not ask for your email.",
    ],
    primary: {
      label: "Run the AI agent cost estimator →",
      href: "/tools/ai-agent-cost-calculator",
    },
    secondary: { label: "Talk to us about a build", href: null },
  },

  relatedLinks: [
    { label: "AI Agent Development Company", href: "/services/ai-agent-development" },
    { label: "MVP Development Services", href: "/services/mvp-development" },
    { label: "ReplyDude, built with these tools", href: "/products/replydude" },
  ],
};

export default googleAntigravityVsCursor;
