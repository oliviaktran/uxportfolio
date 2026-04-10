"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

/**
 * After hydration, mirrors `(prefers-reduced-motion: reduce)`.
 * Before mount, always `false` so SSR + first client paint match (avoids hydration mismatch).
 */
export function usePrefersReducedMotion(): boolean {
  const mqMatches = useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return hydrated && mqMatches;
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
 * Ellipse semi-axes for the playground gallery. Until hydrated, uses a fixed
 * server key so inline positions match SSR; then tracks `resize`.
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
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHydrated(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const stableKey = hydrated ? key : SERVER_RADII;

  return useMemo(() => {
    const [as, bs] = stableKey.split("|");
    const a = Number(as) || 320;
    const b = Number(bs) || 192;
    return { a, b };
  }, [stableKey]);
}
