import { HomeLandingHero } from "@/components/HomeLandingHero";
import { WorksGallery } from "@/components/WorksGallery";

export default function HomePage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col bg-white text-[var(--color-primary)]">
      <HomeLandingHero />
      <section id="work" aria-label="Selected work">
        <WorksGallery />
      </section>
    </main>
  );
}
