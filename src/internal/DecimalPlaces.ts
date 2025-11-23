export type DecimalPlaces = number;

export const defaultDecimalPlaces = Infinity;

export const createDecimalPlaces = (
  optionalDecimalPlaces: DecimalPlaces | undefined,
): DecimalPlaces => optionalDecimalPlaces ?? defaultDecimalPlaces;

export const mergeOptionalDecimalPlaces = (
  precedingOptionalDecimalPlaces: DecimalPlaces | undefined,
  followingOptionalDecimalPlaces: DecimalPlaces | undefined,
): DecimalPlaces | undefined =>
  followingOptionalDecimalPlaces ?? precedingOptionalDecimalPlaces;
