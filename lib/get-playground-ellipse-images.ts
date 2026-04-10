import fs from "fs";
import path from "path";

import {
  type PlaygroundTheme,
  playgroundThemeForSrc,
  PLAYGROUND_THEMES,
} from "@/lib/playground-image-categories";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg)$/i;

/** File names that are safe as a single URL path segment without encoding. */
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function urlSegment(name: string): string {
  return SAFE_SEGMENT.test(name) ? name : encodeURIComponent(name);
}

/**
 * Resolve the Next.js app root (directory that contains `public/`) even when
 * `process.cwd()` is a parent folder (e.g. dev started from Desktop).
 */
function resolveAppRoot(): string {
  let dir = path.resolve(/* turbopackIgnore: true */ process.cwd());

  for (let i = 0; i < 10; i++) {
    const playground = path.join(dir, "public", "images", "playground");
    if (fs.existsSync(playground)) {
      return dir;
    }
    const nestedUx = path.join(dir, "uxportfolio", "public", "images", "playground");
    if (fs.existsSync(nestedUx)) {
      return path.join(dir, "uxportfolio");
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return path.resolve(/* turbopackIgnore: true */ process.cwd());
}

type PlaygroundDir = { absDir: string; urlPrefix: string };

function playgroundDirsForRoot(root: string): PlaygroundDir[] {
  return [
    {
      absDir: path.join(root, "public", "images", "playground"),
      urlPrefix: "/images/playground",
    },
    {
      absDir: path.join(root, "public", "playground"),
      urlPrefix: "/playground",
    },
  ];
}

function listImagesFromDir(absDir: string, urlPrefix: string): string[] {
  if (!fs.existsSync(absDir)) {
    return [];
  }

  return fs
    .readdirSync(absDir)
    .filter((name) => !name.startsWith(".") && IMAGE_EXT.test(name))
    .map((name) => `${urlPrefix}/${urlSegment(name)}`);
}

export type { PlaygroundTheme } from "@/lib/playground-image-categories";
export { PLAYGROUND_THEMES } from "@/lib/playground-image-categories";

/** Split in half and interleave (riffle shuffle). */
function riffleInterleave<T>(items: T[]): T[] {
  if (items.length <= 2) return items;
  const mid = Math.ceil(items.length / 2);
  const first = items.slice(0, mid);
  const second = items.slice(mid);
  const out: T[] = [];
  const len = Math.max(first.length, second.length);
  for (let i = 0; i < len; i++) {
    if (i < first.length) out.push(first[i]!);
    if (i < second.length) out.push(second[i]!);
  }
  return out;
}

/** Split into thirds and interleave …A0,B0,C0,A1,B1,C1… for stronger color/scene spacing. */
function interleaveThirds<T>(items: T[]): T[] {
  if (items.length <= 3) return items;
  const k = Math.ceil(items.length / 3);
  const a = items.slice(0, k);
  const b = items.slice(k, 2 * k);
  const c = items.slice(2 * k);
  const out: T[] = [];
  const len = Math.max(a.length, b.length, c.length);
  for (let i = 0; i < len; i++) {
    if (i < a.length) out.push(a[i]!);
    if (i < b.length) out.push(b[i]!);
    if (i < c.length) out.push(c[i]!);
  }
  return out;
}

/** Color / scene spacing for one list (used per theme). */
export function balancePlaygroundOrder(urls: string[]): string[] {
  const sorted = [...urls].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
  return riffleInterleave(
    interleaveThirds(riffleInterleave(interleaveThirds(sorted))),
  );
}

function listSortedPlaygroundUrls(): string[] {
  const root = resolveAppRoot();
  const urls = playgroundDirsForRoot(root).flatMap(({ absDir, urlPrefix }) =>
    listImagesFromDir(absDir, urlPrefix),
  );
  return urls.sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

/**
 * Images grouped by theme, each ellipse order balanced separately.
 */
export function getPlaygroundImagesByTheme(): Record<
  PlaygroundTheme,
  string[]
> {
  const buckets: Record<PlaygroundTheme, string[]> = {
    nature: [],
    food: [],
    life: [],
  };

  for (const src of listSortedPlaygroundUrls()) {
    const theme = playgroundThemeForSrc(src);
    buckets[theme].push(src);
  }

  const out = {} as Record<PlaygroundTheme, string[]>;
  for (const t of PLAYGROUND_THEMES) {
    out[t] = balancePlaygroundOrder(buckets[t]);
  }
  return out;
}

/**
 * @deprecated Use getPlaygroundImagesByTheme for themed ellipses.
 * All images in one balanced list (legacy).
 */
export function getPlaygroundEllipseImages(): string[] {
  return balancePlaygroundOrder(listSortedPlaygroundUrls());
}
