import fs from "fs";
import path from "path";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|svg)$/i;

const PLAYGROUND_DIR = path.join(process.cwd(), "public/images/images");

export function getPlaygroundEllipseImages(): string[] {
  if (!fs.existsSync(PLAYGROUND_DIR)) {
    return [];
  }

  return fs
    .readdirSync(PLAYGROUND_DIR)
    .filter((name) => !name.startsWith(".") && IMAGE_EXT.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
    .map((name) => {
      const segment = encodeURIComponent(name);
      return `/images/images/${segment}`;
    });
}
