export type ProjectCategory =
  | "INTERNSHIP"
  | "CASE STUDY"
  | "PERSONAL PROJECT"
  | "HACKATHON";

export type Project = {
  number: string;
  slug: string;
  /** Bold project name (featured row title) */
  title: string;
  company: string;
  summary: string;
  category: ProjectCategory;
  year: string;
  coverImage?: string;
  /** Optional wider hero for /work/[slug]; falls back to coverImage */
  caseStudyCoverImage?: string;
};

export const projects: Project[] = [
  {
    number: "001",
    slug: "whats-cooking",
    title: "What's Cooking?",
    company: "Personal",
    summary:
      "Designing and shipping an AI-powered meal generator using Cursor, Claude API, and a custom PRD to go from design system to deployed product.",
    category: "PERSONAL PROJECT",
    year: "2026",
    coverImage: "/images/whats-cooking-cover.svg",
    caseStudyCoverImage: "/images/whats-cooking-cover.svg",
  },
  {
    number: "002",
    slug: "jpmc",
    title: "Employee Exprience",
    company: "JPMorganChase",
    summary:
      "Shaping the employee experiences for 320,000+ employees.",
    category: "INTERNSHIP",
    year: "2025",
    coverImage: "/images/jpmc-hero.png",
  },
  {
    number: "003",
    slug: "impact",
    title: "IMPACT",
    company: "UW INFO 360",
    summary:
      "A mobile fitness app empowering full-time remote workers to stay active, build healthy habits, and reclaim their well-being - without leaving home.",
    category: "CASE STUDY",
    year: "2023",
    coverImage: "/images/impact-hero.png",
    caseStudyCoverImage: "/images/impact-hero.png",
  },
  {
    number: "004",
    slug: "bump",
    title: "bump",
    company: "Protothon 2023",
    summary:
      "48-hour hackathon: virtual “hallway” networking with live rooms - 1st place Enterprise Track.",
    category: "HACKATHON",
    year: "2023",
    coverImage: "/images/bump-hero.png",
  },
];

export const workFilters = [
  "ALL",
  "INTERNSHIP",
  "CASE STUDY",
  "PERSONAL PROJECT",
  "HACKATHON",
] as const;

export type WorkFilter = (typeof workFilters)[number];
