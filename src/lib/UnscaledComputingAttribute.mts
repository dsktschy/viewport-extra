import type { UnscaledComputing } from "./UnscaledComputing.mjs";

export type UnscaledComputingAttribute = string;

export const mergeNullableUnscaledComputingAttribute = (
  precedingNullableUnscaledComputingAttribute: UnscaledComputingAttribute | null,
  followingNullableUnscaledComputingAttribute: UnscaledComputingAttribute | null,
): UnscaledComputingAttribute | null =>
  followingNullableUnscaledComputingAttribute ??
  precedingNullableUnscaledComputingAttribute;

export const createOptionalUnscaledComputing = (
  nullableUnscaledComputingAttribute: UnscaledComputingAttribute | null,
): UnscaledComputing | undefined =>
  nullableUnscaledComputingAttribute !== null ? true : undefined;
