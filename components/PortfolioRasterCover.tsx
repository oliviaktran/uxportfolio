/* eslint-disable @next/next/no-img-element -- intentional: skip optimizer for crisp PNG mockups */
import { dimensionsForPortfolioRaster } from "@/lib/portfolio-raster-dimensions";

type Props = {
  src: string;
  alt?: string;
  priority?: boolean;
  className: string;
};

/**
 * Plain <img> for PNG mockups - avoids next/image resize/re-encode, which often softens UI shots.
 * Prefer higher-res source files (e.g. 2×) for Retina; this only fixes pipeline blur.
 */
export function PortfolioRasterCover({
  src,
  alt = "",
  priority = false,
  className,
}: Props) {
  const { width, height } = dimensionsForPortfolioRaster(src);

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      decoding={priority ? "sync" : "async"}
      loading={priority ? "eager" : "lazy"}
      draggable={false}
    />
  );
}
