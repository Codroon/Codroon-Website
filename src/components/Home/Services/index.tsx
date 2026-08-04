import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Code2,
  Layers,
  Plug,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { CtaButton } from "@/components/contact/CtaButton";
import { SERVICES, serviceHref, type Service } from "@/config/services";

/**
 * Services — split layout: the big heading (+ CTA) sits in a sticky
 * left column and stays put while the six service cards scroll up
 * through the right column, each revealing as it enters the viewport.
 * Card anatomy: icon top-right, bold canonical service name,
 * entity-first description, "VIEW DETAILS →" bottom-left.
 * Names/slugs come from config/services.ts.
 */

const ICONS: Record<Service["icon"], LucideIcon> = {
  bot: Bot,
  sparkles: Sparkles,
  plug: Plug,
  rocket: Rocket,
  layers: Layers,
  code: Code2,
};

function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon];
  return (
    <Link
      href={serviceHref(service.slug)}
      className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-colors duration-300 hover:border-border-strong sm:p-8"
    >
      {/* name left, icon top-right */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-sans text-xl font-semibold leading-snug text-foreground">
          {service.name}
        </h3>
        <span
          aria-hidden
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface-raised text-accent-dim"
        >
          <Icon size={20} />
        </span>
      </div>

      <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
        {service.description}
      </p>

      {/* bottom-left action */}
      <span className="text-eyebrow mt-auto inline-flex items-center gap-2 pt-6 text-accent transition-colors group-hover:text-accent-hover">
        View details
        <ArrowRight
          size={13}
          aria-hidden
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

export function Services() {
  return (
    <Section id="services" containerWidth="wide">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        {/* Sticky heading — stays put while the cards scroll past */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Eyebrow>Services</Eyebrow>
            <h2 className="text-h2 mt-5 text-foreground">What we build.</h2>
            <p className="mt-5 max-w-sm text-body text-muted-foreground">
              Six ways we take founders from workflow to shipped product,
              each one planned on a free discovery call.
            </p>
            <div className="mt-8">
              <CtaButton size="lg">
                Discuss your project
                <ArrowRight className="size-[1.1em]" aria-hidden />
              </CtaButton>
            </div>
          </div>
        </div>

        {/* Cards — single column, revealing one by one */}
        <ul className="flex flex-col gap-5 lg:col-span-8">
          {SERVICES.map((s) => (
            <li key={s.slug} className="h-full">
              <Reveal className="h-full">
                <ServiceCard service={s} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export default Services;
