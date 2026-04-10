"use client";

import { HalftoneText } from "@/components/HalftoneText";

function ScrollToWorkLink() {
  return (
    <a
      href="#work"
      className="group inline-flex flex-col items-end gap-3 text-right font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--color-primary)_80%,white)] transition-colors hover:text-[var(--color-primary)]"
    >
      <span>Selected work</span>
      <span className="inline-flex shrink-0" aria-hidden>
        <svg
          className="h-5 w-4 shrink-0 motion-safe:animate-bounce"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v17M19 13l-7 7-7-7" />
        </svg>
      </span>
    </a>
  );
}

export function HomeLandingHero() {
  return (
    <section
      aria-label="Introduction"
      className="flex min-h-dvh flex-col bg-white"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-16">
        <div className="max-w-2xl">
          <HalftoneText />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-[1400px] justify-end px-6 pb-16 md:px-12 md:pb-20 lg:px-16 lg:pb-24">
        <ScrollToWorkLink />
      </div>
    </section>
  );
}
