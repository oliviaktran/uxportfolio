/**
 * Curated themes for /playground photos (by public filename).
 *
 * Rule: **nature** = landscapes, plants, outdoor scenes (food not the subject).
 * **food** = dishes, ingredients, drinks where food/drink is the subject.
 * **life** = everything else (people, interiors, travel, craft, etc.).
 *
 * Edit FILENAME_THEME when you add or replace assets.
 */
export type PlaygroundTheme = "nature" | "food" | "life";

const FILENAME_THEME: Record<string, PlaygroundTheme> = {
  "playground-01.png": "life", // picnic / friend + cake on grass (lifestyle, not dish-first)
  "playground-02.png": "life",
  "playground-03.png": "nature", // sunset, water, sky
  "playground-04.png": "nature", // beach / coast / dunes
  "playground-05.png": "life", // people, architecture, travel
  "playground-06.png": "nature", // desert / land / exterior landscape
  "playground-07.png": "life", // dining space (room, not dish hero)
  "playground-08.png": "nature", // paths, trees, seasons
  "playground-09.png": "nature", // sheep / pasture
  "playground-10.png": "nature", // fenced vegetable rows / garden outdoors
  "playground-11.png": "life", // golf driving range / targets (not food)
  "playground-12.png": "life", // lounge / tufted sofa interior (not food)
  "playground-13.png": "food", // pasta / restaurant dish
  "playground-14.png": "food", // plate / meal (was under life)
  "playground-15.png": "life", // not food-forward (was miscategorized as food)
  "playground-16.png": "life",
  "playground-17.png": "nature",
  "playground-18.png": "life",
  "playground-19.png": "life", // not food-forward (was miscategorized as food)
  "playground-20.png": "nature",
  "playground-21.png": "food", // meal / dish (was under life)
  "playground-22.png": "life",
  "playground-23.png": "food", // carrot cake / dessert (restaurant)
  "playground-24.png": "nature", // vineyard / land through window
  "playground-25.png": "nature", // orchard / fields
  "playground-26.png": "food", // iced coffee
  "playground-27.png": "food", // cheese / charcuterie
  "playground-28.png": "food", // pastries
  "playground-29.png": "nature", // lake, paddleboards
  "playground-30.png": "life", // pottery / studio
};

export const PLAYGROUND_THEMES: PlaygroundTheme[] = ["nature", "food", "life"];

export function playgroundThemeForSrc(src: string): PlaygroundTheme {
  const base = src.split("/").pop() ?? "";
  return FILENAME_THEME[base] ?? "life";
}
