import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CtaButton } from "@/components/contact/CtaButton";
import { SERVICES, getService, serviceHref } from "@/config/services";
import { getServiceContent } from "@/content/services";
import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdString,
  pageOpenGraph,
  serviceJsonLd,
} from "@/lib/seo";

/**
 * Service page STUB — canonical name + entity-first intro + sideways
 * links to the other five services + CTA. Service + BreadcrumbList
 * JSON-LD included.
 *
 * TODO (per service, before launch):
 *  - "How we work" section (process lives here, not on a standalone page)
 *  - "Technologies" section (stack we use for this service)
 *  - "Integrations" section (systems we connect for this service)
 *  - real case studies / product proof once available
 */

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  // Full content module → meta comes verbatim from the page's copy deck
  // (title/description and OG title/description differ by design).
  const content = getServiceContent(slug);
  if (content) {
    const og = pageOpenGraph(
      serviceHref(slug),
      content.meta.ogTitle,
      content.meta.ogDescription
    );
    return {
      title: content.meta.title,
      description: content.meta.description,
      alternates: { canonical: absoluteUrl(serviceHref(slug)) },
      openGraph: og,
      twitter: {
        card: "summary_large_image",
        title: content.meta.ogTitle,
        description: content.meta.ogDescription,
        images: ["/og.png"],
      },
    };
  }

  const description = `${service.description.split(". ")[0]}. Based in Dallas, TX — shipping in weeks. Book a free discovery call.`;
  return {
    title: `${service.name} | Codroon`,
    description,
    alternates: { canonical: absoluteUrl(serviceHref(service.slug)) },
    openGraph: pageOpenGraph(
      serviceHref(service.slug),
      `${service.name} | Codroon`,
      service.description
    ),
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  // Full content module → rich template; otherwise the stub below.
  const content = getServiceContent(slug);
  if (content) {
    return <ServicePageTemplate service={service} content={content} />;
  }

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(serviceJsonLd(service)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/#services" },
              { name: service.name, path: serviceHref(service.slug) },
            ])
          ),
        }}
      />

      <Section as="article" className="pt-36 sm:pt-40" spacing="compact">
        {/* Visible breadcrumb removed on 2026-08-04 (client) — same call
            as ServicePageTemplate. The BreadcrumbList JSON-LD stays. */}
        <h1 className="text-h1 max-w-3xl text-foreground">{service.name}</h1>
        <p className="text-body-lg mt-6 max-w-2xl text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-10">
          <CtaButton size="lg">
            Discuss your project
            <ArrowRight className="size-[1.1em]" aria-hidden />
          </CtaButton>
        </div>

        {/*
          TODO: full service page content —
          "How we work", "Technologies", "Integrations" sections plus
          real proof (products, case studies). No placeholder copy.
        */}
      </Section>

      <Section spacing="compact">
        <h2 className="text-h2 text-foreground">Other services</h2>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((s) => (
            <li key={s.slug}>
              <Link
                href={serviceHref(s.slug)}
                className="group flex h-full items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-5 transition-colors hover:border-border-strong"
              >
                <span className="font-sans font-medium text-foreground">{s.name}</span>
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="shrink-0 text-accent-dim transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
