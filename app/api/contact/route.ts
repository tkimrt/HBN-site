import { contactRecipient, emailConfigured, sendEmail } from "../../../lib/email";
import { recordEmailStatus, saveEnquiry } from "../../../lib/enquiries";

/**
 * Contact form endpoint.
 *
 * The enquiry is written to D1 first and emailed second. If mail is not
 * configured, or the provider is down, the submission is still captured and
 * visible at /admin/enquiries — the visitor is never told it worked when it did
 * not, but a mail outage does not cost HBN the lead.
 */

const MAX = { name: 120, company: 160, email: 200, phone: 60, interest: 80, message: 5000 };

function field(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  // Honeypot: a field hidden from humans. Bots fill it, so accept and discard.
  if (field(payload.website, 100)) {
    return Response.json({ ok: true }, { status: 202 });
  }

  const name = field(payload.name, MAX.name);
  const email = field(payload.email, MAX.email);
  const message = field(payload.message, MAX.message);

  if (!name) return Response.json({ error: "Please add your name." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Please add a valid email address." }, { status: 400 });
  }
  if (!message) return Response.json({ error: "Please add a message." }, { status: 400 });

  const enquiry = {
    name,
    company: field(payload.company, MAX.company),
    email,
    phone: field(payload.phone, MAX.phone),
    interest: field(payload.interest, MAX.interest),
    message,
  };

  let id: number;
  try {
    id = await saveEnquiry(enquiry);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "";
    // Nothing was stored, so do not claim success — the visitor should call.
    return Response.json(
      {
        error:
          detail.includes("no such table") || detail.includes("unavailable")
            ? "The form is not connected yet. Please call 800 823 4344 or email admin@hbnnet.com."
            : "Something went wrong sending that. Please email admin@hbnnet.com.",
      },
      { status: 503 }
    );
  }

  const lines = [
    `Name:     ${enquiry.name}`,
    enquiry.company && `Company:  ${enquiry.company}`,
    `Email:    ${enquiry.email}`,
    enquiry.phone && `Phone:    ${enquiry.phone}`,
    enquiry.interest && `Interest: ${enquiry.interest}`,
    "",
    enquiry.message,
    "",
    "—",
    "Sent from the hbnnet.com contact form.",
  ].filter(Boolean);

  const result = await sendEmail({
    subject: `Website enquiry — ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ""}`,
    text: lines.join("\n"),
    replyTo: enquiry.email,
  });

  try {
    await recordEmailStatus(id, result.status);
  } catch {
    // The enquiry is stored; a status write failure is not worth failing on.
  }

  return Response.json({
    ok: true,
    // Surfaced so the thank-you copy can be honest about what happens next.
    delivered: result.ok,
    recipient: emailConfigured() ? contactRecipient() : null,
  });
}
