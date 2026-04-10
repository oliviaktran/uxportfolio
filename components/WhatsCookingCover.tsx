"use client";

import { useEffect, useState } from "react";

/**
 * Figma layout (2563×1441). Cube starts centered, drifts left as X + title appear.
 * Title types word-by-word (chars within each word). Cube: Cursor CUBE_25D.
 */
const FIGMA_W = 2563;
const FIGMA_H = 1441;
const INK = "#faf8f6";

/** Must match `wc-cover-title-cycle` duration in globals.css */
const COVER_CYCLE_MS = 13_000;
/** When title is fully visible in the keyframe timeline (~33%) */
const TITLE_TYPE_START_MS = 0.33 * COVER_CYCLE_MS;

const WORD1 = "What's";
const WORD2 = "Cooking?";
const CHAR_MS = 52;
const BETWEEN_WORDS_MS = 200;

/** Final cube position (must match `wc-cover-cube-drift` end state in globals.css). */
const CUBE_LEFT_FINAL = 537;
const CUBE_W = 466.73;
const X_LEFT = 1220;
const X_W = 122;

const cubeCenterX = CUBE_LEFT_FINAL + CUBE_W / 2;
const xCenterX = X_LEFT + X_W / 2;
const titleCenterX = xCenterX + (xCenterX - cubeCenterX);

const TITLE_FONT_SIZE = 132;
const TITLE_LINE_STEP = Math.round(TITLE_FONT_SIZE * 1.06);
const TITLE_BLOCK_MID_Y = 720;

const FACES = [
  {
    className: "cursor-cube-shard cursor-cube-shard--0",
    fill: "#756a68",
    d: "M233.37,266.66l231.16,133.46c-1.42,2.46-3.48,4.56-6.03,6.03l-216.06,124.74c-5.61,3.24-12.53,3.24-18.14,0L8.24,406.15c-2.55-1.47-4.61-3.57-6.03-6.03l231.16-133.46h0Z",
  },
  {
    className: "cursor-cube-shard cursor-cube-shard--1",
    fill: "#5a504e",
    d: "M233.37,0v266.66L2.21,400.12c-1.42-2.46-2.21-5.3-2.21-8.24v-250.44c0-5.89,3.14-11.32,8.24-14.27L224.29,2.43c2.81-1.62,5.94-2.43,9.07-2.43h.01Z",
  },
  {
    className: "cursor-cube-shard cursor-cube-shard--2",
    fill: "#484240",
    d: "M464.52,133.2c-1.42-2.46-3.48-4.56-6.03-6.03L242.43,2.43c-2.8-1.62-5.93-2.43-9.06-2.43v266.66l231.16,133.46c1.42-2.46,2.21-5.3,2.21-8.24v-250.44c0-2.95-.78-5.77-2.21-8.24h-.01Z",
  },
  {
    className: "cursor-cube-shard cursor-cube-shard--3 cursor-cube-shard--light",
    fill: "#d6d5d2",
    d: "M448.35,142.54c1.31,2.26,1.49,5.16,0,7.74l-209.83,363.42c-1.41,2.46-5.16,1.45-5.16-1.38v-239.48c0-1.91-.51-3.75-1.44-5.36l216.42-124.95h.01Z",
  },
  {
    className: "cursor-cube-shard cursor-cube-shard--4 cursor-cube-shard--light",
    fill: "#fff",
    d: "M448.35,142.54l-216.42,124.95c-.92-1.6-2.26-2.96-3.92-3.92L20.62,143.83c-2.46-1.41-1.45-5.16,1.38-5.16h419.65c2.98,0,5.4,1.61,6.7,3.87Z",
  },
] as const;

type Props = {
  className?: string;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function WhatsCookingCover({ className }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");

  useEffect(() => {
    if (reducedMotion) {
      setLine1(WORD1);
      setLine2(WORD2);
      return;
    }

    const typingTimers: ReturnType<typeof setTimeout>[] = [];

    const clearTyping = () => {
      typingTimers.forEach(clearTimeout);
      typingTimers.length = 0;
    };

    const queue = (fn: () => void, ms: number) => {
      typingTimers.push(setTimeout(fn, ms));
    };

    const runTypingBurst = () => {
      clearTyping();
      setLine1("");
      setLine2("");

      queue(() => {
        let i = 0;
        const typeChar1 = () => {
          if (i < WORD1.length) {
            setLine1(WORD1.slice(0, i + 1));
            i += 1;
            queue(typeChar1, CHAR_MS);
          } else {
            let j = 0;
            queue(() => {
              const typeChar2 = () => {
                if (j < WORD2.length) {
                  setLine2(WORD2.slice(0, j + 1));
                  j += 1;
                  queue(typeChar2, CHAR_MS);
                }
              };
              typeChar2();
            }, BETWEEN_WORDS_MS);
          }
        };
        typeChar1();
      }, TITLE_TYPE_START_MS);
    };

    runTypingBurst();
    const interval = setInterval(runTypingBurst, COVER_CYCLE_MS);

    return () => {
      clearInterval(interval);
      clearTyping();
    };
  }, [reducedMotion]);

  return (
    <svg
      viewBox={`0 0 ${FIGMA_W} ${FIGMA_H}`}
      className={className}
      role="img"
      aria-label={"What's Cooking? - AI meal generator case study cover"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect className="wc-cover-bg" width={FIGMA_W} height={FIGMA_H} fill="#690507" />

      <g className="wc-cover-stage-cube">
        <g className="wc-cover-cube-drift">
          <g className="whats-cooking-cover-logo">
            {FACES.map((face, i) => (
              <g key={i} className={face.className}>
                <path fill={face.fill} d={face.d} />
              </g>
            ))}
          </g>
        </g>
      </g>

      <text
        className="wc-cover-stage-x"
        x={xCenterX}
        y={567 + 230 / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={INK}
        fontSize={200}
        fontWeight={700}
        style={{
          fontFamily:
            "var(--font-roboto), ui-sans-serif, system-ui, sans-serif",
        }}
      >
        X
      </text>

      <text
        className="wc-cover-stage-title"
        x={titleCenterX}
        y={TITLE_BLOCK_MID_Y - TITLE_LINE_STEP / 2}
        textAnchor="middle"
        fill={INK}
        fontSize={TITLE_FONT_SIZE}
        style={{
          fontFamily: "var(--font-schoolbell), cursive",
        }}
      >
        <tspan x={titleCenterX} dy={0}>
          {line1}
        </tspan>
        <tspan x={titleCenterX} dy={TITLE_LINE_STEP}>
          {line2}
        </tspan>
      </text>
    </svg>
  );
}
