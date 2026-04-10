"use client";

import { PortfolioRasterCover } from "@/components/PortfolioRasterCover";
import { WhatsCookingCover } from "@/components/WhatsCookingCover";
import Link from "next/link";
import {
  projects,
  type Project,
} from "@/lib/projects";

/** Featured-work style row - wide image + year, title, company, summary */
function ProjectRow({ project }: { project: Project }) {
  const cover = project.coverImage;
  const metaLabel =
    project.category === "CASE STUDY"
      ? `Case study ${project.year}`
      : project.category === "PERSONAL PROJECT"
        ? `Personal project - ${project.year}`
        : project.slug === "bump"
          ? project.company
          : `${project.company} - ${project.year}`;
  const titleFontClass = "font-roboto-serif";
  const summaryFontClass = "";

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block border-b border-neutral-200/80 py-14 first:pt-4 last:border-b-0 md:py-20"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-12 lg:gap-16">
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-sm bg-neutral-100 md:aspect-[5/3] md:w-[58%] md:max-w-[720px]">
          {cover ? (
            project.slug === "whats-cooking" ? (
              <WhatsCookingCover className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
            ) : (
              <PortfolioRasterCover
                src={cover}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            )
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center bg-neutral-100">
              <span className="text-xs text-neutral-400">Cover image</span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="font-mono text-[11px] uppercase tabular-nums tracking-[0.18em] text-neutral-400">
            {metaLabel}
          </p>
          <h2
            className={`mt-3 text-[clamp(1.7rem,4vw,2.5rem)] font-normal leading-[1.08] tracking-tight text-neutral-800 ${titleFontClass}`}
          >
            {project.title}
          </h2>
          <p
            className={`mt-4 max-w-md text-[13px] leading-[1.7] text-neutral-500 md:max-w-lg md:text-[14px] ${summaryFontClass}`}
          >
            {project.summary}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function WorksGallery() {
  return (
    <div className="mx-auto max-w-[1280px] bg-white px-5 py-16 md:px-10 md:py-24">
      <div className="flex flex-col">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
