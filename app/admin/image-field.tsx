"use client";

import { useRef, useState, type DragEvent } from "react";

/**
 * Cover image picker: drop or browse to upload into R2, or paste a path to an
 * image that already ships with the site (e.g. /images/art-scale.jpg).
 */
export function ImageField({
  label = "Cover image",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (path: string) => void;
}) {
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setStatus(`Uploading ${file.name}…`);
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const result = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !result.path) {
        setStatus(result.error ?? "Upload failed.");
        return;
      }
      onChange(result.path);
      setStatus("Uploaded.");
    } catch {
      setStatus("Upload failed.");
    }
  }

  return (
    <div className="image-field">
      <span className="image-field-label">{label}</span>
      <div className="image-field-row">
        <div
          className={`image-drop ${dragging ? "is-dragging" : ""}`}
          onDragOver={(e: DragEvent) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) void upload(file);
          }}
          onClick={() => input.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") input.current?.click(); }}
        >
          {value ? <img src={value} alt="" /> : <span>Drop an image<br />or browse</span>}
          <input
            ref={input}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); }}
          />
        </div>
        <div className="image-field-path">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/art-scale.jpg"
          />
          <span className="field-note">
            JPG, PNG or WebP. Or paste the path of an image already on the site.
          </span>
          {value && (
            <button type="button" className="link-button" onClick={() => { onChange(""); setStatus(""); }}>
              Remove
            </button>
          )}
          {status && <span className="field-note">{status}</span>}
        </div>
      </div>
    </div>
  );
}
