import { Suspense } from "react";
import type { Metadata } from "next";
import { MvpEstimator } from "@/components/tools/estimator/MvpEstimator";

/**
 * Estimator flow. Answers live in the URL search params (never browser
 * storage), which is what makes Back, refresh and a pasted link all
 * reproduce the same estimate — and requires the Suspense boundary
 * around useSearchParams.
 *
 * noindex: an estimate URL is one visitor's answers, not a page.
 */

export const metadata: Metadata = {
  title: "MVP Cost Estimator | Codroon",
  robots: { index: false },
};

export default function EstimatePage() {
  // the fallback must not be a <main> — two landmarks on one page
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <MvpEstimator />
    </Suspense>
  );
}
