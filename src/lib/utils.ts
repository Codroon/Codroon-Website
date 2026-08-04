/**
 * cn — tiny className joiner. Filters falsy values so conditional
 * classes read cleanly: cn("base", isActive && "active", className).
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}