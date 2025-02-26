import { type ContentAttribute } from './ContentAttribute.js'
import { type DecimalPlaces } from './DecimalPlaces.js'
import { type DeepPartial } from './DeepPartial.js'
import { type MediaSpecificParameters } from './MediaSpecificParameters.js'
import { truncateDecimalNumber } from './number.js'
import { kebabizeCamelCaseString } from './string.js'

export type ContentWidth = number | 'device-width'
export type ContentInitialScale = number
export type ContentMinWidth = number
export type ContentMaxWidth = number

export interface Content {
  width: ContentWidth
  initialScale: ContentInitialScale
  minWidth: ContentMinWidth
  maxWidth: ContentMaxWidth
  [key: string]: string | number
}

export const isContentWidth = (value: unknown): value is ContentWidth =>
  (typeof value === 'number' && value > 0 && value < Infinity) ||
  value === 'device-width'

export const isContentInitialScale = (
  value: unknown
): value is ContentInitialScale =>
  typeof value === 'number' && value >= 0 && value <= 10

export const isContentMinWidth = (value: unknown): value is ContentMinWidth =>
  typeof value === 'number' && value >= 0 && value < Infinity

export const isContentMaxWidth = (value: unknown): value is ContentMaxWidth =>
  typeof value === 'number' && value > 0 && value <= Infinity

export const defaultContent = {
  width: 'device-width' as const,
  initialScale: 1,
  minWidth: 0,
  maxWidth: Infinity
}

export const createContent = (
  partialContent: Partial<Content> | undefined = {}
): Content => {
  const content: Content = { ...defaultContent }
  for (const key of Object.keys(partialContent)) {
    const value = partialContent[key]
    if (
      value == null ||
      (key === 'width' && !isContentWidth(value)) ||
      (key === 'initialScale' && !isContentInitialScale(value)) ||
      (key === 'minWidth' && !isContentMinWidth(value)) ||
      (key === 'maxWidth' && !isContentMaxWidth(value))
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `Viewport Extra received invalid ${key}, so it is discarded.`
      )
      continue
    }
    content[key] = value
  }
  return content
}

export const mergeOptionalPartialContent = (
  precedingOptionalPartialContent: Partial<Content> | undefined,
  followingOptionalPartialContent: Partial<Content> | undefined
): Partial<Content> | undefined =>
  precedingOptionalPartialContent
    ? {
        ...precedingOptionalPartialContent,
        ...(followingOptionalPartialContent ?? {})
      }
    : followingOptionalPartialContent

export const createPartialMediaSpecificParameters = (
  partialContent: Partial<Content>
): DeepPartial<MediaSpecificParameters> => ({
  content: partialContent
})

export function createContentAttribute(
  content: Content,
  documentClientWidth: number,
  decimalPlaces: DecimalPlaces
): ContentAttribute
export function createContentAttribute(): ContentAttribute
export function createContentAttribute(
  content: Content = { ...defaultContent },
  documentClientWidth: number = 0,
  decimalPlaces: number = 0
): ContentAttribute {
  const { width, initialScale } = content
  const { minWidth, maxWidth, ...contentWithoutExtraProperties } = content
  if (minWidth > maxWidth) {
    // eslint-disable-next-line no-console
    console.warn(
      'Viewport Extra received minWidth that is greater than maxWidth, so they are ignored.'
    )
  } else if (typeof width === 'number') {
    // eslint-disable-next-line no-console
    console.warn(
      'Viewport Extra received fixed width, so minWidth and maxWidth are ignored.'
    )
  } else if (documentClientWidth < minWidth) {
    contentWithoutExtraProperties.width = minWidth
    contentWithoutExtraProperties.initialScale =
      (documentClientWidth / minWidth) * initialScale
  } else if (documentClientWidth > maxWidth) {
    contentWithoutExtraProperties.width = maxWidth
    contentWithoutExtraProperties.initialScale =
      (documentClientWidth / maxWidth) * initialScale
  }
  return Object.keys(contentWithoutExtraProperties)
    .map(
      key =>
        `${kebabizeCamelCaseString(key)}=${
          typeof contentWithoutExtraProperties[key] === 'number'
            ? truncateDecimalNumber(
                contentWithoutExtraProperties[key],
                decimalPlaces
              )
            : contentWithoutExtraProperties[key]
        }`
    )
    .sort()
    .join(',')
}
