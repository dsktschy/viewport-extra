import {
  type ContentAttribute,
  createOptionalPartialContent,
  mergeNullableContentAttributes
} from './ContentAttribute.js'
import { type DeepPartial } from './DeepPartial.js'
import {
  type GlobalParameters,
  setOptionalUnscaledComputing
} from './GlobalParameters.js'
import {
  type MediaSpecificParameters,
  createContentAttribute,
  setOptionalPartialContent
} from './MediaSpecificParameters.js'
import {
  type UnscaledComputingAttribute,
  createOptionalUnscaledComputing,
  mergeNullableUnscaledComputingAttribute
} from './UnscaledComputingAttribute.js'

export const getNullableUnscaledComputingAttribute = (
  htmlMetaElement: HTMLMetaElement
): UnscaledComputingAttribute | null =>
  mergeNullableUnscaledComputingAttribute(
    htmlMetaElement.getAttribute('data-unscaled-computing'),
    htmlMetaElement.getAttribute('data-extra-unscaled-computing')
  )

export const createPartialGlobalParameters = (
  htmlMetaElement: HTMLMetaElement
): Partial<GlobalParameters> => {
  const partialGlobalParameters: Partial<GlobalParameters> = {}
  setOptionalUnscaledComputing(
    partialGlobalParameters,
    createOptionalUnscaledComputing(
      getNullableUnscaledComputingAttribute(htmlMetaElement)
    )
  )
  return partialGlobalParameters
}

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
