"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }).catch(() => null);
    if (response?.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    const body = await response?.json().catch(() => null);
    setError(body?.error ?? "Could not sign in. Try again.");
    setBusy(false);
  }

  return (
    <form className="editor-form admin-login-form" onSubmit={submit}>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="button button-dark" type="submit" disabled={busy || !password}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
