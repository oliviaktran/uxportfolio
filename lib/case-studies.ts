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

/** Two-column table (e.g. role / responsibility breakdown) */
export type CaseStudyTableRow = {
  label: string;
  description: string;
};

/** Figure under a subsection; `src` is a path under `/public`. */
export type CaseStudySubsectionFigure = {
  src: string;
  alt: string;
};

/** Large index + bold title + paragraph (e.g. research themes). */
export type CaseStudyNumberedFinding = {
  title: string;
  description: string;
};

/** Titled block inside a section (body copy + optional lists / table). */
export type CaseStudySubsection = {
  title: string;
  body?: string[];
  /** Raster figures shown after `body` (paths like `/images/...`). */
  figures?: CaseStudySubsectionFigure[];
  /** Numbered vertical list (01, 02, …) with title + description. */
  numberedFindings?: CaseStudyNumberedFinding[];
  /** Full-width images below numbered findings / body (no thumbnail carousel). */
  inlineFigures?: CaseStudySubsectionFigure[];
  /** Paragraphs before `inlineFigures`; use with `body` for text after figures. */
  bodyBeforeFigures?: string[];
  /** Surface behind `inlineFigures` (persona cards use `light`). */
  inlineFigureVariant?: "dark" | "light";
  /** Line above bullets, e.g. “Key findings:” */
  bulletsIntro?: string;
  bullets?: string[];
  /** Short lead-in immediately before `tail` (e.g. “The key insight:”) */
  beforeTail?: string;
  /** Paragraphs after bullets / after `beforeTail` */
  tail?: string[];
  /** Full-width images after `tail` (e.g. journey map under key insight). */
  tailInlineFigures?: CaseStudySubsectionFigure[];
  table?: CaseStudyTableRow[];
};

/** OKDive-style section: phase label + optional editorial headlines + body */
export type CaseStudySection = {
  id: string;
  /** Sticky subnav link text */
  navLabel?: string;
  /** Uppercase phase keyword (e.g. RESEARCH) */
  phaseLabel?: string;
  /** Short title; used as fallback headline if leadLines omitted */
  heading: string;
  /** Large editorial lines (Diana Lu / OKDive ## style) */
  leadLines?: string[];
  /** Omit the large h2 block only; rail label (e.g. “context”) still shows. */
  hideLeadHeadlines?: boolean;
  /** Omit the small uppercase rail keyword above the section (nav link text unchanged). */
  hideRailLabel?: boolean;
  /** No top border rule before this section (e.g. after removing a prior section). */
  suppressTopBorder?: boolean;
  body: string[];
  /** In-content titled blocks (after `body`, before section-level table/bullets). */
  subsections?: CaseStudySubsection[];
  /** Full-width images after `subsections`, before section `table` / `bullets`. */
  bodyFigures?: CaseStudySubsectionFigure[];
  /** Surface for `bodyFigures` (`light` for UI mock comparisons). */
  bodyFigureVariant?: "dark" | "light";
  /** Paragraphs after `bodyFigures` (use with leading `body` + `bodyFigures` to split copy). */
  bodyAfterFigures?: string[];
  bullets?: string[];
  /** Optional label + description rows rendered as a table */
  table?: CaseStudyTableRow[];
  /** Live URL shown below section body (iframe + new-tab link) */
  liveEmbedUrl?: string;
  /** If set, “Open in new tab” uses this (e.g. Figma prototype) while iframe uses `liveEmbedUrl` (e.g. embed wrapper). */
  liveEmbedOpenUrl?: string;
  liveEmbedTitle?: string;
  /** Omit the visible “Open in new tab” row (screen-reader link kept when `liveEmbedOpenUrl` is set). */
  liveEmbedHideLink?: boolean;
};

