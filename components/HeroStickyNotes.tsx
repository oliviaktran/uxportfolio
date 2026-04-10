const NOTE_1 =
  "Olivia designs experiences that feel intuitive and intentional.";
const NOTE_2 =
  "She's currently designing at JPMorgan, exploring new ways of building and supporting the design process.";

export function HeroStickyNotes() {
  return (
    <div className="hero-sticky-cluster pointer-events-none relative mx-auto mt-2 w-full max-w-[min(96vw,660px)] min-h-[min(39vh,390px)] px-1 sm:min-h-[405px] md:min-h-[420px]">
      <span
        aria-hidden
        className="hero-sticky-pin absolute left-[2%] top-[2%] z-0 sm:left-[4%] sm:top-[4%]"
      />
      {/* Stack: red rectangle defines box; yellow square anchors to its bottom-right */}
      <div className="relative mx-auto w-[min(100%,510px)] pb-16 sm:pb-[4.5rem] md:pb-20">
        <div
          className="hero-sticky-primary hero-sticky-interactive hero-sticky-border pointer-events-auto relative z-[1] w-full cursor-default px-[1.875rem] pb-[4.5rem] pt-12 shadow-[7.5px_9px_0_var(--color-sticky-shadow)] sm:px-9 sm:pb-[5.25rem] sm:pt-[3.1875rem]"
        >
          <div
            aria-hidden
            className="absolute left-[1.875rem] right-[1.875rem] top-[0.9375rem] flex gap-[0.75rem] sm:left-[2.25rem] sm:right-[2.25rem] sm:top-[1.125rem] sm:gap-3"
          >
            <span className="hero-sticky-hole" />
            <span className="hero-sticky-hole" />
            <span className="hero-sticky-hole" />
          </div>
          <p className="font-serif-display relative z-[1] max-w-[36ch] text-[1.0125rem] font-normal leading-snug text-[var(--color-white)] sm:text-[1.1625rem] md:text-[1.425rem] md:leading-[1.25]">
            {NOTE_1}
          </p>
        </div>
        {/* Secondary: bottom-right of red note; top pulls it up into the overlap zone */}
        <div
          className="hero-sticky-secondary hero-sticky-interactive hero-sticky-border pointer-events-auto absolute z-[2] right-0 top-[calc(100%-5.25rem)] aspect-square w-[min(100%,min(92vw,285px))] max-w-[min(285px,calc(100%-0.5rem))] shadow-[6px_7.5px_0_var(--color-sticky-shadow)] sm:top-[calc(100%-6.25rem)] sm:w-[min(100%,min(90vw,300px))] sm:max-w-[min(300px,calc(100%-0.5rem))] md:top-[calc(100%-6.75rem)] md:w-[min(min(92vw,315px),calc(100%-1rem))] md:max-w-[min(315px,calc(100%-1rem))]"
        >
          <div className="relative z-[1] flex h-full min-h-0 flex-col justify-center overflow-y-auto overscroll-contain px-[1.125rem] py-6 sm:px-6 sm:py-[1.875rem]">
            <p className="text-[0.8rem] font-normal leading-snug text-[var(--color-primary)] sm:text-[0.825rem] md:text-[0.9rem] md:leading-[1.4]">
              {NOTE_2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
