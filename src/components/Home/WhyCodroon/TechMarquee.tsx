"use client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { TECH } from "./data";

/**
 * TechMarquee — "tools we build with". Seamless infinite scroll via a
 * duplicated track translated -50% (CSS transform); paused on hover.
 * Reduced motion → a static wrapped grid. These are tools used, not
 * endorsements. Text wordmarks keep it accessible and dependency-free.
 */
export function TechMarquee() {
  const reduced = usePrefersReducedMotion();

  const Item = ({ name, hidden }: { name: string; hidden?: boolean }) => (
    <span
      aria-hidden={hidden}
      className="shrink-0 font-sans text-lg font-medium text-muted-foreground/70 transition-colors duration-300 hover:text-foreground"
    >
      {name}
    </span>
  );

  if (reduced) {
    return (
      <ul
        aria-label="Tools we build with"
        className="flex flex-wrap items-center gap-x-8 gap-y-3"
      >
        {TECH.map((t) => (
          <li key={t} className="font-sans text-lg font-medium text-muted-foreground/70">
            {t}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className="marquee-fade group relative overflow-hidden"
      aria-label="Tools we build with"
    >
      <div className="marquee-track flex gap-x-10 group-hover:[animation-play-state:paused]">
        {TECH.map((t) => (
          <Item key={`a-${t}`} name={t} />
        ))}
        {/* duplicate for seamless loop (hidden from a11y) */}
        {TECH.map((t) => (
          <Item key={`b-${t}`} name={t} hidden />
        ))}
      </div>
    </div>
  );
}

export default TechMarquee;