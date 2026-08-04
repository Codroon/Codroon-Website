/**
 * /about copy. VERBATIM from codroon-about-page-copy.md. Do not write,
 * rephrase, or extend anything here, and do not add sections the deck
 * does not contain — several common About sections (founding story,
 * timeline, values list, team grid) were considered and rejected in
 * the deck, so their absence is the design.
 *
 * The page is typographic by decision: no photos, illustrations, icons,
 * or decorative graphics anywhere. If a section looks empty the answer
 * is more whitespace and larger type.
 */

export const ABOUT_META = {
  /**
   * Deck title tag is "About Codroon — AI-Native Software Studio in
   * Dallas, TX". The em dash is replaced with a colon: no em dashes in
   * user-visible copy is a standing client rule (2026-08-03) and a
   * <title> shows in the tab and the SERP. Same substitution already
   * made on /blog and the other page titles.
   */
  title: "About Codroon: AI-Native Software Studio in Dallas, TX",
  description:
    "Codroon is an AI-native software studio in Dallas. We build products for founders, and on some projects we come in as technical co-founder instead.",
  ogTitle: "About Codroon",
  ogDescription:
    "An AI-native software studio in Dallas. Four products shipped, two co-founded, 100+ projects delivered.",
};

export const ABOUT_HERO = {
  eyebrow: "About",
  h1: "We build products. Sometimes we co-found them.",
  subhead:
    "Codroon is an AI-native software studio in Dallas, Texas. We work with founders and small teams who need software built properly and quickly, and who would rather have a technical partner than a vendor.",
};

/**
 * Bare numerals on the page background, never cards. Cards make numbers
 * look like a dashboard; bare numerals make them look like facts.
 *
 * ⚠️ TODO (client): confirm "10 on the team" before this ships. If ten
 * counts contractors and the teams at the two joint ventures, the deck's
 * suggested honest phrasing is "10 across the studio and the products we
 * co-founded". This is the one figure a prospect can test in a single
 * question.
 */
export const ABOUT_NUMBERS: Array<{
  value: string;
  label: string;
  /** supporting line. The ONLY new copy on this page. */
  description: string;
}> = [
  {
    value: "4",
    label: "products shipped",
    description: "Live products with real users, not case studies.",
  },
  {
    value: "2",
    label: "companies co-founded",
    description: "We took equity and stayed technical through launch.",
  },
  {
    value: "100+",
    label: "projects delivered",
    description: "Across web, mobile, AI, and automation.",
  },
  {
    value: "10",
    label: "on the team",
    description: "Small enough that you talk to whoever builds it.",
  },
];

/**
 * §3. Hairline-separated rows, label left in a fixed column, description
 * right. NOT three cards and NOT a bordered table: boxes turn this into
 * a pricing grid, which is the wrong register for an About page.
 *
 * ⚠️ TODO (client): the equity offer here is a real commercial
 * commitment. It tells founders you will take equity in exchange for a
 * reduced fee, and it will produce that inbound.
 */
export const ABOUT_FOUNDERS = {
  eyebrow: "How we work with founders",
  h2: "We'd rather own part of what we build.",
  body: [
    "Most studios bill you and leave. On some projects we do the opposite. We come in as your technical co-founder, take equity in the company, and cut the build fee to match.",
    "Two of our products started that way and both are live today. ReplyDude runs reply-based growth on X and Instagram for over a thousand users. Decipher Engine is an AI storytelling platform with five thousand. Neither was a client brief we executed. Both were bets we took alongside the people who had the idea.",
  ],
  models: [
    {
      label: "Standard build",
      body: "Fixed price, you own everything, we hand over and go.",
    },
    {
      label: "Co-founder build",
      body: "Reduced fee, equity instead, and we stay technical through launch.",
    },
    {
      label: "Which one",
      body: "Depends on the product, and on whether we would use it ourselves. We will tell you plainly which one we think it is.",
    },
  ],
  closing:
    "The second model is not on offer for every project, and saying so is part of the point. Taking equity means we only do it when we believe the thing will work, which is a different filter from whether we can build it.",
};

/**
 * §4. Each item is a claim followed by something checkable, then one
 * inline link. The deck is explicit: do not soften any of these into
 * adjectives.
 *
 * "You own everything" was REMOVED on 2026-08-03 (client). It carried
 * the only link to /services, which does not exist as an index, so that
 * broken-link TODO is resolved by the removal rather than worked around.
 *
 * `href: null` opens the shared contact modal rather than navigating.
 *
 * ⚠️ TODO (client): the free scope document is promised here and on all
 * six service pages. It is the strongest risk-reversal on the site and
 * it only works if it is honoured every time.
 */
export const ABOUT_BUILD = {
  eyebrow: "How we build",
  /**
   * ⚠️ ONE WORD CHANGED from the deck: "Three" became "Two". Removing
   * the third item left the heading counting items that are no longer
   * there. Revert both together if the item comes back.
   */
  h2: "Two things we do differently, and the proof for each.",
  items: [
    {
      claim: "We cut scope before we build",
      body: [
        "Every engagement starts with a free forty-five minute call where we argue you down to the smallest thing that answers your question. You leave with a written scope, an architecture sketch, and a real number, and you keep all three whether you hire us or not.",
        "Most projects that go wrong were scoped badly rather than built badly, and the scoping conversation costs us an hour.",
      ],
      links: [{ label: "Book a free discovery call", href: null }],
    },
    {
      claim: "We publish our prices",
      body: [
        "Every service page carries a range. Both cost estimators give you a build figure, a timeline, and a list of what we would cut to bring the number down, with no email required to see any of it.",
        "Agencies avoid publishing prices because it costs them the ability to quote by what a client looks like they can pay. That is precisely why we publish them.",
      ],
      links: [
        { label: "AI agent cost estimator", href: "/tools/ai-agent-cost-calculator" },
        { label: "MVP cost estimator", href: "/tools/mvp-cost-calculator" },
      ],
    },
  ],
};

