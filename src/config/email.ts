/**
 * Email addressing. One place, because the From and the Reply-To are
 * the two things most likely to be wrong in a way nobody notices until a
 * reply disappears.
 *
 * FROM is the sending subdomain (send.codroon.com), which is what gets
 * SPF and DKIM. REPLY_TO is the mailbox a human reads. They are
 * deliberately different addresses.
 *
 * REPLY_TO is set on EVERY send, both categories:
 *   · visitor emails — templates 1 and 3 explicitly invite a reply
 *   · notifications  — replying must reach a person, not the sending
 *     subdomain, which nobody monitors
 *
 * Env overrides exist so a staging deploy can point somewhere harmless
 * without a code change.
 */
export const EMAIL = {
  from: process.env.FROM_EMAIL ?? "Codroon <info@send.codroon.com>",
  replyTo: process.env.REPLY_TO_EMAIL ?? "sales@codroon.com",
  /** where lead notifications land */
  notify: process.env.NOTIFICATION_EMAIL ?? "sales@codroon.com",
} as const;
