import {
  createDecimalPlaces,
  type DecimalPlaces,
  mergeOptionalDecimalPlaces,
} from "./DecimalPlaces.js";

export interface GlobalParameters {
  decimalPlaces: DecimalPlaces;
}

export const createGlobalParameters = (
  partialGlobalParameters: Partial<GlobalParameters> = {},
): GlobalParameters => ({
  decimalPlaces: createDecimalPlaces(partialGlobalParameters.decimalPlaces),
});

export const mergePartialGlobalParameters = (
  precedingPartialGlobalParameters: Partial<GlobalParameters>,
  followingPartialGlobalParameters: Partial<GlobalParameters>,
): Partial<GlobalParameters> => {
  const partialGlobalParameters: Partial<GlobalParameters> = {};
  const optionalDecimalPlaces = mergeOptionalDecimalPlaces(
    precedingPartialGlobalParameters.decimalPlaces,
    followingPartialGlobalParameters.decimalPlaces,
  );
  if (typeof optionalDecimalPlaces !== "undefined")
    partialGlobalParameters.decimalPlaces = optionalDecimalPlaces;
  return partialGlobalParameters;
};

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

export const getDecimalPlaces = (globalParameters: GlobalParameters) =>
  globalParameters.decimalPlaces;
