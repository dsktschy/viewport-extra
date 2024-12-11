import { type DeepPartial } from './DeepPartial.js'
import {
  type MediaSpecificParameters,
  setOptionalPartialContent,
  createContentAttribute
} from './MediaSpecificParameters.js'
import {
  type ContentAttribute,
  mergeNullableContentAttributes,
  createOptionalPartialContent
} from './ContentAttribute.js'

export const getNullableContentAttribute = (
  htmlMetaElement: HTMLMetaElement
): ContentAttribute | null =>
  mergeNullableContentAttributes(
    htmlMetaElement.getAttribute('content'),
    htmlMetaElement.getAttribute('data-extra-content')
  )

export const createPartialMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement
): DeepPartial<MediaSpecificParameters> => {
  const partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> =
    {}
  setOptionalPartialContent(
    partialMediaSpecificParameters,
    createOptionalPartialContent(getNullableContentAttribute(htmlMetaElement))
  )
  return partialMediaSpecificParameters
}

export const setContentAttribute = (
  htmlMetaElement: HTMLMetaElement,
  contentAttribute: ContentAttribute
): void => htmlMetaElement.setAttribute('content', contentAttribute)

export const applyMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement,
  mediaSpecificParameters: MediaSpecificParameters,
  documentClientWidth: number
): void => {
  setContentAttribute(
    htmlMetaElement,
    createContentAttribute(mediaSpecificParameters, documentClientWidth)
  )
}
