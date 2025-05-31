export type Media = string;

export const defaultMedia = "";

export const createMedia = (optionalMedia: Media | undefined): Media =>
  optionalMedia ?? defaultMedia;

export const mergeOptionalMedia = (
  precedingOptionalMedia: Media | undefined,
  followingOptionalMedia: Media | undefined,
): Media | undefined => followingOptionalMedia ?? precedingOptionalMedia;
