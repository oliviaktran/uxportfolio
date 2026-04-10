import { EllipsePhotoGallery } from "@/components/EllipsePhotoGallery";
import { getPlaygroundEllipseImages } from "@/lib/get-playground-ellipse-images";

export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
  const images = getPlaygroundEllipseImages();
  const showCorner = images.length >= 3;
  const cornerSrc = showCorner ? images[0] : null;

  return (
    <main className="relative flex min-h-0 flex-1 flex-col bg-white text-neutral-900">
      <p className="absolute left-6 top-8 font-mono text-[10px] uppercase tracking-[0.2em] md:left-12 lg:left-16">
        Beyond work
      </p>

      {cornerSrc ? (
        <div className="pointer-events-none absolute right-6 top-8 w-[4.5rem] overflow-hidden sm:w-[5rem] md:right-12 md:w-[5.5rem] lg:right-16">
          <div className="relative aspect-[5/6] w-full">
            <img
              src={cornerSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />
          </div>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 md:py-24">
        <EllipsePhotoGallery images={images} durationSec={110} />
      </div>

      <p className="absolute bottom-10 left-6 font-mono text-[10px] lowercase tracking-[0.16em] text-neutral-600 md:bottom-12 md:left-12 lg:left-16">
        <span className="mr-5">nature</span>
        <span className="mr-5">food</span>
        <span>life</span>
      </p>
    </main>
  );
}
