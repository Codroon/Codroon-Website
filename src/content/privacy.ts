/**
 * /privacy copy. VERBATIM from codroon-privacy-policy-copy.md.
 *
 * This is a legal document. Do not write, rephrase, soften, or extend a
 * single sentence here. If a line reads oddly, raise it with the client
 * rather than fixing it in code.
 *
 * PUBLISHED AS WRITTEN on the client's instruction (2026-08-04): the
 * analytics and session-recording tools described in §2, §6, §7 and §9
 * are being added after this page ships. The cookie banner is built and
 * gates them from the moment they land.
 *
 * ⚠️ The deck is an unreviewed first draft and says so: a solicitor read
 * is still outstanding, and input masking in Clarity and Mouseflow must
 * be configured in those dashboards when the tools go in.
 */

export const PRIVACY_META = {
  title: "Privacy Policy | Codroon",
  description:
    "What data Codroon collects, why, how long we keep it, and who else sees it. Written in plain English with a summary table.",
};

/**
 * The deck has a "[DATE]" placeholder. Set to the publish date, which is
 * what a "last updated" line means on first publication.
 *
 * ⚠️ Update this whenever the policy changes. §13 promises exactly that.
 */
export const PRIVACY_LAST_UPDATED = "4 August 2026";

export const PRIVACY_HEADER = {
  eyebrow: "LEGAL",
  h1: "Privacy Policy",
  intro: [
    "This explains what we collect when you use codroon.com, why we collect it, how long we keep it, and who else can see it. We have tried to write it in plain English rather than in the usual legal register, because a policy nobody reads protects nobody.",
    "If anything here is unclear, email privacy@codroon.com and we will answer.",
  ],
};

/**
 * §2. THE SUMMARY TABLE — the most important element on the page.
 * Seven rows, four columns, rendered as a real <table>: th scope="col"
 * on the headers, th scope="row" on the first cell of every row.
 */
export const PRIVACY_SUMMARY = {
  h2: "Everything we collect, in one table",
  columns: ["What", "Why", "How long", "Who else sees it"] as const,
  rows: [
    {
      what: "Estimator answers",
      why: "To calculate and show your estimate",
      howLong: "24 months, then deleted",
      who: "Supabase",
    },
    {
      what: "Your email, if you give it",
      why: "To send you your estimate",
      howLong: "Kept as a business record",
      who: "Supabase, Resend",
    },
    {
      what: "Contact form details",
      why: "To reply to you",
      howLong: "Kept as a business record",
      who: "Supabase, Resend",
    },
    {
      what: "Booking details",
      why: "To schedule a call",
      howLong: "Per Calendly's policy",
      who: "Calendly",
    },
    {
      what: "Analytics data",
      why: "To see which pages work",
      howLong: "Per each provider's settings",
      who: "Google, Microsoft, Mouseflow",
    },
    {
      what: "Session recordings",
      why: "To find where the site confuses people",
      howLong: "Per each provider's settings",
      who: "Microsoft, Mouseflow",
    },
    {
      what: "Server and security logs",
      why: "To keep the site up and safe",
      howLong: "Short term",
      who: "Vercel, Cloudflare",
    },
  ],
};

/**
 * §9. The processor table. Nine rows, three columns, same semantics as
 * the summary table.
 */
export const PRIVACY_PROCESSORS = {
  h2: "Who else processes your data",
  intro: [
    "We use these providers. Each has its own privacy policy governing what it does with data it handles on our behalf.",
  ],
  columns: ["Provider", "What it handles", "Where"] as const,
  rows: [
    { provider: "Vercel", handles: "Website hosting, performance analytics", where: "United States" },
    { provider: "Cloudflare", handles: "Network security and traffic filtering", where: "Global" },
    { provider: "Supabase", handles: "Estimate answers and contact submissions", where: "United States" },
    { provider: "Resend", handles: "Sending email", where: "United States" },
    { provider: "Calendly", handles: "Call bookings", where: "United States" },
    { provider: "Google Analytics", handles: "Site analytics", where: "Global" },
    { provider: "Microsoft Clarity", handles: "Session recording and heatmaps", where: "Global" },
    { provider: "Mouseflow", handles: "Session recording and heatmaps", where: "Global" },
    { provider: "Spaceship", handles: "Email hosting for our addresses", where: "Varies" },
  ],
};

