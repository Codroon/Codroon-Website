import type { ProductPageContent } from "./types";

/**
 * Decipher Engine — /products/decipher-engine
 * Copy verbatim from docs deck "Copy Deck — Decipher Engine" (codroon.com).
 *
 * ⚠ AWAITING SIGN-OFF (deck § NOTES FOR ZOTHIX):
 *   1. RESOLVED 2026-08-04: the equity percentage is not published. The
 *      metaRail now reads "Technical co-founder" with no stake. The
 *      subhead's "holds equity in the company behind it" stays — the
 *      client's concern was the number, not the relationship.
 *   2. Naming Decipher Engine LLC — the subhead says "the company behind
 *      it" without naming them. Name only if agreed.
 *   3. 5,000 users / 50,000 stories / 10,000 images — confirm all three
 *      are current and defensible.
 *   4. Slider captions are deck copy; alt text is provisional until the
 *      real screenshots land (see slider TODO).
 *   5. Image models are listed as families (Flux, Seedream, Recraft),
 *      not exact versions — deliberate, per the deck.
 *
 * The lead heading ("What is Decipher Engine?") is the one string on the
 * page that is not in the deck — it mirrors the ReplyDude page's
 * structure and gives search a clean entity answer. Worth adding to the
 * deck so the copy stays in one place.
 */
