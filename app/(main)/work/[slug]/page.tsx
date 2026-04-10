import { CaseStudyDesktopSectionNav } from "@/components/CaseStudyDesktopSectionNav";
import { CaseStudyHomeLink } from "@/components/CaseStudyHomeLink";
import { CaseStudySubsectionFigures } from "@/components/CaseStudySubsectionFigures";
import { PortfolioRasterCover } from "@/components/PortfolioRasterCover";
import { WhatsCookingCover } from "@/components/WhatsCookingCover";
import { notFound } from "next/navigation";
import { ArtifactPlaceholder } from "@/components/ArtifactPlaceholder";
import {
  caseStudies,
  caseStudySlugs,
  type CaseStudy,
  type CaseStudySection,
} from "@/lib/case-studies";

import { dimensionsForPortfolioRaster } from "@/lib/portfolio-raster-dimensions";
import { projects } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) return { title: "Work" };
  return { title: `${study.title} - Olivia Tran` };
}

/** OKDive-style short labels - https://diana.lu/okdive */
const SUBNAV_BY_ID: Record<string, string> = {
  context: "Context",
  landscape: "Landscape",
  "user-research": "Research",
  synthesis: "Synthesis",
  "personas-goals": "Goals",
  "ideation-design": "Ideation",
  testing: "Testing",
  final: "Product",
  outcomes: "Impact",
  reflection: "Reflection",
  problem: "Problem",
  overview: "Overview",
  role: "My role",
  research: "Research",
  design: "Design",
  results: "Results",
  impact: "Impact",
  learnings: "Learnings",
};

function subnavLabel(s: CaseStudySection): string {
  return s.navLabel ?? SUBNAV_BY_ID[s.id] ?? s.heading;
}

function leadLinesFor(s: CaseStudySection): string[] {
  return s.leadLines?.length ? s.leadLines : [s.heading];
}

/** Emmi-style lowercase section keyword */
function sectionRailLabel(sec: CaseStudySection): string {
  return subnavLabel(sec).toLowerCase();
}

/** Optional framing lines under the meta grid (italic); brief + hmws, no duplicate “the brief” block */
function narrativePromptLines(study: CaseStudy): string[] {
  const lines: string[] = [];
  if (study.brief) lines.push(study.brief);
  if (study.hmws?.length) lines.push(...study.hmws);
  return lines;
}

