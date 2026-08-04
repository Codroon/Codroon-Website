import type { ComponentType } from "react";
import { AgentFlowVisual } from "./AgentFlowVisual";
import { RetrievalFlowVisual } from "./RetrievalFlowVisual";
import { IntegrationHubVisual } from "./IntegrationHubVisual";
import { MvpTimelineVisual } from "./MvpTimelineVisual";
import { SaasLayersVisual } from "./SaasLayersVisual";
import { ModularBlocksVisual } from "./ModularBlocksVisual";

/**
 * Per-page hero diagrams — same component contract everywhere
 * (server-rendered, CSS-only animation, aria-hidden, reduced-motion
 * static). The shell stays identical; only the diagram changes.
 *
 * TODO (as their pages ship): ai-integration → hub-and-spoke;
 * mvp-development → build timeline; saas-development → layered
 * multi-tenant; custom-software-development → modular blocks.
 */
export const HERO_VISUALS: Record<string, ComponentType> = {
  "ai-agent-development": AgentFlowVisual,
  "generative-ai-development": RetrievalFlowVisual,
  "ai-integration": IntegrationHubVisual,
  "mvp-development": MvpTimelineVisual,
  "saas-development": SaasLayersVisual,
  "custom-software-development": ModularBlocksVisual,
};

export const getHeroVisual = (slug: string): ComponentType =>
  HERO_VISUALS[slug] ?? AgentFlowVisual;
