/**
 * The preview tool is a workbench, not a page of the site, so it hides
 * the site chrome. The app's header is `fixed` and sits above everything
 * at z-50, which otherwise covers the toggle bar and swallows its
 * clicks.
 *
 * A nested layout cannot escape the root layout in the App Router, so
 * the chrome is hidden with CSS rather than restructured into a route
 * group — this route is dev-only and 404s in production.
 */
export default function DevEmailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        body > header, body > footer,
        main > header, main + footer { display: none !important; }
        header.fixed { display: none !important; }
        main { min-height: 0 !important; }
        body { background: #f2f2f0 !important; }
      `}</style>
      {children}
    </>
  );
}
