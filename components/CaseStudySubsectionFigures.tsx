"use client";

/* Case study document PNGs: plain <img> keeps pixel-accurate screenshots sharp (see PortfolioRasterCover). */
/* eslint-disable @next/next/no-img-element -- document figures, fixed dimensions from portfolio-raster-dimensions */

import type { CaseStudySubsectionFigure } from "@/lib/case-studies";
import { dimensionsForPortfolioRaster } from "@/lib/portfolio-raster-dimensions";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Props = { figures: CaseStudySubsectionFigure[] };

export function CaseStudySubsectionFigures({ figures }: Props) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const n = figures.length;
  const current = figures[index];
  const dims = current
    ? dimensionsForPortfolioRaster(current.src)
    : { width: 1, height: 1 };

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % n);
  }, [n]);

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2.5">
        {figures.map((fig, fi) => {
          const d = dimensionsForPortfolioRaster(fig.src);
          return (
            <button
              key={fig.src}
              type="button"
              onClick={() => openAt(fi)}
              aria-label={`Open document viewer, page ${fi + 1} of ${n}: ${fig.alt}`}
              className="group shrink-0 rounded bg-neutral-50 p-1 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400"
            >
              <img
                src={fig.src}
                alt=""
                width={d.width}
                height={d.height}
                className="pointer-events-none block h-20 w-auto max-w-[4.5rem] object-contain object-top sm:h-24 sm:max-w-[5.25rem]"
                loading="lazy"
                decoding="async"
              />
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-neutral-400">
        Click a thumbnail to open the viewer. Use the side arrows or your
        keyboard arrow keys to move between pages.
      </p>

      {open && current ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/88 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <p id={titleId} className="sr-only">
            Interview document, page {index + 1} of {n}
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close viewer"
            className="absolute right-3 top-3 z-[102] rounded-full border border-white/20 bg-neutral-900/80 p-2.5 text-white shadow-lg transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-5 md:top-5"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative flex max-h-[min(90vh,900px)] w-full max-w-4xl flex-col items-center gap-3"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="relative w-full">
              <img
                src={current.src}
                alt={current.alt}
                width={dims.width}
                height={dims.height}
                className="mx-auto max-h-[min(78vh,800px)] w-auto max-w-full object-contain"
              />

              {n > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous page"
                    className="absolute left-1 top-1/2 z-[101] -translate-y-1/2 rounded-full border border-white/15 bg-neutral-900/75 p-2.5 text-white shadow-md transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-2 md:p-3"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next page"
                    className="absolute right-1 top-1/2 z-[101] -translate-y-1/2 rounded-full border border-white/15 bg-neutral-900/75 p-2.5 text-white shadow-md transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-2 md:p-3"
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[13px] font-medium tabular-nums text-white/90">
                {index + 1} / {n}
              </p>
              <p className="max-w-xl text-[12px] leading-relaxed text-white/65">
                {current.alt}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
