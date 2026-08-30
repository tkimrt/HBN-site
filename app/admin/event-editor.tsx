"use client";

import { useState } from "react";
import { ImageField } from "./image-field";
import { formatEventDate, type SpeakingEvent } from "../../content/events";
import { ArrowIcon } from "../components";

const EMPTY: SpeakingEvent = {
  id: 0,
  name: "",
  title: "",
  summary: "",
  location: "",
  date: "",
  url: "",
  cover: "",
  published: true,
};

export function EventEditor({ initial }: { initial?: SpeakingEvent }) {
  const [draft, setDraft] = useState<SpeakingEvent>(initial ?? EMPTY);
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "error"; message: string }>({
    kind: "idle",
    message: "",
  });

  const set = <K extends keyof SpeakingEvent>(key: K, value: SpeakingEvent[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  async function save() {
    setStatus({ kind: "busy", message: "Saving…" });
    const response = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // id 0 means "new" — the seeded event uses -1 and must also insert fresh.
      body: JSON.stringify({ ...draft, id: draft.id > 0 ? draft.id : undefined }),
    });
    const result = (await response.json()) as { error?: string };
    if (!response.ok) {
      setStatus({ kind: "error", message: result.error ?? "Save failed." });
      return;
    }
    window.location.href = "/admin/events";
  }

  async function remove() {
    if (draft.id <= 0) return;
    setStatus({ kind: "busy", message: "Deleting…" });
    const response = await fetch(`/api/admin/events?id=${draft.id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setStatus({ kind: "error", message: result.error ?? "Delete failed." });
      return;
    }
    window.location.href = "/admin/events";
  }

  return (
    <div className="editor">
      <div className="editor-form">
        <label>Event
          <input
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="PCBC San Diego"
          />
          <span className="field-note">The conference or host organization.</span>
        </label>

        <label>Session title
          <input
            value={draft.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="From Market to Move-In: How AI is Changing Homebuilding"
          />
        </label>

        <label>Summary
          <textarea
            rows={3}
            value={draft.summary}
            onChange={(e) => set("summary", e.target.value)}
            placeholder="What the session covers, and who it is with."
          />
        </label>

        <div className="form-row">
          <label>Date
            <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)} />
            <span className="field-note">
              {draft.date ? formatEventDate(draft.date) : "Drives the upcoming / past split."}
            </span>
          </label>
          <label>Location
            <input
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="San Diego, CA"
            />
          </label>
        </div>

        <label>Registration link
          <input
            value={draft.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://… (optional)"
          />
        </label>

        <ImageField value={draft.cover} onChange={(path) => set("cover", path)} />

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Show on the site
        </label>

        {status.message && <p className={`editor-status is-${status.kind}`}>{status.message}</p>}

        <div className="editor-actions">
          <button className="button button-dark" type="button" onClick={() => void save()} disabled={status.kind === "busy"}>
            {status.kind === "busy" ? "Working…" : "Save event"}
            <ArrowIcon />
          </button>
          {draft.id > 0 && (
            <button className="link-button is-danger" type="button" onClick={() => void remove()}>
              Delete event
            </button>
          )}
        </div>
      </div>

      <aside className="editor-preview">
        <p className="eyebrow">Live preview</p>
        <div className="event-preview">
          {draft.cover && <div className="event-preview-photo"><img src={draft.cover} alt="" /></div>}
          <div className="event-preview-copy">
            <p className="eyebrow light">
              Upcoming{draft.date ? ` · ${formatEventDate(draft.date)}` : ""}
            </p>
            <h2>{draft.name || "Event name"}</h2>
            <h3>{draft.title || "Session title"}</h3>
            {draft.summary && <p>{draft.summary}</p>}
            {draft.location && <p className="event-preview-location">{draft.location}</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
