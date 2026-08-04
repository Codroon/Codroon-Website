/**
 * Analytics providers, and the switch that decides whether the cookie
 * banner appears on a first visit.
 *
 * Nothing is installed yet (client, 2026-08-04: the tools go in after
 * the privacy page ships). Fill these in and the consent layer is
 * already wired: the banner starts asking, and no script may load until
 * `analytics` is true in ConsentContext.
 *
 * ⚠️ When Clarity and Mouseflow land, configure INPUT MASKING in both
 * dashboards before the first recording. §6 of the policy states that
 * text typed into forms is masked, and neither tool does that fully by
 * default. Verify by recording yourself filling in the contact modal and
 * confirming the replay shows masked characters.
 */
export const ANALYTICS = {
  /** Google Analytics measurement id, e.g. "G-XXXXXXXXXX" */
  ga: null as string | null,
  /** Microsoft Clarity project id */
  clarity: null as string | null,
  /** Mouseflow website id */
  mouseflow: null as string | null,
};

/** True once any provider is configured. */
export const HAS_ANALYTICS = Object.values(ANALYTICS).some(Boolean);
