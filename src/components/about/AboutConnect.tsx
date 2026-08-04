"use client";

import { Calendar, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useContactModal } from "@/components/contact/ContactModalContext";
import { ABOUT_CONNECT } from "@/content/about";

const ICONS = { call: Phone, email: Mail, meeting: Calendar } as const;

/**
 * §8 How to connect — two column. Left is a visual panel, right is the
 * heading and three option rows that open the SAME three flows as the
 * shared contact modal. No parallel contact implementation exists here.
 *
 * LEFT PANEL — TODO: a client testimonial video goes here. It is built
 * at the target aspect ratio and takes a `video` slot, so dropping one
 * in later needs no redesign. Until then it shows the hexagon mark at
 * low opacity and nothing else.
 *
 * Deliberately NOT filled with a fabricated testimonial, name, quote,
 * or stock footage. `panelStatement` is null because no copy was
 * supplied; it renders the moment a real line exists.
 */
export function AboutConnect({ video }: { video?: React.ReactNode }) {
  const { open } = useContactModal();

  return (
    // Full-bleed orange (client, 2026-08-03). Every piece of text
    // directly on it is #232220: light on orange fails contrast.
    // The panel and option rows stay dark cards so they read as raised
    // against it, exactly like the model card in §3.
    <section aria-labelledby="connect-h" className="bg-accent py-24 sm:py-32">
      <Container width="wide">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2 lg:items-center">
          {/* ---- left: the swappable media slot ---- */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background">
            {video ?? (
              <>
                <img
                  src="/images/codroon-mark.svg"
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.07]"
                />
                {ABOUT_CONNECT.panelStatement && (
                  <p className="absolute inset-x-0 bottom-0 p-8 font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-foreground">
                    {ABOUT_CONNECT.panelStatement}
                  </p>
                )}
              </>
            )}
          </div>

          {/* ---- right: heading + the three flows ---- */}
          <div>
            <h2 id="connect-h" className="text-h2 text-accent-foreground">
              {ABOUT_CONNECT.h2}
            </h2>
            {ABOUT_CONNECT.subhead && (
              <p className="text-body mt-5 max-w-[46ch] text-accent-foreground">
                {ABOUT_CONNECT.subhead}
              </p>
            )}

            <ul className="mt-10 flex flex-col gap-3">
              {ABOUT_CONNECT.options.map((o) => {
                const Icon = ICONS[o.view];
                return (
                  <li key={o.view}>
                    <button
                      type="button"
                      onClick={() => open(o.view)}
                      className="group flex w-full items-center gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4 text-left transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-accent">
                        <Icon size={20} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-sans font-semibold text-foreground">
                          {o.label}
                        </span>
                        <span className="text-small block text-muted-foreground">
                          {o.descriptor}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AboutConnect;
