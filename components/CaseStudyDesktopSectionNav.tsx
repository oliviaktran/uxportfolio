"use client";

import { useEffect, useState } from "react";

export type CaseStudyNavItem = { id: string; label: string };

type Props = {
  items: CaseStudyNavItem[];
  /** Inactive link classes (theme color, typography). */
  linkClassName: string;
  /** Appended when this section is the current one. */
  activeClassName: string;
};

/** Align with case study `scroll-mt-28` (~7rem) so the active link matches in-page anchors. */
const ACTIVATION_LINE_PX = 112;

/**
 * Past this distance from the document bottom, treat scroll as “at end” so the last
 * nav item (e.g. more info / outcome) stays highlighted. Otherwise a short final
 * section can sit entirely below the activation line while reflection still looks “active”.
 */
const BOTTOM_TOLERANCE_PX = 96;

function pickActiveId(orderedIds: string[]): string {
  if (orderedIds.length === 0) return "";

  const docH = document.documentElement.scrollHeight;
  const viewBottom = window.scrollY + window.innerHeight;
  if (viewBottom >= docH - BOTTOM_TOLERANCE_PX) {
    return orderedIds[orderedIds.length - 1] ?? "";
  }

  let best = orderedIds[0] ?? "";
  for (const id of orderedIds) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= ACTIVATION_LINE_PX) best = id;
  }
  return best;
}

export function CaseStudyDesktopSectionNav({
  items,
  linkClassName,
  activeClassName,
}: Props) {
  const sectionIds = items.map((i) => i.id);
  const idsDependency = sectionIds.join("\u{1e}");

  const [activeId, setActiveId] = useState(() => sectionIds[0] ?? "");

  useEffect(() => {
    const orderedIds =
      idsDependency.length > 0 ? idsDependency.split("\u{1e}") : [];
    if (orderedIds.length === 0) return;

    const update = () => {
      setActiveId(pickActiveId(orderedIds));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [idsDependency]);

  return (
    <div className="hidden lg:sticky lg:top-10 lg:flex lg:max-w-[180px] lg:flex-col lg:self-start">
      <nav className="shrink-0" aria-label="On this page">
        <div className="space-y-2.5">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block duration-150 ${linkClassName} ${isActive ? activeClassName : ""}`}
                aria-current={isActive ? "location" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
