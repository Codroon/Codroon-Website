import type { ProductPageContent } from "./types";

/**
 * ReplyDude — /products/replydude
 * Copy verbatim from docs deck "Copy Deck — ReplyDude" (codroon.com).
 *
 * ⚠ AWAITING SIGN-OFF before this page is indexed (deck § NOTES FOR ZOTHIX):
 *   1. RESOLVED 2026-08-04: the equity percentage is not published. The
 *      metaRail now reads "Technical co-founder" with no stake.
 *   2. The meta description names K-Hive; the deck's own note says to name
 *      them only if K-Hive has agreed. Left verbatim — confirm or cut.
 *   3. "1,000+ users" (hero) — confirm current and defensible.
 *   4. Slider captions are deck copy; alt text is provisional until the
 *      real screenshots land (see slider TODO).
 *   5. "Live · v7.6.1" — version numbers date fast; deck suggests
 *      considering "seven releases in four months" instead.
 *
 * TODO (next build step): § the bet, three decisions, the agent loop,
 * where it is now, what building it taught us, final CTA. All copy is in
 * the deck; the type contract already declares the fields.
 */
export const replydude: ProductPageContent = {
  slug: "replydude",

  /* Black, by client decision (2026-08-02). ReplyDude's sampled blue
     (#3f67e9) was tried and rejected — the coloured edge read as
     decoration rather than as a frame. This is a deliberate exception to
     the ≥3:1 guidance in public/products/README.md: black is 1.21:1
     against --surface-page, so the edge recedes instead of announcing
     itself. That is the intent. Do not "fix" it back to a sampled
     colour or to the neutral hairline. */
  brandColor: "#000000",

  meta: {
    title: "ReplyDude: AI Reply Automation for X & Instagram | Codroon",
    description:
      "ReplyDude is a desktop AI agent that runs reply-based growth on X and Instagram. Built by Codroon, co-founded with K-Hive. 1,000+ users.",
    ogTitle: "ReplyDude: Built by Codroon",
    ogDescription:
      "A cross-platform desktop AI agent running reply growth on X and Instagram. Four models, real browser automation, non-custodial billing.",
  },

  hero: {
    eyebrow: "PRODUCT · LIVE",
    h1: "ReplyDude: an AI agent that runs reply-based growth around the clock",
    subhead:
      "A cross-platform desktop agent that watches the accounts you choose, drafts replies in your voice, and posts within about ninety seconds of a tracked post, pacing itself like a person rather than a script. Codroon built it and co-founded the company behind it.",
    stats: [
      { value: "1,000+", label: "users" },
      { value: "7", label: "releases in 4 months" },
      { value: "4", label: "AI models, each with a job" },
      { value: "3", label: "desktop platforms" },
    ],
  },

  /**
   * Slide order per client (2026-08-02): the live product site leads,
   * app screens follow. Captions and alt text describe the ACTUAL
   * screenshots in /public/products/replydude/ — if an image is
   * replaced, re-run scripts/wire-product-images.mjs (sets src +
   * true dimensions) and re-check its caption/alt by eye
   * (scripts/contact-sheet.mjs renders them side by side).
   */
  slider: {
    slides: [
      {
        src: "/products/replydude/01-replydude-site.png",
        alt: "The replydude.ai homepage: the headline 'An AI agent that earns organic engagement and followers on X and Instagram', Windows and Linux download buttons, and a preview of the app dashboard.",
        /* the slider prefixes the linked domain itself — caption is
           only the descriptive tail */
        caption: "the shipped product, live today",
        href: "https://replydude.ai",
        width: 2428,
        height: 1266,
      },
      {
        src: "/products/replydude/02-campaign-builder.png",
        alt: "The new-campaign dialog: a one-line brief field that generates personas, accounts and keywords, with campaign name and per-platform persona pickers below.",
        caption: "Campaign builder: one sentence in, a full campaign out",
        width: 1771,
        height: 1056,
      },
      {
        src: "/products/replydude/03-live-status.png",
        alt: "The Home dashboard: comment, view, like and reply counters across X and Instagram, a recent-activity list of posted replies, and the active campaign's accounts and keywords.",
        caption: "Live agent status: every reply, tracked and re-measured",
        width: 1771,
        height: 1056,
      },
      {
        src: "/products/replydude/04-settings.png",
        alt: "Settings: platform toggles for X and Instagram, saved browser logins with reconnect controls, and the option to run the agent window hidden in the background.",
        caption: "Saved logins: the agent drives your own signed-in browser",
        width: 1550,
        height: 1025,
      },
    ],
  },

  metaRail: [
    {
      label: "Category",
      value: "AI Agents · Desktop Software · Social Automation",
    },
    {
      label: "Technologies",
      items: [
        "Electron",
        "TypeScript",
        "React",
        "Puppeteer / CDP",
        "Node.js",
        "Express",
        "MongoDB",
        "Anthropic Claude",
        "OpenAI",
        "Google Gemini",
        "xAI Grok",
        "Solana Anchor",
        "WalletConnect",
        "GitLab CI",
      ],
    },
    { label: "Status", value: "Live · v7.6.1", accent: true },
    // Equity percentage removed on 2026-08-04 (client): the stake is not
    // published. "Technical co-founder" carries the relationship.
    { label: "Codroon's role", value: "Technical co-founder" },
    { label: "Visit", value: "replydude.ai", href: "https://replydude.ai" },
  ],

  leadHeading: "What is ReplyDude?",

  bet: {
    heading: "The bet",
    paragraphs: [
      "Replying is the most reliable organic growth strategy left on X and Instagram, and almost nobody does it consistently. It works because it puts you in front of an audience that already exists. But it demands you show up within minutes of the right post, several times a day, in a voice that sounds like you rather than like a tool.",
      "Every existing attempt to automate it took the same shortcut: platform APIs or injected cookies. Both are brittle, both get accounts flagged, and both mean somebody is holding your credentials. The bet behind ReplyDude was that the hard version, done properly, would make the thing people actually wanted possible: drive the user's own signed-in browser, behave like a person, never touch a password.",
    ],
  },

  decisions: {
    heading: "Three decisions that shaped it",
    intro:
      "The interesting part of a build is rarely the feature list. These are the three calls that determined what ReplyDude could become.",
    tabs: [
      {
        tab: "Drive the real browser, not the API",
        heading: "Automation without credentials",
        paragraphs: [
          "ReplyDude drives the user's own installed browser (Chrome, Edge, or Opera GX) over the Chrome DevTools Protocol. It types character by character, scrolls and pauses at randomised intervals, keeps session rhythms and cooldowns, and enforces per-account caps.",
          "It is meaningfully harder to build than calling an API, and it's the reason the product works. There are no platform API keys to be revoked, no cookies to inject, and no credentials leaving the user's machine.",
        ],
        bullets: [
          "Character-by-character typing with human-like cadence",
          "Randomised dwell, scroll, and session timing",
          "Per-account caps and cooldowns to protect account health",
          "No credential storage, anywhere in the system",
        ],
      },
      {
        tab: "Four models, four jobs",
        heading: "One abstraction, the right engine per task",
        paragraphs: [
          "Most products that advertise multiple models are offering the same task to different providers. ReplyDude assigns work by what each model is genuinely best at: Claude builds the campaign, Grok writes the replies, Gemini reads the images and video, and OpenAI runs as the alternate engine.",
          "They sit behind a single abstraction, so swapping a provider is a config change rather than a rewrite. That matters in a market where model pricing and capability move every few months.",
        ],
        bullets: [
          "Claude: campaign construction, persona writing, account research",
          "Grok: reply generation, tuned for platform-native voice",
          "Gemini: multimodal understanding of images and video in tracked posts",
          "OpenAI: alternate engine, and the fallback when a provider degrades",
        ],
      },
      {
        tab: "Payments without a card on file",
        heading: "Non-custodial billing, signature-based auth",
        paragraphs: [
          "Plan checkout runs through a custom Solana Anchor program taking USDT or SOL, verified server-side, with no auto-renew and nothing custodial. Sign-in can be a pure wallet signature; the backend verifies ed25519 for Solana and EVM signatures via ethers, so there is no password in the system to breach.",
          "Unusual for a SaaS product, and deliberate. It suited an audience that already holds wallets, and it removed an entire category of security surface.",
        ],
        bullets: [
          "Custom on-chain Anchor program for plan checkout",
          "USDT and SOL, verified server-side, non-custodial",
          "Wallet-signature sign-in (ed25519 and EVM)",
          "No stored cards, no auto-renew, no password database",
        ],
      },
    ],
  },

  mechanic: {
    heading: "How the agent actually works",
    paragraphs: [
      "A campaign starts as one sentence. From there the agent researches target accounts against live trends, builds 300-plus-word personas for each platform, and verifies every handle in a real browser before it commits to anything.",
      "Then it runs. It watches tracked accounts, drafts a reply in the user's voice, and posts within roughly ninety seconds, then re-measures that reply's engagement at one hour, one day, and seven days. Over 10,000 replies have gone out this way.",
      "The part we're most pleased with is the loop that closes: the agent reads its own engagement data, proposes changes to targeting and voice, and waits for the user to approve them. It isn't a tool that runs a strategy you wrote once. It's one that argues with you about the strategy, using evidence.",
    ],
  },

  whereItIsNow: {
    heading: "Where it is now",
    paragraphs: [
      "ReplyDude is live at v7.6.1: seven tagged releases in four months, shipped through tag-triggered CI on self-hosted infrastructure, with multi-OS Electron builds and auto-updates. Windows and Linux are out; macOS is in progress.",
      "Over a thousand people use it, across roughly three thousand connected accounts. It's a live product with an active roadmap rather than a finished one, which is the honest description of any software still being used.",
    ],
  },

  taughtUs: {
    heading: "What building it taught us",
    intro:
      "Three things we now bring to client work because ReplyDude forced us to learn them.",
    items: [
      {
        heading: "Agents that act, not agents that answer",
        body: "Most “AI agent” work stops at generating text. ReplyDude had to take real actions in systems it didn't control, safely, thousands of times a day. Permissions, pacing, caps, and rollback stopped being theoretical.",
        link: {
          label: "AI Agent Development",
          href: "/services/ai-agent-development",
        },
      },
      {
        heading: "Routing work to the right model",
        body: "Running four providers in production taught us where each one is genuinely better, and how much you save by not sending every task to the frontier model. It's the first thing we look at on any AI build now.",
        link: {
          label: "Generative AI Development",
          href: "/services/generative-ai-development",
        },
      },
      {
        heading: "Shipping desktop software properly",
        body: "Auto-updates, multi-OS builds, and release discipline are unglamorous and they're what separates a demo from a product people keep open all day.",
        link: {
          label: "SaaS Development",
          href: "/services/saas-development",
        },
      },
    ],
  },

  finalCta: {
    heading: "Try it, or build something like it",
    body: "ReplyDude is live and you can use it today. If you're building something that needs an agent to take real actions in real systems, that's the work we do.",
    // Primary sends traffic away on purpose — a case study can't do that.
    primary: { label: "Visit replydude.ai", href: "https://replydude.ai" },
    secondary: "Build something like this",
  },
};

export default replydude;
