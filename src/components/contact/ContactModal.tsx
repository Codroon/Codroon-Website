"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Mail, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";
import { SITE } from "@/config/site";
import { CallForm } from "./CallForm";
import { EmailForm } from "./EmailForm";

export type ModalView = "menu" | "call" | "email" | "meeting";

type Props = {
  isOpen: boolean;
  view: ModalView;
  /** extra Calendly query params (e.g. the estimator's { a1: code }) */
  calendlyParams?: Record<string, string>;
  onViewChange: (v: ModalView) => void;
  onClose: () => void;
};

/** One booking link everywhere; the env var overrides it per deploy. */
const CALENDLY_BASE = process.env.NEXT_PUBLIC_CALENDLY_URL || SITE.calendly;

/** Calendly URL with our dark theming plus any caller-supplied params. */
function calendlyUrl(extra?: Record<string, string>, themed = true) {
  const url = new URL(CALENDLY_BASE);
  if (themed) {
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "232220");
    url.searchParams.set("text_color", "eae5e1");
    url.searchParams.set("primary_color", "e96a42");
  }
  for (const [k, v] of Object.entries(extra ?? {})) url.searchParams.set(k, v);
  return url.toString();
}

const OPTIONS: Array<{
  view: Exclude<ModalView, "menu">;
  icon: typeof Phone;
  label: string;
  descriptor: string;
}> = [
  {
    view: "call",
    icon: Phone,
    label: "Get a call",
    descriptor: "We'll call you back within 24 hours",
  },
  {
    view: "email",
    icon: Mail,
    label: "Send an email",
    descriptor: "Write to us and we'll reply with next steps",
  },
  {
    view: "meeting",
    icon: Calendar,
    label: "Schedule a meeting",
    descriptor: "Pick a slot for a free discovery call",
  },
];

/**
 * Fire-and-forget: a failed write must not stop someone reaching the
 * scheduler, and there is nothing useful to tell them if it does.
 */
function recordMeetingIntent() {
  try {
    void fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "modal_meeting" }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignored */
  }
}

const VIEW_TITLES: Record<ModalView, string> = {
  menu: "Start a project",
  call: "Get a call",
  email: "Send an email",
  meeting: "Schedule a meeting",
};

/**
 * ContactModal — the ONE shared contact dialog. Three stacked options
 * (icon tile left, bold label, one-line descriptor), each opening its
 * own flow: call-back form, email form, or Calendly embed.
 *
 * Accessibility: role=dialog + aria-modal, labelled by its heading,
 * focus is trapped, Escape closes, and the provider returns focus to
 * the trigger on close.
 *
 * TODO: right-hand panel is reserved for a client testimonial video —
 * single-column until a real video exists (no placeholder media).
 */
export function ContactModal({
  isOpen,
  view,
  calendlyParams,
  onViewChange,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // focus trap + Escape
  useEffect(() => {
    if (!isOpen) return;
    const root = panelRef.current;
    if (!root) return;

    const focusables = () =>
      Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el.tagName === "IFRAME");

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const els = focusables();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [isOpen, onClose]);

  // move focus to the heading whenever the dialog opens or the view changes
  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => headingRef.current?.focus());
  }, [isOpen, view]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            // click on the backdrop (not the panel) closes
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="relative my-auto w-full max-w-lg rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-2xl shadow-black/50 sm:p-8"
          >
            {/* Header row: back (when in a flow) + close */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {view !== "menu" && (
                  <button
                    type="button"
                    onClick={() => onViewChange("menu")}
                    aria-label="Back to contact options"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    <ArrowLeft size={18} aria-hidden />
                  </button>
                )}
                <h2
                  id="contact-modal-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-sans text-2xl font-semibold text-foreground outline-none"
                >
                  {VIEW_TITLES[view]}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {view === "menu" && (
              <>
                <p className="mt-2 text-[0.95rem] text-muted-foreground">
                  Pick how you&apos;d like to talk to us.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.view}
                        type="button"
                        onClick={() => {
                          // The meeting option has no form to submit, so
                          // the signal is recorded on selection — before
                          // the embed loads. An abandoned booking still
                          // leaves a trace, which is the only evidence
                          // we would otherwise never get.
                          if (opt.view === "meeting") recordMeetingIntent();
                          onViewChange(opt.view);
                        }}
                        className={cn(
                          "group flex w-full items-center gap-4 rounded-[var(--radius-md)] border border-border bg-surface-raised p-4 text-left",
                          "transition-colors duration-200 hover:border-border-strong"
                        )}
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-border bg-surface text-accent">
                          <Icon size={20} aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <span className="block font-sans font-semibold text-foreground">
                            {opt.label}
                          </span>
                          <span className="block text-[0.9rem] text-muted-foreground">
                            {opt.descriptor}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {view === "call" && <CallForm />}
            {view === "email" && <EmailForm />}

            {view === "meeting" && (
              <div className="mt-4">
                {/* The embed is cross-origin, so nothing we ship can style
                    inside it — the badge can only be covered from out
                    here. Measured 2026-08-06: the ribbon is a 105x105
                    square pinned to top-0/right-0, and it stays 105x105
                    at every width (checked at 446 and 330), so a fixed
                    patch is enough. It is position:sticky, so it also
                    survives scrolling inside the embed.

                    WHY THIS IS FRAGILE. Calendly's class names are
                    hashed per deploy (zzii_0xdazpec5x7l3cz), so there is
                    nothing stable to target even in principle, and
                    nothing warns us if they move or resize it — the
                    patch would simply stop lining up, or start covering
                    real UI. Check this corner after any report of the
                    scheduler looking wrong.

                    The proper fix is Calendly Standard, which removes
                    the badge at the account level AND makes the
                    background_color/text_color/primary_color params in
                    calendlyUrl() start working; they are ignored on the
                    free plan, which is why the card renders white
                    inside a dark modal. Delete this patch then.

                    The wrapper carries the radius and border so the
                    patch needs no corner rounding of its own, and it is
                    white to match the card and to keep the panel from
                    flashing dark-then-white while the embed loads. */}
                <div className="relative overflow-hidden rounded-[var(--radius-md)] border border-border bg-white">
                  <iframe
                    src={calendlyUrl(calendlyParams)}
                    title="Schedule a meeting with Codroon (Calendly)"
                    className="block h-[62vh] min-h-[420px] w-full"
                  />
                  {/* pointer-events-none is load-bearing: later booking
                      steps put real controls near this corner, and a
                      solid patch would swallow those clicks. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 h-[106px] w-[106px] bg-white"
                  />
                </div>
                <p className="mt-3 text-small text-muted-foreground">
                  The scheduler is provided by Calendly. If it doesn&apos;t
                  load,{" "}
                  <a
                    href={calendlyUrl(calendlyParams, false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-accent underline underline-offset-4 hover:text-accent-hover"
                  >
                    open it in a new tab
                  </a>
                  .
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ContactModal;
