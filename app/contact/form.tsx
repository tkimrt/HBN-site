"use client";

import { useState, type FormEvent } from "react";
import { ArrowIcon } from "../components";

const INTERESTS = [
  "Coaching & consulting",
  "Land planning / TINS",
  "Design & renderings",
  "Speaking / 20 Clubs",
  "Home plans",
  "Something else",
];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError("");

    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please email admin@hbnnet.com.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("Could not reach the server. Please email admin@hbnnet.com.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="contact-form contact-sent" role="status">
        <p className="eyebrow">Thank you</p>
        <h2>Message received.</h2>
        <p>
          It has gone to Al and the team at admin@hbnnet.com. You will hear back within a
          business day or two — usually sooner.
        </p>
        <p className="contact-sent-note">
          In a hurry? Call <a href="tel:18008234344">800 823 4344</a>.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <label>Full name
        <input type="text" name="name" autoComplete="name" placeholder="Your name" required />
      </label>
      <label>Company
        <input type="text" name="company" autoComplete="organization" placeholder="Company name" />
      </label>
      <div className="form-row">
        <label>Email
          <input type="email" name="email" autoComplete="email" placeholder="you@company.com" required />
        </label>
        <label>Phone
          <input type="tel" name="phone" autoComplete="tel" placeholder="(555) 555-5555" />
        </label>
      </div>
      <label>I’m interested in
        <select name="interest" defaultValue="">
          <option value="" disabled>Select one</option>
          {INTERESTS.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>Tell us more
        <textarea
          name="message"
          rows={5}
          placeholder="Your market, your business, and the challenge in front of you..."
          required
        />
      </label>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div className="honeypot" aria-hidden="true">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="button button-dark" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"} <ArrowIcon />
      </button>
    </form>
  );
}
