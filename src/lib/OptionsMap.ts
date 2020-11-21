import { isGeneralObject } from './GeneralObject'

export type OptionsMap =
  | {
      minWidth: number
      [key: string]: unknown
    }
  | {
      maxWidth: number
      [key: string]: unknown
    }

export const isOptionsMap = (value: unknown): value is OptionsMap =>
  isGeneralObject(value) &&
  (typeof value.minWidth === 'number' || typeof value.maxWidth === 'number')
