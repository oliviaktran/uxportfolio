"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CloudCursorSvg,
  UNIFIED_PHASE_FRAME,
  PhasePixelSvg,
  type FlowerPhase,
} from "@/components/hero-pixel-phases";

/** Base: 30 Figma units wide → 30px at sizeMul 1 (matches prior PixelFlowerMark width scale). */
const PIXEL_UNIT = 1;
/** Total extra size on each axis (was 50px when using 25px per side). */
const SURROUND_TOTAL = 25;
/** How often the “water me :)” hint jumps to another phase 1/2 flower */
const WATER_ME_HOP_MS = 14_000;

export type FloaterConfig = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay: string;
  /** Width multiplier vs 30px baseline (e.g. 28 → 28/30). */
  sizeMul: number;
};

/** Initial phase odds 1 : 1 : 1. */
function randomPhase(): FlowerPhase {
  return (Math.floor(Math.random() * 3) + 1) as FlowerPhase;
}

function eligibleIndices(phases: FlowerPhase[]): number[] {
  return phases.flatMap((p, i) => (p === 1 || p === 2 ? [i] : []));
}

/** Same pixel footprint every phase - stem foot stays fixed in SVG + layout. */
function hitSize(sizeMul: number) {
  const { w, h } = UNIFIED_PHASE_FRAME;
  const u = PIXEL_UNIT * sizeMul;
  const visW = w * u;
  const visH = h * u;
  return {
    hitW: visW + SURROUND_TOTAL,
    hitH: visH + SURROUND_TOTAL,
    visW,
    visH,
  };
}

type FlowerInstanceProps = {
  config: FloaterConfig;
  phase: FlowerPhase;
  ready: boolean;
  showWaterMe: boolean;
  waterMeTick: number;
  onAdvancePhase: () => void;
};

