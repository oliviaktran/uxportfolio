"use client";

import { EllipsePhotoGallery } from "@/components/EllipsePhotoGallery";
import {
  siteNavInsetClass,
  siteNavLinkClass,
} from "@/lib/site-nav-styles";
import {
  PLAYGROUND_THEMES,
  type PlaygroundTheme,
} from "@/lib/playground-image-categories";
import { useEffect, useMemo, useState } from "react";

type PlaygroundFilter = "all" | PlaygroundTheme;

type Props = {
  imagesByTheme: Record<PlaygroundTheme, string[]>;
  /** Full gallery (all categories), same balanced order as legacy single ellipse. */
  imagesAll: string[];
};

function firstNonEmptyTheme(
  by: Record<PlaygroundTheme, string[]>,
): PlaygroundTheme {
  for (const t of PLAYGROUND_THEMES) {
    if (by[t].length > 0) return t;
  }
  return "nature";
}

function defaultFilter(
  imagesAll: string[],
  by: Record<PlaygroundTheme, string[]>,
): PlaygroundFilter {
  if (imagesAll.length > 0) return "all";
  return firstNonEmptyTheme(by);
}

export function PlaygroundClient({ imagesByTheme, imagesAll }: Props) {
  const [filter, setFilter] = useState<PlaygroundFilter>(() =>
    defaultFilter(imagesAll, imagesByTheme),
  );

  const images = useMemo(() => {
    if (filter === "all") return imagesAll;
    return imagesByTheme[filter] ?? [];
  }, [filter, imagesAll, imagesByTheme]);

  const [featuredSrc, setFeaturedSrc] = useState<string | null>(
    () => images[0] ?? null,
  );

  useEffect(() => {
    if (images.length === 0) {
      setFeaturedSrc(null);
      return;
    }
    setFeaturedSrc((prev) =>
      prev && images.includes(prev) ? prev : images[0]!,
    );
  }, [images]);

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 md:py-24">
        <div
          className={
            featuredSrc
              ? "-translate-x-6 sm:-translate-x-10 md:-translate-x-14 lg:-translate-x-[4.5rem] xl:-translate-x-24"
              : undefined
          }
        >
          <EllipsePhotoGallery
            images={images}
            durationSec={110}
            featuredSrc={featuredSrc}
            onPickFeatured={setFeaturedSrc}
          />
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 md:bottom-12">
        <div className={siteNavInsetClass}>
          <nav
            className="flex flex-wrap items-center gap-x-[32px] gap-y-3"
            aria-label="Gallery categories"
          >
            <button
              type="button"
              onClick={() => setFilter("all")}
              disabled={imagesAll.length === 0}
              aria-current={filter === "all" ? "page" : undefined}
              className={
                imagesAll.length === 0
                  ? "cursor-not-allowed border-0 bg-transparent p-0 text-left font-mono text-[14px] font-normal uppercase tracking-[0.1em] text-neutral-300"
                  : `${siteNavLinkClass} border-0 bg-transparent p-0 text-left ${filter === "all" ? "text-neutral-800" : ""}`
              }
            >
              all
            </button>
            {PLAYGROUND_THEMES.map((t) => {
              const count = imagesByTheme[t].length;
              const active = filter === t;
              const empty = count === 0;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilter(t)}
                  disabled={empty}
                  aria-current={active ? "page" : undefined}
                  className={
                    empty
                      ? "cursor-not-allowed border-0 bg-transparent p-0 text-left font-mono text-[14px] font-normal uppercase tracking-[0.1em] text-neutral-300"
                      : `${siteNavLinkClass} border-0 bg-transparent p-0 text-left ${active ? "text-neutral-800" : ""}`
                  }
                >
                  {t}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {featuredSrc ? (
        <div className="pointer-events-none absolute inset-x-0 top-8 z-[200]">
          {/*
            Row must stay pointer-events-none: a full-width flex box with default auto
            would sit above the carousel and steal every click in that band.
          */}
          <div
            className={`${siteNavInsetClass} pointer-events-none flex justify-end pt-0`}
          >
            <div
              key={featuredSrc}
              className="playground-featured-preview pointer-events-auto w-[9.5rem] overflow-hidden sm:w-[11.5rem] md:w-[13rem] lg:w-[15.5rem] xl:w-[17rem]"
            >
              <div className="relative aspect-[5/6] w-full overflow-hidden bg-neutral-100 shadow-lg ring-1 ring-neutral-200/80">
                <img
                  src={featuredSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
