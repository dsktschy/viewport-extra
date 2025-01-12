import {
  type ContentAttribute,
  createOptionalPartialContent,
  mergeNullableContentAttributes
} from './ContentAttribute.js'
import { type DeepPartial } from './DeepPartial.js'
import {
  type GlobalParameters,
  assignOptionalUnscaledComputing,
  getUnscaledComputing
} from './GlobalParameters.js'
import {
  type MediaAttribute,
  createOptionalMedia,
  mergeNullableMediaAttribute
} from './MediaAttribute.js'
import {
  type MediaSpecificParameters,
  assignOptionalMedia,
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

export const getNullableMediaAttribute = (
  htmlMetaElement: HTMLMetaElement
): MediaAttribute | null =>
  mergeNullableMediaAttribute(
    htmlMetaElement.getAttribute('data-media'),
    htmlMetaElement.getAttribute('data-extra-media')
  )

export const createPartialMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement
): DeepPartial<MediaSpecificParameters> =>
  assignOptionalMedia(
    assignOptionalPartialContent(
      undefined,
      createOptionalPartialContent(getNullableContentAttribute(htmlMetaElement))
    ),
    createOptionalMedia(getNullableMediaAttribute(htmlMetaElement))
  )

export const setContentAttribute = (
  htmlMetaElement: HTMLMetaElement,
  contentAttribute: ContentAttribute
): void => htmlMetaElement.setAttribute('content', contentAttribute)

export const applyMediaSpecificParameters = (
  htmlMetaElement: HTMLMetaElement,
  getDocumentClientWidth: () => number,
  getMediaSpecificParameters: () => MediaSpecificParameters,
  globalParameters: GlobalParameters
): void => {
  if (getUnscaledComputing(globalParameters)) {
    setContentAttribute(
      htmlMetaElement,
      createContentAttribute(undefined, getDocumentClientWidth())
    )
  }
  setContentAttribute(
    htmlMetaElement,
    createContentAttribute(
      getMediaSpecificParameters(),
      getDocumentClientWidth()
    )
  )
}

export const applyMediaSpecificParametersUnscaled = (
  htmlMetaElement: HTMLMetaElement,
  getDocumentClientWidth: () => number,
  getMediaSpecificParameters: () => MediaSpecificParameters
): void => {
  setContentAttribute(
    htmlMetaElement,
    createContentAttribute(undefined, getDocumentClientWidth())
  )
  setContentAttribute(
    htmlMetaElement,
    createContentAttribute(
      getMediaSpecificParameters(),
      getDocumentClientWidth()
    )
  )
}
