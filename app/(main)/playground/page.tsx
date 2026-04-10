import { PlaygroundClient } from "@/components/PlaygroundClient";
import {
  getPlaygroundEllipseImages,
  getPlaygroundImagesByTheme,
} from "@/lib/get-playground-ellipse-images";
import {
  siteNavInsetClass,
  siteNavTypographyClass,
} from "@/lib/site-nav-styles";

export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
  const imagesByTheme = getPlaygroundImagesByTheme();
  const imagesAll = getPlaygroundEllipseImages();

  return (
    <main className="relative flex min-h-0 flex-1 flex-col bg-white text-neutral-900">
      <div className="pointer-events-none absolute left-0 right-0 top-8 z-10">
        <div className={`${siteNavInsetClass} pointer-events-none`}>
          <p className={siteNavTypographyClass}>Beyond work</p>
        </div>
      </div>

      <PlaygroundClient
        imagesByTheme={imagesByTheme}
        imagesAll={imagesAll}
      />
    </main>
  );
}
