"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./loading.module.css";

const HERO_PATH = "/";

/** Bar fill: delay 1s + duration 2.2s; then PRD wait 400ms before navigation */
const BAR_COMPLETE_MS = 1000 + 2200;
const POST_BAR_MS = 400;

export default function LoadingPage() {
  const router = useRouter();
  const navigated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("loaded") === "true") {
      router.replace(HERO_PATH);
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const go = () => {
      if (navigated.current) return;
      navigated.current = true;
      sessionStorage.setItem("loaded", "true");
      router.push(HERO_PATH);
    };

    if (reduced) {
      const t = window.setTimeout(go, POST_BAR_MS);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(go, BAR_COMPLETE_MS + POST_BAR_MS);
    return () => window.clearTimeout(t);
  }, [router]);

  return (
    <div className={`${styles.canvas} flex flex-col items-center justify-center px-6`}>
      <div className="flex flex-col items-center gap-8">
        <div className={styles.flowerWrap}>
          <svg
            width={60}
            height={84}
            viewBox="0 0 60 84"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="block"
          >
            <rect
              className={styles.pixel}
              x="24"
              y="0"
              width="12"
              height="12"
              fill="#F5C800"
            />
            <rect
              className={styles.pixel}
              x="12"
              y="12"
              width="12"
              height="12"
              fill="#F5C800"
            />
            <rect
              className={styles.pixel}
              x="24"
              y="12"
              width="12"
              height="12"
              fill="#E8301A"
            />
            <rect
              className={styles.pixel}
              x="36"
              y="12"
              width="12"
              height="12"
              fill="#F5C800"
            />
            <rect
              className={styles.pixel}
              x="24"
              y="24"
              width="12"
              height="12"
              fill="#F5C800"
            />
            <rect
              className={styles.pixel}
              x="24"
              y="36"
              width="12"
              height="12"
              fill="#2D8A2D"
            />
            <rect
              className={styles.pixel}
              x="24"
              y="48"
              width="12"
              height="12"
              fill="#2D8A2D"
            />
            <rect
              className={styles.pixel}
              x="24"
              y="60"
              width="12"
              height="12"
              fill="#2D8A2D"
            />
          </svg>
        </div>

        <h1 className={styles.name}>olivia tran</h1>

        <div className={styles.progressBlock}>
          <p className="sr-only" aria-live="polite">
            Initialising portfolio
          </p>
          <div className={styles.track} aria-hidden>
            <div className={styles.fill} />
          </div>
          <p className={styles.barLabel}>INITIALISING PORTFOLIO</p>
        </div>
      </div>
    </div>
  );
}
