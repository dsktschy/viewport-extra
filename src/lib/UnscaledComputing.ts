export type UnscaledComputing = boolean;

export const defaultUnscaledComputing = false;

export const createUnscaledComputing = (
  optionalUnscaledComputing: UnscaledComputing | undefined,
): UnscaledComputing => optionalUnscaledComputing ?? defaultUnscaledComputing;

export const mergeOptionalUnscaledComputing = (
  precedingOptionalUnscaledComputing: UnscaledComputing | undefined,
  followingOptionalUnscaledComputing: UnscaledComputing | undefined,
): UnscaledComputing | undefined =>
  followingOptionalUnscaledComputing ?? precedingOptionalUnscaledComputing;
