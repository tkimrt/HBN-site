"use client";

import { useRef, useState, type DragEvent } from "react";
import { Markdown } from "../markdown";
import { ImageField } from "./image-field";
import { CATEGORIES } from "../../content/articles/types";

export type EditorArticle = {
  slug: string;
  title: string;
  kicker: string;
  category: string;
  author: string;
  date: string;
  cover: string;
  pdf: string;
  body: string;
  published: boolean;
};

const EMPTY: EditorArticle = {
  slug: "",
  title: "",
  kicker: "",
  category: "Strategy",
  author: "Al Trellis",
  date: "",
  cover: "",
  pdf: "",
  body: "",
  published: true,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export function ArticleEditor({ initial, mode }: { initial?: EditorArticle; mode: "new" | "edit" }) {
  const [draft, setDraft] = useState<EditorArticle>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "error" | "done"; message: string }>({
    kind: "idle",
    message: "",
  });
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof EditorArticle>(key: K, value: EditorArticle[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const onTitle = (title: string) =>
    setDraft((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));

  async function ingest(file: File) {
    const name = file.name.toLowerCase();
    setStatus({ kind: "busy", message: `Reading ${file.name}…` });

    try {
      if (name.endsWith(".md") || name.endsWith(".markdown") || name.endsWith(".txt")) {
        const text = await file.text();
        setDraft((prev) => ({
          ...prev,
          body: text,
          title: prev.title || file.name.replace(/\.(md|markdown|txt)$/i, ""),
          slug: prev.slug || slugify(file.name.replace(/\.(md|markdown|txt)$/i, "")),
        }));
        setStatus({ kind: "done", message: `Loaded ${file.name}.` });
        return;
      }

      if (name.endsWith(".pdf")) {
        setStatus({ kind: "busy", message: "Extracting text from the PDF…" });
        const { extractPdfText } = await import("./pdf-text");
        const body = await extractPdfText(file);

        setStatus({ kind: "busy", message: "Uploading the PDF for download…" });
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const result = (await response.json()) as { path?: string; error?: string };

        setDraft((prev) => ({
          ...prev,
          body: prev.body || body,
          pdf: result.path ?? prev.pdf,
          title: prev.title || file.name.replace(/\.pdf$/i, ""),
          slug: prev.slug || slugify(file.name.replace(/\.pdf$/i, "")),
        }));

        setStatus(
          response.ok
            ? { kind: "done", message: "Text extracted and PDF attached. Check the body before publishing — extraction is never perfect." }
            : { kind: "error", message: `Text extracted, but the upload failed: ${result.error}. You can still publish without the PDF.` }
        );
        return;
      }

      setStatus({ kind: "error", message: "Drop a .md, .txt or .pdf file." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Could not read that file.",
      });
    }
  }

  async function save() {
    setStatus({ kind: "busy", message: "Saving…" });
    const response = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const result = (await response.json()) as { error?: string; article?: { slug: string } };

    if (!response.ok) {
      setStatus({ kind: "error", message: result.error ?? "Save failed." });
      return;
    }
    setStatus({ kind: "done", message: "Saved." });
    window.location.href = `/articles/${result.article!.slug}`;
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void ingest(file);
  };

  return (
    <div className="editor">
      <div className="editor-form">
        <div
          className={`dropzone ${dragging ? "is-dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInput.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInput.current?.click(); }}
        >
          <strong>Drop an article in</strong>
          <span>PDF, Markdown or plain text. A PDF is attached for download and its text is pulled into the body for you to tidy up.</span>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.md,.markdown,.txt"
            hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void ingest(f); }}
          />
        </div>

        <label>Title
          <input value={draft.title} onChange={(e) => onTitle(e.target.value)} placeholder="What builders can learn from…" />
        </label>

        <label>URL
          <input
            value={draft.slug}
            disabled={mode === "edit"}
            onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
            placeholder="what-builders-can-learn"
          />
          <span className="field-note">/articles/{draft.slug || "…"}</span>
        </label>

        <label>Standfirst
          <textarea
            rows={2}
            value={draft.kicker}
            onChange={(e) => set("kicker", e.target.value)}
            placeholder="One sentence, shown under the title and on the index."
          />
        </label>

        <div className="form-row">
          <label>Category
            <select value={draft.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
          <label>Author
            <input value={draft.author} onChange={(e) => set("author", e.target.value)} />
          </label>
        </div>

        <label>Date
          <input value={draft.date} onChange={(e) => set("date", e.target.value)} placeholder="2026-07 (optional)" />
        </label>

        <ImageField value={draft.cover} onChange={(path) => set("cover", path)} />

        <label>Attached PDF
          <input value={draft.pdf} onChange={(e) => set("pdf", e.target.value)} placeholder="/files/articles/….pdf" />
          <span className="field-note">Set automatically when you drop a PDF above.</span>
        </label>

        <label>Body
          <textarea
            className="editor-body"
            rows={22}
            value={draft.body}
            onChange={(e) => set("body", e.target.value)}
            placeholder={"## A section heading\n\nA paragraph. **Bold** and *italic* work, as do\n\n- bullets\n1. numbered lists\n> pull quotes\n![caption](/path/to/image.jpg)"}
          />
        </label>

        <label className="checkbox-row">
          <input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} />
          Publish immediately (uncheck to save as a draft)
        </label>

        {status.message && <p className={`editor-status is-${status.kind}`}>{status.message}</p>}

        <button className="button button-dark" type="button" onClick={() => void save()} disabled={status.kind === "busy"}>
          {status.kind === "busy" ? "Working…" : draft.published ? "Publish article" : "Save draft"}
          <span aria-hidden="true">↗</span>
        </button>
      </div>

      <aside className="editor-preview">
        <p className="eyebrow">Live preview</p>
        <div className="article-body">
          <h1 className="preview-title">{draft.title || "Untitled"}</h1>
          {draft.kicker && <p className="article-standfirst">{draft.kicker}</p>}
          <div className="article-meta">
            <span>{draft.author}</span>
            <span>{draft.category}</span>
          </div>
          {draft.cover && <div className="article-cover preview-cover"><img src={draft.cover} alt="" /></div>}
          <Markdown body={draft.body} />
        </div>
      </aside>
    </div>
  );
}
