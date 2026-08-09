"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormError,
  Label,
  SuccessNote,
  fieldBase,
  fieldError,
  focusFirstInvalid,
} from "./fields";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = { name?: string; email?: string; message?: string };

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** EmailForm — "Send an email" flow inside the shared contact modal. */
export function EmailForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const company = String(fd.get("company") || ""); // honeypot

    const next: Errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!email) next.email = "We need an email to reply.";
    else if (!isEmail(email)) next.email = "That email doesn't look right.";
    if (!message) next.message = "Tell us a little about what you're building.";
    setErrors(next);
    if (Object.keys(next).length) {
      // Focus the first thing that is actually wrong. Submit leaves
      // focus on the button, so without this the user is told there is
      // an error and left nowhere near it.
      const form = e.currentTarget;
      requestAnimationFrame(() =>
        focusFirstInvalid(form, ["em-name", "em-email", "em-message"])
      );
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "modal_email",
          name,
          email,
          message,
          company,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <SuccessNote title="Thanks. We'll be in touch soon.">
        Your message is on its way to the team. We&apos;ll reply from{" "}
        info@codroon.com with next steps.
      </SuccessNote>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      {/* honeypot (hidden from users + a11y) */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="em-name">Name</Label>
          <input
            id="em-name"
            name="name"
            type="text"
            aria-required="true"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "em-name-err" : undefined}
            className={cn(fieldBase, errors.name && fieldError)}
          />
          {errors.name && <FieldError id="em-name-err">{errors.name}</FieldError>}
        </div>

        <div>
          <Label htmlFor="em-email">Work email</Label>
          <input
            id="em-email"
            name="email"
            type="email"
            aria-required="true"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "em-email-err" : undefined}
            className={cn(fieldBase, errors.email && fieldError)}
          />
          {errors.email && <FieldError id="em-email-err">{errors.email}</FieldError>}
        </div>

        <div>
          <Label htmlFor="em-message">What are you trying to build?</Label>
          <textarea
            id="em-message"
            name="message"
            rows={4}
            aria-required="true"
            placeholder="A sentence or two about the workflow or product you have in mind…"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "em-message-err" : undefined}
            className={cn(fieldBase, "resize-none", errors.message && fieldError)}
          />
          {errors.message && <FieldError id="em-message-err">{errors.message}</FieldError>}
        </div>

        {status === "error" && (
          <FormError>
            Something went wrong sending that. Please try again, or schedule a
            meeting instead.
          </FormError>
        )}

        <Button type="submit" magnetic={false} disabled={status === "submitting"} className="w-full">
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

export default EmailForm;
