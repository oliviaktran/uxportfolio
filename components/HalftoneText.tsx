"use client";

import { usePrefersReducedMotion } from "@/lib/use-sync-media";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const PHRASES = [
  "empathy",
  "real people in mind",
  "curiosity as a compass",
  "intention behind every pixel",
  "AI as a creative partner",
  "heart",
] as const;

const STEP = 2.5;
const PAD = STEP * 4;
const FONT_PX_MIN = 22;
const FONT_PX_MAX = 40;

function hLogicFor(fontPx: number): number {
  return fontPx + PAD;
}
/** Site primary (PRD) - matches --color-primary */
const DOT_COLOR = "#1a35c5";
/** Matches --color-accent-red */
const HEART_DOT_COLOR = "#e8301a";

function phraseDotColor(phrase: string): string {
  return phrase === "heart" ? HEART_DOT_COLOR : DOT_COLOR;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function lerpColor(a: string, b: string, t: number): string {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const bl = Math.round(A.b + (B.b - A.b) * t);
  return `rgb(${r},${g},${bl})`;
}
const MONO_STACK =
  'ui-monospace, "Cascadia Code", "SFMono-Regular", "Courier New", monospace';

function offscreenFont(fontPx: number): string {
  return `800 ${fontPx}px ${MONO_STACK}`;
}

/** Ignore near-white samples (background + antialias fringe). Mask is black ink on white - not alpha. */
const INK_SKIP = 0.08;
/**
 * AM halftone: at full ink (black), dot radius is 0.85× half the cell.
 * Ink comes from luminance (black text vs white ground), not canvas alpha - both are opaque.
 */
const RADIUS_SCALE = 0.85;
const MAX_RADIUS_LOGICAL = (STEP / 2) * RADIUS_SCALE;
const MORPH_MS = 900;
const CYCLE_MS = 2500;

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function measureTextWidth(phrase: string, fontPx: number): number {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (!ctx) return 100;
  ctx.font = offscreenFont(fontPx);
  return ctx.measureText(phrase).width;
}

/** Canonical heart in design space (~110×95); symmetric bezier silhouette */
const HEART_DESIGN_W = 110;
const HEART_DESIGN_H = 95;
/** Vertical midpoint of path (design Y from ~25-120) */
const HEART_PATH_CY = 72.5;

function fillHeartPath(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  ctx.moveTo(75, 40);
  ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
  ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
  ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
  ctx.closePath();
  ctx.fill();
}

function drawHeartMaskInk(
  ctx: CanvasRenderingContext2D,
  logicalW: number,
  logicalH: number,
  fontPx: number
): void {
  const availW = logicalW - PAD;
  const availH = logicalH - PAD;
  const scale = Math.min(availW / HEART_DESIGN_W, availH / HEART_DESIGN_H) * 0.94;
  const ox = PAD / 2;
  const padY = (logicalH - fontPx) / 2;
  const textCenterY = padY + fontPx * 0.48;
  const oy = textCenterY - HEART_PATH_CY * scale;

  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  fillHeartPath(ctx);
  ctx.restore();
}

/** Text only on offscreen canvas - never used as visible output. */
function renderTextMask(
  phrase: string,
  logicalW: number,
  logicalH: number,
  dpr: number,
  fontPx: number
): ImageData {
  const wPhys = Math.max(1, Math.round(logicalW * dpr));
  const hPhys = Math.max(1, Math.round(logicalH * dpr));
  const c = document.createElement("canvas");
  c.width = wPhys;
  c.height = hPhys;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return new ImageData(wPhys, hPhys);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, logicalW, logicalH);
  ctx.fillStyle = "#000000";
  if (phrase === "heart") {
    drawHeartMaskInk(ctx, logicalW, logicalH, fontPx);
  } else {
    ctx.font = offscreenFont(fontPx);
    ctx.textBaseline = "alphabetic";
    const padX = PAD / 2;
    const padY = (logicalH - fontPx) / 2;
    const baseline = padY + fontPx * 0.82;
    ctx.fillText(phrase, padX, baseline);
  }
  return ctx.getImageData(0, 0, wPhys, hPhys);
}

const K3 = [1, 2, 1, 2, 4, 2, 1, 2, 1];

