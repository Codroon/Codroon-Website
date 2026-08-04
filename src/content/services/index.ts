import type { ServicePageContent } from "./types";
import { aiAgentDevelopment } from "./ai-agent-development";
import { generativeAiDevelopment } from "./generative-ai-development";
import { aiIntegration } from "./ai-integration";
import { mvpDevelopment } from "./mvp-development";
import { saasDevelopment } from "./saas-development";
import { customSoftwareDevelopment } from "./custom-software-development";

/**
 * Registry of full service-page content modules. Slugs NOT in this
 * registry render the lightweight stub layout instead (they must not
 * 404 — routes come from config/services.ts).
 *
 * TODO: content modules for the other five services — each needs its
 * own copy deck (comparison table, sub-services, process and FAQ are
 * written from scratch per page, never reworded from this one).
 */
const REGISTRY: Record<string, ServicePageContent> = {
  [aiAgentDevelopment.slug]: aiAgentDevelopment,
  [generativeAiDevelopment.slug]: generativeAiDevelopment,
  [aiIntegration.slug]: aiIntegration,
  [mvpDevelopment.slug]: mvpDevelopment,
  [saasDevelopment.slug]: saasDevelopment,
  [customSoftwareDevelopment.slug]: customSoftwareDevelopment,
};

export const getServiceContent = (slug: string): ServicePageContent | null =>
  REGISTRY[slug] ?? null;
