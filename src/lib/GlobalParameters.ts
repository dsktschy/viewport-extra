import {
  type UnscaledComputing,
  createUnscaledComputing,
  mergeOptionalUnscaledComputing
} from './UnscaledComputing.js'

export interface GlobalParameters {
  unscaledComputing: UnscaledComputing
}

export const createGlobalParameters = (
  partialGlobalParameters: Partial<GlobalParameters> = {}
): GlobalParameters => ({
  unscaledComputing: createUnscaledComputing(
    partialGlobalParameters.unscaledComputing
  )
})

export const mergePartialGlobalParameters = (
  {
    unscaledComputing: precedingOptionalUnscaledComputing
  }: Partial<GlobalParameters>,
  {
    unscaledComputing: followingOptionalUnscaledComputing
  }: Partial<GlobalParameters>
): Partial<GlobalParameters> => {
  const partialGlobalParameters: Partial<GlobalParameters> = {}
  const optionalUnscaledComputing = mergeOptionalUnscaledComputing(
    precedingOptionalUnscaledComputing,
    followingOptionalUnscaledComputing
  )
  if (typeof optionalUnscaledComputing !== 'undefined')
    partialGlobalParameters.unscaledComputing = optionalUnscaledComputing
  return partialGlobalParameters
}

export const assignOptionalUnscaledComputing = (
  partialGlobalParameters: Partial<GlobalParameters> = {},
  optionalUnscaledComputing: UnscaledComputing | undefined
): Partial<GlobalParameters> =>
  typeof optionalUnscaledComputing !== 'undefined'
    ? {
        ...partialGlobalParameters,
        unscaledComputing: optionalUnscaledComputing
      }
    : partialGlobalParameters
