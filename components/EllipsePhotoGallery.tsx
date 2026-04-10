"use client";

import {
  usePlaygroundEllipseRadii,
  usePrefersReducedMotion,
} from "@/lib/use-sync-media";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const THUMB_PRESETS: readonly { w: number; h: number }[] = [
  { w: 88, h: 114 },
  { w: 104, h: 104 },
  { w: 96, h: 124 },
  { w: 116, h: 92 },
  { w: 102, h: 122 },
];

/** Degrees per pixel (from pointer-down origin while dragging) */
const TILT_SENS = 0.32;
const MAX_TILT_X = 48;
const MAX_TILT_Y = 56;
/** Default pitch so the ring reads dimensional before any drag */
const DEFAULT_TILT_X = 14;
/** Below this (px) from pointer-down we treat as a tap, not a tilt drag */
const DRAG_THRESHOLD_PX = 10;

/** Delay before nudging visitors about tilt / tap (ms) */
const PLAYGROUND_HINT_DELAY_MS = 3500;

type Props = {
  images: string[];
  /** Full orbit period in seconds */
  durationSec?: number;
  /** Large preview (top-right) — updated when a tile is clicked */
  featuredSrc?: string | null;
  onPickFeatured?: (src: string) => void;
};

/**
 * Orbit position lives in the tilted plane (parent rotateX/Y). Same element applies
 * inverse rotation so each frame stays facing the viewer — you move the ring’s axis,
 * not the photo surface.
 */
