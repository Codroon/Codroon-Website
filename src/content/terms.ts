/**
 * /terms copy. VERBATIM from codroon-terms-of-service-copy.md.
 *
 * This is a legal document, and a more consequential one than the
 * privacy policy: it carries the fixed-price commitment, the IP
 * transfer, the warranty period and the liability cap. Do not write,
 * rephrase, soften, or extend a single sentence here. If a line reads
 * oddly, raise it with the client rather than fixing it in code.
 *
 * ONE PUNCTUATION CHANGE from the deck, no words touched: §7 had an em
 * dash ("within an agreed feature — that is normal work"), and the
 * standing client rule is no em or en dashes anywhere user-visible. It
 * is a full stop now, which splits the sentence in two and changes
 * nothing else. Same substitution already made in the page titles.
 *
 * ⚠️ The deck is an unreviewed first draft and says so. It flags three
 * decisions; the governing-law clause below is the blocking one.
 */

export const TERMS_META = {
  title: "Terms of Service | Codroon",
  description:
    "The terms covering Codroon's website, cost estimators, and development work. Including what we commit to and what we need from you.",
};

/**
 * ⚠️ Update this whenever the terms change. §20 promises exactly that,
 * and promises material changes are flagged at the top for thirty days.
 */
export const TERMS_LAST_UPDATED = "4 August 2026";

export const TERMS_HEADER = {
  eyebrow: "LEGAL",
  h1: "Terms of Service",
  intro: [
    "These terms cover three things: using this website, using our cost estimators, and working with us on a project. Most of it is the second and third.",
    "We have written it in plain English rather than in the usual legal register. Where a specific project has its own signed agreement, that agreement takes precedence over anything here.",
  ],
};

/**
 * §2. THE COMMITMENTS TABLE — the idea of this page.
 *
 * Both directions in one table, which almost no terms document does.
 * A real <table> with th scope="col" on BOTH headers: neither column is
 * subordinate to the other, so neither gets row headers.
 */
export const TERMS_COMMITMENTS = {
  h2: "What we commit to, and what we need from you",
  intro: ["Most terms of service documents only list one side. Here are both."],
  columns: ["What we commit to", "What we need from you"] as const,
  rows: [
    {
      us: "A fixed price, quoted after discovery, that we hold",
      you: "Decisions within a reasonable time when we are blocked",
    },
    {
      us: "A written scope you keep whether you hire us or not",
      you: "Access to the systems and accounts the work requires",
    },
    {
      us: "Weekly working software you can actually use",
      you: "Feedback on what we ship, not only at the end",
    },
    {
      us: "Full transfer of code, documentation, and infrastructure at handover",
      you: "Payment on the agreed schedule",
    },
    {
      us: "Telling you when we think you should not build something",
      you: "Telling us early when something has changed",
    },
    {
      us: "No lock-in, no proprietary framework, no required retainer",
      you: "One person empowered to make decisions",
    },
  ],
};

/**
 * §3 to §18 and §20, in page order. `id` is the anchor: readable slugs
 * so support can link to /terms#who-owns-what rather than "scroll down".
 * These are public URLs once this ships — do not rename them.
 *
 * §19 GOVERNING LAW IS DELIBERATELY ABSENT. The deck has no copy for it,
 * only "[JURISDICTION — see notes]", and the note calls it the one
 * decision not to guess. The deck's steer was Texas law with arbitration
 * rather than courts, enforceable both ways under the New York
 * Convention. Send the clause and it renders with no other change.
 *
 * ⚠️ That steer assumed a US partner entity, which came out on
 * 2026-08-09 while the partnership is pending. With only the Pakistani
 * company contracting, Texas law is no longer the obvious answer —
 * worth re-checking with whoever reviews these before the clause is
 * written, rather than inheriting a choice made for a structure that
 * is not currently in place.
 */
