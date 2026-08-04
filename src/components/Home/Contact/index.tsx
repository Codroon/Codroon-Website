"use client";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { ContactForm } from "./ContactForm";

const CALENDLY = "https://calendly.com/codroon-info/30min";

/**
 * Contact — closing conversion section. Primary action is the discovery
 * call (dominant, left); the form is the alternative path (right). No
 * background image, no budget slider. id="contact".
 */
export function Contact() {
  return (
    <Section id="contact" className="relative">
      {/* faint accent glow, consistent with the page */}
      <span
        aria-hidden
        className="glow-blob left-1/2 top-[-120px] h-[360px] w-[680px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left — pitch + primary CTA (the lead) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={staggerContainer}
          className="lg:pt-6"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>Let&apos;s build</Eyebrow>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-h1 mt-5 max-w-xl text-foreground">
            Bring us your workflow. Leave with a plan.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 max-w-lg text-body-lg text-muted-foreground">
            Book a free discovery call. No prep, no commitment. Walk us through
            what you&apos;re trying to build, and you&apos;ll leave knowing exactly
            how we&apos;d ship it: the MVP, the automation, the agent, whatever
            fits your use case.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8">
            <Button href={CALENDLY} target="_blank" rel="noopener noreferrer" size="lg">
              Book a free discovery call
              <ArrowRight className="size-[1.1em]" aria-hidden />
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
            <Mail size={18} className="text-accent" aria-hidden />
            <a
              href="mailto:info@codroon.com"
              className="text-[0.95rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              info@codroon.com
            </a>
          </motion.div>
        </motion.div>

        {/* Right — form (alternative path) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </Section>
  );
}

export default Contact;