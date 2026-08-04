/**
 * Email design tokens. A separate, flatter set from the site's, on
 * purpose: these are LIGHT emails on a warm paper background, while the
 * site is dark. Client dark-mode inversion is unpredictable and the
 * site's near-black turns muddy, so the two do not share a palette.
 *
 * Plain string constants, never CSS variables — Outlook does not
 * support custom properties and Gmail strips them from <style>.
 */
export const email = {
  /** page behind the card, warm rather than grey */
  page: "#EDE8E2",
  card: "#FFFFFF",
  header: "#232220",
  accent: "#E96A42",
  footer: "#F7F4F0",
  rule: "#E5E0DA",

  heading: "#232220",
  body: "#403D36",
  muted: "#6B645C",
  smallPrint: "#8A857A",

  /**
   * HARD RULE, same as the site: text on the accent is #232220, never
   * white. White on #E96A42 is 2.5:1 and fails at any size.
   */
  onAccent: "#232220",

  /**
   * No web fonts anywhere. Gmail strips @font-face, so a brand face
   * would only ever render for a minority and the fallback would shift
   * the layout for everyone else. The brand comes from colour and
   * structure here, not the typeface.
   */
  font: "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
} as const;

/**
 * Emails cannot use relative paths — there is no page context to
 * resolve them against, so the asset must be absolute and publicly
 * reachable.
 *
 * The preview route passes its own origin so the logo renders locally
 * before anything is deployed; real sends use the production origin.
 */
export const assetBase = (origin?: string) => origin ?? "https://codroon.com";
