import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
  /** override the rendered tag independently of the visual level */
  as?: ElementType;
  className?: string;
};

/* Each maps to a step in the fluid type scale defined in globals.css.
   Visual level is fixed by the class; semantic tag is overridable
   via `as` so document outline stays correct. */

/** Largest — hero display. Display face. */
export function Display({ children, as: Tag = "h1", className }: HeadingProps) {
  return <Tag className={cn("text-display text-foreground", className)}>{children}</Tag>;
}

/** Page title. Display face. */
export function H1({ children, as: Tag = "h1", className }: HeadingProps) {
  return <Tag className={cn("text-h1 text-foreground", className)}>{children}</Tag>;
}

/** Section title. Display face. */
export function H2({ children, as: Tag = "h2", className }: HeadingProps) {
  return <Tag className={cn("text-h2 text-foreground", className)}>{children}</Tag>;
}

/** Subsection / card title. Sans. */
export function H3({ children, as: Tag = "h3", className }: HeadingProps) {
  return <Tag className={cn("text-h3 text-foreground", className)}>{children}</Tag>;
}