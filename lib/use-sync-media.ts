"use client";

import { useMemo, useSyncExternalStore } from "react";

/** Server + first hydration frame: assume full motion (matches default UI). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Matches previous `useState({ a: 320, b: 192 })` before first resize. */
const SERVER_RADII = "320|192";

function computeEllipseRadiiKey(): string {
  const w = window.innerWidth;
  const reserveRight = w >= 1280 ? 300 : w >= 1024 ? 260 : w >= 640 ? 220 : 180;
  const half = w / 2;
  const maxA = Math.max(120, half - reserveRight - 62);
  const a = Math.min(w * 0.38, 320, maxA);
  const b = Math.min(w * 0.23, 200, a * 0.62);
  return `${Math.round(a)}|${Math.round(b)}`;
}

/**
 * Ellipse semi-axes for the playground gallery. Server snapshot matches the initial
 * client paint so SSR HTML and hydration agree; then it tracks resize.
 */
export function usePlaygroundEllipseRadii(): { a: number; b: number } {
  const key = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      return () => window.removeEventListener("resize", onStoreChange);
    },
    computeEllipseRadiiKey,
    () => SERVER_RADII,
  );

  return useMemo(() => {
    const [as, bs] = key.split("|");
    const a = Number(as) || 320;
    const b = Number(bs) || 192;
    return { a, b };
  }, [key]);
}
