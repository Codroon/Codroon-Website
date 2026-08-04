"use client";
import { Button, type ButtonProps } from "@/components/ui/Button";
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
 */
export function CtaButton({ view = "menu", children, ...rest }: Props) {
  const { open } = useContactModal();
  return (
    <Button {...(rest as ButtonProps)} onClick={() => open(view)}>
      {children}
    </Button>
  );
}

export default CtaButton;
