import { useId } from "react";
import { cn } from "@/lib/utils";
import type { Answers } from "@/pricing/types";

/**
 * ArchitectureDiagram — assembles as answers come in.
 *
 *   type answered    → central agent node (the ONLY accent element)
 *   access answered  → connector arrows (data in, actions out)
 *   systems answered → one node per connected system, above
 *   docs answered    → dashed document store below (only if there are docs)
 *
 * Everything except the agent node is hairline neutral. Before the type
 * is known a faint neutral ghost marks where the diagram will assemble.
 * All groups stay mounted (opacity transition), so the global
 * reduced-motion rule makes each appearance instant.
 */

/** Nodes drawn for each `systems` answer. Four-plus still draws three
    — the diagram illustrates the shape, the estimate carries the count. */
const SYSTEM_NODES: Record<string, number> = {
  one: 1,
  "two-or-three": 3,
  "four-plus": 3,
  many: 3,
};

const NODE_W = 116;
const LAYOUTS: Record<number, number[]> = {
  1: [162],
  2: [76, 248],
  3: [20, 162, 304],
};

export type DiagramState = {
  showAgent: boolean;
  showFlows: boolean;
  systemCount: number;
  showDocs: boolean;
};

/** Read the diagram's state straight off the answers. */
export function diagramState(answers: Answers): DiagramState {
  const systems = typeof answers.systems === "string" ? answers.systems : undefined;
  const docs = typeof answers.docs === "string" ? answers.docs : undefined;
  return {
    showAgent: answers.type !== undefined,
    showFlows: answers.access !== undefined,
    systemCount: systems ? SYSTEM_NODES[systems] ?? 3 : 0,
    showDocs: docs !== undefined && docs !== "none",
  };
}

function describe(s: DiagramState): string {
  if (!s.showAgent) {
    return "Architecture diagram placeholder. It assembles as you answer.";
  }
  const parts = ["A central agent node."];
  if (s.showFlows) {
    parts.push("Arrows show data flowing into the agent and actions flowing out.");
  }
  if (s.systemCount > 0) {
    parts.push(
      `${s.systemCount} of your system${s.systemCount > 1 ? "s" : ""} connect${
        s.systemCount > 1 ? "" : "s"
      } to the agent from above.`
    );
  }
  if (s.showDocs) parts.push("A document store connects to the agent from below.");
  return `Architecture diagram of your agent system. ${parts.join(" ")}`;
}

function SystemNode({ x, index }: { x: number; index: number }) {
  return (
    <g>
      <rect
        x={x}
        y={24}
        width={NODE_W}
        height={44}
        rx={8}
        className="fill-surface stroke-border-strong"
        strokeWidth={1}
      />
      <text
        x={x + NODE_W / 2}
        y={50}
        textAnchor="middle"
        className="text-mono fill-muted-foreground"
        fontSize={10}
        letterSpacing="0.1em"
      >
        {`SYSTEM 0${index + 1}`}
      </text>
    </g>
  );
}

export function ArchitectureDiagram({
  state,
  className,
}: {
  state: DiagramState;
  className?: string;
}) {
  const markerId = useId();
  const show = (on: boolean) =>
    cn("transition-opacity duration-500 ease-out", on ? "opacity-100" : "opacity-0");

  const xs = LAYOUTS[state.systemCount] ?? [];

  return (
    <svg
      viewBox="0 0 440 400"
      role="img"
      aria-label={describe(state)}
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          refX="7"
          refY="4"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--border-strong)" />
        </marker>
      </defs>

      {/* system nodes above, hairline connectors down to the agent */}
      <g className={show(state.systemCount > 0)} aria-hidden="true">
        {xs.map((x, i) => (
          <line
            key={`l${i}`}
            x1={x + NODE_W / 2}
            y1={68}
            x2={220 + (x + NODE_W / 2 - 220) * 0.32}
            y2={178}
            className="stroke-border"
            strokeWidth={1}
          />
        ))}
        {xs.map((x, i) => (
          <SystemNode key={x} x={x} index={i} />
        ))}
      </g>

      {/* flow arrows: data in (left), actions out (right) */}
      <g className={show(state.showFlows)} aria-hidden="true">
        <line
          x1={32}
          y1={210}
          x2={128}
          y2={210}
          className="stroke-border-strong"
          strokeWidth={1}
          markerEnd={`url(#${markerId})`}
        />
        <line
          x1={312}
          y1={210}
          x2={408}
          y2={210}
          className="stroke-border-strong"
          strokeWidth={1}
          markerEnd={`url(#${markerId})`}
        />
      </g>

      {/* agent node — ghost until the type is known, then the one accent */}
      <g
        aria-hidden="true"
        className={cn(
          "transition-opacity duration-500 ease-out",
          state.showAgent ? "opacity-100" : "opacity-35"
        )}
      >
        <rect
          x={140}
          y={178}
          width={160}
          height={64}
          rx={10}
          strokeWidth={1.5}
          className={cn(
            "fill-surface transition-[stroke] duration-500 ease-out",
            state.showAgent ? "stroke-accent" : "stroke-border-strong"
          )}
        />
        <text
          x={220}
          y={215}
          textAnchor="middle"
          fontSize={11.5}
          letterSpacing="0.14em"
          className={cn("text-mono fill-foreground", show(state.showAgent))}
        >
          AGENT
        </text>
      </g>

      {/* dashed document store below */}
      <g className={show(state.showDocs)} aria-hidden="true">
        <line
          x1={220}
          y1={242}
          x2={220}
          y2={320}
          className="stroke-border-strong"
          strokeWidth={1}
          strokeDasharray="4 5"
        />
        <rect
          x={158}
          y={320}
          width={124}
          height={56}
          rx={10}
          className="fill-transparent stroke-border-strong"
          strokeWidth={1}
          strokeDasharray="4 5"
        />
        <text
          x={220}
          y={352}
          textAnchor="middle"
          className="text-mono fill-muted-foreground"
          fontSize={10}
          letterSpacing="0.1em"
        >
          YOUR DOCS
        </text>
      </g>
    </svg>
  );
}

export default ArchitectureDiagram;