/**
 * §5. Straight prose, no special treatment.
 *
 * ⚠️ TODO (client), both from the deck:
 *  - "Our AI agent projects start at six thousand dollars. Comparable
 *    studios start at twenty-five." The first half matches the service
 *    page. The second is a claim about a competitor without naming them.
 *    Keep it, or soften to "considerably less than a traditional agency".
 *  - Naming Claude Code is the third place on the site that tells
 *    clients AI writes a lot of the code. Confirm it stays this plain.
 */
export const ABOUT_AI_NATIVE = {
  eyebrow: "AI-native",
  h2: "It changes the price, not the standard.",
  body: [
    "AI-native is a phrase that has been worn thin, so here is what it means in practice for us. We use Claude Code through most of our build process, we run agents against our own repositories, and we design with AI in the loop rather than bolted on afterwards.",
    "The consequence is arithmetic. A build that took a traditional agency twelve weeks takes us four, and our fixed prices are lower because of it rather than because we are cutting corners somewhere you cannot see. Our AI agent projects start at six thousand dollars. Comparable studios start at twenty-five.",
    "What has not changed is the review. Every line ships because someone read it and decided it was right. The speed comes from removing the parts of software development that were always mechanical, not from removing judgement.",
  ],
};

/**
 * §6. No map, no pin icon, no photo.
 *
 * DO NOT add more Texas or Dallas mentions. The deck is explicit that
 * the instinct to repeat it is counterproductive: local ranking comes
 * from a verified Google Business Profile, a US phone number,
 * consistent NAP across directories, and reviews. One section plus
 * LocalBusiness schema is the correct use of this page.
 */
export const ABOUT_DALLAS = {
  eyebrow: "Where we are",
  h2: "Built in Dallas, working with founders anywhere.",
  body: [
    "We are a Dallas studio. Texas has an unusual concentration of people building real businesses rather than pitching them, and the local expectation is that you show up with something working rather than something promised. That suits how we would want to operate regardless of where we were.",
    "Most of our work happens over calls and shared repositories, so location has never determined who we take on. But if you are in Dallas or Fort Worth and would rather have the conversation in person, we would prefer that too. It is still the fastest way to understand what someone is actually trying to build.",
  ],
};

/**
 * §7 "What we won't do" (ABOUT_WONT_DO, four turn-downs) was REMOVED on
 * the client's instruction (2026-08-04). Deleted rather than commented
 * out. The deck still carries the copy if it is ever wanted back.
 */

/**
 * §8 How to connect. The three options are the contact modal's three
 * flows and open exactly those views.
 *
 * ⚠️ TODO (client): no heading, subheading, or panel statement was
 * supplied for this section. The H2 below is the section's own name
 * from the build brief. The subheading and the left panel's display-
 * serif line are both left empty rather than invented — send the lines
 * and they render with no other change.
 */
export const ABOUT_CONNECT = {
  h2: "How to connect",
  /** ⚠️ TODO: one supporting line under the H2. */
  subhead: null as string | null,
  /** ⚠️ TODO: a short statement for the panel, in the display serif. */
  panelStatement: null as string | null,
  options: [
    {
      view: "call" as const,
      label: "Get a Call",
      descriptor: "We'll call you back within 24 hours",
    },
    {
      view: "email" as const,
      label: "Send an Email",
      descriptor: "Drop us a message and we'll respond soon",
    },
    {
      view: "meeting" as const,
      label: "Schedule a Meeting",
      descriptor: "Book a time that works for you",
    },
  ],
};

/**
 * §9 Where we are. The intro paragraphs are the existing "Built in
 * Dallas" copy, unchanged — it now leads into the cards rather than
 * standing alone.
 *
 * ⚠️ TODO (client): BOTH street addresses. They are deliberately null,
 * not placeholder strings: a wrong NAP is worse for local ranking than
 * an absent one, and these also feed the LocalBusiness schema.
 */
export const ABOUT_OFFICES = {
  eyebrow: ABOUT_DALLAS.eyebrow,
  h2: ABOUT_DALLAS.h2,
  intro: ABOUT_DALLAS.body,
  cards: [
    {
      key: "usa" as const,
      country: "USA",
      note: "head office",
      /** ⚠️ TODO: real street address */
      street: null as string | null,
      city: "Dallas, TX",
      landmark: "Reunion Tower",
    },
    {
      key: "pakistan" as const,
      country: "Pakistan",
      note: null,
      /** ⚠️ TODO: real street address */
      street: null as string | null,
      city: "Islamabad, Pakistan",
      landmark: "Faisal Mosque",
    },
  ],
};

/** §10. `href: null` opens the shared contact modal. */
export const ABOUT_CTA = {
  h2: "Tell us what you are building.",
  body: "Forty-five minutes, no preparation needed, no commitment. You will leave with a scope, an approach, and a real number, whether you build it with us or somewhere else.",
  primary: { label: "Book a free discovery call", href: null as string | null },
  secondary: {
    label: "See what it would cost →",
    href: "/tools/mvp-cost-calculator" as string | null,
  },
};
