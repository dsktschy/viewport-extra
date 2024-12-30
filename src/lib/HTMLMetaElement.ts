import {
  type ContentAttribute,
  createOptionalPartialContent,
  mergeNullableContentAttributes
} from './ContentAttribute.js'
import { type DeepPartial } from './DeepPartial.js'
import {
  type GlobalParameters,
  assignOptionalUnscaledComputing
} from './GlobalParameters.js'
import {
  type MediaSpecificParameters,
  assignOptionalPartialContent,
  createContentAttribute
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
): Partial<GlobalParameters> =>
  assignOptionalUnscaledComputing(
    undefined,
    createOptionalUnscaledComputing(
      getNullableUnscaledComputingAttribute(htmlMetaElement)
    )
  )

export const getNullableContentAttribute = (
  htmlMetaElement: HTMLMetaElement
): ContentAttribute | null =>
  mergeNullableContentAttributes(
    htmlMetaElement.getAttribute('content'),
    htmlMetaElement.getAttribute('data-extra-content')
  )

export const createPartialMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement
): DeepPartial<MediaSpecificParameters> =>
  assignOptionalPartialContent(
    undefined,
    createOptionalPartialContent(getNullableContentAttribute(htmlMetaElement))
  )

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
