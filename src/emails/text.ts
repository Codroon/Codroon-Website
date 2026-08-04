import type { EstimateEmailProps } from "./EstimateEmail";

/**
 * Hand-written text/plain parts for the three visitor templates.
 *
 * Not generated from the components: a renderer flattens the breakdown
 * table by dropping the gap between the two columns, so the ledger came
 * out as "Agent core and reasoning loop$7,200". The text part is a real
 * deliverable — for the recipients who read mail as text, and for the
 * filters that treat a missing or mangled text part as a spam signal —
 * so it is written rather than derived.
 *
 * Lines stay under about 65 characters, which is what a phone shows
 * without wrapping mid-thought.
 */

/** "name .......... figure", padded to a fixed column. */
function ledgerLine(name: string, figure: string, width = 46): string {
  const trimmed = name.length > width - 2 ? `${name.slice(0, width - 3)}…` : name;
  return trimmed + " ".repeat(Math.max(2, width - trimmed.length)) + figure;
}

export function estimateText(p: EstimateEmailProps): string {
  const head = p.aboveCeiling
    ? `YOUR ESTIMATE

Above the ceiling

What you configured came out beyond what a six-answer
estimator can price honestly, so we have not put a number
on it. A build that size deserves a conversation rather
than a guess.`
    : `YOUR ESTIMATE

${p.range}
${p.timeline} to build${p.runCost ? ` · ${p.runCost} a month to run` : ""}`;

  const configured = p.configured ? `\n\n${p.configured}` : "";

  const breakdown = p.ledger.length
    ? `\n\nWHAT'S IN IT\n${p.ledger.map((l) => ledgerLine(l.label, l.figure)).join("\n")}`
    : "";

  return `${head}${configured}${breakdown}

The full breakdown is on the page, along with the list of
what you could cut to bring the number down and what each
cut saves.

View your estimate:
${p.shareUrl}

The link stays live, so you can come back to it or send it
to whoever else needs to see it. If you would rather talk
it through, just reply to this email.
`;
}

export function ackEmailText(firstName: string | null, estimatorUrl: string): string {
  return `${firstName ? `GOT IT, ${firstName.toUpperCase()}.` : "GOT IT."}

Your message has landed. We will read it properly rather
than skim it, and reply within one working day. If talking
would be quicker than typing, the reply will include a
booking link.

WHILE YOU WAIT

Our estimator gives you a build range and a timeline in
about three minutes. No email required to see the number,
and nothing you enter there commits you to anything.

Estimate your build:
${estimatorUrl}

You are getting this because you asked us to send it. It is
a one-off, and we have not added you to anything.
`;
}

export function ackCallText(phone: string, bookingUrl: string): string {
  return `WE'LL CALL YOU.

Within 24 hours, on ${phone}.

If that number is wrong, or a different time suits you
better, just reply to this email and we will sort it out.

WANT TO SKIP THE WAIT?

Pick a slot that works for you and we will call then
instead.

Book a time:
${bookingUrl}

You are getting this because you asked us to call. It is a
one-off, not a list.
`;
}
