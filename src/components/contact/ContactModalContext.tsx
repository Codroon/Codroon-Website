"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ContactModal, type ModalView } from "./ContactModal";

type OpenOptions = {
  /**
   * Extra query params for the Calendly embed — the estimator passes
   * { a1: shortCode } so the estimate code prefills the first custom
   * question on the event type. Cleared on every open() that doesn't
   * pass its own, so a later "Start a project" never inherits them.
   */
  calendlyParams?: Record<string, string>;
  /**
   * The caller has already recorded this visit, so the modal must not
   * record it again.
   *
   * The estimator's quote CTA posts its own estimator_quote lead, which
   * carries the short code and therefore says far more than a bare
   * modal_meeting would. Without this the same click produced two rows:
   * the useful one, plus an empty modal_meeting with no contact details
   * and no estimate, which is exactly the row class that had to be
   * purged from the table (client, 2026-08-09).
   */
  intentAlreadyRecorded?: boolean;
};

type ContactModalApi = {
  /** Open the shared contact modal (optionally on a specific view). */
  open: (view?: ModalView, opts?: OpenOptions) => void;
  close: () => void;
};

const Ctx = createContext<ContactModalApi | null>(null);

/**
 * ContactModalProvider — ONE shared modal for every conversion CTA
 * ("Start a project", "Book a free discovery call", "Get your free
 * consultation"). No forms are rendered inline on pages.
 */
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ModalView>("menu");
  const [calendlyParams, setCalendlyParams] = useState<
    Record<string, string> | undefined
  >(undefined);
  const [intentAlreadyRecorded, setIntentAlreadyRecorded] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((v: ModalView = "menu", opts?: OpenOptions) => {
    // remember the trigger so focus returns to it on close
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setCalendlyParams(opts?.calendlyParams);
    setIntentAlreadyRecorded(Boolean(opts?.intentAlreadyRecorded));
    setView(v);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    const el = triggerRef.current;
    if (el) requestAnimationFrame(() => el.focus());
  }, []);

  const api = useMemo(() => ({ open, close }), [open, close]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <ContactModal
        isOpen={isOpen}
        view={view}
        calendlyParams={calendlyParams}
        intentAlreadyRecorded={intentAlreadyRecorded}
        onViewChange={setView}
        onClose={close}
      />
    </Ctx.Provider>
  );
}

export function useContactModal(): ContactModalApi {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useContactModal must be used inside ContactModalProvider");
  }
  return ctx;
}
