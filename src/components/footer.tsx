"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Linkedin, Github, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui/Wordmark";
import { CookieSettingsLink } from "@/components/cookies/CookieSettingsLink";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useRevealArmed } from "@/hooks/useRevealArmed";
import { FOOTER_COLUMNS, CONTACT, SOCIALS, TAGLINE } from "@/config/footer";

const ICONS = { linkedin: Linkedin, x: Twitter, github: Github } as const;

/**
 * THE FOOTER GRID, in three bands. Six blocks have to be placed: the
 * brand, four nav columns and Contact.
 *
 *   base   2 cols   brand | Services full width, then the four short
 *                   blocks in two flush pairs
 *   lg     4 cols   brand | Services full width, then all four short
 *                   blocks in one row
 *   xl    12 cols   everything in a single row
 *
 * Two rules produced that, and breaking either one is what went wrong
 * before:
 *
 * 1. A 6-link column may not sit beside a 2-link column when there is
 *    another row underneath it. Services is 285px and Products is
 *    102px, so pairing them opens a 180px hole with content below it,
 *    which reads as broken. Below xl, Services gets its own full-width
 *    row and its list goes multi-column; the four short blocks are all
 *    102px and pair up flush. In the xl band every block is in the one
 *    row, so the ragged bottom is just the end of the footer.
 *
 * 2. Every row has to fill. Six blocks in a 12-col row worked; six in a
 *    2-col row leaves Contact orphaned with an empty cell beside it,
 *    which is what shipped (client, 2026-08-11).
 *
 * The row of six does NOT fit at 1024: the six longest labels need
 * ~809px on one line and the lg container offers 768px, which is why
 * "AI Agent Calculator" wrapped there. Hence xl, not lg, for that band.
 *
 * Spans are whole class strings, never composed. Tailwind's scanner
 * only sees literals, and cn() is a plain joiner, not tailwind-merge,
 * so cn("lg:col-span-2", cond && "lg:col-span-1") ships BOTH and the
 * stylesheet's own order picks the winner (client, 2026-08-09).
 * Keyed by title, not index, so reordering config/footer.ts is safe.
 */
const COLUMN_SPAN: Record<string, string> = {
  // full-width below xl — see rule 1
  Services: "col-span-2 lg:col-span-4 xl:col-span-3",
  Products: "xl:col-span-2",
  Tools: "xl:col-span-2",
  // only "About" and "Blog", so it takes the leftover single span
  Company: "xl:col-span-1",
};

/**
 * Services holds 6 links and is full width below xl, so its list runs
 * in columns there rather than as one long sparse stack. Widths are
 * chosen so no service label wraps: 1 col at 342px, 2 at 336px+, 3 at
 * 288px. At xl it is a narrow column again and goes back to a stack.
 */
const LIST_CLASS: Record<string, string> = {
  Services:
    "grid gap-3 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3 xl:grid-cols-1",
};
const LIST_DEFAULT = "flex flex-col gap-3";

function FootLink({ name, href }: { name: string; href: string }) {
  return (
    <Link
      href={href}
      className="group inline-block text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="relative">
        {name}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

const Footer = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], [40, -10]);

  const socials = SOCIALS.filter((s) => s.href !== "#");
  const armed = useRevealArmed();

  /* Until the client is up this is a plain div, so the footer's links
     are visible in the HTML rather than carrying framer's serialised
     opacity:0. This footer is the site's only crawlable navigation and
     12 of its 14 links were invisible without JavaScript. The child
     motion.divs below inherit their variant from this element, so with
     a plain parent they simply render in place. */
  const Shell = armed ? motion.div : "div";
  const shellProps = armed
    ? {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-10%" },
        variants: staggerContainer,
      }
    : {};

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-border bg-surface">
      <Shell
        {...shellProps}
        className="mx-auto max-w-[1240px] px-6 pt-16 sm:px-8 lg:px-12"
      >
        {/* Track counts must swallow every block exactly: 2 + 2 pairs
            at base, 4 short blocks in one row at lg, and 2+3+2+2+1+2 =
            12 at xl. A total that overshoots drops the last block onto
            a row of its own — that is how Contact ended up alone with
            half the footer empty, twice. See COLUMN_SPAN above. */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4 xl:grid-cols-12 xl:gap-8">
          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-2 lg:col-span-4 xl:col-span-2">
            <Link href="/" aria-label="Codroon — home" className="inline-block">
              <Wordmark />
            </Link>
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-muted-foreground">
              {TAGLINE}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map((s) => {
                  const Icon = ICONS[s.icon];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                    >
                      <Icon size={18} aria-hidden />
                    </a>
                  );
                })}
              </div>
            )}
            {/* TODO: newsletter signup lives here (brand column, per the
                footer layout) once an email provider is wired up — no
                dead form until then. */}
          </motion.div>

          {/* Nav columns, in the order config/footer.ts declares them:
              Services / Products / Tools / Company. */}
          {FOOTER_COLUMNS.map((col) => (
            <motion.nav
              key={col.title}
              variants={fadeUp}
              aria-label={col.title}
              className={COLUMN_SPAN[col.title] ?? "xl:col-span-2"}
            >
              <h2 className="text-eyebrow mb-4 text-muted-foreground">{col.title}</h2>
              <ul className={LIST_CLASS[col.title] ?? LIST_DEFAULT}>
                {col.links.map((l) => (
                  <li key={l.name}>
                    <FootLink {...l} />
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          {/* Contact — closes the last row at every width, so it can
              never be the block that gets orphaned. */}
          <motion.div variants={fadeUp} className="xl:col-span-2">
            <h2 className="text-eyebrow mb-4 text-muted-foreground">Contact</h2>
            <ul className="flex flex-col gap-3 text-[0.95rem] text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-accent-dim" aria-hidden />
                <a href={`mailto:${CONTACT.email}`} className="transition-colors hover:text-foreground">
                  {CONTACT.email}
                </a>
              </li>
              {/* TODO: real US phone number — rendered only when set. */}
              {CONTACT.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="shrink-0 text-accent-dim" aria-hidden />
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {CONTACT.phone}
                  </a>
                </li>
              )}
              {/* TODO: full Dallas street address once confirmed. */}
              <li className="flex items-center gap-2.5">
                <MapPin size={16} className="shrink-0 text-accent-dim" aria-hidden />
                <span>{CONTACT.location}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border py-7 sm:flex-row">
          <p className="text-small text-muted-foreground">
            © {new Date().getFullYear()} Codroon. All rights reserved.
          </p>
          {/* "Cookie settings" is referenced twice in the privacy policy
              (§7 and §10) as the way to opt out, so it lives here beside
              the legal links and reopens the consent banner. */}
          <div className="flex flex-wrap justify-center gap-6">
            <FootLink name="Privacy Policy" href="/privacy" />
            <FootLink name="Terms of Service" href="/terms" />
            <CookieSettingsLink />
          </div>
        </div>
      </Shell>

      {/* Large faded wordmark. The REAL mark, not the word set in the
          sans face with letterspacing (client, 2026-08-04) — that was a
          different set of letterforms from the logo directly above it.
          Decorative: the footer's own Wordmark link already names the
          brand, so this must not announce it twice. */}
      <motion.div
        aria-hidden
        style={{ y: wordmarkY }}
        className="pointer-events-none hidden select-none px-6 sm:block"
      >
        <Wordmark decorative className="h-auto w-full text-foreground/[0.03]" />
      </motion.div>
    </footer>
  );
};

export default Footer;
