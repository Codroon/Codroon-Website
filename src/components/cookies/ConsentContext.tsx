"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Cookie consent, stored in a first-party COOKIE, not localStorage.
 *
 * Two reasons: the standing rule on this project is no browser storage
 * anywhere, and the policy itself calls the consent preference an
 * essential cookie in §7. Storing it as anything else would make that
 * sentence untrue.
 *
 * The gate is deliberately conservative: `analytics` is false until the
 * visitor has actively accepted. No implied consent, no "by continuing
 * to browse". Analytics scripts must read this and refuse to load while
 * it is false — see ANALYTICS in src/config/analytics.ts.
 */

export type ConsentChoice = "accepted" | "rejected";

const COOKIE = "codroon_consent";
/** 12 months, the usual re-ask interval. */
const MAX_AGE = 60 * 60 * 24 * 365;

function readChoice(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const hit = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE}=`))
    ?.split("=")[1];
  return hit === "accepted" || hit === "rejected" ? hit : null;
}

function writeChoice(choice: ConsentChoice) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${choice}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

type ConsentValue = {
  /** null = never asked */
  choice: ConsentChoice | null;
  /** true ONLY after an explicit accept */
  analytics: boolean;
  /** the banner is on screen */
  isOpen: boolean;
  /** reopened from the footer rather than shown on first visit */
  open: () => void;
  close: () => void;
  accept: () => void;
  reject: () => void;
};

const Ctx = createContext<ConsentValue | null>(null);

export function ConsentProvider({
  children,
  /** ask on first visit only when there is something to consent to */
  askOnFirstVisit,
}: {
  children: ReactNode;
  askOnFirstVisit: boolean;
}) {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // read after mount: the server has no idea what the cookie says, and
  // rendering a banner on the server would flash it for people who have
  // already answered
  useEffect(() => {
    const existing = readChoice();
    setChoice(existing);
    if (!existing && askOnFirstVisit) setIsOpen(true);
  }, [askOnFirstVisit]);

  const decide = useCallback((next: ConsentChoice) => {
    writeChoice(next);
    setChoice(next);
    setIsOpen(false);
  }, []);

  return (
    <Ctx.Provider
      value={{
        choice,
        analytics: choice === "accepted",
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        accept: () => decide("accepted"),
        reject: () => decide("rejected"),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useConsent must be used inside ConsentProvider");
  return ctx;
}