/** Typography shared by meta labels */
const caseStudyMetaHeadingBase =
  "text-[10px] font-semibold uppercase tracking-[0.18em]";

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) notFound();

  const isWhatsCooking = slug === "whats-cooking";
  const isImpact = slug === "impact";
  const isBump = slug === "bump";
  const isJpmc = slug === "jpmc";
  /** Footer block: “more info” label + contact CTA only (no outcome / impact line). */
  const usesMoreInfoFooter = isWhatsCooking || isImpact || isJpmc;

  const projectEntry = projects.find((p) => p.slug === slug);
  const cover =
    projectEntry?.caseStudyCoverImage ?? projectEntry?.coverImage;
  const coverDims = cover ? dimensionsForPortfolioRaster(cover) : null;
  const showArtifacts = study.showArtifactPlaceholders === true;

  const visibleSections = study.nda ? [] : study.sections;
  /** Short placeholder pages (e.g. NDA): avoid viewport-tall rail + excess bottom padding. */
  const hasNoBodySections = visibleSections.length === 0;
  /** Avoid duplicate #overview when a section uses that id (e.g. Bump). */
  const hasOverviewSection = visibleSections.some((s) => s.id === "overview");
  const narrativePrompts = narrativePromptLines(study);

  /** Meta / rail / subsection label color; IMPACT blue, Bump pink (hero), What's Cooking red, else brown */
  const gridMetaHeadingClass = isWhatsCooking
    ? `${caseStudyMetaHeadingBase} text-[var(--color-whats-cooking-primary-red)]`
    : isImpact
      ? `${caseStudyMetaHeadingBase} text-[#2863C4]`
      : isBump
        ? `${caseStudyMetaHeadingBase} text-[#FFA2C5]`
        : `${caseStudyMetaHeadingBase} text-[#543722]`;

  /** Nav links need !color so preflight `a { color: inherit }` does not pull neutral-800 from main */
  const caseStudyNavLinkClass = isWhatsCooking
    ? `${caseStudyMetaHeadingBase} !text-[var(--color-whats-cooking-primary-red)] visited:!text-[var(--color-whats-cooking-primary-red)] transition-opacity hover:opacity-80`
    : isImpact
      ? `${caseStudyMetaHeadingBase} !text-[#2863C4] visited:!text-[#2863C4] transition-opacity hover:opacity-80`
      : isBump
        ? `${caseStudyMetaHeadingBase} !text-[#FFA2C5] visited:!text-[#FFA2C5] transition-opacity hover:opacity-80`
        : `${caseStudyMetaHeadingBase} !text-[#543722] visited:!text-[#543722] transition-opacity hover:opacity-80`;

  /** Left rail: current section (scroll-spy in CaseStudyDesktopSectionNav). */
  const caseStudyNavLinkActiveClass =
    "font-semibold underline decoration-2 underline-offset-[5px]";

  const breakerLabelClass = gridMetaHeadingClass;

  /** Five columns only when both Role and Constraint appear (e.g. future case studies). */
  const caseStudyMetaGridCols =
    study.constraint && study.role ? "md:grid-cols-5" : "md:grid-cols-4";

  const navItems = [
    ...(hasOverviewSection
      ? []
      : [{ id: "overview", label: "Overview" }]),
    ...visibleSections.map((sec) => ({
      id: sec.id,
      label: subnavLabel(sec).toLowerCase(),
    })),
    {
      id: "outcome",
      label: usesMoreInfoFooter ? "more info" : "the outcome",
    },
  ];

  const homeAccent = isWhatsCooking
    ? "whats-cooking"
    : isImpact
      ? "impact"
      : isBump
        ? "bump"
        : "default";

  return (
    <main
      className={`bg-white text-neutral-800 antialiased${isWhatsCooking ? " whats-cooking-case-study" : ""}`}
    >
      <CaseStudyHomeLink accent={homeAccent} />
      {cover ? (
        <div className="w-full bg-white">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div
              className="relative w-full max-w-[1280px] py-6 md:py-8"
              style={
                coverDims
                  ? {
                      aspectRatio: `${coverDims.width} / ${coverDims.height}`,
                    }
                  : undefined
              }
            >
              {isWhatsCooking ? (
                <WhatsCookingCover className="absolute inset-0 h-full w-full object-contain" />
              ) : (
                <PortfolioRasterCover
                  src={cover}
                  priority
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      ) : null}

      <nav
        className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 px-5 py-3.5 backdrop-blur-md md:px-10 lg:hidden"
        aria-label="On this page"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={caseStudyNavLinkClass}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <article
        id="top"
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pt-6 md:px-10 md:pt-10 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-14 ${
          hasNoBodySections ? "pb-10 md:pb-12" : "pb-24"
        }`}
      >
        <CaseStudyDesktopSectionNav
          items={navItems}
          linkClassName={caseStudyNavLinkClass}
          activeClassName={caseStudyNavLinkActiveClass}
        />

        <div className="min-w-0">
          {!hasOverviewSection ? (
            <div id="overview" className="scroll-mt-28" />
          ) : null}

          <p
            className="font-roboto-serif mt-0 max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl md:leading-[1.65]"
          >
            {study.lede}
          </p>

          <div
            className={`mt-10 grid grid-cols-1 gap-x-10 gap-y-8 border-b border-neutral-200 pb-12 text-sm text-neutral-700 ${caseStudyMetaGridCols}`}
          >
            <div>
              <p className={gridMetaHeadingClass}>Timeline</p>
              <p className="mt-1 text-neutral-400">{study.timeline}</p>
            </div>
            {study.role ? (
              <div>
                <p className={gridMetaHeadingClass}>Role</p>
                <p className="mt-1 whitespace-pre-line text-neutral-400">
                  {study.role}
                </p>
              </div>
            ) : null}
            <div>
              <p className={gridMetaHeadingClass}>Team</p>
              <ul className="mt-2 space-y-1 text-neutral-400">
                {study.team.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className={gridMetaHeadingClass}>Tools</p>
              <p className="mt-1 text-neutral-400">{study.tools.join(" · ")}</p>
            </div>
            {study.constraint ? (
              <div>
                <p className={gridMetaHeadingClass}>Constraint</p>
                <p className="mt-1 text-neutral-400">{study.constraint}</p>
              </div>
            ) : null}
          </div>

          <div className="max-w-2xl">
            {narrativePrompts.map((q) => (
              <p
                key={q}
                className="mt-8 border-l-2 border-neutral-200 pl-4 text-[15px] italic leading-relaxed text-neutral-600 first:mt-12"
              >
                {q}
              </p>
            ))}

            {!cover && !study.nda ? (
              <div className="mt-16 flex min-h-[200px] items-center justify-center border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-400">
                Cover image
              </div>
            ) : null}

            {!study.nda ? (
              <div
                className={
                  narrativePrompts.length
                    ? "mt-16 space-y-20 md:mt-20 md:space-y-24"
                    : "mt-10 space-y-20 md:mt-12 md:space-y-24"
                }
              >
                {study.sections.map((sec, index) => (
                  <section
                    key={sec.id}
                    id={sec.id}
                    className={
                      index === 0 && narrativePrompts.length === 0
                        ? "scroll-mt-28 pt-6 md:scroll-mt-32 md:pt-8"
                        : sec.suppressTopBorder
                          ? "scroll-mt-28 pt-14 md:scroll-mt-32 md:pt-16"
                          : "scroll-mt-28 border-t border-neutral-100 pt-14 md:scroll-mt-32 md:pt-16"
                    }
                  >
                    {!sec.hideRailLabel ? (
                      <p className={breakerLabelClass}>
                        {sectionRailLabel(sec)}
                      </p>
                    ) : null}
                    {!sec.hideLeadHeadlines ? (
                      <div className="mt-5 space-y-3">
                        {leadLinesFor(sec).map((line) => (
                          <h2
                            key={line}
                            className={`font-mono text-[clamp(1.05rem,3vw,1.45rem)] font-normal leading-snug tracking-tight ${
                              isImpact
                                ? "text-[#2863C4]"
                                : isBump
                                  ? "text-neutral-600"
                                  : "text-neutral-900"
                            }`}
                          >
                            {line}
                          </h2>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-6 space-y-4 text-[15px] leading-[1.75] text-neutral-600">
                      {sec.body.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                      {sec.subsections?.map((sub, si) => (
                        <div
                          key={`${sub.title}-${si}`}
                          className={
                            si === 0 ? "mt-10 space-y-4" : "mt-12 space-y-4"
                          }
                        >
                          <p
                            className={gridMetaHeadingClass}
                          >
                            {sub.title}
                          </p>
                          {sub.bodyBeforeFigures?.length
                            ? sub.bodyBeforeFigures.map((p, i) => (
                                <p key={`bf-${i}`}>{p}</p>
                              ))
                            : sub.body?.map((p, i) => (
                                <p key={`b-${i}`}>{p}</p>
                              ))}
                          {sub.numberedFindings &&
                          sub.numberedFindings.length > 0 ? (
                            <ol className="mt-8 list-none space-y-10 p-0 sm:space-y-12">
                              {sub.numberedFindings.map((item, fi) => (
                                <li
                                  key={item.title}
                                  className="flex gap-5 sm:gap-10"
                                >
                                  <span
                                    className={`shrink-0 font-mono text-[clamp(1.65rem,3.8vw,2.65rem)] font-light tabular-nums leading-none tracking-tight ${
                                      isImpact
                                        ? "text-[#2863C4]/[0.2]"
                                        : isBump
                                          ? "text-neutral-400"
                                          : "text-neutral-200"
                                    }`}
                                    aria-hidden
                                  >
                                    {String(fi + 1).padStart(2, "0")}
                                  </span>
                                  <div className="min-w-0 pt-0.5">
                                    <p
                                      className={`text-[15px] font-semibold leading-snug ${
                                        isImpact
                                          ? "text-[#2863C4]"
                                          : isBump
                                            ? "text-neutral-800"
                                            : "text-neutral-900"
                                      }`}
                                    >
                                      {item.title}
                                    </p>
                                    <p className="mt-2 text-[15px] leading-[1.75] text-neutral-600">
                                      {item.description}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          ) : null}
                          {sub.inlineFigures && sub.inlineFigures.length > 0 ? (
                            <div className="mt-10 space-y-6">
                              {sub.inlineFigures.map((fig) => {
                                const d = dimensionsForPortfolioRaster(
                                  fig.src,
                                );
                                const surfaceClass =
                                  sub.inlineFigureVariant === "light"
                                    ? "bg-white"
                                    : "bg-black";
                                const maxW =
                                  sub.inlineFigureVariant === "light"
                                    ? "max-w-5xl"
                                    : "max-w-3xl";
                                return (
                                  <figure
                                    key={fig.src}
                                    className={`m-0 w-full ${maxW}`}
                                  >
                                    <div className={`overflow-hidden ${surfaceClass}`}>
                                      {/* eslint-disable-next-line @next/next/no-img-element -- case study raster, intrinsic size from portfolio-raster-dimensions */}
                                      <img
                                        src={fig.src}
                                        alt={fig.alt}
                                        width={d.width}
                                        height={d.height}
                                        className="h-auto w-full object-contain"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>
                                  </figure>
                                );
                              })}
                            </div>
                          ) : null}
                          {sub.bodyBeforeFigures?.length
                            ? sub.body?.map((p, i) => (
                                <p key={`af-${i}`}>{p}</p>
                              ))
                            : null}
                          {sub.figures && sub.figures.length > 0 ? (
                            <CaseStudySubsectionFigures figures={sub.figures} />
                          ) : null}
                          {sub.bulletsIntro ? (
                            <p className="font-medium text-neutral-800">
                              {sub.bulletsIntro}
                            </p>
                          ) : null}
                          {sub.bullets?.length ? (
                            <ul className="list-inside list-disc space-y-2 pt-1 text-neutral-600">
                              {sub.bullets.map((b) => (
                                <li key={b}>{b}</li>
                              ))}
                            </ul>
                          ) : null}
                          {sub.table?.length ? (
                            <div className="max-w-2xl overflow-x-auto pt-1">
                              <table className="w-full min-w-[min(100%,20rem)] border-collapse text-left">
                                <tbody className="divide-y divide-neutral-200/70">
                                  {sub.table.map((row) => (
                                    <tr key={row.label} className="align-top">
                                      <th
                                        scope="row"
                                        className="w-[min(32%,10.5rem)] py-4 pr-6 text-[13px] font-medium leading-snug text-neutral-500 sm:pr-10"
                                      >
                                        {row.label}
                                      </th>
                                      <td className="py-4 text-[15px] leading-relaxed text-neutral-600">
                                        {row.description}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                          {sub.beforeTail ? (
                            <p className="mt-4 font-medium text-neutral-800">
                              {sub.beforeTail}
                            </p>
                          ) : null}
                          {sub.tail?.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                          {sub.tailInlineFigures &&
                          sub.tailInlineFigures.length > 0 ? (
                            <div className="mt-10 space-y-6">
                              {sub.tailInlineFigures.map((fig) => {
                                const d = dimensionsForPortfolioRaster(
                                  fig.src,
                                );
                                return (
                                  <figure
                                    key={fig.src}
                                    className="m-0 w-full max-w-4xl"
                                  >
                                    <div className="overflow-hidden bg-white">
                                      {/* eslint-disable-next-line @next/next/no-img-element -- case study raster, intrinsic size from portfolio-raster-dimensions */}
                                      <img
                                        src={fig.src}
                                        alt={fig.alt}
                                        width={d.width}
                                        height={d.height}
                                        className="h-auto w-full object-contain"
                                        loading="lazy"
                                        decoding="async"
                                      />
                                    </div>
                                  </figure>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      ))}
                      {sec.bodyFigures && sec.bodyFigures.length > 0 ? (
                        <div className="mt-10 space-y-6">
                          {sec.bodyFigures.map((fig) => {
                            const d = dimensionsForPortfolioRaster(fig.src);
                            const surfaceClass =
                              sec.bodyFigureVariant === "light"
                                ? "bg-white"
                                : "bg-black";
                            const maxW =
                              sec.bodyFigureVariant === "light"
                                ? "max-w-5xl"
                                : "max-w-3xl";
                            return (
                              <figure
                                key={fig.src}
                                className={`m-0 w-full ${maxW}`}
                              >
                                <div className={`overflow-hidden ${surfaceClass}`}>
                                  {/* eslint-disable-next-line @next/next/no-img-element -- case study raster, intrinsic size from portfolio-raster-dimensions */}
                                  <img
                                    src={fig.src}
                                    alt={fig.alt}
                                    width={d.width}
                                    height={d.height}
                                    className="h-auto w-full object-contain"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                </div>
                              </figure>
                            );
                          })}
                        </div>
                      ) : null}
                      {sec.bodyAfterFigures?.map((p, i) => (
                        <p key={`af-fig-${i}`}>{p}</p>
                      ))}
                      {sec.table?.length ? (
                        <div className="max-w-2xl overflow-x-auto">
                          <table className="w-full min-w-[min(100%,20rem)] border-collapse text-left">
                            <tbody className="divide-y divide-neutral-200/70">
                              {sec.table.map((row) => (
                                <tr key={row.label} className="align-top">
                                  <th
                                    scope="row"
                                    className="w-[min(32%,10.5rem)] py-4 pr-6 text-[13px] font-medium leading-snug text-neutral-500 sm:pr-10"
                                  >
                                    {row.label}
                                  </th>
                                  <td className="py-4 text-[15px] leading-relaxed text-neutral-600">
                                    {row.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : null}
                      {sec.bullets?.length ? (
                        <ul className="list-inside list-disc space-y-2 pt-1 text-neutral-600">
                          {sec.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {sec.liveEmbedUrl ? (
                      <div className="mt-10 w-full min-w-0 max-w-5xl overflow-x-hidden">
                        {sec.liveEmbedHideLink ? (
                          <a
                            href={
                              sec.liveEmbedOpenUrl ?? sec.liveEmbedUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sr-only"
                          >
                            Open prototype in Figma (new tab)
                          </a>
                        ) : (
                          <p className="mb-3 text-[13px] text-neutral-600">
                            <a
                              href={
                                sec.liveEmbedOpenUrl ?? sec.liveEmbedUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-neutral-800 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
                            >
                              Open in new tab
                            </a>
                            <span className="text-neutral-400">
                              {" "}
                              -{" "}
                              {(
                                sec.liveEmbedOpenUrl ?? sec.liveEmbedUrl
                              ).replace(/^https?:\/\//i, "")}
                            </span>
                          </p>
                        )}
                        <div className="relative h-[min(92dvh,1600px)] w-full min-w-0 overflow-hidden rounded-sm border border-black/10 bg-white">
                          <iframe
                            title={
                              sec.liveEmbedTitle ??
                              "Embedded case study preview"
                            }
                            src={sec.liveEmbedUrl}
                            className="absolute inset-0 box-border h-full w-full max-w-full border-0"
                            loading="lazy"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : null}
                    {showArtifacts && sec.id !== "reflection" ? (
                      <div className="mt-8">
                        <ArtifactPlaceholder label={sec.heading} />
                        <p className="mt-2 text-[11px] text-neutral-400">
                          Asset export pending - WebP, full width, descriptive
                          alt on insert.
                        </p>
                      </div>
                    ) : null}
                  </section>
                ))}
              </div>
            ) : null}

            <section
              id="outcome"
              className={`scroll-mt-28 ${
                study.nda
                  ? "mt-10 md:mt-12"
                  : "mt-20 border-t border-neutral-200 pt-12 md:mt-24 md:pt-14"
              }`}
            >
              <p className={breakerLabelClass}>
                {usesMoreInfoFooter ? "more info" : "the outcome"}
              </p>
              {!usesMoreInfoFooter && study.outcome ? (
                <p className="font-roboto-serif mt-4 text-lg text-neutral-900 md:text-xl">
                  {study.outcome}
                </p>
              ) : null}
              {!usesMoreInfoFooter && study.impactLine ? (
                <p className="mt-4 text-[15px] leading-[1.75] text-neutral-600">
                  {study.impactLine}
                </p>
              ) : null}
              <p className="mt-6 text-[15px] leading-[1.75] text-neutral-600">
                {study.nda ? (
                  <>
                    The products and designs I worked on are confidential, but
                    I&apos;m happy to chat more about my process and decisions
                    over a call. Reach out to me at{" "}
                    <a
                      href="mailto:oliviakttran@gmail.com"
                      className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
                    >
                      oliviakttran@gmail.com
                    </a>{" "}
                    :)
                  </>
                ) : usesMoreInfoFooter ? (
                  <>
                    Want to hear more about this project or how I work?
                    I&apos;m happy to chat :) reach out at{" "}
                    <a
                      href="mailto:oliviakttran@gmail.com"
                      className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
                    >
                      oliviakttran@gmail.com
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Want to hear more about this project or how I work?
                    I&apos;m happy to chat - reach out at{" "}
                    <a
                      href="mailto:oliviakttran@gmail.com"
                      className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900"
                    >
                      oliviakttran@gmail.com
                    </a>
                    .
                  </>
                )}
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
