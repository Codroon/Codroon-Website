"use client";
import { AlertCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Shared input styling for the contact modal forms. */
export const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface-raised px-4 py-3 text-foreground " +
  // /70 keeps placeholders ≥4.5:1 on the raised input surface
  "placeholder:text-muted-foreground/70 outline-none transition-colors duration-200 focus:border-accent";

export const fieldError = "border-error focus:border-error";

/**
 * Inline field error — error icon + readable text (never colour alone;
 * the message itself stays high-contrast on the card surface).
 */
export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    // role="alert" so the message is announced when it appears. Without
    // it a screen-reader user submitting the form heard nothing at all:
    // the field is described-by this node, but aria-describedby is only
    // read when focus reaches the field, and focus was left on the
    // submit button (client, 2026-08-09). The form-level FormError
    // already had role="alert"; the per-field one did not.
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-start gap-1.5 text-[0.8rem] text-muted-foreground"
    >
      <AlertCircle size={14} className="mt-0.5 shrink-0 text-error" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/**
 * Move focus to the first invalid control in a form after a failed
 * submit, so the fix starts where the problem is rather than wherever
 * the submit button left it. Pairs with role="alert" above: the alert
 * announces WHAT is wrong, this puts the user WHERE it is wrong.
 *
 * Takes the form element and the field ids in visual order, because
 * "first" has to mean first on screen, not first in an object.
 */
export function focusFirstInvalid(
  form: HTMLFormElement | null,
  orderedIds: string[]
): void {
  if (!form) return;
  for (const id of orderedIds) {
    const el = form.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (el?.getAttribute("aria-invalid") === "true") {
      el.focus();
      return;
    }
  }
}

/** Form-level error banner — icon + text. */
export function FormError({ children }: { children: ReactNode }) {
  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-error/60 bg-surface-raised px-3 py-2.5 text-[0.85rem] text-muted-foreground"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-error" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

/** Success state — icon + text. */
export function SuccessNote({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-start justify-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-success/50 text-success">
        <Check size={24} aria-hidden />
      </span>
      <h3 className="mt-5 font-sans text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-[0.95rem] text-muted-foreground">{children}</p>
    </div>
  );
}

export function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-small mb-1.5 block text-muted-foreground">
      {children}
      {optional && <span className="text-muted-foreground/70"> (optional)</span>}
    </label>
  );
}

/** Consent checkbox with a ≥44px touch row and explicit label text. */
export function ConsentCheckbox({
  id,
  name,
  required,
  invalid,
  describedBy,
  children,
}: {
  id: string;
  name: string;
  required?: boolean;
  invalid?: boolean;
  describedBy?: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex min-h-[44px] cursor-pointer items-start gap-3 rounded-[var(--radius-sm)] border px-3 py-2.5 transition-colors",
        invalid ? "border-error/70" : "border-border hover:border-border-strong"
      )}
    >
      <input
        id={id}
        name={name}
        type="checkbox"
        aria-required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
      />
      <span className="text-[0.82rem] leading-relaxed text-muted-foreground">{children}</span>
    </label>
  );
}
