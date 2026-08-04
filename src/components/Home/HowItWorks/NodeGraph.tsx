"use client";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { NODES, EDGES, type GraphNode } from "./data";

/**
 * NodeGraph — decorative SVG driven entirely by a scroll-progress
 * MotionValue (0→1). No React state, no re-renders on scroll.
 *   chaos (0–0.33) → nodes scattered
 *   connect (0.33–0.66) → edges draw, nodes ease to ordered layout
 *   resolve (0.66–1) → network fades, product panel lights up
 * aria-hidden — the readable narrative lives in the step text.
 */
export function NodeGraph({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      viewBox="0 0 600 560"
      className="h-full w-full"
      aria-hidden
      role="presentation"
    >
      <g>
        {EDGES.map(([a, b], i) => (
          <Edge key={i} from={NODES[a]} to={NODES[b]} progress={progress} />
        ))}
      </g>
      <g>
        {NODES.map((node, i) => (
          <Node key={i} node={node} progress={progress} />
        ))}
      </g>
      <ProductPanel progress={progress} />
    </svg>
  );
}

const POS_RANGE = [0.04, 0.58] as const;

function Node({
  node,
  progress,
}: {
  node: GraphNode;
  progress: MotionValue<number>;
}) {
  const x = useTransform(progress, [...POS_RANGE], [node.chaos.x, node.ordered.x]);
  const y = useTransform(progress, [...POS_RANGE], [node.chaos.y, node.ordered.y]);
  const groupOpacity = useTransform(progress, [0.66, 0.82], [1, 0]);
  const labelOpacity = useTransform(progress, [0, 0.16, 0.32], [1, 1, 0]);
  const r = node.r ?? 6;

  return (
    <motion.g style={{ x, y, opacity: groupOpacity }}>
      <circle
        r={r}
        fill={node.hub ? "var(--accent)" : "var(--surface-2)"}
        stroke={node.hub ? "var(--accent)" : "var(--border)"}
        strokeWidth={1.5}
      />
      {node.hub && (
        <circle
          r={r + 6}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1}
          opacity={0.35}
        />
      )}
      {node.label && (
        <motion.text
          x={r + 8}
          y={4}
          style={{ opacity: labelOpacity }}
          fill="var(--muted-foreground)"
          fontSize={13}
          fontFamily="var(--font-mono)"
        >
          {node.label}
        </motion.text>
      )}
    </motion.g>
  );
}

function Edge({
  from,
  to,
  progress,
}: {
  from: GraphNode;
  to: GraphNode;
  progress: MotionValue<number>;
}) {
  const pathLength = useTransform(progress, [0.33, 0.64], [0, 1]);
  const opacity = useTransform(progress, [0.3, 0.42, 0.66, 0.82], [0, 0.7, 0.7, 0]);

  return (
    <motion.line
      x1={from.ordered.x}
      y1={from.ordered.y}
      x2={to.ordered.x}
      y2={to.ordered.y}
      stroke="var(--accent)"
      strokeWidth={1.5}
      strokeLinecap="round"
      style={{ pathLength, opacity }}
    />
  );
}

function ProductPanel({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.66, 0.82], [0, 1]);
  const scale = useTransform(progress, [0.66, 1], [0.92, 1]);

  return (
    <motion.g
      style={{
        opacity,
        scale,
        transformBox: "fill-box",
        transformOrigin: "center",
      }}
    >
      {/* window */}
      <rect
        x={150}
        y={150}
        width={300}
        height={250}
        rx={18}
        fill="var(--surface)"
        stroke="var(--border)"
        strokeWidth={1.5}
      />
      {/* glow */}
      <rect
        x={150}
        y={150}
        width={300}
        height={250}
        rx={18}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={1.5}
        opacity={0.4}
      />
      {/* title bar dots */}
      <circle cx={174} cy={176} r={4} fill="var(--accent)" />
      <circle cx={190} cy={176} r={4} fill="var(--border)" />
      <circle cx={206} cy={176} r={4} fill="var(--border)" />
      <line x1={150} y1={196} x2={450} y2={196} stroke="var(--border)" strokeWidth={1} />
      {/* content lines */}
      <rect x={174} y={220} width={150} height={12} rx={6} fill="var(--accent)" opacity={0.85} />
      <rect x={174} y={246} width={252} height={9} rx={4.5} fill="var(--surface-2)" />
      <rect x={174} y={266} width={228} height={9} rx={4.5} fill="var(--surface-2)" />
      <rect x={174} y={286} width={240} height={9} rx={4.5} fill="var(--surface-2)" />
      {/* accent block */}
      <rect x={174} y={320} width={110} height={44} rx={10} fill="var(--accent)" opacity={0.18} />
      <rect x={300} y={320} width={126} height={44} rx={10} fill="var(--surface-2)" />
    </motion.g>
  );
}

export default NodeGraph;