function applySlotTransform(
  el: HTMLDivElement,
  i: number,
  n: number,
  a: number,
  b: number,
  phase: number,
  axisTiltX: number,
  axisTiltY: number,
  billboard: boolean,
) {
  const theta = (2 * Math.PI * i) / n - Math.PI / 2 + phase;
  const x = a * Math.cos(theta);
  const y = b * Math.sin(theta);
  const z = Math.round(100 + 80 * Math.sin(theta));
  const t = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`;
  el.style.transform = billboard
    ? `${t} rotateY(${-axisTiltY}deg) rotateX(${-axisTiltX}deg)`
    : t;
  el.style.zIndex = String(z);
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type DragSession = {
  pointerId: number;
  originX: number;
  originY: number;
  startRotX: number;
  startRotY: number;
};

export function EllipsePhotoGallery({
  images,
  durationSec = 120,
  featuredSrc = null,
  onPickFeatured,
}: Props) {
  const { a, b } = usePlaygroundEllipseRadii();
  const radiiRef = useRef({ a, b });
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const interactive = Boolean(onPickFeatured);

  const tiltWrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ rotX: DEFAULT_TILT_X, rotY: 0 });
  /** Last orbit phase so we can resync slot matrices when only axis tilt changes */
  const phaseRef = useRef(0);
  const sessionRef = useRef<DragSession | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [playgroundHintVisible, setPlaygroundHintVisible] = useState(false);
  const playgroundHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const playgroundHintDismissedRef = useRef(false);

  const dismissPlaygroundHint = useCallback(() => {
    if (playgroundHintDismissedRef.current) return;
    playgroundHintDismissedRef.current = true;
    if (playgroundHintTimeoutRef.current) {
      clearTimeout(playgroundHintTimeoutRef.current);
      playgroundHintTimeoutRef.current = null;
    }
    setPlaygroundHintVisible(false);
  }, []);

  const resyncSlotBillboards = useCallback(
    (axisTiltX: number, axisTiltY: number, billboard: boolean) => {
      const n = images.length;
      if (n === 0) return;
      const phase = phaseRef.current;
      const { a: ra, b: rb } = radiiRef.current;
      for (let i = 0; i < n; i++) {
        const slotEl = slotRefs.current[i];
        if (slotEl) {
          applySlotTransform(
            slotEl,
            i,
            n,
            ra,
            rb,
            phase,
            axisTiltX,
            axisTiltY,
            billboard,
          );
        }
      }
    },
    [images.length],
  );

  const applyTiltTransform = useCallback(() => {
    const el = tiltWrapRef.current;
    if (!el) return;
    if (reducedMotion) {
      el.style.transform = "none";
      resyncSlotBillboards(0, 0, false);
      return;
    }
    const { rotX, rotY } = tiltRef.current;
    el.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    resyncSlotBillboards(rotX, rotY, true);
  }, [reducedMotion, resyncSlotBillboards]);

  useEffect(() => {
    applyTiltTransform();
  }, [applyTiltTransform, images.length, reducedMotion]);

  useEffect(() => {
    radiiRef.current = { a, b };
  }, [a, b]);

  useEffect(() => {
    if (images.length === 0) return;
    playgroundHintDismissedRef.current = false;
    const hideId = window.requestAnimationFrame(() => {
      setPlaygroundHintVisible(false);
    });
    if (playgroundHintTimeoutRef.current) {
      clearTimeout(playgroundHintTimeoutRef.current);
      playgroundHintTimeoutRef.current = null;
    }
    playgroundHintTimeoutRef.current = setTimeout(() => {
      playgroundHintTimeoutRef.current = null;
      if (!playgroundHintDismissedRef.current) {
        setPlaygroundHintVisible(true);
      }
    }, PLAYGROUND_HINT_DELAY_MS);
    return () => {
      cancelAnimationFrame(hideId);
      if (playgroundHintTimeoutRef.current) {
        clearTimeout(playgroundHintTimeoutRef.current);
        playgroundHintTimeoutRef.current = null;
      }
    };
  }, [images.length]);

  const slots = useMemo(() => {
    const n = images.length;
    if (n === 0) return [];

    return images.map((src, i) => {
      const theta = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = a * Math.cos(theta);
      const y = b * Math.sin(theta);
      const { w, h } = THUMB_PRESETS[i % THUMB_PRESETS.length];
      const z = Math.round(100 + 80 * Math.sin(theta));
      return { src, x, y, w, h, z, i };
    });
  }, [images, a, b]);

  useEffect(() => {
    const n = images.length;
    if (n === 0) return;
    if (reducedMotion) return;

    const periodMs = durationSec * 1000;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const phase = (((now - start) % periodMs) / periodMs) * 2 * Math.PI;
      phaseRef.current = phase;
      const { a: ra, b: rb } = radiiRef.current;
      const { rotX, rotY } = tiltRef.current;
      for (let i = 0; i < n; i++) {
        const el = slotRefs.current[i];
        if (el) {
          applySlotTransform(el, i, n, ra, rb, phase, rotX, rotY, true);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [images, durationSec, reducedMotion]);

  const onPointerDownCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dismissPlaygroundHint();

      if (reducedMotion) return;
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      /** Never capture on the stage when pressing a tile — capture steals the click target. */
      if (target?.closest("button")) return;

      e.currentTarget.setPointerCapture(e.pointerId);
      sessionRef.current = {
        pointerId: e.pointerId,
        originX: e.clientX,
        originY: e.clientY,
        startRotX: tiltRef.current.rotX,
        startRotY: tiltRef.current.rotY,
      };
      setIsGrabbing(true);
    },
    [dismissPlaygroundHint, reducedMotion],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = sessionRef.current;
      if (!s || s.pointerId !== e.pointerId) return;
      const dx = e.clientX - s.originX;
      const dy = e.clientY - s.originY;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) {
        tiltRef.current.rotX = s.startRotX;
        tiltRef.current.rotY = s.startRotY;
        applyTiltTransform();
        return;
      }
      tiltRef.current.rotX = clamp(
        s.startRotX - dy * TILT_SENS,
        -MAX_TILT_X,
        MAX_TILT_X,
      );
      tiltRef.current.rotY = clamp(
        s.startRotY + dx * TILT_SENS,
        -MAX_TILT_Y,
        MAX_TILT_Y,
      );
      applyTiltTransform();
    },
    [applyTiltTransform],
  );

  const endPointer = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = sessionRef.current;
    if (s && s.pointerId === e.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      sessionRef.current = null;
    }
    setIsGrabbing(false);
  }, []);

  if (images.length === 0) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
        Add photos to{" "}
        <span className="text-neutral-600">public/images/playground</span>
        {" or "}
        <span className="text-neutral-600">public/playground</span>
      </p>
    );
  }

  const perspectiveStyle = reducedMotion
    ? undefined
    : ({ perspective: "min(1100px, 85vw)" } as CSSProperties);

  return (
    <div
      aria-label="Photo carousel — tap a photo to enlarge; drag empty space to tilt the orbit"
      className={`relative mx-auto aspect-square w-[min(90vw,680px)] max-w-full overflow-visible select-none ${
        reducedMotion ? "" : "touch-none cursor-grab"
      } ${!reducedMotion && isGrabbing ? "cursor-grabbing" : ""}`}
      style={
        {
          "--ellipse-duration": `${durationSec}s`,
          ...perspectiveStyle,
        } as CSSProperties
      }
      onPointerDownCapture={onPointerDownCapture}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onLostPointerCapture={endPointer}
    >
      <div
        ref={tiltWrapRef}
        className="absolute inset-0 flex items-center justify-center overflow-visible"
        style={
          reducedMotion
            ? undefined
            : {
                transformStyle: "preserve-3d",
                transformOrigin: "50% 50%",
              }
        }
      >
        {slots.map(({ src, x, y, w, h, z, i }) => {
          const isFeatured = interactive && featuredSrc === src;
          return (
            <div
              key={`${src}-${i}`}
              ref={(el) => {
                slotRefs.current[i] = el;
              }}
              className={`absolute left-1/2 top-1/2 will-change-transform ${
                interactive ? "pointer-events-auto" : "pointer-events-none"
              }`}
              style={{
                transform: reducedMotion
                  ? `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0)`
                  : `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) rotateY(0deg) rotateX(${-DEFAULT_TILT_X}deg)`,
                zIndex: z,
                transformStyle: "preserve-3d",
              }}
            >
              {interactive ? (
                <button
                  type="button"
                  className="group relative block cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-yellow)] focus-visible:ring-offset-2"
                  aria-label="Show large"
                  aria-pressed={isFeatured}
                  onClick={() => onPickFeatured?.(src)}
                >
                  <div
                    className={`relative overflow-hidden bg-neutral-100 shadow-none transition-[box-shadow] duration-200 ${
                      isFeatured
                        ? "ring-2 ring-neutral-800/50 ring-offset-2 ring-offset-white"
                        : "group-hover:ring-2 group-hover:ring-neutral-400/40 group-hover:ring-offset-1 group-hover:ring-offset-white"
                    }`}
                    style={{
                      width: w,
                      height: h,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      width={w}
                      height={h}
                      className="pointer-events-none block h-full w-full object-cover"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                </button>
              ) : (
                <div
                  className="relative overflow-hidden bg-neutral-100 shadow-none"
                  style={{ width: w, height: h }}
                >
                  <img
                    src={src}
                    alt=""
                    width={w}
                    height={h}
                    className="block h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {playgroundHintVisible ? (
        <p
          className={`playground-hint-pop pointer-events-none absolute bottom-3 left-1/2 z-[280] max-w-[min(90%,20rem)] -translate-x-1/2 text-center font-mono text-[11px] font-normal uppercase leading-snug tracking-[0.14em] text-neutral-500 sm:bottom-4 sm:text-[12px] ${
            reducedMotion ? "playground-hint-pop--static" : ""
          }`}
          role="status"
          aria-live="polite"
        >
          {reducedMotion || !interactive ? (
            <>Click me!</>
          ) : (
            <>
              Rotate me :)
              <span className="mx-1.5 text-neutral-400">·</span>
              or click me!
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
