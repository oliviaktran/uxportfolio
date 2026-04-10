"use client";

import { useCallback, useState } from "react";

const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? "";

export function ContactForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "err">(
    "idle",
  );

  const validateEmail = useCallback((value: string) => {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    setEmailError(ok || !value ? null : "Enter a valid email address");
    return ok;
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const em = String(fd.get("email") ?? "");
    if (!validateEmail(em)) return;

    if (!endpoint.trim()) {
      setStatus("err");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("done");
      form.reset();
      setEmail("");
    } catch {
      setStatus("err");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative z-10 max-w-md space-y-8"
      noValidate
    >
      {!endpoint.trim() ? (
        <p className="text-xs leading-relaxed text-[var(--color-muted)]">
          Set{" "}
          <code className="rounded bg-[var(--color-surface)] px-1">
            NEXT_PUBLIC_FORMSPREE_ENDPOINT
          </code>{" "}
          to your Formspree form URL to enable submissions.
        </p>
      ) : null}
      <div>
        <label
          htmlFor="name"
          className="text-[10px] font-bold uppercase tracking-[0.25em]"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="YOUR NAME"
          className="mt-2 w-full border-0 border-b border-[var(--color-primary)] bg-transparent py-2 text-base text-[var(--color-primary)] placeholder:text-[var(--color-muted)] placeholder:uppercase focus:outline-none focus:ring-0"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="text-[10px] font-bold uppercase tracking-[0.25em]"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          placeholder="EMAIL@DOMAIN.COM"
          className="mt-2 w-full border-0 border-b border-[var(--color-primary)] bg-transparent py-2 text-base text-[var(--color-primary)] placeholder:text-[var(--color-muted)] placeholder:uppercase focus:outline-none focus:ring-0"
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-err" : undefined}
        />
        {emailError ? (
          <p id="email-err" className="mt-1 text-xs text-[var(--color-accent-red)]">
            {emailError}
          </p>
        ) : null}
      </div>
      <div>
        <label
          htmlFor="message"
          className="text-[10px] font-bold uppercase tracking-[0.25em]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="LET'S CHAT..."
          className="mt-2 w-full resize-y border-0 border-b border-[var(--color-primary)] bg-transparent py-2 text-base text-[var(--color-primary)] placeholder:text-[var(--color-muted)] placeholder:uppercase focus:outline-none focus:ring-0"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="border border-[var(--color-primary)] bg-[var(--color-primary)] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send envelope"}
      </button>

      {status === "done" ? (
        <p className="text-sm" role="status">
          Thanks - your message is on its way.
        </p>
      ) : null}
      {status === "err" ? (
        <p className="text-sm text-[var(--color-accent-red)]" role="alert">
          Something went wrong. Try again or email directly.
        </p>
      ) : null}
    </form>
  );
}