function FlowerInstance({
  config,
  phase,
  ready,
  showWaterMe,
  waterMeTick,
  onAdvancePhase,
}: FlowerInstanceProps) {
  const [hovering, setHovering] = useState(false);
  const [cloudPos, setCloudPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [showCompleteShine, setShowCompleteShine] = useState(false);
  const prevPhaseRef = useRef<FlowerPhase>(phase);

  useEffect(() => {
    const prev = prevPhaseRef.current;
    if (prev === 2 && phase === 3) {
      const startId = requestAnimationFrame(() => {
        setShowCompleteShine(true);
      });
      const endId = window.setTimeout(() => setShowCompleteShine(false), 950);
      prevPhaseRef.current = phase;
      return () => {
        cancelAnimationFrame(startId);
        window.clearTimeout(endId);
      };
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const { hitW, hitH, visW, visH } = hitSize(config.sizeMul);
  const showCloud =
    hovering && (phase === 1 || phase === 2) && cloudPos;

  const cloudUnit = 0.68 * config.sizeMul;

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (phase === 3) return;
      setCloudPos({ x: e.clientX, y: e.clientY });
    },
    [phase],
  );

  const onEnter = useCallback(
    (e: React.MouseEvent) => {
      setHovering(true);
      if (phase === 1 || phase === 2) {
        setCloudPos({ x: e.clientX, y: e.clientY });
      }
    },
    [phase],
  );

  const onLeave = useCallback(() => {
    setHovering(false);
    setCloudPos(null);
  }, []);

  const onClick = useCallback(() => {
    onAdvancePhase();
  }, [onAdvancePhase]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onClick();
    },
    [onClick],
  );

  const stylePos = useMemo(
    () => ({
      top: config.top,
      left: config.left,
      right: config.right,
      bottom: config.bottom,
      animationDelay: config.delay,
    }),
    [config],
  );

  const showHint = showWaterMe && (phase === 1 || phase === 2);

  return (
    <>
      <div
        className="animate-flower-float pointer-events-auto absolute z-0 transition-opacity duration-150"
        style={{ ...stylePos, opacity: ready ? 0.7 : 0 }}
      >
        <div
          role={phase < 3 ? "button" : undefined}
          tabIndex={phase < 3 ? 0 : undefined}
          aria-label={
            phase < 3
              ? `Decorative pixel flower, phase ${phase}. Activate to grow.`
              : "Decorative pixel flower, full bloom."
          }
          className="relative flex cursor-default items-end justify-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-yellow)] focus-visible:ring-offset-2"
          style={{
            width: hitW,
            height: hitH,
            cursor: showCloud ? "none" : undefined,
          }}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onMouseMove={onMove}
          onClick={onClick}
          onKeyDown={onKeyDown}
        >
          <div className="flex w-max max-w-full flex-col items-center justify-end">
            {showHint ? (
              <p
                key={waterMeTick}
                className="water-me-hint pointer-events-none z-10 mb-[12px] w-max text-center text-[10px] font-bold tracking-wide text-[var(--color-primary)]"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.95)" }}
              >
                water me :)
              </p>
            ) : null}
            <div
              className="relative shrink-0 overflow-hidden"
              style={{ width: visW, height: visH }}
            >
            <div key={phase} className="flower-phase-pop relative z-0 h-full w-full">
              <PhasePixelSvg phase={phase} className="block h-full w-full" />
            </div>
            {phase === 3 && showCompleteShine ? (
              <div
                className="flower-complete-shine pointer-events-none absolute inset-0 z-[2]"
                aria-hidden
              />
            ) : null}
            </div>
          </div>
        </div>
      </div>
      {showCloud && cloudPos ? (
        <div
          className="pointer-events-none fixed z-[200]"
          style={{
            left: cloudPos.x,
            top: cloudPos.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <CloudCursorSvg unit={cloudUnit} />
        </div>
      ) : null}
    </>
  );
}

export function HeroFloatingFlowers({ floaters }: { floaters: FloaterConfig[] }) {
  const n = floaters.length;
  const [phases, setPhases] = useState<FlowerPhase[]>(() =>
    Array.from({ length: n }, () => 1),
  );
  const [ready, setReady] = useState(false);
  const [waterMeIndex, setWaterMeIndex] = useState<number | null>(null);
  const [waterMeTick, setWaterMeTick] = useState(0);
  const phasesRef = useRef(phases);
  phasesRef.current = phases;

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const next = floaters.map(() => randomPhase());
      setPhases(next);
      const eligible = eligibleIndices(next);
      if (eligible.length > 0) {
        setWaterMeIndex(eligible[Math.floor(Math.random() * eligible.length)]);
      }
      setReady(true);
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only init once per count; floaters[] is new ref from parent each render
  }, [n]);

  useEffect(() => {
    setWaterMeIndex((idx) => {
      if (idx === null) return null;
      if (phases[idx] === 1 || phases[idx] === 2) return idx;
      const eligible = eligibleIndices(phases);
      if (eligible.length === 0) return null;
      const others = eligible.filter((i) => i !== idx);
      const pool = others.length > 0 ? others : eligible;
      return pool[Math.floor(Math.random() * pool.length)];
    });
  }, [phases]);

  useEffect(() => {
    if (!ready) return;
    const hop = () => {
      const p = phasesRef.current;
      const eligible = eligibleIndices(p);
      if (eligible.length === 0) {
        setWaterMeIndex(null);
        setWaterMeTick((t) => t + 1);
        return;
      }
      setWaterMeIndex((prev) => {
        if (eligible.length === 1) return eligible[0];
        let next = eligible[Math.floor(Math.random() * eligible.length)];
        if (prev !== null) {
          let guard = 0;
          while (next === prev && guard++ < 20) {
            next = eligible[Math.floor(Math.random() * eligible.length)];
          }
        }
        return next;
      });
      setWaterMeTick((t) => t + 1);
    };
    const id = window.setInterval(hop, WATER_ME_HOP_MS);
    return () => window.clearInterval(id);
  }, [ready]);

  const advancePhase = useCallback((index: number) => {
    setPhases((prev) => {
      const next = [...prev];
      const p = next[index];
      if (p === 1) next[index] = 2;
      else if (p === 2) next[index] = 3;
      return next;
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {floaters.map((f, i) => (
        <FlowerInstance
          key={i}
          config={f}
          phase={phases[i] ?? 1}
          ready={ready}
          showWaterMe={waterMeIndex === i}
          waterMeTick={waterMeTick}
          onAdvancePhase={() => advancePhase(i)}
        />
      ))}
    </div>
  );
}
