import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { buildPreviews } from "@/emails/previewSet";
import { EmailPreview } from "./EmailPreview";

/**
 * /dev/emails — DEV ONLY. Renders all five templates to real HTML and
 * shows each in an iframe, with a background toggle that approximates a
 * client dark-mode inversion and an HTML/plain-text switch.
 *
 * The route 404s in production rather than hiding behind a flag: a page
 * that renders internal notification layouts should not exist on the
 * public site at all.
 *
 * The dark toggle is an approximation, not a simulation. Gmail's
 * inversion is proprietary and per-client; this catches the obvious
 * failures and nothing subtler. Real verification is a send to a real
 * inbox, which is what the checklist in email-previews/CHECKLIST.md is
 * for.
 */

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Email previews (dev)",
  robots: { index: false, follow: false },
};

export default async function EmailPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  // Absolute asset URLs are mandatory in email, so the templates take an
  // origin. Locally that has to be this server or the logo 404s.
  const h = await headers();
  const origin = `http://${h.get("host") ?? "localhost:3000"}`;

  return <EmailPreview templates={await buildPreviews(origin)} />;
}
