/**
 * Blog authors.
 *
 * Name only, by client decision (2026-08-03): posts read "By Mujtaba
 * Abbas" and nothing else. No photo, role, biography, or LinkedIn.
 *
 * Worth knowing rather than acting on: /blog/how-to-rank-in-ai-search
 * argues in its own body that the E-E-A-T signal is "a named author
 * with a real biography rather than a company byline". A bare name is
 * the named-author half of that and not the biography half. If a bio
 * is ever wanted, add the field here and the byline picks it up.
 *
 * What matters is already true: nothing publishes under "By Codroon".
 */

export type Author = {
  key: string;
  name: string;
};

export const AUTHORS: Record<string, Author> = {
  "codroon-lead": {
    key: "codroon-lead",
    name: "Mujtaba Abbas",
  },
};

export const getAuthor = (key: string): Author | undefined => AUTHORS[key];
