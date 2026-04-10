import {
  IMPACT_FINAL_PRODUCT_SCREENS_SRC,
  IMPACT_IDEATION_BOARD_SRC,
  IMPACT_PERSONA_RICKIE_CHEN_SRC,
  IMPACT_PERSONA_SHELLEY_DEAN_SRC,
  IMPACT_USABILITY_LEARN_HUB_SRC,
  IMPACT_USABILITY_LESSON_COMPLETION_SRC,
  IMPACT_USABILITY_MODULE_CONTENT_SRC,
  IMPACT_USABILITY_QUIZ_ITERATION_SRC,
  IMPACT_USER_JOURNEY_MAP_SRC,
} from "./impact-public-assets";

/** Intrinsic pixel size of files in /public/images (for <img width/height> + aspect-ratio). */
export const portfolioRasterDimensions: Record<
  string,
  { width: number; height: number }
> = {
  "/images/whats-cooking-cover.svg": { width: 2563, height: 1441 },
  "/images/jpmc-hero.png": { width: 1024, height: 555 },
  "/images/impact-hero.png": { width: 7689, height: 4323 },
  "/images/impact-contextual-interview-01.png": { width: 794, height: 1024 },
  "/images/impact-contextual-interview-02.png": { width: 789, height: 1024 },
  "/images/impact-contextual-interview-03.png": { width: 791, height: 1024 },
  "/images/impact-contextual-interview-04.png": { width: 787, height: 1024 },
  [IMPACT_USER_JOURNEY_MAP_SRC]: { width: 1024, height: 805 },
  [IMPACT_PERSONA_RICKIE_CHEN_SRC]: { width: 1024, height: 461 },
  [IMPACT_PERSONA_SHELLEY_DEAN_SRC]: { width: 1024, height: 461 },
  [IMPACT_USABILITY_LEARN_HUB_SRC]: { width: 1024, height: 392 },
  [IMPACT_USABILITY_MODULE_CONTENT_SRC]: { width: 1024, height: 392 },
  [IMPACT_USABILITY_QUIZ_ITERATION_SRC]: { width: 1024, height: 392 },
  [IMPACT_USABILITY_LESSON_COMPLETION_SRC]: { width: 1024, height: 392 },
  [IMPACT_IDEATION_BOARD_SRC]: { width: 1024, height: 557 },
  [IMPACT_FINAL_PRODUCT_SCREENS_SRC]: { width: 1024, height: 697 },
  "/images/bump-hero.png": { width: 7689, height: 4323 },
  "/images/bump-lowfi-sketches.jpg": { width: 1024, height: 768 },
  "/images/finalbump.png": { width: 1715, height: 2718 },
};

export function dimensionsForPortfolioRaster(src: string): {
  width: number;
  height: number;
} {
  return portfolioRasterDimensions[src] ?? { width: 1024, height: 576 };
}
