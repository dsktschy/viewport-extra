import { Content } from './Content.js'
import { camelize, kebabize } from './string.js'

export const createPartialContent = (
  htmlMetaElement: HTMLMetaElement
): Partial<Content> => {
  const contentAttributeValue = htmlMetaElement.getAttribute('content') || ''
  const dataExtraContentAttributeValue =
    htmlMetaElement.getAttribute('data-extra-content') || ''
  const equalSeparatedContentList = [
    ...contentAttributeValue.split(','),
    ...dataExtraContentAttributeValue.split(',')
  ]
  const partialContent: Partial<Content> = {}
  for (const equalSeparatedContent of equalSeparatedContentList) {
    const [key, value] = equalSeparatedContent.split('=')
    // If empty string is splitted, key will be empty string
    const trimmedKey = key.trim()
    if (!trimmedKey) continue
    // If empty string is splitted, value will be undefined
    const trimmedValue = value ? value.trim() : ''
    if (!trimmedValue) continue
    partialContent[camelize(trimmedKey)] = isNaN(+trimmedValue)
      ? trimmedValue
      : +trimmedValue
  }
  return partialContent
}

export const applyContent = (
  htmlMetaElement: HTMLMetaElement,
  content: Content,
  documentClientWidth: number
): void => {
  // Calculate width and initial-scale
  const { width, initialScale } = content
  const { minWidth, maxWidth, ...omittedContent } = content
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
    omittedContent.width = minWidth
    omittedContent.initialScale =
      (documentClientWidth / minWidth) * initialScale
  } else if (documentClientWidth > maxWidth) {
    omittedContent.width = maxWidth
    omittedContent.initialScale =
      (documentClientWidth / maxWidth) * initialScale
  }
  // Stringify Content
  const contentAttributeValue = Object.keys(omittedContent)
    .map(key => `${kebabize(key)}=${omittedContent[key]}`)
    .sort() // For testing
    .join(',')
  // Apply to HTMLMetaElement
  htmlMetaElement.setAttribute('content', contentAttributeValue)
}
