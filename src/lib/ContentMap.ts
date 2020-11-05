import { ContentString } from './ContentString'

export interface ContentMap {
  [key: string]: string
}

export const stringifyContentMap = (contentMap: ContentMap): ContentString => {
  return Object.entries(contentMap)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
}

export const isValidAsViewportExtraContentMap = (
  contentMap: ContentMap
): boolean => {
  // Not numeric string
  const minWidthDefined = contentMap['min-width'] != null
  const numericMinWidth = +contentMap['min-width']
  if (minWidthDefined && Number.isNaN(numericMinWidth)) return false
  const maxWidthDefined = contentMap['max-width'] != null
  const numericMaxWidth = +contentMap['max-width']
  if (maxWidthDefined && Number.isNaN(numericMaxWidth)) return false

  // Must be mix-width <= max-width
  // At least one of mix-width or max-width
  return minWidthDefined
    ? maxWidthDefined
      ? numericMinWidth <= numericMaxWidth
      : true
    : maxWidthDefined
}
