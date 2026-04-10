"use client";

import { useId, useState, type CSSProperties } from "react";

/** A4 cover portrait - `public/about/a4-portrait.png`. */
export const ABOUT_A4_COVER_IMAGE: string | null = "/about/a4-portrait.png";

/** Resume image - `public/resume.png` (top under-sheet; vellum slides aside to reveal). */
export const ABOUT_RESUME_IMAGE = "/resume.png";

/** Back → front; `null` = gradient “Photo” placeholder. */
export const ABOUT_STACK_IMAGE_SRCS: (string | null)[] = [
  null,
  null,
  null,
  ABOUT_RESUME_IMAGE,
];

/**
 * Frame 595×842 (Figma 61:247). Name + image per spec; bio directly under photo;
 * aside blocks at original y=615 / y=648 from pasted JSON.
 */
const A4_H = 842;
const A4_W = 595;
const IMG_TOP = 39;
const IMG_H = 307;
const imgBottom = IMG_TOP + IMG_H;
const bodyTop = imgBottom + 22;

/** Positions as % of width / height. */
const A4 = {
  name: { left: (42 / A4_W) * 100, top: (39 / A4_H) * 100, w: (349 / A4_W) * 100 },
  image: {
    left: (183 / A4_W) * 100,
    top: (IMG_TOP / A4_H) * 100,
    w: (230 / A4_W) * 100,
    h: (IMG_H / A4_H) * 100,
  },
  body: {
    left: (42 / A4_W) * 100,
    top: (bodyTop / A4_H) * 100,
    w: (349 / A4_W) * 100,
  },
  asideLabel: {
    left: (298 / A4_W) * 100,
    top: (615 / A4_H) * 100,
    w: (247 / A4_W) * 100,
  },
  asideBody: {
    left: (298 / A4_W) * 100,
    top: (648 / A4_H) * 100,
    w: (247 / A4_W) * 100,
  },
} as const;

const a4ParagraphClass =
  "absolute text-black/90 leading-snug drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]";
const a4ParagraphSize = "clamp(10px, 2.35vw, 12px)" as const;