export const decipherEngine: ProductPageContent = {
  slug: "decipher-engine",

  /** Decipher's violet — the light end of the "Start your adventure"
      button gradient on decipherengine.ai. The gradient's dominant
      shade (#583b96) only reaches 2.08:1 on our near-black page and
      vanishes; this end clears 3:1. */
  brandColor: "#7852b5",

  meta: {
    title: "Decipher Engine: AI Storytelling Platform | Codroon",
    description:
      "Decipher Engine is an AI storytelling platform with persistent narrative memory, 13 text models, and a full image studio. Built by Codroon.",
    ogTitle: "Decipher Engine: Built by Codroon",
    ogDescription:
      "An AI storytelling platform that remembers. Retrieval-backed narrative memory, 20+ models across text and image, 5,000+ users.",
  },

  hero: {
    eyebrow: "PRODUCT · LIVE",
    h1: "Decipher Engine: an AI storytelling platform that remembers what happened",
    subhead:
      "A generative fiction platform where stories hold together across hours of play. Thirteen text models, seven image models, voice in and out, and a library that connects characters, scenes, and images across everything you build. Codroon built it and holds equity in the company behind it.",
    stats: [
      { value: "5,000+", label: "users" },
      { value: "50,000+", label: "stories generated" },
      { value: "10,000+", label: "images generated" },
      { value: "20+", label: "models across text and image" },
    ],
  },

  /**
   * Slide order per client (2026-08-02): the live product site leads,
   * app screens follow. Captions and alt text describe the ACTUAL
   * screenshots in /public/products/decipher-engine/ — if an image is
   * replaced, re-run scripts/wire-product-images.mjs (sets src + true
   * dimensions) and re-check its caption/alt by eye
   * (scripts/contact-sheet.mjs renders them side by side).
   */
  slider: {
    slides: [
      {
        src: "/products/decipher-engine/01-decipher-site.png",
        alt: "The decipherengine.ai homepage: the Decipher Engine logo above a glowing open book, with the tagline 'A playable AI story engine where your choices become worlds, characters, and adventures that keep moving.'",
        /* the slider prefixes the linked domain itself — caption is
           only the descriptive tail */
        caption: "the live product",
        href: "https://decipherengine.ai",
        width: 2452,
        height: 1278,
      },
      {
        src: "/products/decipher-engine/02-dashboard.png",
        alt: "The dashboard: a featured world, 'Gates of Eldenvale', with a Start Adventure button, above a Rejoin Your Adventures row of in-progress story cards.",
        caption: "Dashboard: every world, ready to rejoin where you left it",
        width: 2529,
        height: 1273,
      },
      {
        src: "/products/decipher-engine/03-image-studio.png",
        alt: "The Image Studio: art-style presets, a model list of seven image engines, and a generated image on the canvas.",
        caption: "Image studio: seven models, styles, and formats",
        width: 2553,
        height: 1268,
      },
      {
        src: "/products/decipher-engine/04-story-creator.png",
        alt: "The story creator: a chapter of 'Mika's Adventure' open in the editor, with the AI Assistant panel, story controls, model picker and live story stats alongside.",
        caption: "Story creator: writing with the model of your choice",
        width: 2560,
        height: 1266,
      },
    ],
  },

  metaRail: [
    {
      label: "Category",
      value: "Generative AI · Consumer Software · Interactive Fiction",
    },
    {
      label: "Technologies",
      items: [
        "React 18",
        "Vite",
        "React Router",
        "Node.js",
        "MongoDB",
        "OpenRouter",
        "Replicate",
        "ElevenLabs",
        "Web Speech API",
        "RAG",
        "Stripe",
        "AWS",
        "S3",
        "Grafana",
        "GitHub Actions",
      ],
    },
    { label: "Status", value: "Live", accent: true },
    // Equity percentage removed on 2026-08-04 (client): the stake is not
    // published. "Technical co-founder" carries the relationship.
    { label: "Codroon's role", value: "Technical co-founder" },
    {
      label: "Visit",
      value: "decipherengine.ai",
      href: "https://decipherengine.ai",
    },
  ],

  leadHeading: "What is Decipher Engine?",

  bet: {
    heading: "The bet",
    paragraphs: [
      "AI storytelling has one well-known failure: the model forgets. Two hours in, a character's name drifts, a dead character reappears, and the world you were building quietly stops being the world you were building. Every player of these tools has hit it, and most stop playing because of it.",
      "The bet behind Decipher Engine was that the fix isn't a bigger context window. It's treating the story as state (characters, locations, prior events, established facts) and retrieving the relevant parts before each generation rather than hoping the model still holds them. Get that right and the same models everyone else uses produce something that behaves like a world instead of a very good improviser with no memory.",
    ],
  },

  decisions: {
    heading: "Three decisions that shaped it",
    intro:
      "The interesting part of a build is rarely the feature list. These are the three calls that determined what Decipher Engine could become.",
    tabs: [
      {
        tab: "Retrieval as narrative memory",
        heading: "RAG, pointed at story state",
        paragraphs: [
          "Most retrieval systems answer questions from documents. Decipher Engine's points at the story itself (characters, locations, established events, and prior scenes) so each generation is grounded in what has already been true rather than in whatever survived the context window.",
          "It's the architectural difference between a session that drifts and one that holds. It's also why the platform gets better as a story gets longer, which is the opposite of how these tools usually behave.",
        ],
        bullets: [
          "Story state indexed and retrieved per generation, not held in context",
          "Characters, locations, and events tracked as structured entities",
          "Continuity that improves with story length rather than degrading",
          "Model-agnostic: the memory layer survives a model swap",
        ],
      },
      {
        tab: "Twenty models, routed by task",
        heading: "One abstraction, many engines",
        paragraphs: [
          "Thirteen text models through OpenRouter, spanning Anthropic, OpenAI, Google, DeepSeek, and Mistral, plus seven image models through Replicate, including the Flux family, Seedream, and Recraft.",
          "The point isn't the count. It's that narrative registers differ: the model that writes tense action isn't the one that writes dialogue, and cost varies by an order of magnitude across the set. Users pick per story, and the platform falls back cleanly when a provider degrades. Across twenty providers, that's a weekly event rather than a hypothetical.",
        ],
        bullets: [
          "13 text models via OpenRouter, user-selectable per story",
          "7 image models via Replicate: Flux, Seedream, Recraft, and others",
          "Provider degradation handled with automatic fallback",
          "Swapping or adding a model is configuration, not a rewrite",
        ],
      },
      {
        tab: "A library, not a feed",
        heading: "The thing that makes it a platform",
        paragraphs: [
          "Generated content in most AI tools is disposable. You make it, you scroll past it, it's gone. Decipher Engine's library is the opposite: folders you organise, characters you import into new stories, images generated for a specific character and reused across scenarios, references that carry between worlds.",
          "This is the feature users cite most, and it's the one that turns a generator into a platform. It's also where the hardest product design work went, because organising generated content well is a much harder problem than generating it.",
        ],
        bullets: [
          "User-created folders across stories, characters, scenes, and images",
          "Characters and references importable into any story",
          "Images generated against a specific character and reused",
          "Scenario builder: construct the world before the story starts",
        ],
      },
    ],
  },

  mechanic: {
    heading: "Text, image, and voice in one loop",
    paragraphs: [
      "A session isn't only text. Images generate inside the story from the same context that wrote the scene: seven models, selectable styles, and formats sized for characters, creatures, locations, or references. ElevenLabs reads the story aloud, and the browser's speech API takes input back, so a session can be spoken rather than typed.",
      "The intent was never four features side by side. It's one loop that reads, speaks, listens, and illustrates, all pulling from the same story state. That's only possible because the memory layer sits underneath all of it rather than beside the text generation.",
    ],
  },

  whereItIsNow: {
    heading: "Where it is now",
    paragraphs: [
      "Decipher Engine is live. Around 5,000 people use it, and they've generated more than 50,000 stories and 10,000 images between them.",
      "It runs on AWS with S3 for media, MongoDB behind it, Stripe for payments, and Grafana for front-end and back-end monitoring. That matters more than it sounds on a platform calling twenty external model providers. When a provider slows down or starts failing, we see it on a dashboard rather than in a support ticket.",
      "Active roadmap rather than a finished product, which is the honest description of anything still being used.",
    ],
  },

  taughtUs: {
    heading: "What building it taught us",
    intro:
      "Three things we now bring to client work because Decipher Engine forced us to learn them.",
    items: [
      {
        heading: "Retrieval is a memory problem, not a search problem",
        body: "Most RAG builds are search with extra steps. Building retrieval for narrative continuity meant thinking about what state matters, when to retrieve it, and how to keep it consistent. That turns out to be the right way to think about retrieval for any long-running AI system.",
        link: {
          label: "Generative AI Development",
          href: "/services/generative-ai-development",
        },
      },
      {
        heading: "Twenty providers is an orchestration problem",
        body: "Running that many models in production taught us routing, fallback, cost control, and how to design so a provider outage degrades rather than breaks. It's the first thing we architect for on any multi-model build now.",
        link: {
          label: "AI Agent Development",
          href: "/services/ai-agent-development",
        },
      },
      {
        heading:
          "Observability isn't optional once you depend on other people's APIs",
        body: "Grafana across the front end and back end is how we know a model provider is degrading before users tell us. On any product built on external AI services, this is the difference between a bad hour and a bad week.",
        link: {
          label: "SaaS Development",
          href: "/services/saas-development",
        },
      },
    ],
  },

  finalCta: {
    heading: "Try it, or build something like it",
    body: "Decipher Engine is live and you can use it today. If you're building something that needs AI to stay coherent over long sessions, that's the work we do.",
    // Primary sends traffic away on purpose — a case study can't do that.
    primary: {
      label: "Visit decipherengine.ai",
      href: "https://decipherengine.ai",
    },
    secondary: "Build something like this",
  },
};

export default decipherEngine;
