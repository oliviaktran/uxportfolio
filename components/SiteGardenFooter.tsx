import { HeroFloatingFlowers } from "@/components/HeroFloatingFlowers";

/** sizeMul = prior PixelFlowerMark `size` / 30 (native flower width = 60). Laid out for the footer band. */
const SITE_GARDEN_FLOATERS = [
  { bottom: "8%", left: "4%", delay: "0s", sizeMul: 26 / 30 },
  { bottom: "14%", left: "16%", delay: "0.35s", sizeMul: 28 / 30 },
  { bottom: "6%", left: "30%", delay: "0.7s", sizeMul: 24 / 30 },
  { bottom: "18%", left: "44%", delay: "1.1s", sizeMul: 22 / 30 },
  { bottom: "10%", right: "36%", delay: "0.2s", sizeMul: 30 / 30 },
  { bottom: "20%", right: "22%", delay: "1.3s", sizeMul: 32 / 30 },
  { bottom: "8%", right: "10%", delay: "0.55s", sizeMul: 29 / 30 },
  { top: "12%", left: "8%", delay: "0.9s", sizeMul: 25 / 30 },
  { top: "18%", left: "52%", delay: "1.45s", sizeMul: 27 / 30 },
  { top: "8%", right: "8%", delay: "0.15s", sizeMul: 30 / 30 },
  { top: "22%", right: "42%", delay: "1s", sizeMul: 26 / 30 },
  { bottom: "28%", left: "24%", delay: "0.65s", sizeMul: 23 / 30 },
  { bottom: "24%", right: "14%", delay: "1.25s", sizeMul: 31 / 30 },
  { top: "14%", left: "34%", delay: "0.4s", sizeMul: 26 / 30 },
  { bottom: "32%", right: "48%", delay: "1.15s", sizeMul: 24 / 30 },
];

export function SiteGardenFooter() {
  return (
    <footer
      className="relative min-h-[min(38vh,400px)] w-full shrink-0 border-t border-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]"
      aria-label="Garden"
    >
      <HeroFloatingFlowers floaters={SITE_GARDEN_FLOATERS} />
      <p className="pointer-events-none absolute bottom-6 right-5 z-10 text-right text-[10px] uppercase tracking-[0.2em] md:right-8">
        © 2026 OLIVIA TRAN
      </p>
    </footer>
  );
}
