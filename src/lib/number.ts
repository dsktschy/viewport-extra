import { type Content } from './Content.js'

export const createPartialContent = (num: number): Partial<Content> => ({
  minWidth: num
})

export const truncateDecimalNumber = (
  num: number,
  decimalPlaces: number
): number =>
  isFinite(decimalPlaces)
    ? Math.trunc(num * 10 ** decimalPlaces) / 10 ** decimalPlaces
    : num
