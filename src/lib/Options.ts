import { OptionsMap, isOptionsMap } from './OptionsMap'
import { ContentMap } from './ContentMap'

type Options = OptionsMap | number

export const isOptions = (value: unknown): value is Options =>
  isOptionsMap(value) || typeof value === 'number'

export const parse = (options: Options): ContentMap => {
  const contentMap: ContentMap = {}
  if (typeof options === 'number') {
    contentMap['min-width'] = `${options}`
  } else {
    if (typeof options.minWidth === 'number')
      contentMap['min-width'] = `${options.minWidth}`
    if (typeof options.maxWidth === 'number')
      contentMap['max-width'] = `${options.maxWidth}`
  }
  return contentMap
}