/**
 * §8. Four hairline-separated rows, exactly the About page's "what we
 * won't do" treatment. Not cards, not boxes, not a bulleted list.
 */
export const PRIVACY_WONT_DO = {
  h2: "What we don't do",
  items: [
    {
      claim: "We don't sell your data",
      body: "Not to anyone, in any form, including anonymised or aggregated. There is no arrangement under which anyone pays us for information about you.",
    },
    {
      claim: "We don't run advertising or retargeting",
      body: "No Meta pixel, no Google Ads tag, no LinkedIn insight tag, no retargeting of any kind. If you visit this site you will not start seeing our adverts elsewhere.",
    },
    {
      claim: "We don't have a marketing list",
      body: "Giving us your email to receive an estimate subscribes you to nothing. There is no newsletter and no drip sequence.",
    },
    {
      claim: "We don't ask for more than we need",
      body: "The estimators work without an email address, and we say so on the page. Our forms ask for the minimum required to reply to you.",
    },
  ],
};

/**
 * The prose sections, in page order. `id` is the anchor: readable slugs
 * derived from the heading so support can send someone straight to
 * /privacy#session-recording rather than "scroll down a bit". These are
 * public URLs once this ships — do not rename them.
 *
 * §14's address block is separate below because it is an <address>,
 * not a paragraph.
 */
