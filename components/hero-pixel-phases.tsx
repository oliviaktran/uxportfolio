import type { CSSProperties } from "react";

/** Single canvas for every phase - stem bottom cell locked at (10,50)→(20,60). */
export const UNIFIED_PHASE_FRAME = { w: 30, h: 60 } as const;

export const PHASE_FRAME = {
  1: UNIFIED_PHASE_FRAME,
  2: UNIFIED_PHASE_FRAME,
  3: UNIFIED_PHASE_FRAME,
} as const;

export type FlowerPhase = 1 | 2 | 3;

type Rect = { x: number; y: number; w: number; h: number; fill: string; o?: number };

/** PRD: yellow #F5C800, red #E8301A, stem #2D8A2D */
const Y = "#f5c800";
const R = "#e8301a";
const G = "#2d8a2d";

/** Phase 1 - bud; bottom green matches P2/P3 stem foot at y=50-60, x=10-20 */
const P1: Rect[] = [
  { x: 10, y: 40, w: 10, h: 10, fill: Y },
  { x: 10, y: 50, w: 10, h: 10, fill: G },
];

/** Phase 2 - original layout shifted down +20 so stem sits on same foot as P3 */
const P2: Rect[] = [
  { x: 10, y: 20, w: 10, h: 10, fill: Y },
  { x: 0, y: 30, w: 10, h: 10, fill: Y },
  { x: 10, y: 30, w: 10, h: 10, fill: R },
  { x: 20, y: 30, w: 10, h: 10, fill: Y },
  { x: 10, y: 40, w: 10, h: 10, fill: Y },
  { x: 10, y: 50, w: 10, h: 10, fill: G },
];

/** Phase 3 - unchanged geometry (already 30×60; bottom stem y=50) */
const P3: Rect[] = [
  { x: 5, y: 15, w: 10, h: 10, fill: Y, o: 0.8 },
  { x: 15, y: 15, w: 10, h: 10, fill: Y, o: 0.8 },
  { x: 15, y: 5, w: 10, h: 10, fill: Y, o: 0.8 },
  { x: 5, y: 5, w: 10, h: 10, fill: Y, o: 0.8 },
  { x: 10, y: 0, w: 10, h: 10, fill: Y },
  { x: 0, y: 10, w: 10, h: 10, fill: Y },
  { x: 10, y: 10, w: 10, h: 10, fill: R },
  { x: 20, y: 10, w: 10, h: 10, fill: Y },
  { x: 10, y: 20, w: 10, h: 10, fill: Y },
  { x: 10, y: 30, w: 10, h: 10, fill: G },
  { x: 10, y: 40, w: 10, h: 10, fill: G },
  { x: 20, y: 40, w: 10, h: 10, fill: G },
  { x: 10, y: 50, w: 10, h: 10, fill: G },
];

/** PRD primary #1A35C5 + lighter tint for cloud cursor */
const CLOUD_LIGHT = "#7b9cff";
const CLOUD_DARK = "#1a35c5";

const CLOUD: Rect[] = [
  { x: 12, y: 0, w: 10, h: 10, fill: CLOUD_LIGHT },
  { x: 22, y: 0, w: 10, h: 10, fill: CLOUD_LIGHT },
  { x: 2, y: 10, w: 10, h: 10, fill: CLOUD_LIGHT },
  { x: 12, y: 10, w: 10, h: 10, fill: CLOUD_LIGHT },
  { x: 22, y: 10, w: 10, h: 10, fill: CLOUD_LIGHT },
  { x: 32, y: 10, w: 10, h: 10, fill: CLOUD_LIGHT },
  { x: 2, y: 42, w: 10, h: 10, fill: CLOUD_DARK },
  { x: 17, y: 42, w: 10, h: 10, fill: CLOUD_DARK },
  { x: 7, y: 26, w: 10, h: 10, fill: CLOUD_DARK },
  { x: 22, y: 26, w: 10, h: 10, fill: CLOUD_DARK },
];

function rectsForPhase(phase: FlowerPhase): Rect[] {
  if (phase === 1) return P1;
  if (phase === 2) return P2;
  return P3;
}

export function PhasePixelSvg({
  phase,
  className,
  style,
}: {
  phase: FlowerPhase;
  className?: string;
  style?: CSSProperties;
}) {
  const { w, h } = UNIFIED_PHASE_FRAME;
  const rects = rectsForPhase(phase);
  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height="100%"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {rects.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill={r.fill}
          fillOpacity={r.o ?? 1}
        />
      ))}
    </svg>
  );
}

const CLOUD_W = 42;
const CLOUD_H = 52;

export function CloudCursorSvg({
  unit = 0.68,
  className,
}: {
  unit?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={CLOUD_W * unit}
      height={CLOUD_H * unit}
      viewBox={`0 0 ${CLOUD_W} ${CLOUD_H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {CLOUD.map((r, i) => (
        <rect
          key={i}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          fill={r.fill}
        />
      ))}
    </svg>
  );
}
