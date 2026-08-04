import { Container } from "@/components/ui/Container";
import { ABOUT_OFFICES } from "@/content/about";

/**
 * §9 Where we are — the existing Dallas prose now leads into two office
 * cards rather than standing alone.
 *
 * These landmark drawings are the one place on the page an image does a
 * job words cannot: they are wayfinding, not decoration, which is why
 * they are the deliberate exception to this page's no-illustrations
 * rule. Single accent stroke, no fill, drawn inline so they inherit
 * currentColor and add no request.
 *
 * "Light card" from the brief is read as the raised surface rather than
 * a literal light background: a white card would be the only one on a
 * dark site and would need a token that does not exist.
 *
 * Centred on the client's instruction (2026-08-04) — eyebrow, heading,
 * intro and the cards. It is the only centred section on the page, which
 * is the point: it reads as an address block rather than more argument.
 *
 * ⚠️ TODO (client): both street addresses. They render the moment the
 * values land in src/content/about.ts, and they also feed the
 * LocalBusiness schema.
 */

/** Reunion Tower: shaft, observation sphere, horizon. */
function ReunionTower() {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-full w-full text-accent"
    >
      <path d="M60 8v14" />
      <circle cx="60" cy="32" r="10.5" />
      <path d="M49.5 32h21M52 24.5l16 15M52 39.5l16-15" />
      <path d="M55 42.5v33M65 42.5v33" />
      <path d="M44 75.5h32" />
      <path d="M14 82h92" />
      <path d="M22 82V64h14v18M84 82V70h14v12" />
    </svg>
  );
}

/** Faisal Mosque: the angular tent and its four minarets. */
function FaisalMosque() {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-full w-full text-accent"
    >
      <path d="M60 20 38 66h44L60 20Z" />
      <path d="M60 20v46M46 49h28" />
      <path d="M30 66V26l3-6 3 6v40M84 66V26l3-6 3 6v40" />
      <path d="M14 82h92" />
      <path d="M26 82v-8h68v8" />
    </svg>
  );
}

const LANDMARKS = { usa: ReunionTower, pakistan: FaisalMosque } as const;

export function AboutOffices() {
  return (
    <section aria-labelledby="offices-h" className="border-b border-border bg-surface py-24 sm:py-32">
      <Container width="wide">
        <div className="mx-auto max-w-[680px] text-center">
          <p className="text-eyebrow text-muted-foreground">{ABOUT_OFFICES.eyebrow}</p>
          <h2 id="offices-h" className="text-h2 mt-5 text-balance text-foreground">
            {ABOUT_OFFICES.h2}
          </h2>
          {ABOUT_OFFICES.intro.map((p, i) => (
            <p key={i} className="text-body mt-6 text-muted-foreground first:mt-8">
              {p}
            </p>
          ))}
        </div>

        <ul className="mx-auto mt-14 grid max-w-[880px] gap-6 text-center sm:grid-cols-2">
          {ABOUT_OFFICES.cards.map((c) => {
            const Landmark = LANDMARKS[c.key];
            return (
              <li
                key={c.key}
                className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background"
              >
                <div className="flex h-[168px] items-end justify-center border-b border-border bg-surface px-8 pb-0 pt-8">
                  <Landmark />
                </div>
                <div className="p-7">
                  <p className="font-sans text-lg font-semibold text-foreground">
                    {c.country}
                    {c.note && " "}
                    {c.note && (
                      <span className="ml-2 text-[0.8125rem] font-normal text-muted-foreground">
                        {c.note}
                      </span>
                    )}
                  </p>
                  {c.street && (
                    <p className="text-small mt-3 text-muted-foreground">{c.street}</p>
                  )}
                  <p className="text-small mt-1 text-muted-foreground">{c.city}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default AboutOffices;