export type PrivacySection = { id: string; h2: string; body: string[] };

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    id: "who-we-are",
    h2: "Who we are",
    body: [
      // The US partner entity came out 2026-08-09 (partnership pending).
      // The transfer paragraph had to be rewritten rather than just
      // trimmed: it opened "This means", leaning on the sentence that
      // was removed, and it claimed data is handled by people in the
      // United States. With no US entity that claim is not true, and
      // overstating who touches personal data is exactly the kind of
      // error a privacy policy must not make.
      //
      // What stays true is the storage half: Vercel, Supabase, Resend
      // and Calendly are all listed as United States in the processor
      // table above, so the cross-border transfer and the consent
      // language it carries are still required.
      "Codroon (Pvt) Ltd is a private limited company registered in Islamabad, Pakistan.",
      "Your data is handled by people in Pakistan, and stored on servers in the United States and elsewhere depending on the provider. Wherever you are contacting us from, you are consenting to that transfer by using the site.",
      "For any question about your data, email privacy@codroon.com.",
    ],
  },
  {
    id: "cost-estimators",
    h2: "The cost estimators",
    body: [
      "Our estimators at /tools/ai-agent-cost-calculator and /tools/mvp-cost-calculator save your answers as you go, so you can come back to an estimate or share it with someone else.",
      "We save those answers anonymously. There is nothing personal attached unless you choose to give us an email address at the end. An estimate is identified only by a short code in its URL, which means anyone holding that link can see the estimate.",
      "We keep anonymous estimates for 24 months and then delete them automatically. If you gave us an email address, the estimate and the contact details are kept as a business record, because that is a conversation we may need to refer back to.",
      "Answers are stored in Supabase, a hosted database provider, on servers in the United States.",
    ],
  },
  {
    id: "when-you-contact-us",
    h2: "When you contact us",
    body: [
      "Our contact forms ask for some combination of your name, email address, phone number, and a description of what you are building. We use those to reply to you and, if it goes further, to scope the work.",
      "If you book a call, that happens through Calendly, which handles the booking data under its own privacy policy. We see the name, email address, and any notes you enter.",
      "We do not add you to a mailing list. We do not have a mailing list. If you give us your email to receive an estimate, you receive that estimate and nothing else.",
      "Email is sent through Resend, which processes the address in order to deliver the message.",
    ],
  },
  {
    id: "session-recording",
    h2: "Analytics and session recording",
    body: [
      "We use four things to understand how the site is used.",
      "Google Analytics tells us which pages people visit and roughly where they come from. Vercel Analytics measures page performance. Both are aggregate and neither identifies you personally.",
      "Microsoft Clarity and Mouseflow are different, and worth explaining properly because most policies bury them. Both record sessions, meaning they capture a replay of mouse movement, scrolling, and clicks on the pages you visit. We use them to find where the site confuses people, which is a genuine problem to solve and also a genuine intrusion to disclose.",
      "We configure both tools to mask text you type into forms, so your name, email address, phone number, and message are not captured in a recording. We do not review recordings looking for individuals, and we do not connect them to any contact details you give us.",
      "Recordings and analytics data are held by those providers under their own policies. You can opt out of all four using the cookie controls on this site, or by using a browser extension that blocks them.",
    ],
  },
  {
    id: "cookies",
    h2: "Cookies",
    body: [
      "We use two kinds.",
      "Essential cookies keep the site working, remember your cookie preference, and help Cloudflare tell real visitors from automated traffic. These cannot be turned off without breaking the site.",
      "Analytics cookies are set by Google Analytics, Microsoft Clarity, and Mouseflow. These are optional, they are off until you accept them, and you can change your mind at any time using the cookie settings link in the footer.",
      "We do not use advertising cookies, retargeting pixels, or any cookie that follows you to other websites.",
    ],
  },
  {
    id: "your-rights",
    h2: "Your rights",
    body: [
      "Whatever jurisdiction you are in, you can ask us to do any of the following and we will do it.",
      "Tell you what data we hold about you. Correct anything that is wrong. Delete what we hold, unless we are required to keep it. Send you a copy of it in a usable format. Stop using it for anything you have not agreed to.",
      "Email privacy@codroon.com and we will respond within 30 days. We will not ask you to justify the request.",
      "For analytics and session recording specifically, you can opt out immediately using the cookie settings link in the footer, without emailing anyone.",
    ],
  },
  {
    id: "how-we-protect-it",
    h2: "How we protect it",
    body: [
      "The site runs over HTTPS. Our database uses row-level security, meaning the database itself enforces who can read what rather than trusting application code to get it right. Contact submissions cannot be read from the browser at all. Credentials are held in a managed secrets store rather than in code.",
      "No system is perfectly secure and anyone claiming otherwise is overselling. If we became aware of a breach affecting your data, we would tell you.",
    ],
  },
  {
    id: "children",
    h2: "Children",
    body: [
      "This site is aimed at businesses and is not intended for anyone under 16. We do not knowingly collect data from children. If you believe a child has given us information, email privacy@codroon.com and we will delete it.",
    ],
  },
  {
    id: "changes",
    h2: "Changes to this policy",
    body: [
      "If we change what we collect or how we use it, we will update this page and change the date at the top. Material changes will be noted at the top of the page for at least 30 days.",
    ],
  },
];

/**
 * §14. The address block.
 *
 * The second entity and its "[Texas address]" TODO came out 2026-08-09
 * with the pending partnership. The block renders through entities.map,
 * so one entry is fine — nothing to change on the page. Add the entry
 * back if the partnership is signed.
 */
export const PRIVACY_CONTACT = {
  id: "contact",
  h2: "Contact",
  body: ["For anything in this policy, email privacy@codroon.com."],
  entities: [{ name: "Codroon (Pvt) Ltd", lines: ["Islamabad, Pakistan"] }],
};

/** The email referenced five times in the policy. */
export const PRIVACY_EMAIL = "privacy@codroon.com";
