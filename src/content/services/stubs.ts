import { getService } from "@/config/services";
import type { ServicePageContent } from "./types";

/**
 * STUB content modules for the five remaining service pages.
 *
 * NOT REGISTERED in index.ts on purpose — until a page's copy deck is
 * approved, its route renders the lightweight stub layout (which
 * already exists and does not 404). To ship a page: write its deck,
 * fill the module, then register it in index.ts.
 *
 * DUPLICATE-CONTENT RULE: the comparison table, sub-services, process
 * and FAQ for each page must be WRITTEN FROM SCRATCH for that service
 * — never reworded from ai-agent-development. The frame repeats; the
 * middle never does.
 *
 * hero.subhead below reuses the already-approved entity copy from
 * config/services.ts as an interim value; metas are TODO.
 */

const stub = (slug: string, ctaLabel: string): ServicePageContent => {
  const service = getService(slug);
  if (!service) throw new Error(`Unknown service slug: ${slug}`);
  return {
    slug,
    // TODO: per-page copy deck — title/description/OG pair.
    meta: {
      title: `${service.name} | Codroon`,
      description: service.description,
      ogTitle: `${service.name} | Codroon`,
      ogDescription: service.description,
    },
    hero: {
      // TODO: per-page copy deck — eyebrow/H1/subhead/CTA.
      eyebrow: service.name,
      h1: service.name,
      subhead: service.description,
      cta: ctaLabel,
    },
    // TODO: whatIs — written from scratch for this service.
    // TODO: comparison — unique table, never reworded from another page.
    // TODO: subServices — unique cards.
    // TODO: process — unique steps/durations/deliverables.
    // TODO: tech — the stack actually used for this service.
    // TODO: industries — unique rows.
    // TODO: pricing — real range for this service.
    // TODO: faq — unique questions + quick answers.
    // TODO: finalCta.
  };
};

export const generativeAiDevelopmentStub = stub("generative-ai-development", "Start your project");
export const aiIntegrationStub = stub("ai-integration", "Start your project");
export const mvpDevelopmentStub = stub("mvp-development", "Start your project");
export const saasDevelopmentStub = stub("saas-development", "Start your project");
export const customSoftwareDevelopmentStub = stub("custom-software-development", "Start your project");