export type CaseStudy = {
  slug: string;
  number: string;
  categoryLine: string;
  year: string;
  title: string;
  lede: string;
  role: string;
  timeline: string;
  team: string[];
  tools: string[];
  /** Optional fourth meta column (e.g. hackathon platform constraints). */
  constraint?: string;
  nda: boolean;
  outcome?: string;
  impactLine?: string;
  /** Optional italic framing line(s) under the meta grid, with `hmws` */
  brief?: string;
  /** Three chips under lede - e.g. Context | Course | Dates */
  contextChips?: string[];
  /** Show gray artifact placeholders under sections (off for OKDive-style pages) */
  showArtifactPlaceholders?: boolean;
  sections: CaseStudySection[];
  hmws?: string[];
  reflection?: string[];
};

/** Default phase labels by section id - OKDive-style uppercase rails */
export const caseStudyPhaseById: Record<string, string> = {
  context: "CONTEXT",
  landscape: "RESEARCH",
  "user-research": "RESEARCH",
  synthesis: "SYNTHESIS",
  "personas-goals": "STRATEGY",
  "ideation-design": "IDEATION",
  testing: "DESIGN",
  final: "DESIGN",
  outcomes: "OUTCOMES",
  reflection: "REFLECTION",
  problem: "CONTEXT",
  overview: "CONTEXT",
  role: "STRATEGY",
  research: "RESEARCH",
  design: "DESIGN",
  results: "OUTCOMES",
  impact: "OUTCOMES",
  learnings: "REFLECTION",
};

