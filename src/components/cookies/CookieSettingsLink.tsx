"use client";
import { useConsent } from "./ConsentContext";

/**
 * "Cookie settings" in the footer legal row. The policy points at this
 * link twice (§7 and §10), so it has to exist and it has to reopen the
 * banner. Styled to match FootLink exactly — it is a <button> because it
 * opens a control rather than navigating.
 */
export function CookieSettingsLink() {
  const { open } = useConsent();
  return (
    <button
      type="button"
      onClick={open}
      className="group inline-block text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="relative">
        Cookie settings
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
      </span>
    </button>
  );
}

export default CookieSettingsLink;
