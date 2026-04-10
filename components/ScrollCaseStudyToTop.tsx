"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/** `/work` is the index; case studies are `/work/<slug>`. */
function isCaseStudyPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] === "work" && segments.length >= 2;
}

/**
 * Case study pages were visibly settling scroll after load (router focus/scroll
 * handling). Snap to the top in layout phase so the first paint matches.
 */
export function ScrollCaseStudyToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isCaseStudyPath(pathname)) return;
    const root = document.scrollingElement ?? document.documentElement;
    root.scrollTop = 0;
    root.scrollLeft = 0;
    // Ignore `html { scroll-behavior: smooth }` so the case study doesn’t ease upward after load.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
