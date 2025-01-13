import { type DecimalPlaces } from './DecimalPlaces.js'

export type DecimalPlacesAttribute = string

export const mergeNullableDecimalPlacesAttribute = (
  precedingNullableDecimalPlacesAttribute: DecimalPlacesAttribute | null,
  followingNullableDecimalPlacesAttribute: DecimalPlacesAttribute | null
): DecimalPlacesAttribute | null =>
  followingNullableDecimalPlacesAttribute ??
  precedingNullableDecimalPlacesAttribute

export const createOptionalDecimalPlaces = (
  nullableDecimalPlacesAttribute: DecimalPlacesAttribute | null
): DecimalPlaces | undefined =>
  nullableDecimalPlacesAttribute !== null
    ? +nullableDecimalPlacesAttribute
    : undefined
