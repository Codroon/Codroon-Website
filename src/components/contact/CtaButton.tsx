"use client";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { SITE } from "@/config/site";
import { useContactModal } from "./ContactModalContext";
import type { ModalView } from "./ContactModal";

type Props = Omit<ButtonProps, "href" | "onClick"> & {
  /** open the modal on a specific view (default: the options menu) */
  view?: ModalView;
};

/**
 * CtaButton — a Button that opens the shared contact modal. Use this for
 * every conversion CTA ("Start a project", "Book a free discovery call",
 * "Get your free consultation") so server components can stay server-
 * rendered and still trigger the one shared modal.
 *
 * RENDERS AS A REAL LINK, upgraded by JavaScript.
 *
 * These used to be plain <button onClick>, which meant that with the
 * client bundle absent, blocked or broken there was NO contact path
 * anywhere on the homepage: every conversion CTA was inert and the only
 * reachable address was a mailto in the footer (client, 2026-08-09).
 *
 * So the element is an anchor with a genuine destination, and the click
 * handler intercepts it when the modal is available. Nothing changes for
 * a normal visitor. Without JavaScript the CTA still goes somewhere
 * useful, and middle-click or "open in new tab" now behave like the link
 * they appear to be.
 *
 * The href is chosen to match the view so the fallback lands on the
 * thing the button promised, not on a generic page.
 */
const FALLBACK_HREF: Record<ModalView, string> = {
  menu: "/about#connect",
  call: "/about#connect",
  email: `mailto:${SITE.email}`,
  meeting: process.env.NEXT_PUBLIC_CALENDLY_URL || SITE.calendly,
};

export function CtaButton({ view = "menu", children, ...rest }: Props) {
  const { open } = useContactModal();

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    // let the browser handle modified clicks, so new-tab and
    // middle-click keep working on what is a real link
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    open(view);
  };

  // Button's props are a union discriminated on `href`; one cast at the
  // boundary is cleaner than threading the anchor variant through.
  const props = {
    ...rest,
    href: FALLBACK_HREF[view],
    onClick,
    children,
  } as unknown as ButtonProps;

  return <Button {...props} />;
}

export default CtaButton;
