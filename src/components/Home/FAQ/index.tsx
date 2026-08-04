"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { FaqItem } from "./FaqItem";
import { FAQS, CALENDLY } from "./data";

/**
 * FAQ — clean, image-free two-column split. Sticky header + CTA on the
 * left, accordion on the right. One item open at a time. id="faq".
 * FAQPage JSON-LD is generated from the same FAQS array (stays in sync).
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Left — sticky header + CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>FAQ</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-h2 mt-5 text-foreground">
            Questions, answered.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 max-w-sm text-body-lg text-muted-foreground">
            Everything you might want to know before we talk.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <p className="text-sm text-muted-foreground">Still have a question?</p>
            <Button
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3"
            >
              Book a free discovery call
              <ArrowRight className="size-[1.1em]" aria-hidden />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right — accordion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8%" }}
          variants={staggerContainer}
          className="border-t border-border"
        >
          {FAQS.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <FaqItem
                item={item}
                index={i}
                open={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

export default FAQ;