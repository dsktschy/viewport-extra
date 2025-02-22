import type { Media } from "./Media.js";

export type MediaAttribute = string;

export const mergeNullableMediaAttribute = (
  precedingNullableMediaAttribute: MediaAttribute | null,
  followingNullableMediaAttribute: MediaAttribute | null,
): MediaAttribute | null =>
  followingNullableMediaAttribute ?? precedingNullableMediaAttribute;

export const createOptionalMedia = (
  nullableMediaAttribute: MediaAttribute | null,
): Media | undefined => nullableMediaAttribute ?? undefined;
