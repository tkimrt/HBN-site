/**
 * Outbound email for contact-form notifications.
 *
 * Delivery is best-effort and never blocks a submission: the enquiry is already
 * stored in D1 by the time this runs, and the returned status is recorded
 * alongside it. With no provider configured this reports "skipped" rather than
 * failing, so the form keeps working before mail is set up.
 *
 * Configure via Vercel environment variables (a `.env` locally):
 *   RESEND_API_KEY   from https://resend.com — the only required value
 *   CONTACT_TO       defaults to admin@hbnnet.com
 *   CONTACT_FROM     defaults to website@hbnnet.com; the domain must be
 *                    verified with the provider or sends will be rejected
 */

export const DEFAULT_CONTACT_TO = "admin@hbnnet.com";

function setting(key: string): string {
  return (process.env[key] ?? "").trim();
}

export function contactRecipient(): string {
  return setting("CONTACT_TO") || DEFAULT_CONTACT_TO;
}

export function emailConfigured(): boolean {
  return Boolean(setting("RESEND_API_KEY"));
}

export type EmailResult = { status: string; ok: boolean };

export async function sendEmail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<EmailResult> {
  const key = setting("RESEND_API_KEY");
  if (!key) {
    return { ok: false, status: "skipped" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: setting("CONTACT_FROM") || "Home Builders Network <website@hbnnet.com>",
        to: [contactRecipient()],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 200);
      return { ok: false, status: `failed: ${response.status} ${detail}` };
    }
    return { ok: true, status: "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return { ok: false, status: `failed: ${message}` };
  }
}