/** Luminance 0-1 (white=1, black=0) */
function lumaAt(data: Uint8ClampedArray, wPhys: number, x: number, y: number): number {
  const i = (y * wPhys + x) * 4;
  const r = data[i]!;
  const g = data[i + 1]!;
  const b = data[i + 2]!;
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/** Weighted 3×3 on ink (1 − luma) so letterforms resolve */
function sampleInk(
  data: Uint8ClampedArray,
  wPhys: number,
  hPhys: number,
  px: number,
  py: number
): number {
  const ix = Math.floor(px);
  const iy = Math.floor(py);
  let sum = 0;
  let wsum = 0;
  let ki = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const wt = K3[ki]!;
      ki++;
      const x = ix + dx;
      const y = iy + dy;
      if (x < 0 || y < 0 || x >= wPhys || y >= hPhys) continue;
      const ink = 1 - lumaAt(data, wPhys, x, y);
      sum += ink * wt;
      wsum += wt;
    }
  }
  return wsum > 0 ? sum / wsum : 0;
}

function radiusFromInk(ink: number, dpr: number): number {
  if (ink < INK_SKIP) return 0;
  return ink * MAX_RADIUS_LOGICAL * dpr;
}

/** Visible canvas: circles only - no fillText. */
function drawHalftoneFrame(
  ctx: CanvasRenderingContext2D,
  dataFrom: Uint8ClampedArray,
  dataTo: Uint8ClampedArray,
  wPhys: number,
  hPhys: number,
  dpr: number,
  tMorph: number | null,
  colorFrom: string,
  colorTo: string
) {
  const step = STEP * dpr;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, wPhys, hPhys);
  const eased = tMorph == null ? 1 : easeInOutQuad(tMorph);
  ctx.fillStyle =
    tMorph == null ? colorTo : lerpColor(colorFrom, colorTo, eased);

  for (let py = step * 0.5; py < hPhys; py += step) {
    for (let px = step * 0.5; px < wPhys; px += step) {
      const a0 = sampleInk(dataFrom, wPhys, hPhys, px, py);
      const a1 = sampleInk(dataTo, wPhys, hPhys, px, py);
      const r0 = radiusFromInk(a0, dpr);
      const r1 = radiusFromInk(a1, dpr);
      const r = tMorph == null ? r1 : r0 + (r1 - r0) * eased;
      if (r < 0.01) continue;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function fontPxFromWidth(width: number): number {
  if (!Number.isFinite(width) || width <= 0) return FONT_PX_MAX;
  return Math.min(
    FONT_PX_MAX,
    Math.max(FONT_PX_MIN, Math.round(width * 0.09)),
  );
}

export function HalftoneText() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const morphRef = useRef<{
    fromData: ImageData;
    toData: ImageData;
    wLogic: number;
    hLogic: number;
    start: number;
    fromColor: string;
    toColor: string;
  } | null>(null);
  const rafRef = useRef(0);
  const dwellTimeoutRef = useRef<number | null>(null);
  const startMorphRef = useRef<(from: string, to: string) => void>(() => {});
  const runMorphFrameRef = useRef<(now: number) => void>(() => {});

  const [displayPhrase, setDisplayPhrase] = useState<string>(PHRASES[0]);
  const [fontPx, setFontPx] = useState(FONT_PX_MAX);
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionOk = !prefersReducedMotion;

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.getBoundingClientRect().width;
      const next = fontPxFromWidth(w);
      setFontPx((prev) => (prev === next ? prev : next));
    });
    ro.observe(el);
    const w = el.getBoundingClientRect().width;
    setFontPx(fontPxFromWidth(w));
    return () => ro.disconnect();
  }, []);

  const clearDwellTimeout = useCallback(() => {
    if (dwellTimeoutRef.current) {
      clearTimeout(dwellTimeoutRef.current);
      dwellTimeoutRef.current = null;
    }
  }, []);

  const stopRaf = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const paintStatic = useCallback(
    (phrase: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio ?? 1, 3);
      const hLog = hLogicFor(fontPx);
      const textW = measureTextWidth(phrase, fontPx);
      const logicalW = textW + PAD;
      const wPhys = Math.round(logicalW * dpr);
      const hPhys = Math.round(hLog * dpr);

      const mask = renderTextMask(phrase, logicalW, hLog, dpr, fontPx);
      canvas.width = wPhys;
      canvas.height = hPhys;
      canvas.style.width = `${logicalW}px`;
      canvas.style.height = `${hLog}px`;
      canvas.style.maxWidth = "100%";

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const c = phraseDotColor(phrase);
      drawHalftoneFrame(ctx, mask.data, mask.data, wPhys, hPhys, dpr, null, c, c);
    },
    [fontPx]
  );

  const scheduleNextMorphAfterDwell = useCallback(() => {
    clearDwellTimeout();
    dwellTimeoutRef.current = window.setTimeout(() => {
      dwellTimeoutRef.current = null;
      if (morphRef.current) return;
      const i = indexRef.current;
      startMorphRef.current(
        PHRASES[i]!,
        PHRASES[(i + 1) % PHRASES.length]!
      );
    }, CYCLE_MS);
  }, [clearDwellTimeout]);

  const runMorphFrame = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const job = morphRef.current;
    if (!canvas || !job) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 3);
    const { fromData, toData, wLogic, hLogic, start, fromColor, toColor } =
      job;
    const wPhys = Math.round(wLogic * dpr);
    const hPhys = Math.round(hLogic * dpr);
    const elapsed = now - start;
    const t = Math.min(1, elapsed / MORPH_MS);

    canvas.width = wPhys;
    canvas.height = hPhys;
    canvas.style.width = `${wLogic}px`;
    canvas.style.height = `${hLogic}px`;
    canvas.style.maxWidth = "100%";

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    drawHalftoneFrame(
      ctx,
      fromData.data,
      toData.data,
      wPhys,
      hPhys,
      dpr,
      t,
      fromColor,
      toColor
    );

    if (t < 1) {
      rafRef.current = requestAnimationFrame((t) =>
        runMorphFrameRef.current(t),
      );
    } else {
      morphRef.current = null;
      const nextIdx = (indexRef.current + 1) % PHRASES.length;
      indexRef.current = nextIdx;
      const nextPhrase = PHRASES[nextIdx]!;
      setDisplayPhrase(nextPhrase);
      paintStatic(nextPhrase);
      scheduleNextMorphAfterDwell();
    }
  }, [paintStatic, scheduleNextMorphAfterDwell]);

  const startMorph = useCallback(
    (fromPhrase: string, toPhrase: string) => {
      clearDwellTimeout();
      const dpr = Math.min(window.devicePixelRatio ?? 1, 3);
      const hLog = hLogicFor(fontPx);
      const wFrom = measureTextWidth(fromPhrase, fontPx) + PAD;
      const wTo = measureTextWidth(toPhrase, fontPx) + PAD;
      const wLogic = Math.max(wFrom, wTo);

      const fromData = renderTextMask(fromPhrase, wLogic, hLog, dpr, fontPx);
      const toData = renderTextMask(toPhrase, wLogic, hLog, dpr, fontPx);

      morphRef.current = {
        fromData,
        toData,
        wLogic,
        hLogic: hLog,
        start: performance.now(),
        fromColor: phraseDotColor(fromPhrase),
        toColor: phraseDotColor(toPhrase),
      };
      stopRaf();
      rafRef.current = requestAnimationFrame((t) =>
        runMorphFrameRef.current(t),
      );
    },
    [stopRaf, clearDwellTimeout, fontPx]
  );

  useEffect(() => {
    startMorphRef.current = startMorph;
  }, [startMorph]);

  useEffect(() => {
    runMorphFrameRef.current = runMorphFrame;
  }, [runMorphFrame]);

  useLayoutEffect(() => {
    morphRef.current = null;
    stopRaf();
    clearDwellTimeout();
    paintStatic(PHRASES[indexRef.current]!);
  }, [fontPx, paintStatic, stopRaf, clearDwellTimeout]);

  useEffect(() => {
    if (!motionOk) {
      stopRaf();
      morphRef.current = null;
      clearDwellTimeout();
      paintStatic(PHRASES[indexRef.current]!);
      return;
    }
    scheduleNextMorphAfterDwell();
    return () => {
      clearDwellTimeout();
      stopRaf();
    };
  }, [
    motionOk,
    paintStatic,
    stopRaf,
    clearDwellTimeout,
    scheduleNextMorphAfterDwell,
  ]);

  useEffect(
    () => () => {
      clearDwellTimeout();
      stopRaf();
    },
    [clearDwellTimeout, stopRaf]
  );

  const heroMonoClass =
    "font-mono tracking-tight text-[var(--color-primary)] text-[clamp(1.375rem,4.5vw+0.5rem,2.5rem)]";

  return (
    <div ref={measureRef} className="max-w-full font-bold text-[var(--color-primary)]">
      <p className={`${heroMonoClass} leading-[1.35]`}>Hi, im olivia</p>
      <div
        className={`${heroMonoClass} mt-4 flex max-w-full flex-col items-start gap-2 leading-none sm:mt-5 sm:flex-row sm:flex-wrap sm:items-baseline md:flex-nowrap md:items-center`}
      >
        <span className="shrink-0 whitespace-pre">I design with </span>
        <span className="relative min-w-0 shrink leading-none">
          <span className="sr-only" aria-live="polite">
            {displayPhrase}
          </span>
          <canvas
            ref={canvasRef}
            className="block align-middle"
            style={{ verticalAlign: "middle" }}
            aria-hidden
            suppressHydrationWarning
          />
        </span>
      </div>
    </div>
  );
}
