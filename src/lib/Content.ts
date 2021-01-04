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

export const defaultProps = {
  width: 'device-width' as const,
  initialScale: 1,
  minWidth: 0,
  maxWidth: Infinity
}

export const create = (partialContent: Partial<Content>): Content => {
  const content: Content = { ...defaultProps }
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