export const caseStudies: Record<string, CaseStudy> = {
  "whats-cooking": {
    slug: "whats-cooking",
    number: "001",
    categoryLine: "PERSONAL PROJECT",
    year: "2026",
    title: "What's Cooking?",
    lede:
      "Designing and shipping an AI-powered meal generator using Cursor, Claude API, and a custom PRD to go from design system to deployed product.",
    role: "Product designer\nBuilder",
    timeline: "2026",
    team: ["Solo"],
    tools: ["Cursor", "Claude API", "Figma", "TypeScript", "Next.js"],
    nda: false,
    contextChips: ["Personal project", "AI product", "2026"],
    sections: [
      {
        id: "context",
        heading: "Context",
        leadLines: ["The daily dinner problem."],
        body: [
          "Every day, millions of people face the same paralysing question: what's for dinner? They open the fridge, see random ingredients, and either order takeaway or make the same three meals on rotation...or maybe it's just me :(",
          "What's Cooking? is an AI-powered meal generator that turns whatever ingredients you have into personalised recipe suggestions. It's complete with nutritional info, step-by-step instructions, and a one-tap shopping list.",
        ],
      },
      {
        id: "role",
        heading: "My role",
        navLabel: "My role",
        leadLines: ["Design Engineer - solo, end to end"],
        body: [
          "This project was a deliberate experiment in AI-assisted design and build. I owned every layer:",
        ],
        table: [
          {
            label: "Product Thinking",
            description:
              "Defined the problem, user flow, and MVP scope before touching any tool",
          },
          {
            label: "Design System",
            description:
              "Colour tokens, typography scale, every component spec written in a PRD",
          },
          {
            label: "Spec Writing",
            description:
              "Produced a full PRD detailed enough to feed directly into Cursor",
          },
          {
            label: "AI Direction",
            description:
              "Used Cursor to scaffold the UI from the PRD - directing the AI, not just prompting it",
          },
          {
            label: "API Integration",
            description:
              "Wired Claude API to generate recipes from live user selections",
          },
          {
            label: "Deployment",
            description:
              "Shipped to Vercel with environment variables and production config",
          },
        ],
      },
      {
        id: "design",
        heading: "Design system & UI",
        leadLines: ["Designing the system before the screens"],
        body: [
          "Before writing a single line of code, I defined the entire design system in a structured PRD: color tokens, typography, component states, and interaction specs. This became the single source of truth I fed into Cursor, allowing AI to build production-ready components that matched the design I intended.",
        ],
      },
      {
        id: "results",
        heading: "Build & ship",
        leadLines: ["Claude API + Cursor in the loop"],
        body: [
          "The app calls the Claude API for meal and recipe generation, with server-side handling for prompts, parsing, and guardrails. I iterated in Cursor with tight feedback loops: UI polish, error states, and API contracts all moved together until the experience felt production-ready and deployable.",
        ],
        liveEmbedUrl: "https://whats-cooking-xi.vercel.app/",
        liveEmbedTitle: "What’s Cooking - live app",
      },
      {
        id: "reflection",
        heading: "Reflection",
        leadLines: ["The spec is the design."],
        body: [
          "The single biggest shift in my thinking from this project: when working with AI build tools, the PRD is no longer just documentation. It is the design. The quality of what Cursor produces is a direct reflection of how precisely you've defined the system.",
          "Vague spec, vague output. Sharp spec, sharp output.",
        ],
      },
    ],
  },
  jpmc: {
    slug: "jpmc",
    number: "002",
    categoryLine: "INTERNSHIP",
    year: "2023",
    title: "JPMorganChase",
    lede:
      "Shaping the employee experiences for 320,000+ employees.",
    role: "Product Designer",
    timeline: "2024-2025",
    team: [
      "Architecture",
      "Engineering",
      "Design",
      "Analytics",
    ],
    tools: ["Figma"],
    nda: true,
    contextChips: ["Internship", "Internal platforms", "June - August 2023"],
    sections: [
      {
        id: "context",
        heading: "Context",
        body: [
          "I redesigned and enhanced a proprietary internal code deployment system accessed by 5,000+ applications. I also designed a comprehensive toolkit webpage used by 100+ designers and delivered research reports and a journey map to executive leadership.",
        ],
      },
      {
        id: "learnings",
        heading: "Learnings",
        bullets: [
          "How to move fast inside a highly regulated enterprise without sacrificing research rigor.",
          "Clear storytelling from research to leadership is as critical as the screens.",
          "Design systems scale when documentation matches real designer workflows.",
        ],
        body: [],
      },
      {
        id: "reflection",
        heading: "Reflection",
        body: [
          "This internship deepened my ability to translate messy technical constraints into approachable experiences - and to advocate for users who are also expert practitioners.",
        ],
      },
    ],
  },
  impact: {
    slug: "impact",
    number: "003",
    categoryLine: "CASE STUDY",
    year: "2023",
    title: "IMPACT",
    lede:
      "A mobile fitness app empowering full-time remote workers to stay active, build healthy habits, and reclaim their well-being - without leaving home.",
    role: "UX Designer, UX Researcher",
    timeline: "2023",
    team: ["Classmates"],
    tools: ["Figma"],
    nda: false,
    impactLine:
      "Presented to class; peers and instructor shared that they wanted an app like this to exist.",
    contextChips: [
      "UW INFO 360 - Design Thinking",
      "Class project",
      "2023",
    ],
    sections: [
      {
        id: "context",
        heading: "Context",
        hideLeadHeadlines: true,
        body: [
          "My contributions spanned the full project: I led contextual inquiry interviews, synthesized research findings, and owned the high-fidelity visual design. This case study walks through every decision, dead-end, and breakthrough along the way.",
          "For my UX Design Thinking class at the University of Washington, my team set out to tackle health and wellness through a human-centered design lens. What started as a broad prompt evolved into a focused, research-driven product: IMPACT - a mobile app built specifically for full-time remote employees who want to move more but keep running into the same invisible walls.",
        ],
      },
      {
        id: "user-research",
        heading: "Understanding the Problem Space",
        body: [],
        subsections: [
          {
            title: "Secondary Research",
            body: [
              "We started by grounding ourselves in existing research to identify known patterns before introducing our own assumptions.",
            ],
            bulletsIntro: "Key findings from secondary research:",
            bullets: [
              "Blurred work-life boundaries make it harder to carve out time for exercise. (Harvard Business Review)",
              "Prolonged sedentary behavior leads to serious health consequences including obesity, cardiovascular disease, and musculoskeletal problems. (World Health Organization)",
              "Remote workers struggle significantly more with maintaining motivation and accountability for exercise. (Journal of Occupational and Environmental Medicine)",
            ],
          },
          {
            title: "Competitive Analysis",
            body: [
              "We audited the top fitness apps on the market - FitOn, Nike Training Club, and Strava - to understand what solutions already existed and where the gaps were.",
              "The finding was striking: the market was oversaturated with apps competing on the exact same features - workout video libraries and activity tracking. Not one of them addressed the core friction points for remote workers: space constraints, motivation decay, or health literacy.",
            ],
            beforeTail: "The question this raised for us:",
            tail: [
              "If all these tools already exist - why are remote employees still struggling to work out at home?",
            ],
          },
          {
            title: "Contextual Inquiry - Going Beyond the Survey",
            body: [
              "I knew surveys wouldn't give us what we needed. To truly understand our users, I led my team in conducting contextual inquiries with 4 full-time remote workers - a two-part method that combined traditional interviewing with real-time observation.",
            ],
          },
          {
            title: "Part 1 - Conventional Interview",
            body: [
              "I developed and facilitated individual interviews to uncover each participant's relationship with exercise, their home environment, and what made staying active feel hard.",
            ],
            bulletsIntro: "Key questions I used:",
            bullets: [
              "Walk me through a typical day in your remote work life.",
              "Do you currently exercise? What does that look like?",
              "What gets in the way of working out when you're home all day?",
              "What would motivate you to move more?",
            ],
          },
          {
            title: "Part 2 - Contextual Interview (Observation in Context)",
            body: [
              "In each session, I asked participants to walk me through their actual day in real time - not from memory, but as it happened. This gave me a window into behaviors people don't think to mention: the overflowing desk that doubles as a dining table, the apartment where the living room is also the \"gym,\" the mid-afternoon slump that kills any intention of working out.",
              "When I needed to clarify what I was seeing, I paused to confirm my interpretation rather than assume. This kept the data grounded in the user's reality, not my projections.",
            ],
            figures: [
              {
                src: "/images/impact-contextual-interview-01.png",
                alt: "Interview write-up: contextual session introduction, consent framing, video call still with identity obscured, and opening conventional interview questions.",
              },
              {
                src: "/images/impact-contextual-interview-02.png",
                alt: "Interview write-up: participant quote on exercising at home, transition into contextual walkthrough, and narrative of a typical remote workday.",
              },
              {
                src: "/images/impact-contextual-interview-03.png",
                alt: "Interview transcript excerpt with questions and answers on distraction, motivation, gym habits, and exercise while working from home.",
              },
              {
                src: "/images/impact-contextual-interview-04.png",
                alt: "Interview write-up: wrap-up and clarifying questions after the contextual walkthrough, plus reflections on remote moderation limits.",
              },
            ],
          },
          {
            title: "A Challenge I Navigated - Privacy in the Home",
            table: [
              {
                label: "Obstacle",
                description:
                  "Some participants were uncomfortable allowing observation inside their homes - a completely valid concern I hadn't fully anticipated.",
              },
              {
                label: "How I resolved it",
                description:
                  "I reassured participants that all data would be anonymized and used solely for research. I gave them full control over which areas or activities they shared - turning the session into a collaboration rather than a surveillance exercise. This also deepened trust, which made the interviews richer.",
              },
            ],
          },
          {
            title: "What We Learned - Research Findings",
            body: [
              "Four clear themes emerged from our interviews and observations:",
            ],
            numberedFindings: [
              {
                title: "Lack of Motivation",
                description:
                  "Even if the user begins their fitness journey, motivation would decline with little to no means of raising it up again over time.",
              },
              {
                title: "Limited Space",
                description:
                  "Living in small spaces can be difficult for people to exercise without having to go to an outside space such as a park or the gym.",
              },
              {
                title: "Time Management",
                description:
                  "Many participants expressed challenges in effectively managing their time while working remotely.",
              },
              {
                title: "Need for Education and Awareness",
                description:
                  "Participants emphasized the need for easily accessible information on the health risks of a sedentary lifestyle.",
              },
            ],
            beforeTail: "The key insight:",
            tail: [
              "Most users weren't inactive by choice - they were active starters who hit a motivation cliff and had no tools to climb back up. The opportunity wasn't to get people started; it was to keep them going.",
              "To make this tangible, I mapped a mini user journey tracing the emotional arc from initial motivation → routine establishment → motivation decline → dropout. This became our north star for identifying intervention points in the design.",
            ],
            tailInlineFigures: [
              {
                src: IMPACT_USER_JOURNEY_MAP_SRC,
                alt: "User journey map: emotional arc from goal initiation through exercise success, motivation decline with an opportunity to sustain engagement, and eventual dropout.",
              },
            ],
          },
        ],
      },
      {
        id: "personas-goals",
        heading: "Defining the problem",
        leadLines: [
          "How might we design a solution that consistently boosts motivation and provides accessible resources for full-time remote employees?",
        ],
        body: [
          "Revisiting our competitive analysis through the lens of our research made the opportunity undeniable: no existing app addressed motivation sustainment, space-adaptive workouts, or health education in an integrated way. The market was full of tools for people who were already motivated - nothing existed for the moment the motivation runs dry.",
        ],
        subsections: [
          {
            title: "User Personas",
            bodyBeforeFigures: [
              "I synthesized our research into two personas that anchored all future design decisions - not as hypothetical users, but as distilled portraits of the real people we interviewed.",
            ],
            inlineFigureVariant: "light",
            inlineFigures: [
              {
                src: IMPACT_PERSONA_RICKIE_CHEN_SRC,
                alt: "Persona card for Rickie Chen, 41, software engineer in Seattle: remote work, introvert and homebody traits, about narrative, goals such as adaptable exercises and motivation, and frustrations including gym cost and small space.",
              },
              {
                src: IMPACT_PERSONA_SHELLEY_DEAN_SRC,
                alt: "Persona card for Shelley Dean, 26, product designer in San Francisco: fully remote fin-tech role, extrovert and athletic traits, about narrative, goals including gym frequency and incentives, and frustrations such as motivation and time.",
              },
            ],
            body: [
              "These personas kept the team grounded during ideation: every feature we considered had to serve Rickie or Shelley, not a generic 'fitness app user.'",
            ],
          },
        ],
      },
      {
        id: "ideation-design",
        heading: "Ideation & low-fidelity design",
        leadLines: ["Ideation, votes, and three pathways forward"],
        body: [
          "We generated many ideas for a motivational experience, voted as a team, and plotted ideas by implementation effort against our goals. A mobile app emerged as the strongest way to cover motivation, accessibility, and education together.",
        ],
        bodyFigureVariant: "light",
        bodyFigures: [
          {
            src: IMPACT_IDEATION_BOARD_SRC,
            alt: "Ideation board: sketches grouped from low to high effort under Rewards and Encouragement, Resources and tools, and Physical Objects, with dot voting across themes like encouragement, education, beneficial exercises, and meaningful change.",
          },
        ],
        bodyAfterFigures: [
          "Low-fi wireframes mapped three straightforward paths toward those goals.",
        ],
        bullets: [
          "Learning pathway - modules and quizzes on health and fitness; completing modules earns PTO-style points.",
          "Exercise pathway - workout videos with filters for available space and time; points scale with workout intensity.",
          "Reward pathway - progress toward PTO rewards, weekly points, and a company-wide leaderboard to reinforce habit.",
        ],
      },
      {
        id: "testing",
        heading: "Usability Testing - 3 Rounds of Iteration",
        leadLines: ["Usability Testing - 3 Rounds of Iteration"],
        body: [
          "We ran moderated think-aloud testing over Zoom with 5 participants across each round, including remote employees, peers, instructors, and TAs. Participants were asked to complete learning modules, find a suitable workout, and track their progress while narrating their experience aloud.",
          "This process was humbling and essential. Here's what we found and how we responded:",
        ],
        bodyFigureVariant: "light",
        bodyFigures: [
          {
            src: IMPACT_USABILITY_LEARN_HUB_SRC,
            alt: "Learn tab evolution: plain lesson list, then visual topic grid, then high-fidelity cards with thumbnails, points, and duration plus saved and explore sections.",
          },
          {
            src: IMPACT_USABILITY_MODULE_CONTENT_SRC,
            alt: "Learning module evolution: dense text wall, then segmented cards with photos, then modular lessons with bite-sized units and an immersive dark lesson view with progress.",
          },
          {
            src: IMPACT_USABILITY_QUIZ_ITERATION_SRC,
            alt: "Cardiovascular quiz iteration: text-heavy multiple choice versus immersive full-screen question with pill answers and runner photography, responding to feedback that the first format felt like a classroom test.",
          },
          {
            src: IMPACT_USABILITY_LESSON_COMPLETION_SRC,
            alt: "Lesson completion flow: wireframe points screen, mid-fidelity celebration with pattern, then high-fidelity gradient with View Recommended Workouts and a linked workout recommendation screen.",
          },
        ],
      },
      {
        id: "final",
        heading: "Style guide & final product",
        leadLines: ["Accessible UI and the final experience"],
        body: [],
        bodyFigureVariant: "light",
        bodyFigures: [
          {
            src: IMPACT_FINAL_PRODUCT_SCREENS_SRC,
            alt: "Twelve high-fidelity mobile screens: Learn flow from lesson explore through quiz and completion to workout recommendation; home dashboard with points and PTO redemption; workout search with space and duration filters, advanced filters, results, detail, and active workout view.",
          },
        ],
      },
      {
        id: "reflection",
        heading: "What I Learned and next steps",
        leadLines: ["What I Learned and next steps"],
        body: [
          "This project reinforced something I now hold as a core design principle: the best insights don't come from surveys - they come from watching people in their actual environment. The contextual inquiry sessions were the most valuable 2 hours of the entire project. Seeing someone's cluttered apartment or hearing them laugh nervously about their \"workout corner\" told me more than any questionnaire ever could.",
          "Three rounds of usability testing also made the iterative process visceral. Watching users struggle with a filter button I thought was obvious, then redesigning it, then watching the next user breeze right through - that feedback loop is where design actually happens.",
          "Working within a team taught me the value of friction. Diverse perspectives slowed us down in the best way - they forced us to pressure-test assumptions and reach better solutions than any of us would have alone.",
        ],
        subsections: [
          {
            title: "If I Had More Time",
            bullets: [
              "Conduct additional usability testing with a larger and more demographically diverse participant group.",
              "Refine micro-interactions and animation to make the reward system feel more satisfying and polished.",
              "Validate the PTO reward mechanic with real employer stakeholders to assess feasibility as a workplace wellness program.",
            ],
          },
          {
            title: "Planned Next Steps",
            bullets: [
              "Inclusivity. Design alternative exercise pathways for users with physical disabilities or mobility limitations.",
              "Professional Partnerships. Partner with certified fitness trainers and health professionals to create medically-informed workout recommendations based on individual health profiles.",
              "Richer Multimedia Content. Explore richer multimedia formats: video demonstrations, interactive body-weight calculators, and audio-guided workouts to serve diverse learning styles.",
            ],
          },
        ],
      },
    ],
  },
  bump: {
    slug: "bump",
    number: "004",
    categoryLine: "HACKATHON",
    year: "2023",
    title: "bump",
    lede:
      "A virtual networking app that recreates the spontaneous, serendipitous collisions of in-person professional life — designed solo in 48 hours.",
    role: "",
    timeline: "48 Hours",
    team: ["Designer - Solo Project"],
    tools: ["Figma", "Agora Design Guidelines"],
    constraint:
      "Design for Agora's video, voice, streaming, and messaging platform",
    nda: false,
    outcome: "1st Place - Enterprise Track, UW Protothon 2023",
    contextChips: ["Hackathon", "UW Protothon", "2023"],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        leadLines: [
          "How do we recreate the spontaneous, unplanned moments of in-person networking in a fully virtual environment?",
        ],
        body: [
          "There’s a specific kind of magic that happens when you round a corner at a conference and bump into someone you’ve been meaning to meet. Or when you overhear a conversation in the office kitchen and find yourself pulled into it. These spontaneous moments are where real professional relationships are built — and remote work has almost completely eliminated them.",
          "bump started from something personal: watching my older brother, a recent grad entering a fully remote role struggle to build any sense of professional belonging. He could join meetings, send Slack messages, and do great work. But he couldn’t meet anyone.",
          "The UW Protothon 2023 prompt asked teams to design an enterprise real-time engagement app using Agora’s platform. I saw it immediately: this was a chance to solve the spontaneous connection problem. I had 48 hours. I worked alone. And I won first place in the Enterprise Track.",
          "This case study walks through every decision I made - the research that grounded them, the design tradeoffs I navigated, and the constraints I worked within.",
        ],
      },
      {
        id: "research",
        heading: "Research",
        hideLeadHeadlines: true,
        body: [
          "With limited time, I made a deliberate choice: rather than guessing at user pain points, I interviewed two new grad employees — the exact profile of users most affected by remote networking challenges. These are the people for whom building a professional network isn’t a nice-to-have; it’s critical for their career trajectory.",
        ],
        subsections: [
          {
            title: "Primary interviews",
            body: [
              "I designed my questions to uncover the emotional reality of remote networking, not just the practical friction:",
            ],
            bullets: [
              "How would you describe your experience transitioning into a remote work environment?",
              "What are your typical challenges when trying to connect with other employees virtually?",
              "How do you currently stay connected with colleagues and build professional relationships remotely?",
            ],
          },
          {
            title: "Target Customer & Their Goals",
            body: ["The company-level goals that bump needed to serve:"],
            numberedFindings: [
              {
                title: "Team Collaboration",
                description:
                  "Enable distributed teams to collaborate, brainstorm, and build cohesion through seamless, interactive meetings.",
              },
              {
                title: "Virtual Social Hub",
                description:
                  "Create a persistent virtual social hub where employees can connect across teams — not just in scheduled meetings, but in the casual moments between them.",
              },
            ],
          },
        ],
      },
      {
        id: "design",
        heading: "Design process",
        body: [
          "Lo-fi sketches explored anonymous versus public room metaphors; wireframe variants converged on a browsable room list with live presence. Hi-fi screens aligned with Agora’s real-time video patterns.",
        ],
        subsections: [
          {
            title: "Ideation",
            body: [
              "After understanding the problem and my users, I started to sketch out my ideas of possible concepts that would achieve my design goals. Even the wildest ones. Throughout my brainstorming process, I made an effort to envision what it feels like to network and “bump” into people in real life.",
            ],
            inlineFigureVariant: "light",
            inlineFigures: [
              {
                src: "/images/bump-lowfi-sketches.jpg",
                alt: "Four hand-drawn index-card sketches exploring bump concepts: chat rooms with presence, multiple rooms in a shared hub, company floor layout for rooms, and nested listener zones within a conversation.",
              },
            ],
          },
        ],
      },
      {
        id: "results",
        heading: "Results",
        leadLines: [
          "The concept placed first in the Enterprise Track - validating that lightweight social presence can pair with professional boundaries in remote settings.",
        ],
        body: [],
        bodyFigures: [
          {
            src: "/images/finalbump.png",
            alt: "Conversation States: floating avatars with speaking indicator; spectate zone to hear before joining; Join Conversation; entering the inner circle as a full participant.",
          },
        ],
        bodyFigureVariant: "light",
        liveEmbedUrl:
          "https://embed.figma.com/proto/0TwbU0Nq9qnv5K2si1JfhA/bump?node-id=6-2865&p=f&viewport=-198%2C-3979%2C0.39&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=6%3A2865&page-id=6%3A42&embed-host=share",
        liveEmbedOpenUrl:
          "https://www.figma.com/proto/0TwbU0Nq9qnv5K2si1JfhA/bump?node-id=6-2865&p=f&viewport=-198%2C-3979%2C0.39&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=6%3A2865&page-id=6%3A42",
        liveEmbedTitle: "bump — Figma prototype",
        liveEmbedHideLink: true,
      },
    ],
  },
};

export const caseStudySlugs = Object.keys(caseStudies);
