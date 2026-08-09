"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  ConsentCheckbox,
  FieldError,
  FormError,
  Label,
  SuccessNote,
  fieldBase,
  fieldError,
  focusFirstInvalid,
} from "./fields";

type Status = "idle" | "submitting" | "success" | "error";
type Errors = { name?: string; phone?: string; email?: string; callConsent?: string };

/** Loose email check — enough to catch a typo, not to validate RFC 5322. */
const looksLikeEmail = (v: string) => /^[^@s]+@[^@s]+.[^@s]+$/.test(v);

/** Loose phone check — at least 7 digits somewhere in the value. */
const looksLikePhone = (v: string) => (v.match(/\d/g) ?? []).length >= 7;

/**
 * CallForm — "Get a call" flow. Collects name + phone and EXPLICIT,
 * SEPARATE consents (TCPA): one to receive the requested call-back,
 * one (optional) for transactional SMS.
 *
 * Email is OPTIONAL and framed as a backup. Two reasons it exists: a
 * phone number with no fallback loses the lead to one missed call, and
 * without an address the call acknowledgement (template 3, which echoes
 * the number back so a typo is catchable) can never be sent.
 */
export function CallForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const about = String(fd.get("about") || "").trim();
    const callConsent = fd.get("callConsent") === "on";
    const smsConsent = fd.get("smsConsent") === "on";
    const company = String(fd.get("company") || ""); // honeypot

    const next: Errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!phone) next.phone = "We need a number to call you back.";
    else if (!looksLikePhone(phone)) next.phone = "That number doesn't look right.";
    // optional, but a typo in it is worth catching
    if (email && !looksLikeEmail(email)) next.email = "That email doesn't look right.";
    if (!callConsent)
      next.callConsent = "We can only call you if you agree to be contacted by phone.";
    setErrors(next);
    if (Object.keys(next).length) {
      // ids in VISUAL order, so "first invalid" means the first one the
      // user can see, not the first key in the errors object
      const form = e.currentTarget;
      requestAnimationFrame(() =>
        focusFirstInvalid(form, [
          "call-name",
          "call-phone",
          "call-email",
          "call-about",
          "call-consent",
        ])
      );
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "modal_call",
          name,
          phone,
          email,
          message: about,
          callConsent,
          smsConsent,
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
      <SuccessNote title="Thanks. We'll call you back within 24 hours.">
        Keep your phone handy. If we can&apos;t reach you, we&apos;ll try once
        more and follow up by any other contact detail you shared.
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
          <Label htmlFor="call-name">Name</Label>
          <input
            id="call-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "call-name-err" : undefined}
            className={cn(fieldBase, errors.name && fieldError)}
          />
          {errors.name && <FieldError id="call-name-err">{errors.name}</FieldError>}
        </div>

        <div>
          <Label htmlFor="call-phone">Phone number</Label>
          <input
            id="call-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 000-0000"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "call-phone-err" : undefined}
            className={cn(fieldBase, errors.phone && fieldError)}
          />
          {errors.phone && <FieldError id="call-phone-err">{errors.phone}</FieldError>}
        </div>

        <div>
          <Label htmlFor="call-email" optional>
            Email
          </Label>
          <input
            id="call-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "call-email-err" : "call-email-hint"
            }
            className={cn(fieldBase, errors.email && fieldError)}
          />
          {errors.email ? (
            <FieldError id="call-email-err">{errors.email}</FieldError>
          ) : (
            <p id="call-email-hint" className="text-small mt-2 text-muted-foreground">
              A backup, in case we can&apos;t reach you by phone. We&apos;ll
              confirm the call by email if you add one.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="call-about" optional>
            What&apos;s the project about?
          </Label>
          <textarea
            id="call-about"
            name="about"
            rows={3}
            placeholder="A sentence or two so we come prepared…"
            className={cn(fieldBase, "resize-none")}
          />
        </div>

        {/* TCPA — explicit, SEPARATE consents */}
        <fieldset className="space-y-2.5">
          <legend className="text-small mb-2 block text-muted-foreground">Consent</legend>

          <ConsentCheckbox
            id="call-consent"
            name="callConsent"
            required
            invalid={!!errors.callConsent}
            describedBy={errors.callConsent ? "call-consent-err" : undefined}
          >
            I agree that Codroon may call me at the number provided to discuss
            my inquiry. This consent is for the call-back I&apos;m requesting;
            it isn&apos;t a condition of purchase.
          </ConsentCheckbox>
          {errors.callConsent && (
            <FieldError id="call-consent-err">{errors.callConsent}</FieldError>
          )}

          <ConsentCheckbox id="sms-consent" name="smsConsent">
            I agree that Codroon may send me transactional SMS messages
            (scheduling and follow-ups about this inquiry) at the number
            provided. Message and data rates may apply. Reply STOP to opt out
            at any time. This is optional and not a condition of purchase.
          </ConsentCheckbox>
        </fieldset>

        {status === "error" && (
          <FormError>
            Something went wrong sending that. Please try again, or schedule a
            meeting instead.
          </FormError>
        )}

        <Button type="submit" magnetic={false} disabled={status === "submitting"} className="w-full">
          {status === "submitting" ? "Sending…" : "Request a call back"}
        </Button>
      </div>
    </form>
  );
}

export default CallForm;
