import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-04-custom-ecommerce-vs-shopify-v2.md.
 * Excluded as internal scaffolding: the header block above META and NOTES.
 *
 * ⚠️ Deck note, for the client not the code: this post advises people not
 * to hire you fairly directly. Deliberate, and consistent with the service
 * pages, but it trades enquiry volume for enquiry quality.
 */
export const customEcommerceVsShopify: BlogPost = {
  slug: "custom-ecommerce-vs-shopify",

  title: "Custom Ecommerce vs Shopify: When Building Is Worth It",
  metaTitle: "Custom Ecommerce vs Shopify: When Building Is Worth It",
  metaDescription:
    "Should you build custom or use Shopify? An honest breakdown of costs, ceilings, and the three situations where building your own actually pays.",

  category: "ECOMMERCE",
  coverHeadline: "Custom or\nShopify? Mostly\nShopify.",
  coverSubtitle: "The three situations where building your own actually pays",
  watermark: "SHOPIFY",

  publishedAt: "2026-07-13",
  updatedAt: "2026-07-13",
  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "Most stores should use Shopify.",
      rest: "If the operation is products, cart, checkout, and shipping, a platform does it better than you will and for less money.",
    },
    {
      lead: "WooCommerce trades platform fees for a maintenance obligation.",
      rest: "That is a good trade for content-led stores with technical capacity and a poor one without.",
    },
    {
      lead: "Custom is right in three situations:",
      rest: "the business logic is the product, platform fees have reached the cost of a salary, or an integration exists that nothing supports.",
    },
    {
      lead: "The build is not the expensive part.",
      rest: "Owning it is. Every payment provider change, tax rule, and security patch becomes yours permanently.",
    },
    {
      lead: "Headless is the option people rarely ask about and frequently need.",
      rest: "Keep the commerce engine, own the experience.",
    },
    {
      lead: "Budget ten to twenty percent of the build cost annually",
      rest: "for maintenance, indefinitely.",
    },
  ],

  intro: [
    "We get asked to build custom ecommerce reasonably often and talk roughly half of those people out of it.",
    "That is not modesty. Ecommerce is among the most thoroughly solved problems in commercial software, and the companies solving it employ thousands of engineers working on things you would otherwise build yourself. Fraud detection, tax calculation across jurisdictions, PCI compliance, and checkout conversion are all problems with known answers, and the known answers are better than the ones a small team will arrive at.",
    "But mostly use Shopify is not a complete answer, and the cases where it is wrong are expensive to get wrong in the other direction. What follows is how to tell which case you are.",
  ],

  sections: [
    {
      id: "shopify-solved-the-hard-parts",
      heading: "Shopify has already solved the parts you would get wrong",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Checkout, primarily. Shopify's checkout has been optimised against a volume of real transactions no individual store will ever generate, and rebuilding it is one of the more reliable ways to lose revenue without noticing you are losing it. Conversion differences of a few percent do not announce themselves. They just quietly happen.",
            "Beyond checkout there is PCI compliance handled on your behalf, fraud analysis included, tax calculation across jurisdictions maintained by somebody else, payment integrations that keep working when providers change their APIs, and an application ecosystem where most things you will want already exist.",
            "The trade is uniformity. Your store works the way Shopify believes stores work. For the overwhelming majority of retail this is not a constraint but a decade of accumulated good decisions you receive at no cost.",
            "The expenses that matter are the subscription, transaction fees if you do not use their payment processing, and application subscriptions, which stack more quickly than anyone expects. A store running eight applications is unremarkable and is not cheap, and this is the number that eventually drives the custom conversation.",
          ],
        },
      ],
    },
    {
      id: "woocommerce-trades-fees-for-obligation",
      heading: "WooCommerce trades fees for an obligation",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "WooCommerce is the right answer more often than the discourse suggests, particularly where content and commerce are equally important.",
            "If a meaningful part of the business is publishing, whether recipes, guides, reviews, or a community, WordPress is a better content platform than Shopify and WooCommerce lets the store live inside it rather than beside it. You own the data, you own the hosting, there are no transaction fees, and customisation means writing PHP rather than working around a platform's assumptions.",
            "The cost is that you now own a WordPress installation. Updates, plugin conflicts, security patching, backups, and performance tuning are somebody's job. This is where the comparison becomes less about features and more about organisational capacity, because a neglected WooCommerce store is a genuine liability in a way a neglected Shopify store is not. Shopify cannot be compromised through an outdated plugin you forgot about.",
            "Choose it when content and commerce carry equal weight, or when you have the technical capacity and object to platform fees on principle. Avoid it when nobody has been named as the person who maintains it.",
          ],
        },
      ],
    },
    {
      id: "shopify-woocommerce-custom",
      heading: "Shopify vs WooCommerce vs custom",
      blocks: [
        {
          kind: "table",
          caption:
            "Shopify, WooCommerce, and a custom build compared across launch time, cost, maintenance, checkout, custom logic, SEO, compliance, and ceiling.",
          columns: ["Shopify", "WooCommerce", "Custom build"],
          rows: [
            { label: "Time to launch", cells: ["Days", "Weeks", "6 to 12 weeks"] },
            { label: "Upfront cost", cells: ["Low", "Low to moderate", "$15,000 and up"] },
            {
              label: "Ongoing cost",
              cells: [
                "Subscription, fees, apps",
                "Hosting and maintenance",
                "Hosting and your own time",
              ],
            },
            {
              label: "Transaction fees",
              cells: ["Yes, unless using Shopify Payments", "None", "None"],
            },
            { label: "Who maintains it", cells: ["Shopify", "You", "You"] },
            {
              label: "Checkout",
              cells: [
                "Best available, not yours to change",
                "Good and customisable",
                "Yours to build and get right",
              ],
            },
            {
              label: "Custom business logic",
              cells: ["Limited to apps and scripts", "Possible with PHP", "Unlimited"],
            },
            { label: "Content and SEO", cells: ["Good", "Excellent", "Whatever you build"] },
            {
              label: "Compliance and PCI",
              cells: ["Handled", "Partly yours", "Entirely yours"],
            },
            {
              label: "Ceiling",
              cells: ["The platform's rules", "Performance at scale", "None"],
            },
            {
              label: "Best for",
              cells: ["Most stores, most of the time", "Content-led commerce", "Logic-led commerce"],
            },
          ],
        },
      ],
    },
    {
      id: "three-situations",
      heading: "Three situations where building actually pays",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Wanting it to look different is not one of them. Looking different is a theme. These are the situations where a platform is the wrong shape rather than the wrong style.",
          ],
        },
        { kind: "subheading", text: "The business logic is the product" },
        {
          kind: "prose",
          paragraphs: [
            "Configurable products with real dependency rules between options. Quoting that depends on customer, volume, and contract terms. Subscription models nobody has built before. Marketplace mechanics with multi-party payouts. Business-to-business ordering with approval chains and account-specific catalogues.",
            "If the thing that makes the business work is the logic sitting between browsing and paying, a platform will resist you at every step, and the usual outcome is a stack of applications and workarounds that costs more than a build and performs worse. The workaround stack is also harder to reason about than a codebase, because it is distributed across vendors nobody controls.",
          ],
        },
        { kind: "subheading", text: "Platform fees have reached the cost of a salary" },
        {
          kind: "prose",
          paragraphs: [
            "This is arithmetic rather than philosophy. Subscription plus transaction fees plus application subscriptions, multiplied by twelve. Once that figure exceeds what a build plus its maintenance would cost, and volume is stable enough to trust the projection, custom starts to make sense.",
            "For most stores that crossover never arrives. For a high-volume store operating on thin margins it can arrive quickly, and the margin structure is what determines it rather than the revenue.",
          ],
        },
        { kind: "subheading", text: "An integration exists that nothing supports" },
        {
          kind: "prose",
          paragraphs: [
            "A legacy enterprise resource planning system, a specialised warehouse management platform, an industry compliance requirement, or unusual tax treatment. Occasionally there is no application and no plausible workaround, and the integration is not optional to the operation of the business.",
          ],
        },
        { kind: "subheading", text: "And the option people rarely ask about" },
        {
          kind: "prose",
          paragraphs: [
            "Headless commerce is frequently the correct answer and almost never the thing people arrive asking for. Keep Shopify as the commerce engine, meaning checkout, inventory, payments, and compliance, and build a custom frontend against its API.",
            "You get the experience you want while keeping the parts that are genuinely hard and genuinely regulated. It costs less than a full custom build and removes most of the ceiling. If you are considering custom because the storefront feels constraining rather than because the logic does, this is almost certainly your answer, and it is worth naming explicitly because the conversation is usually framed as a binary that it is not.",
          ],
        },
      ],
    },
    {
      id: "build-is-the-cheap-part",
      heading: "The build is the cheap part",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "A build is a defined scope with an end date. What follows it has neither.",
            "Payment providers change their APIs. Tax rules change, sometimes with a few weeks of notice. Security patches need applying. Browsers change and something breaks on iOS for reasons nobody anticipated. Fraud patterns evolve and your defences do not evolve with them unless somebody is paid to evolve them. Every one of those is Shopify's problem today and becomes yours permanently the moment you build.",
            "The honest budget is somewhere between ten and twenty percent of the build cost annually, ongoing, with no end date. If that number causes the project to stop making sense, that is useful information now rather than in year two.",
            "We tell clients this before quoting, because a custom store nobody maintains becomes a liability faster than almost any other category of software. It is also the number most agencies leave out of the pitch, which is why so many custom stores are quietly abandoned eighteen months after launch.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "Custom ecommerce: common questions",
    items: [
      {
        q: "How much does a custom ecommerce site cost?",
        a: "Most custom builds start around $15,000 and run to $50,000 depending on catalogue structure, custom logic, integrations, and how many types of user the system serves. Headless, which keeps a platform as the commerce engine, is usually cheaper because you are not rebuilding checkout, payments, or compliance.",
      },
      {
        q: "Can I migrate from Shopify to custom later?",
        a: "Yes, and that is the sensible order. Prove demand on a platform, learn what the business actually requires, then build. Product and customer data exports cleanly and order history is more awkward but manageable. Building first and hoping for demand is the expensive version of the same decision.",
      },
      {
        q: "Is WooCommerce good enough for a serious store?",
        a: "Yes, with a caveat. It runs plenty of substantial stores. The constraint is not capability but maintenance, because a WooCommerce store needs an owner in a way a Shopify store does not. With one it is fine. Without one it degrades.",
      },
      {
        q: "What is headless commerce?",
        a: "Keeping a commerce platform as the backend for products, inventory, checkout, and payments while building a completely custom frontend against its API. You get full control of the experience without rebuilding the hard and regulated parts.",
      },
      {
        q: "Will a custom store be faster than Shopify?",
        a: "It can be and frequently is not. Shopify's infrastructure is very good, and a custom store built without attention to caching, image handling, and query patterns will lose. Speed is a reason to build carefully rather than a reason to build custom.",
      },
      {
        q: "When would you tell somebody not to build custom?",
        a: "When a platform does eighty percent or more of what they need. The remaining twenty percent is almost never worth owning everything forever, and when it genuinely is, that shows up in the numbers rather than in a feeling about the storefront.",
      },
    ],
  },

  finalCta: {
    heading: "Not sure which one you are",
    body: [
      "The answer is usually clear within a conversation. What the logic actually requires, what you are paying in fees, and whether anything has genuinely hit a wall. If Shopify is the right answer we will tell you.",
    ],
    primary: { label: "Book a free discovery call", href: null },
    secondary: { label: "Estimate a custom build →", href: "/tools/mvp-cost-calculator" },
  },

  relatedLinks: [
    { label: "Custom Software Development", href: "/services/custom-software-development" },
    { label: "AI Integration Services", href: "/services/ai-integration" },
  ],
};

export default customEcommerceVsShopify;
