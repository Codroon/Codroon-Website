import { cn } from "@/lib/utils";
import { Container } from "./Container";
import type { ElementType, ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  /** vertical rhythm: responsive py-24 → py-40 */
  spacing?: "default" | "compact" | "spacious";
  /** wrap children in a Container, or let the caller manage layout */
  bare?: boolean;
  containerWidth?: "default" | "wide" | "narrow";
  as?: ElementType;
  id?: string;
  className?: string;
};

/**
 * Section — vertical rhythm wrapper for page sections. Pairs with
 * Container for horizontal layout. Keeps section spacing consistent
 * across the whole site.
 */
export function Section({
  children,
  spacing = "default",
  bare = false,
  containerWidth = "default",
  as: Tag = "section",
  id,
  className,
}: SectionProps) {
  const rhythm =
    spacing === "compact"
      ? "py-16 sm:py-20"
      : spacing === "spacious"
      ? "py-28 sm:py-40"
      : "py-24 sm:py-32";

  return (
    <Tag id={id} className={cn("relative", rhythm, className)}>
      {bare ? children : <Container width={containerWidth}>{children}</Container>}
    </Tag>
  );
}

export default Section;