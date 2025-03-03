import type { Media } from "./Media.mjs";

export type MatchMedia = (query: string) => MediaQueryList;

export const createMatchMediaPredicate =
  (mm: MatchMedia) =>
  (media?: Media): boolean =>
    typeof media !== "undefined" ? mm(media).matches : true;
