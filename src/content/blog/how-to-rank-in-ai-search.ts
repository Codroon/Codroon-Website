import type { BlogPost } from "./types";

/**
 * Copy is VERBATIM from blog-07-how-to-rank-in-ai-search-v2.md.
 * Excluded as internal scaffolding: the header block above META, the
 * SOURCES block (explicitly marked "Not published"), and NOTES.
 *
 * ⚠️ This post argues in Section 3 that a named author with a real
 * biography is required. Publishing it under a stub byline visibly
 * contradicts its own body copy — see src/content/blog/authors.ts.
 */
export const howToRankInAiSearch: BlogPost = {
  slug: "how-to-rank-in-ai-search",

  title: "How to Rank in AI Search: A Practical GEO Guide (2026)",
  metaTitle: "How to Rank in AI Search: A Practical GEO Guide (2026)",
  metaDescription:
    "AI search sends less traffic and converts far better. What actually makes ChatGPT, Perplexity, and AI Overviews cite you, and what is a waste of time.",

  category: "SEO & GROWTH",
  coverHeadline: "Ranking is over.\nGetting cited\nis the job.",
  coverSubtitle: "What actually works in generative engine optimization",
  watermark: "CITED",

  publishedAt: "2026-07-07",
  updatedAt: "2026-07-07",
  author: "codroon-lead",

  keyTakeaways: [
    {
      lead: "GEO is a layer on SEO rather than a replacement.",
      rest: "Google's own 2026 guidance states that optimizing for its generative features is still SEO.",
    },
    {
      lead: "The traffic is small and the conversion is not.",
      rest: "One analysis found AI search drove 0.5 percent of visitors and 12 percent of signups.",
    },
    {
      lead: "Ranking and being cited have come apart.",
      rest: "Overlap between top Google links and AI-cited sources has reportedly fallen from around 70 percent to below 20 percent.",
    },
    {
      lead: "Put the answer in the first 80 to 100 words",
      rest: "of every section. Models copy a self-contained paragraph more readily than they assemble one.",
    },
    {
      lead: "Structure beats volume.",
      rest: "Comparison tables, FAQ blocks, and extractable answers get cited. Undifferentiated prose does not.",
    },
    {
      lead: "Skip the folklore.",
      rest: "Google confirmed that llms.txt files, special chunking, and bespoke schema are not required.",
    },
  ],

  intro: [
    "Something has changed in how people find things, and most sites have not adjusted to it.",
    "The old model was ten blue links and a click. The new one is a synthesised answer assembled from sources, with citations, and whether you are one of those sources has surprisingly little to do with where you rank on Google. Research from one GEO firm puts the overlap between top-ranking Google links and AI-cited sources below twenty percent, down from roughly seventy percent.",
    "That decoupling is the whole story. Ranking first no longer implies being quoted, and being quoted does not require ranking first, which means the work of being visible has split into two related but distinct activities.",
  ],

  sections: [
    {
      id: "ranking-and-citation-diverged",
      heading: "Ranking and being cited have come apart",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Generative engine optimization means structuring content so that AI answer engines cite it when generating a response. The engines in question are ChatGPT, Perplexity, Google's AI Overviews and AI Mode, Claude, and Gemini. The goal is to be inside the answer rather than beside it in a list.",
            "The terminology gets tangled and it is worth untangling once. SEO chases a ranking position. AEO chases the direct answer slot. GEO chases the citation inside a generated response. They overlap heavily and none of them replaces the others, and Google's 2026 guidance is explicit that optimizing for its generative features remains SEO rather than a separate discipline.",
            "There is one structural difference that changes how you should think about measurement. Language models are non-deterministic, so asking the same question five times produces five different answers. There is no position one in ChatGPT. Visibility is a matter of frequency rather than rank, meaning how often you appear across many responses to many phrasings of the same underlying question. That makes the metric fuzzier and the strategy clearer, because you are optimising for being a reasonable source to reach for rather than for beating a specific competitor to a specific slot.",
          ],
        },
      ],
    },
    {
      id: "traffic-is-small",
      heading: "The traffic is small and that is not the objection it appears to be",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Traditional organic search still sends dramatically more traffic. By one estimate, hundreds of times more than ChatGPT, Gemini, and Perplexity combined. On volume alone AI search looks like a rounding error, and this is the reason most teams have not bothered with it.",
            "The conversion numbers describe a different situation. Reported figures put ChatGPT referrals converting at around sixteen percent and Perplexity around ten percent, against typical organic conversion below two percent. Ahrefs found AI search drove 0.5 percent of visitors and 12.1 percent of signups, a ratio of roughly twenty-four to one against organic. Vercel has reported that around ten percent of new signups now arrive through ChatGPT referrals.",
            "The mechanism is not mysterious once you look at it. Somebody arriving from a blue link is still evaluating whether you are worth considering. Somebody arriving from an AI answer has already been recommended by a system they were consulting for advice. They land further down the funnel than any organic visitor, which is why a channel that looks negligible on traffic can be material on revenue.",
          ],
        },
      ],
    },
    {
      id: "what-actually-works",
      heading: "What actually works",
      blocks: [
        { kind: "prose", paragraphs: ["Six things, in approximate order of impact."] },
        { kind: "subheading", text: "Answer in the first 80 to 100 words" },
        {
          kind: "prose",
          paragraphs: [
            "This is the highest-leverage change available and it costs an afternoon. Research on GEO shows that placing a concise, explicit answer near the top of a section significantly increases citation likelihood, because the model can lift a self-contained paragraph rather than assembling one from scattered sentences.",
            "Practically this means leading every section with a direct answer of about forty words and elaborating afterwards. It is the inverse of the structure most writing instruction teaches, which builds toward a conclusion, and adopting it requires deliberately unlearning a habit.",
          ],
        },
        { kind: "subheading", text: "Tables and structured formats" },
        {
          kind: "prose",
          paragraphs: [
            "Comparison tables are the single most citable format available. Dense structure with clear rows, real headers, and bolded data points gives a model something clean to extract. Use semantic HTML tables rather than divs styled to resemble tables, because the markup is what carries the meaning.",
          ],
        },
        { kind: "subheading", text: "FAQ blocks with matching schema" },
        {
          kind: "prose",
          paragraphs: [
            "Real questions, direct answers, and FAQPage structured data that matches the visible text exactly. This is conventional SEO practice that happens to be shaped perfectly for extraction.",
          ],
        },
        { kind: "subheading", text: "Say something nobody else says" },
        {
          kind: "prose",
          paragraphs: [
            "Regurgitated content gets filtered out, which is a mechanical consequence of how these systems work rather than a value judgement. If your page says what forty other pages say, there is no reason to cite yours specifically. Original data, a genuine position, a real number from your own work, or an admission a competitor would avoid are what make a page worth quoting.",
          ],
        },
        { kind: "subheading", text: "E-E-A-T signals, which now carry more weight" },
        {
          kind: "prose",
          paragraphs: [
            "A named author with a real biography rather than a company byline. Visible publication and update dates. Inline references to sources. External mentions of your brand on sites you do not own. Generative engines lean heavily on news and media sources, which means third-party mentions carry value beyond whatever link equity they pass.",
          ],
        },
        { kind: "subheading", text: "Get into Bing's index" },
        {
          kind: "prose",
          paragraphs: [
            "ChatGPT's web search retrieves through Bing. If you have never opened Bing Webmaster Tools, submit your sitemap. It takes twenty minutes and it is a prerequisite rather than an optimisation.",
          ],
        },
      ],
    },
    {
      id: "what-does-not-work",
      heading: "What does not work",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "This is worth stating plainly, because the space has accumulated folklore and some of it is being sold.",
            "Google confirmed in its 2026 guidance that llms.txt files, special content chunking, and bespoke schema formats are not required for generative AI search. If somebody is charging you specifically for those artifacts, the value is not in the artifact.",
            "Keyword density does nothing here. Models parse meaning rather than counting terms, which makes the entire concept inapplicable.",
            "Publishing volume alone does nothing either. Twenty thin posts are less citable than three genuinely useful ones, because thin content is precisely what gets filtered. This is a meaningful departure from an era where volume was a viable strategy on its own.",
            "And there is currently no way to buy a citation. There is no equivalent of paid placement inside an AI answer, which is unusual and, for the moment, good.",
          ],
        },
      ],
    },
    {
      id: "how-to-tell-if-it-is-working",
      heading: "How to tell whether it is working",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "The metrics are different from SEO metrics and most analytics configurations are not watching for them.",
            "Citation rate is the most direct signal. Ask ChatGPT, Perplexity, Gemini, and Claude your target questions, meaning the ones a customer would actually type, and record whether you appear. Do it monthly. It is manual and there is not currently a better substitute.",
            "AI referral traffic can be filtered in GA4 by referrer for chatgpt.com, perplexity.ai, and gemini.google.com. The numbers will be small and the intent will be high, which means you should track conversion on that segment separately. Blending it into organic hides the entire point.",
            "Share of voice is the broader measure. Across a set of prompts about your category, how often does your brand come up at all, whether cited or merely mentioned. Frequency across phrasings is the real metric rather than position on any single one.",
            "Expect a lag. Reported estimates put four to eight weeks between publishing and appearing in AI answers, which makes this a slower feedback loop than traditional SEO rather than a faster one.",
          ],
        },
      ],
    },
    {
      id: "what-we-did-on-this-site",
      heading: "What we did on this site",
      blocks: [
        {
          kind: "prose",
          paragraphs: [
            "Everything above, and it is worth saying which parts were deliberate.",
            "Every service page opens with a direct definitional answer in the first paragraph. Every one carries a comparison table using real semantic markup. Every FAQ has FAQPage schema matching the visible text. Our cost estimators publish actual price ranges, which is specific, checkable information of the kind that gets quoted, and which most agencies decline to put in writing for reasons that are commercially understandable and strategically expensive.",
            "We also added an explicit summarize-with-AI control on the service pages, which deep-links to ChatGPT, Claude, Perplexity, and Gemini with the page URL. Whether it moves anything is unproven. It cost almost nothing to build.",
            "The thing worth emphasising over any individual tactic is that pages get cited when they say something specific enough to be worth quoting. We deliver quality software is a sentence no model will ever reach for. Six thousand to thirty-eight thousand dollars, two to six weeks, and here is what we would cut, is a sentence a model can use, and the difference between those two is not formatting.",
          ],
        },
      ],
    },
  ],

  faq: {
    heading: "AI search optimization: common questions",
    items: [
      {
        q: "Is GEO replacing SEO?",
        a: "No. It is an additional layer on top of strong SEO fundamentals. Google's 2026 guidance treats optimizing for generative features as still being SEO, and traditional organic search continues to send the overwhelming majority of traffic.",
      },
      {
        q: "How do I get cited by ChatGPT specifically?",
        a: "Submit your sitemap to Bing Webmaster Tools, since ChatGPT's search retrieves through Bing's index. Then add a named author with a biography, visible dates, direct answers in short extractable paragraphs, FAQPage and Article schema, and verifiable statistics with sources. Expect four to eight weeks of lag.",
      },
      {
        q: "Do I need an llms.txt file?",
        a: "No. Google confirmed in 2026 that llms.txt, special chunking, and bespoke schema are not required for generative AI search. Standard practice and genuinely useful content remain the reliable path.",
      },
      {
        q: "How long until I see results?",
        a: "Roughly four to eight weeks between publishing and appearing in AI answers, based on reported observations. That is slower than traditional indexing and worth setting expectations around before starting.",
      },
      {
        q: "Is AI search traffic worth chasing given the volume?",
        a: "On volume, no. On conversion, yes. Reported rates are multiples of typical organic and one analysis found a twenty-four to one signup ratio. The accurate framing is a small, high-intent channel growing quickly rather than a replacement for anything.",
      },
      {
        q: "What is the single highest-impact change?",
        a: "Put a direct, self-contained answer in the first 80 to 100 words of every section. It is free, it takes an afternoon across a site, and GEO research consistently identifies it as the strongest structural signal available.",
      },
    ],
  },

  finalCta: {
    heading: "Being citable starts with having something to say",
    body: [
      "Most of GEO is structure and structure is easy. The difficult part is having something specific enough to quote, which usually means real numbers, a real position, or something a competitor would prefer not to put in writing.",
      "We build the tools and content that make that possible, and we did it on our own site before recommending it.",
    ],
    primary: { label: "Book a free discovery call", href: null },
    secondary: { label: "See how we price →", href: "/tools/ai-agent-cost-calculator" },
  },

  relatedLinks: [
    { label: "Generative AI Development", href: "/services/generative-ai-development" },
    { label: "AI Integration Services", href: "/services/ai-integration" },
  ],
};

export default howToRankInAiSearch;
