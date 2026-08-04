"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { easeOutExpo } from "@/lib/motion";

const CALENDLY = "https://calendly.com/codroon-info/30min";

const NEEDS = [
  "SaaS product",
  "AI integration",
  "AI automation",
  "AI agent",
  "Integrations",
  "Not sure yet",
];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>("idle");

  const toggleNeed = (n: string) =>
    setNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const company = String(fd.get("company") || ""); // honeypot

    const next: typeof errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!email) next.email = "We need an email to reply.";
    else if (!isEmail(email)) next.email = "That email doesn't look right.";
    if (!message) next.message = "Tell us a little about what you're building.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "modal_email",
          name,
          email,
          // `needs` is this form's own extra field; folded into the
          // message so nothing the visitor typed is dropped
          message: needs?.length ? `${message}\n\nInterested in: ${needs.join(", ")}` : message,
          company,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fieldBase =
    "w-full rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors duration-200 focus:border-accent";

  return (
    <div className="surface-card rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="flex min-h-[420px] flex-col items-start justify-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Check size={24} />
            </span>
            <h3 className="mt-5 font-sans text-xl font-semibold text-foreground">
              Thanks — we&apos;ll be in touch soon.
            </h3>
            <p className="mt-2 max-w-sm text-[0.95rem] text-muted-foreground">
              Prefer to talk now? Grab a slot and we&apos;ll dig into your workflow
              on a free call.
            </p>
            <Button href={CALENDLY} target="_blank" rel="noopener noreferrer" className="mt-6">
              Grab a slot
              <ArrowRight className="size-[1.1em]" aria-hidden />
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-h3 text-foreground">Prefer to write?</p>
            <p className="mt-1 text-[0.95rem] text-muted-foreground">
              Tell us about your workflow and we&apos;ll take it from there.
            </p>

            {/* honeypot (hidden from users + a11y) */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="mt-6 space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="cf-name" className="text-small mb-1.5 block text-muted-foreground">
                  Name
                </label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "cf-name-err" : undefined}
                  className={cn(fieldBase, errors.name && "border-[#ef6f6f] focus:border-[#ef6f6f]")}
                />
                {errors.name && (
                  <p id="cf-name-err" className="mt-1.5 text-[0.8rem] text-[#ef6f6f]">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="cf-email" className="text-small mb-1.5 block text-muted-foreground">
                  Work email
                </label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "cf-email-err" : undefined}
                  className={cn(fieldBase, errors.email && "border-[#ef6f6f] focus:border-[#ef6f6f]")}
                />
                {errors.email && (
                  <p id="cf-email-err" className="mt-1.5 text-[0.8rem] text-[#ef6f6f]">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Needs chips */}
              <fieldset>
                <legend className="text-small mb-2 block text-muted-foreground">
                  What do you need? <span className="text-muted-foreground/60">(optional)</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {NEEDS.map((n) => {
                    const on = needs.includes(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleNeed(n)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-small transition-colors duration-200",
                          on
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                        )}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Message */}
              <div>
                <label htmlFor="cf-message" className="text-small mb-1.5 block text-muted-foreground">
                  What are you trying to build?
                </label>
                <textarea
                  id="cf-message"
                  name="message"
                  rows={4}
                  placeholder="A sentence or two about the workflow or product you have in mind…"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "cf-message-err" : undefined}
                  className={cn(fieldBase, "resize-none", errors.message && "border-[#ef6f6f] focus:border-[#ef6f6f]")}
                />
                {errors.message && (
                  <p id="cf-message-err" className="mt-1.5 text-[0.8rem] text-[#ef6f6f]">
                    {errors.message}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p role="alert" className="text-[0.85rem] text-[#ef6f6f]">
                  Something went wrong sending that. Please try again, or just book a call above.
                </p>
              )}

              <Button
                type="submit"
                magnetic={false}
                disabled={status === "submitting"}
                className="w-full"
              >
                {status === "submitting" ? "Sending…" : "Start the conversation"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ContactForm;