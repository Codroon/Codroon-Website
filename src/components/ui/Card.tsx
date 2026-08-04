"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  /** subtle lift + accent border on hover */
  hover?: boolean;
  className?: string;
};

/**
 * Card — surface primitive: warm surface bg, hairline border, generous
 * padding, optional hover lift. The base for feature/solution/case cards.
 */
export function Card({ children, hover = true, className }: CardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      whileHover={
        hover && !reduced ? { y: -4, transition: { duration: 0.2 } } : undefined
      }
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8",
        hover &&
          "transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--accent)_35%,transparent)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export default Card;