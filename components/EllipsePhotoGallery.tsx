"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const THUMB_PRESETS: readonly { w: number; h: number }[] = [
  { w: 52, h: 68 },
  { w: 64, h: 64 },
  { w: 58, h: 76 },
  { w: 70, h: 56 },
  { w: 60, h: 72 },
];

type Props = {
  images: string[];
  /** Full orbit period in seconds */
  durationSec?: number;
};

function useEllipseRadii() {
  const [radii, setRadii] = useState({ a: 240, b: 140 });

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const a = Math.min(w * 0.36, 300);
      const b = Math.min(w * 0.21, 176);
      setRadii({ a, b });
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return radii;
}

function applySlotTransform(
  el: HTMLDivElement,
  i: number,
  n: number,
  a: number,
  b: number,
  phase: number,
) {
  const theta = (2 * Math.PI * i) / n - Math.PI / 2 + phase;
  const x = a * Math.cos(theta);
  const y = b * Math.sin(theta);
  const z = Math.round(100 + 80 * Math.sin(theta));
  el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  el.style.zIndex = String(z);
}

export function EllipsePhotoGallery({
  images,
  durationSec = 120,
}: Props) {
  const { a, b } = useEllipseRadii();
  const radiiRef = useRef({ a, b });
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    radiiRef.current = { a, b };
  }, [a, b]);

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const periodMs = durationSec * 1000;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const phase = (((now - start) % periodMs) / periodMs) * 2 * Math.PI;
      const { a: ra, b: rb } = radiiRef.current;
      for (let i = 0; i < n; i++) {
        const el = slotRefs.current[i];
        if (el) applySlotTransform(el, i, n, ra, rb, phase);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [images, durationSec]);

  if (images.length === 0) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400">
        Drop photos in{" "}
        <span className="text-neutral-600">public/images/images</span>
      </p>
    );
  }

  return (
    <div
      className="relative mx-auto aspect-square w-[min(92vw,560px)] max-w-full overflow-visible"
      style={{ "--ellipse-duration": `${durationSec}s` } as CSSProperties}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        {slots.map(({ src, x, y, w, h, z, i }) => (
          <div
            key={`${src}-${i}`}
            ref={(el) => {
              slotRefs.current[i] = el;
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform"
            style={{
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: z,
            }}
          >
            <div
              className="relative overflow-hidden bg-neutral-100 shadow-none"
              style={{ width: w, height: h }}
            >
              {/* Plain <img>: skips next/image optimizer (large PNG/JPEG often fail or hang in Sharp) */}
              <img
                src={src}
                alt=""
                width={w}
                height={h}
                className="block h-full w-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority={i < 6 ? "high" : "low"}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