function Paperclip({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 36 52" fill="none" aria-hidden>
      <defs>
        <linearGradient
          id={`pc-steel-${uid}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#f2f3f6" />
          <stop offset="42%" stopColor="#9b9da4" />
          <stop offset="100%" stopColor="#4e5058" />
        </linearGradient>
        <filter
          id={`pc-sh-${uid}`}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
        >
          <feDropShadow
            dx="0.4"
            dy="1.1"
            stdDeviation="0.65"
            floodOpacity="0.3"
          />
        </filter>
      </defs>
      <path
        d="M11.2 6.8V37c0 5.8 4.7 10.5 10.5 10.5s10.5-4.7 10.5-10.5V17.6c0-3.8-3.1-6.9-6.9-6.9s-6.9 3.1-6.9 6.9V39c0 2.3 1.9 4.2 4.2 4.2s4.2-1.9 4.2-4.2V14.8"
        stroke={`url(#pc-steel-${uid})`}
        strokeWidth={2.45}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#pc-sh-${uid})`}
      />
      <path
        d="M11.2 6.8V37c0 5.8 4.7 10.5 10.5 10.5s10.5-4.7 10.5-10.5V17.6c0-3.8-3.1-6.9-6.9-6.9s-6.9 3.1-6.9 6.9V39c0 2.3 1.9 4.2 4.2 4.2s4.2-1.9 4.2-4.2V14.8"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0.2 -0.15)"
      />
    </svg>
  );
}

function GemPaperclip({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 56 68" fill="none" aria-hidden>
      <defs>
        <linearGradient
          id={`gc-steel-${uid}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fafbfc" />
          <stop offset="38%" stopColor="#b4b6bd" />
          <stop offset="100%" stopColor="#55565e" />
        </linearGradient>
        <filter
          id={`gc-sh-${uid}`}
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0.55"
            dy="1.35"
            stdDeviation="0.95"
            floodOpacity="0.34"
          />
        </filter>
      </defs>
      <path
        d="M38 9.5h-5.2c-5.2 0-9.5 4.3-9.5 9.5v38c0 7.7 6.3 14 14 14s14-6.3 14-14V26.2c0-5.2-4.3-9.5-9.5-9.5s-9.5 4.3-9.5 9.5v28.5c0 3.3 2.7 6 6 6s6-2.7 6-6V20.5"
        stroke={`url(#gc-steel-${uid})`}
        strokeWidth={2.05}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#gc-sh-${uid})`}
      />
      <path
        d="M38 9.5h-5.2c-5.2 0-9.5 4.3-9.5 9.5v38c0 7.7 6.3 14 14 14s14-6.3 14-14V26.2c0-5.2-4.3-9.5-9.5-9.5s-9.5 4.3-9.5 9.5v28.5c0 3.3 2.7 6 6 6s6-2.7 6-6V20.5"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth={0.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0.25 -0.2)"
      />
    </svg>
  );
}

function PlaceholderSheet({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-[2px] shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_28px_rgba(26,53,197,0.14)]"
      style={{
        background:
          "linear-gradient(145deg, #e8e4dc 0%, #cfc6b8 42%, #b8aea2 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_11px,rgba(0,0,0,0.04)_11px,rgba(0,0,0,0.04)_12px)]" />
      <span className="sr-only">{label}</span>
      <div
        className="absolute left-1/2 top-1/2 w-[55%] -translate-x-1/2 -translate-y-1/2 rounded border border-black/10 bg-white/35 px-3 py-6 text-center font-serif-display text-[11px] uppercase tracking-[0.2em] text-black/45"
        aria-hidden
      >
        Photo
      </div>
    </div>
  );
}

function GhostLayer({ opacity }: { opacity: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-[6%] font-serif-display text-[9px] leading-snug text-black/70"
      style={{ opacity, filter: "blur(6px)" }}
      aria-hidden
    >
      <div
        className="absolute rounded-[1px] bg-neutral-300/80"
        style={{
          left: `${A4.image.left}%`,
          top: `${A4.image.top}%`,
          width: `${A4.image.w}%`,
          height: `${A4.image.h}%`,
        }}
      />
      <p
        className="absolute font-semibold text-[var(--color-primary)]"
        style={{
          left: `${A4.name.left}%`,
          top: `${A4.name.top}%`,
          width: `${A4.name.w}%`,
        }}
      >
        Olivia Tran
      </p>
      <p
        className="absolute text-[8px] leading-relaxed"
        style={{
          left: `${A4.body.left}%`,
          top: `${A4.body.top}%`,
          width: `${A4.body.w}%`,
        }}
      >
        I design experiences…
      </p>
    </div>
  );
}

function A4FrontSheet({ imageSrc }: { imageSrc: string | null }) {
  const pct = (n: number) => `${n}%`;

  return (
    <div className="about-a4-front relative h-full w-full">
      <div className="relative z-[1] h-full w-full">
        <p
          className="absolute leading-snug text-[var(--color-primary)] drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]"
          style={{
            left: pct(A4.name.left),
            top: pct(A4.name.top),
            width: pct(A4.name.w),
            fontSize: a4ParagraphSize,
          }}
        >
          Olivia Tran
        </p>

        <div
          className="absolute overflow-hidden bg-neutral-200/40 ring-1 ring-black/[0.06]"
          style={{
            left: pct(A4.image.left),
            top: pct(A4.image.top),
            width: pct(A4.image.w),
            height: pct(A4.image.h),
            opacity: 0.8,
          }}
        >
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- static asset from /public
            <img
              src={imageSrc}
              alt="Olivia Tran, black-and-white portrait seated in an armchair"
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-400/70 px-2 text-center font-serif-display text-[10px] uppercase tracking-wider text-black/40"
              aria-hidden
            >
              Add image in public/about/
            </div>
          )}
        </div>

        <p
          className={a4ParagraphClass}
          style={{
            left: pct(A4.body.left),
            top: pct(A4.body.top),
            width: pct(A4.body.w),
            fontSize: a4ParagraphSize,
          }}
        >
          I design experiences that feel intuitive and intentional, grounded in
          visual craft. Currently designing at JPMorganChase, I&apos;m exploring
          new ways of building and supporting the design process.
        </p>

        <p
          className={a4ParagraphClass}
          style={{
            left: pct(A4.asideLabel.left),
            top: pct(A4.asideLabel.top),
            width: pct(A4.asideLabel.w),
            fontSize: a4ParagraphSize,
          }}
        >
          Outside of design I&apos;m:
        </p>

        <p
          className={a4ParagraphClass}
          style={{
            left: pct(A4.asideBody.left),
            top: pct(A4.asideBody.top),
            width: pct(A4.asideBody.w),
            fontSize: a4ParagraphSize,
          }}
        >
          Throwing clay on a wheel Cafe hopping Playing pickleball or tennis
          Learning how to swim...
        </p>
      </div>
    </div>
  );
}

export function AboutPaperStack() {
  const uid = useId();
  const sheets = ABOUT_STACK_IMAGE_SRCS;
  const [resumeRevealed, setResumeRevealed] = useState(false);

  return (
    <section
      className="relative flex min-h-[min(78vh,720px)] w-full items-center justify-center border-b border-[var(--color-grid-strong)] bg-[var(--background)] px-4 py-16 md:py-24"
      aria-label="About - photo stack"
    >
      <div
        className="relative mx-auto"
        style={
          {
            perspective: "1050px",
            perspectiveOrigin: "16% 22%",
            ["--vellum-delay" as string]: `${(sheets.length - 1) * 0.095 + 0.12}s`,
            ["--ghost-delay" as string]: `${(sheets.length - 1) * 0.095 + 1.18}s`,
          } as CSSProperties
        }
      >
        <div
          className="relative mt-5"
          style={{
            width: "min(420px, 88vw)",
            aspectRatio: "595 / 842",
          }}
        >
          <div
            className="about-folder-back pointer-events-none absolute z-0 rounded-sm"
            style={{
              top: "-0.85rem",
              left: "-3.5%",
              right: "-3.5%",
              bottom: "-5%",
            }}
            aria-hidden
          />
          <div className="relative z-[1] h-full w-full">
          {sheets.map((src, i) => {
            const endX = 10 + i * 5;
            const endY = 8 + i * 4;
            const endRz = -1.4 + i * 0.9;
            const delay = `${i * 0.095}s`;
            const startZ = -(38 + i * 26);
            const style = {
              ["--end-x" as string]: `${endX}px`,
              ["--end-y" as string]: `${endY}px`,
              ["--end-rz" as string]: `${endRz}deg`,
              ["--start-z" as string]: `${startZ}px`,
              ["--riffle-delay" as string]: delay,
              zIndex: i,
            } as CSSProperties;

            const isResumeSheet =
              src === ABOUT_RESUME_IMAGE && resumeRevealed;
            const isResumeSlot = src === ABOUT_RESUME_IMAGE;

            return (
              <div
                key={`${uid}-paper-${i}`}
                id={isResumeSlot ? `${uid}-resume-panel` : undefined}
                className={`about-paper-sheet about-paper-riffle absolute left-0 top-0 h-full w-full overflow-hidden rounded-[2px]`}
                style={style}
              >
                {src ? (
                  isResumeSlot ? (
                    <div className="absolute inset-0 overflow-hidden rounded-[2px] shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_28px_rgba(26,53,197,0.14)]">
                      {isResumeSheet ? (
                        <button
                          type="button"
                          className="relative flex h-full w-full cursor-pointer flex-col border-0 bg-[#ddd5c8] p-2 text-left sm:p-3"
                          aria-label="Back to about - hide resume"
                          onClick={() => setResumeRevealed(false)}
                        >
                          <div className="relative flex min-h-0 w-full flex-1 flex-col bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.07)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={src}
                              alt="Olivia Tran - resume"
                              className="pointer-events-none mx-auto h-full min-h-[60%] w-full bg-white object-contain object-top"
                              draggable={false}
                            />
                          </div>
                          <span className="pointer-events-none pt-2 text-center text-[9px] uppercase tracking-[0.2em] text-black/45">
                            Tap to return
                          </span>
                        </button>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={src}
                          alt="Olivia Tran - resume"
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover shadow-[0_1px_0_rgba(0,0,0,0.06),0_10px_28px_rgba(26,53,197,0.14)]"
                    />
                  )
                ) : (
                  <PlaceholderSheet label={`Portfolio image placeholder ${i + 1}`} />
                )}
              </div>
            );
          })}

          <div
            className="about-paper-ghost pointer-events-none absolute left-0 top-0 z-[15] h-full w-full"
            aria-hidden
          >
            <GhostLayer opacity={0.35} />
          </div>

          <div className="about-paper-vellum about-paper-vellum-on absolute left-0 top-0 z-20 h-full w-full overflow-visible">
            <div className="about-vellum-flip-scene h-full w-full overflow-visible">
              <div
                className={`about-vellum-page h-full w-full overflow-visible will-change-transform ${resumeRevealed ? "about-vellum-page--flipped" : ""}`}
              >
                <div className="about-vellum-face about-vellum-face--front">
                  <div className="about-vellum-frosted absolute inset-0 overflow-hidden rounded-[2px] border border-white/70 bg-white/[0.96] shadow-[0_1px_0_rgba(0,0,0,0.06),0_14px_40px_rgba(26,53,197,0.18)] backdrop-blur-[16px] backdrop-saturate-[1.05]">
                    <A4FrontSheet imageSrc={ABOUT_A4_COVER_IMAGE} />
                  </div>
                  <div
                    className="about-front-tab-olivia pointer-events-none absolute top-[11%] z-[2] h-[min(26%,11rem)] min-h-[5rem] w-[min(38px,9vw)] px-0"
                    aria-hidden={true}
                  >
                    <span
                      className="relative z-[1] text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]"
                      style={{
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                      }}
                    >
                      Olivia
                    </span>
                  </div>
                  <GemPaperclip className="pointer-events-none absolute left-0 top-1 z-30 h-[4.25rem] w-[3.35rem] origin-[28%_32%] -translate-x-1 -translate-y-0.5 -rotate-[58deg]" />
                  <div className="pointer-events-none absolute -bottom-2 -left-1 z-30 flex items-end gap-0">
                    <div
                      className="relative flex h-[min(132px,36vw)] w-[min(40px,11vw)] items-center justify-center rounded-[2px] border border-black/10 bg-[#e8dcc8] shadow-[2px_6px_14px_rgba(0,0,0,0.4)]"
                      style={{
                        boxShadow:
                          "2px 6px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
                      }}
                    >
                      <p
                        className="font-serif-display text-[9px] font-semibold uppercase tracking-[0.35em] text-black/55"
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                        }}
                      >
                        Public access
                      </p>
                    </div>
                    <Paperclip className="-ml-2 mb-3 h-[2.65rem] w-[1.85rem] rotate-[-12deg]" />
                  </div>
                </div>

                <div
                  className="about-vellum-face about-vellum-face--back rounded-[2px]"
                  aria-hidden={!resumeRevealed}
                >
                  <div className="about-vellum-back-paper" aria-hidden={true} />
                </div>
              </div>
              <button
                type="button"
                className="about-folder-tab-side absolute top-[43%] z-[35] h-[min(22%,9.5rem)] min-h-[5.5rem] w-[min(40px,9.5vw)] cursor-pointer px-1 text-left"
                aria-label={
                  resumeRevealed ? "Hide resume - flip back" : "Show resume"
                }
                aria-expanded={resumeRevealed}
                aria-controls={`${uid}-resume-panel`}
                onClick={() => setResumeRevealed((v) => !v)}
              >
                <span
                  className="relative z-[1] text-[9px] font-bold uppercase tracking-[0.22em] text-black/70"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  Resume
                </span>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
