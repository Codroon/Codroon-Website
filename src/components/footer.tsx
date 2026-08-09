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
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-3 lg:col-span-3">
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

          {/* Nav columns: Products / Services / Company */}
          {FOOTER_COLUMNS.map((col, i) => (
            <motion.nav
              key={col.title}
              variants={fadeUp}
              aria-label={col.title}
              className={cn("lg:col-span-2", i === 1 && "lg:col-span-3")}
            >
              <h2 className="text-eyebrow mb-4 text-muted-foreground">{col.title}</h2>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <FootLink {...l} />
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          {/* Contact */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
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
