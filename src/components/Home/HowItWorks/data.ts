/** Content + node-graph geometry for the "How It Works" section. */

export type Step = {
  n: string;
  title: string;
  body: string;
  /** which graph phase / glyph this step corresponds to */
  phase: 1 | 2 | 3;
};

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Free discovery call",
    body: "Start with a free call. Walk us through your business and the workflow you want to fix. No prep, no commitment. We find where AI actually moves the needle.",
    phase: 1,
  },
  {
    n: "02",
    title: "We map your workflow",
    body: "We turn what you told us into a concrete plan: the product, the automations, the integrations, the right tools. You see exactly what we'll build, before a line of code.",
    phase: 2,
  },
  {
    n: "03",
    title: "Shipped in weeks",
    body: "Then we build. Because we're AI-native and we know the tools, your MVP, automation, or agent goes from plan to production in weeks, not months.",
    phase: 3,
  },
];

/* ---- Node graph geometry (SVG viewBox 0 0 600 560) ----
   Each node has a scattered "chaos" position and a structured
   "ordered" position; we interpolate between them by scroll progress.
   Coordinates are translations applied to a <g> (transform only). */

export type GraphNode = {
  chaos: { x: number; y: number };
  ordered: { x: number; y: number };
  r?: number;
  hub?: boolean;
  label?: string;
};

export const NODES: GraphNode[] = [
  { chaos: { x: 70, y: 90 }, ordered: { x: 110, y: 120 }, label: "spreadsheets" },
  { chaos: { x: 150, y: 470 }, ordered: { x: 110, y: 280 }, label: "manual handoffs" },
  { chaos: { x: 60, y: 360 }, ordered: { x: 110, y: 440 }, label: "disconnected tools" },
  { chaos: { x: 330, y: 70 }, ordered: { x: 290, y: 180 } },
  { chaos: { x: 470, y: 200 }, ordered: { x: 290, y: 300 } },
  { chaos: { x: 250, y: 520 }, ordered: { x: 290, y: 420 } },
  { chaos: { x: 500, y: 440 }, ordered: { x: 450, y: 220 } },
  { chaos: { x: 390, y: 300 }, ordered: { x: 450, y: 360 } },
  { chaos: { x: 200, y: 200 }, ordered: { x: 520, y: 290 }, r: 11, hub: true },
  { chaos: { x: 440, y: 90 }, ordered: { x: 380, y: 110 } },
];

export const EDGES: Array<[number, number]> = [
  [0, 3],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [9, 3],
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 7],
  [6, 8],
  [7, 8],
];
