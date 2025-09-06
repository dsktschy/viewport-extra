import {
  createDecimalPlaces,
  type DecimalPlaces,
  mergeOptionalDecimalPlaces,
} from "./DecimalPlaces.js";
import {
  createUnscaledComputing,
  mergeOptionalUnscaledComputing,
  type UnscaledComputing,
} from "./UnscaledComputing.js";

export interface GlobalParameters {
  unscaledComputing: UnscaledComputing;
  decimalPlaces: DecimalPlaces;
}

export const createGlobalParameters = (
  partialGlobalParameters: Partial<GlobalParameters> = {},
): GlobalParameters => ({
  unscaledComputing: createUnscaledComputing(
    partialGlobalParameters.unscaledComputing,
  ),
  decimalPlaces: createDecimalPlaces(partialGlobalParameters.decimalPlaces),
});

export const mergePartialGlobalParameters = (
  precedingPartialGlobalParameters: Partial<GlobalParameters>,
  followingPartialGlobalParameters: Partial<GlobalParameters>,
): Partial<GlobalParameters> => {
  const partialGlobalParameters: Partial<GlobalParameters> = {};
  const optionalUnscaledComputing = mergeOptionalUnscaledComputing(
    precedingPartialGlobalParameters.unscaledComputing,
    followingPartialGlobalParameters.unscaledComputing,
  );
  const optionalDecimalPlaces = mergeOptionalDecimalPlaces(
    precedingPartialGlobalParameters.decimalPlaces,
    followingPartialGlobalParameters.decimalPlaces,
  );
  if (typeof optionalUnscaledComputing !== "undefined")
    partialGlobalParameters.unscaledComputing = optionalUnscaledComputing;
  if (typeof optionalDecimalPlaces !== "undefined")
    partialGlobalParameters.decimalPlaces = optionalDecimalPlaces;
  return partialGlobalParameters;
};

export const assignOptionalUnscaledComputing = (
  optionalPartialGlobalParameters: Partial<GlobalParameters> | undefined,
  optionalUnscaledComputing: UnscaledComputing | undefined,
): Partial<GlobalParameters> =>
  typeof optionalUnscaledComputing !== "undefined"
    ? {
        ...(optionalPartialGlobalParameters ?? {}),
        unscaledComputing: optionalUnscaledComputing,
      }
    : (optionalPartialGlobalParameters ?? {});

export const assignOptionalDecimalPlaces = (
  optionalPartialGlobalParameters: Partial<GlobalParameters> | undefined,
  optionalDecimalPlaces: DecimalPlaces | undefined,
): Partial<GlobalParameters> =>
  typeof optionalDecimalPlaces !== "undefined"
    ? {
        ...(optionalPartialGlobalParameters ?? {}),
        decimalPlaces: optionalDecimalPlaces,
      }
    : (optionalPartialGlobalParameters ?? {});

export const getUnscaledComputing = (globalParameters: GlobalParameters) =>
  globalParameters.unscaledComputing;

export const getDecimalPlaces = (globalParameters: GlobalParameters) =>
  globalParameters.decimalPlaces;