export type TermsSection = { id: string; h2: string; body: string[] };

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "who-these-terms-are-with",
    h2: "Who these terms are with",
    body: [
      // The US partner entity came out 2026-08-09: that partnership is
      // pending and must not be stated as fact. Its removal also took
      // the two-entity scaffolding with it — "we means both entities"
      // and "which entity contracts with you" describe a structure that
      // is not currently in place, and a terms page that names a
      // counterparty arrangement that does not exist yet is worse than
      // one that stays quiet about it. Restore both lines alongside the
      // partner if and when it is signed.
      'Codroon (Pvt) Ltd is a private limited company registered in Islamabad, Pakistan. In these terms, "we" and "Codroon" mean that company.',
      "These terms apply to anyone using codroon.com and to anyone engaging us for work, unless a signed agreement says otherwise.",
    ],
  },
  {
    id: "using-this-website",
    h2: "Using this website",
    body: [
      "You may read, share, and quote anything on this site with attribution. Our blog posts, cost breakdowns, and guides exist to be used.",
      "What you may not do is scrape the site at a volume that degrades it for other people, republish our content as your own, or attempt to access parts of the site that are not public.",
      "The Codroon name, logo, and brand assets are ours. Everything else on the site is offered as information rather than as advice, and we are not liable for decisions taken on the basis of it.",
    ],
  },
  {
    id: "cost-estimators",
    h2: "The cost estimators are estimates, not quotes",
    body: [
      "This one matters, so it is stated plainly.",
      "Our estimators at /tools/ai-agent-cost-calculator and /tools/mvp-cost-calculator produce an indicative range based on six to nine answers. They are not an offer, not a quote, and not a contract. Nothing you see in an estimator binds either of us.",
      "They are built from what we have actually charged for comparable work and tuned to come in conservatively, which means a real quote usually lands inside the range. But six answers cannot see how difficult your integrations are, how firm your requirements really are, or what the discovery call will surface.",
      "A binding number comes after the discovery call, in writing, and only then.",
    ],
  },
  {
    id: "discovery-call",
    h2: "The discovery call and the scope document",
    body: [
      "We offer a free discovery call, typically forty-five minutes. You leave with a written scope, an approach, and a price, and you keep all three whether you hire us or not. That is a genuine commitment and we honour it.",
      "The scope document is yours. Take it to another developer, build it yourself, or put it in a drawer. We do not ask for anything in return and there is no obligation attached to receiving it.",
      "Two things it is not. It is not a fixed quote until you accept it in writing, because scope can change between the call and a decision. And producing one does not create an engagement, a retainer, or any obligation on either side.",
      "We reserve the right to decline a discovery call where we do not think we are the right fit, or where the request appears to be for a specification we have no prospect of being engaged to build.",
    ],
  },
  {
    id: "fixed-price",
    h2: "What fixed price means",
    body: [
      "We quote a fixed price for a defined scope, rather than an hourly rate. This means we carry the risk of our own estimates, which is the correct place for that risk to sit.",
      "The trade is that the scope has to be defined. A fixed price covers what is in the written scope. Work outside it is a change order, discussed and priced before it happens rather than appearing on an invoice afterwards.",
      // em dash replaced with a full stop, no words changed (see header)
      "We absorb ordinary iteration. Refining a screen, adjusting copy, changing how something behaves within an agreed feature. That is normal work and we do not raise a change order for it. What triggers one is new scope: a feature that was not in the document, an additional user type, an integration nobody mentioned.",
      "If we underestimate, that is our problem and we deliver anyway. That is what fixed price means.",
    ],
  },
  {
    id: "change-orders",
    h2: "Change orders",
    body: [
      "When something falls outside the agreed scope, we tell you before doing it, with a price and a timeline impact. You approve it in writing or you do not, and if you do not, we build what was originally agreed.",
      "We will not do additional work and invoice for it afterwards. If you find unapproved work on an invoice, tell us and we will remove it.",
    ],
  },
  {
    id: "payment",
    h2: "Payment",
    body: [
      "Payment terms are set out in your project agreement. Typically that means a deposit before work starts and the balance on delivery, or staged payments against milestones on longer engagements.",
      "Invoices are due within the period stated on them. If an invoice is significantly overdue we may pause work, and we will tell you before we do rather than simply stopping.",
      "Ownership of the work transfers on full payment. This is covered in the next section and it is the one commercial term worth reading carefully.",
    ],
  },
  {
    id: "who-owns-what",
    h2: "Who owns what",
    body: [
      "On full payment, everything we build for you is yours. The repository, the application code, the prompts, the evaluation suites, the infrastructure configuration, and the documentation. It transfers outright, with no licence back to us, no per-seat fee, and no ongoing dependency on us to run it.",
      "Where practical we deploy to your own accounts under your own name from the start, so that in practice you hold it throughout rather than receiving it at the end.",
      "Two exceptions, both narrow and both standard.",
      "We retain ownership of general-purpose tooling, libraries, and internal components that existed before your project or that we develop independently of it. Where any of that is used in your build, you receive a perpetual, worldwide, royalty-free licence to use it as part of the delivered work. You will never need our permission to keep running what we built.",
      "Open source components remain under their own licences, which we document at handover.",
      "Until full payment is received, ownership stays with us. We say this plainly because the rest of this section is unusually generous and the condition is what makes it workable.",
    ],
  },
  {
    id: "how-we-use-ai",
    h2: "How we use AI in our work",
    body: [
      "We use AI tools throughout our development process, including Claude Code, and we say so publicly rather than quietly. It is a substantial part of why our timelines and prices are what they are.",
      "What that means for you in practice. Every line we ship is reviewed by a person who decided it was correct, and the delivered work is ours to transfer to you on the terms above. We do not send your proprietary code, credentials, or business data to AI services on consumer tiers, and we use business tiers where inputs are not used for training.",
      "If your organisation has a policy restricting AI-assisted development, tell us before we start. We will either work within it or tell you we are not the right fit, and we would rather have that conversation at the beginning.",
    ],
  },
  {
    id: "what-we-need-from-you",
    h2: "What we need from you",
    body: [
      "Projects run late for one reason far more often than any other, and it is usually not engineering.",
      "We need decisions when we are blocked, access to the systems the work requires, feedback on what we ship each week rather than only at the end, and one person who can make a call without going away to ask three other people.",
      "Where we are blocked waiting on any of those, the timeline moves by at least the length of the delay. We will tell you when that happens rather than absorbing it silently and then explaining at the end.",
      "You are also responsible for the accuracy of what you give us, and for having the right to give it to us. If you provide content, data, or credentials that belong to somebody else, that is your responsibility rather than ours.",
    ],
  },
  {
    id: "confidentiality",
    h2: "Confidentiality",
    body: [
      "Both ways.",
      "We keep your business information, code, data, and plans confidential, and we do not use them for anything other than your project. This continues after the engagement ends.",
      "We may reference the fact that we worked with you, and describe the work in general terms, unless you ask us not to. We will not publish specifics, metrics, screenshots, or your name in a case study without asking you first.",
      "If you need something stronger, we will sign your NDA.",
    ],
  },
  {
    id: "third-party-services",
    h2: "Third-party services and their costs",
    body: [
      "Most builds depend on services we do not control. Hosting, databases, payment processing, model providers, email delivery, and similar.",
      "Those accounts are yours and the costs are yours, both during the build and after it. We will tell you what a project needs and roughly what it costs to run before you commit, and our estimators give a monthly figure where relevant.",
      "We are not responsible for those providers changing their pricing, their terms, their APIs, or their availability. Where a change breaks something we built, we will tell you what it takes to fix it. Where the fix falls outside your original scope, it is a change order.",
    ],
  },
  {
    id: "warranties",
    h2: "What we promise and what we do not",
    body: [
      "We promise that the work will match the agreed scope, that it will be built competently, and that we have the right to transfer it to you.",
      "For thirty days after handover we will fix defects in what we built, at no charge. A defect means it does not do what the scope said it would. It does not mean a change of mind about what it should do, which is a change order.",
      "We do not promise that software will be free of all bugs, that it will handle any particular scale we have not been asked to design for, that a third-party service will keep working as it does today, or that a product will succeed commercially. Nobody can promise those and anybody who does is overselling.",
      "Where a project uses AI models, we do not warrant model outputs. Models are non-deterministic. We build evaluation suites, guardrails, and human review steps to manage that, and we hand those over with the code.",
    ],
  },
  {
    id: "liability",
    h2: "Limitation of liability",
    body: [
      "Our total liability for anything arising out of an engagement is limited to the fees you have paid us for that engagement.",
      "We are not liable for indirect or consequential losses, including lost profits, lost revenue, lost data, or business interruption.",
      "Nothing here limits liability for fraud, for wilful misconduct, or for anything that cannot be limited under applicable law.",
    ],
  },
  {
    id: "ending-an-engagement",
    h2: "Ending an engagement",
    body: [
      "Either of us can end an engagement with written notice.",
      "If you end it, you pay for work completed to that point and we hand over everything built so far on the same ownership terms, meaning on payment of what is outstanding.",
      "If we end it, which is rare and usually means the working relationship is not functioning, we hand over what has been built and refund anything paid for work not yet done.",
      "Either way you leave with the code, the documentation, and enough context for somebody else to continue. We will not hold work hostage over a disagreement.",
    ],
  },
  {
    id: "equity-arrangements",
    h2: "Equity arrangements",
    body: [
      "On some projects we work as a technical co-founder, taking equity in the company in exchange for a reduced build fee. Two of our products started that way.",
      "That arrangement is never covered by these terms. It requires a separate signed agreement covering the equity itself, vesting, governance, roles, and what happens if either side wants out. Nothing on our website, in a discovery call, or in these terms creates or implies such an arrangement.",
      "We offer it selectively and we decline it more often than we accept it.",
    ],
  },
  {
    id: "changes",
    h2: "Changes to these terms",
    body: [
      "We may update these terms. The date at the top changes when we do, and material changes are noted at the top of this page for at least thirty days.",
      "Changes do not apply retrospectively to a signed project agreement. Your agreement is governed by the terms in force when you signed it.",
    ],
  },
];

/**
 * §19. Governing law. `body` is null until the client decides, and the
 * section does not render at all while it is: a "Governing law" heading
 * with nothing under it reads as broken, and inventing a jurisdiction
 * would be inventing the most consequential clause in the document.
 */
export const TERMS_GOVERNING_LAW: { id: string; h2: string; body: string[] | null } = {
  id: "governing-law",
  h2: "Governing law",
  body: null,
};

/**
 * §21. The contact block.
 *
 * The second entity and its "[Texas address]" TODO came out 2026-08-09
 * with the pending partnership. The block renders through entities.map,
 * so one entry is fine — nothing to change on the page. Add the entry
 * back if the partnership is signed.
 */
export const TERMS_CONTACT = {
  id: "contact",
  h2: "Contact",
  body: ["Questions about these terms: legal@codroon.com"],
  entities: [{ name: "Codroon (Pvt) Ltd", lines: ["Islamabad, Pakistan"] }],
};

/** The address §21 points at. */
export const TERMS_EMAIL = "legal@codroon.com";
