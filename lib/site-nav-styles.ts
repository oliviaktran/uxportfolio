/** Matches header “OLIVIA TRAN” / primary nav link typography (no hover). */
export const siteNavTypographyClass =
  "font-mono text-[14px] font-normal uppercase tracking-[0.1em] text-neutral-500";

/** Primary nav links (Work, Playground, About) + home name hover. */
export const siteNavLinkClass =
  `${siteNavTypographyClass} transition-colors hover:text-neutral-700`;

/** Horizontal alignment with `SiteNav` inner row on wide viewports. */
export const siteNavInsetClass =
  "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-16";
