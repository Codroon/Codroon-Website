"use client";
import { useContactModal } from "./ContactModalContext";
import type { ModalView } from "./ContactModal";

/**
 * ContactModalLink — an inline TEXT link that opens the shared contact
 * modal, for prose contexts where CtaButton's button chrome would be
 * too heavy. Same modal, different register.
 *
 * Deliberately no arrow glyph or icon: its first caller is /about,
 * which permits no icons of any kind. Callers that want an arrow put
 * one in the label text.
 *
 * It is a <button> rather than an <a> because it triggers an in-page
 * dialog and goes nowhere.
 */
export function ContactModalLink({
  children,
  view = "menu",
}: {
  children: React.ReactNode;
  view?: ModalView;
}) {
  const { open } = useContactModal();
  return (
    <button
      type="button"
      onClick={() => open(view)}
      className="text-small inline-flex min-h-[44px] items-center text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {children}
    </button>
  );
}

export default ContactModalLink;
