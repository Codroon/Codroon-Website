/**
 * Analytics providers, and the switch that decides whether the cookie
 * banner appears on a first visit.
 *
 * Installed 2026-08-11 (client). These ids are PUBLIC — they ship in the
 * page source by design, which is why they are literals here and not
 * environment variables. They are not secrets and nothing is gained by
 * hiding them.
 *
 * Setting any of them to a value turns HAS_ANALYTICS true, which is what
 * makes the cookie banner start asking on a first visit. No script may
 * load until `analytics` is true in ConsentContext: the policy says in
 * §7 that these are "off until you accept them", so pasting the vendors'
 * own <head> snippets would have made that sentence false on day one.
 *
 * ⚠️ INPUT MASKING. §6 states that text typed into forms is masked. Both
 * tools do that by default — Clarity masks input contents in every mode
 * including Relaxed and it cannot be turned off, and Mouseflow excludes
 * keystrokes automatically — so the promise holds as installed. What is
 * NOT covered by default is user data rendered as ordinary page text.
 * Nothing in the contact flow does that today (the success notes are
 * static strings), but verify after any change by recording yourself
 * through the contact modal and the estimator.
 */
export const ANALYTICS = {
  /** Google Analytics measurement id, e.g. "G-XXXXXXXXXX" */
  ga: "G-0DJG1L78EQ" as string | null,
  /** Microsoft Clarity project id */
  clarity: "y0h609nnaf" as string | null,
  /** Mouseflow website id */
  mouseflow: "0dafe929-43c8-4126-9213-1681ca7f48a5" as string | null,
};

/** True once any provider is configured. */
export const HAS_ANALYTICS = Object.values(ANALYTICS).some(Boolean);
