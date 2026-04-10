import Link from "next/link";

export type CaseStudyHomeAccent =
  | "default"
  | "whats-cooking"
  | "impact"
  | "bump";

const accentClass: Record<CaseStudyHomeAccent, string> = {
  default: "text-[#543722] hover:opacity-80 focus-visible:ring-[#543722]/40",
  "whats-cooking":
    "text-[var(--color-whats-cooking-primary-red)] hover:opacity-80 focus-visible:ring-[var(--color-whats-cooking-primary-red)]/40",
  impact: "text-[#2863C4] hover:opacity-80 focus-visible:ring-[#2863C4]/40",
  bump: "text-[#FFA2C5] hover:opacity-80 focus-visible:ring-[#FFA2C5]/40",
};

export function CaseStudyHomeLink({ accent }: { accent: CaseStudyHomeAccent }) {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-4 md:px-10 md:pt-5">
      <Link
        href="/"
        className={`inline-flex items-center gap-2 rounded-sm font-mono text-[13px] font-normal uppercase tracking-[0.1em] outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-offset-2 ${accentClass[accent]}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 shrink-0 -translate-x-px"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M11.78 4.22a.75.75 0 0 1 0 1.06L7.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd"
          />
        </svg>
        Home
      </Link>
    </div>
  );
}
