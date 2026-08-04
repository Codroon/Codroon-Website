import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** "default" ≈ 1240px content; "wide" ≈ 1440px full-bleed sections */
  width?: "default" | "wide" | "narrow";
  as?: ElementType;
  className?: string;
};

/**
 * Container — centers content with the editorial max-width + responsive
 * gutters. Use inside <Section>.
 */
export function Container({
  children,
  width = "default",
  as: Tag = "div",
  className,
}: ContainerProps) {
  const max =
    width === "wide"
      ? "max-w-[1440px]"
      : width === "narrow"
      ? "max-w-[768px]"
      : "max-w-[1240px]";

  return (
    <Tag className={cn("mx-auto w-full px-6 sm:px-8 lg:px-12", max, className)}>
      {children}
    </Tag>
  );
}

export default Container;