import type { Metadata } from "next";
import Hero from "@/components/Home/Hero";
import Services from "@/components/Home/Services";
import Products from "@/components/Home/Products";
import Stats from "@/components/Home/Stats";
import WhyCodroon from "@/components/Home/WhyCodroon";
import HowItWorks from "@/components/Home/HowItWorks";
import Testimonials from "@/components/Home/Testimonials";
import BlogTeaser from "@/components/Home/BlogTeaser";
import FinalCta from "@/components/Home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Homepage — section order:
 *   1 Hero · 2 Services · 3 Products · 4 Stats · 5 Why Codroon
 *   6 How it works · 7 Testimonials · 8 Blog · 9 Final CTA
 * (10 Footer lives in the root layout.)
 *
 * The Blog teaser was removed from render on 2026-08-03 (it was
 * publishing three fabricated posts) and restored here once the real
 * post registry existed. It reads that registry and renders nothing
 * when it is empty, so the failure cannot recur.
 *
 * ⚠️ Testimonials still renders four PLACEHOLDER quotes attributed to
 * invented people (see the DUMMY warning in that component). Same class
 * of problem, awaiting the client's real testimonials.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Products />
      <Stats />
      <WhyCodroon />
      <HowItWorks />
      <Testimonials />
      <BlogTeaser />
      <FinalCta />
    </>
  );
}
