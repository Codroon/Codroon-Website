"use client";
import Link from "next/link";
import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./MagneticButton";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** wrap in MagneticButton for cursor-tracking hover */
  magnetic?: boolean;
  className?: string;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium whitespace-nowrap " +
  "transition-[background-color,color,border-color,opacity] duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:cursor-not-allowed disabled:opacity-40";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-13 px-8 text-body-lg",
};

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:bg-accent-hover",
  secondary:
    "border border-border text-foreground hover:border-[color-mix(in_srgb,var(--accent)_50%,var(--border))] hover:text-accent",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-surface-2",
};

/**
 * CTA_FIT — for the long labels in the closing CTA cards.
 *
 * Buttons are whitespace-nowrap, so a label wider than the card interior
 * runs straight past the padding instead of wrapping. Below sm the button
 * goes full width, wraps its text and takes its height from the content
 * rather than the fixed h-13. Above sm it reverts to the normal
 * intrinsic-width pill, so pair this with flex-wrap on the row.
 */
export const CTA_FIT =
  "max-sm:h-auto max-sm:min-h-13 max-sm:w-full max-sm:whitespace-normal max-sm:px-6 max-sm:py-3.5 max-sm:text-center";

/**
 * Button — primary (accent fill) / secondary (outline) / ghost.
 * Renders an <a> (Next Link) when `href` is set, otherwise a <button>.
 * Magnetic hover, visible focus-visible ring, disabled state.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      children,
      variant = "primary",
      size = "md",
      magnetic = true,
      className,
      ...rest
    } = props;

    const classes = cn(base, sizes[size], variants[variant], className);

    const inner =
      "href" in props && props.href !== undefined ? (
        <Link
          href={props.href}
          className={classes}
          {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}
        >
          {children}
        </Link>
      ) : (
        <button
          ref={ref}
          className={classes}
          {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );

    // ghost buttons skip the magnetic effect (they're low-emphasis)
    if (magnetic && variant !== "ghost") {
      return <MagneticButton>{inner}</MagneticButton>;
    }
    return inner;
  }
);

export default Button;