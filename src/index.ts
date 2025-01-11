import * as ContentModule from './lib/Content.js'
import { type Content, type ContentMinWidth } from './lib/Content.js'
import { DeepPartial } from './lib/DeepPartial.js'
import {
  ensureViewportElement,
  getDocumentClientWidth,
  getViewportExtraElementList
} from './lib/Document.js'
import {
  type GlobalParameters,
  createGlobalParameters,
  mergePartialGlobalParameters
} from './lib/GlobalParameters.js'
import * as HTMLMetaElementModule from './lib/HTMLMetaElement.js'
import {
  applyMediaSpecificParameters,
  applyMediaSpecificParametersUnscaled,
  createPartialGlobalParameters
} from './lib/HTMLMetaElement.js'
import * as MediaSpecificParametersModule from './lib/MediaSpecificParameters.js'
import {
  type MediaSpecificParameters,
  createMediaSpecificParameters,
  mergePartialMediaSpecificParameters
} from './lib/MediaSpecificParameters.js'
import { createPartialContent } from './lib/number.js'

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElementList: HTMLMetaElement[] = []
let globalParameters: GlobalParameters | null = null
let mediaSpecificParametersList: MediaSpecificParameters[] = []

if (typeof window !== 'undefined') {
  viewportElement = ensureViewportElement(document)
  viewportExtraElementList = getViewportExtraElementList(document)
  globalParameters = createGlobalParameters(
    [
      createPartialGlobalParameters(viewportElement),
      ...viewportExtraElementList.map(createPartialGlobalParameters)
    ].reduce(mergePartialGlobalParameters)
  )
  mediaSpecificParametersList = [
    createMediaSpecificParameters(
      [
        HTMLMetaElementModule.createPartialMediaSpecificParameters(
          viewportElement
        ),
        ...viewportExtraElementList.map(
          HTMLMetaElementModule.createPartialMediaSpecificParameters
        )
      ].reduce(mergePartialMediaSpecificParameters)
    )
  ]
  // For backward compatibility,
  // side effects force unscaled computing regardless of data-(extra-)unscaled-computing attributes
  // It's so that document.documentElement.clientWidth can work
  // in the case where viewport meta element does not exist
  applyMediaSpecificParametersUnscaled(
    viewportElement,
    () => getDocumentClientWidth(document),
    mediaSpecificParametersList[0]
  )
}

export const setParameters = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
  partialGlobalParameters: Partial<GlobalParameters> = {}
): void => {
  if (typeof window === 'undefined' || !viewportElement || !globalParameters)
    return
  globalParameters = createGlobalParameters(
    [globalParameters, partialGlobalParameters].reduce(
      mergePartialGlobalParameters
    )
  )
  mediaSpecificParametersList = [
    createMediaSpecificParameters(
      [
        mediaSpecificParametersList[0],
        ...partialMediaSpecificParametersList
      ].reduce(mergePartialMediaSpecificParameters)
    )
  ]
  applyMediaSpecificParameters(
    viewportElement,
    () => getDocumentClientWidth(document),
    mediaSpecificParametersList[0],
    globalParameters
  )
}

export const setContent = (partialContent: Partial<Content>): void => {
  if (typeof window === 'undefined' || !viewportElement || !globalParameters)
    return
  mediaSpecificParametersList = [
    createMediaSpecificParameters(
      [
        mediaSpecificParametersList[0],
        ContentModule.createPartialMediaSpecificParameters(partialContent)
      ].reduce(mergePartialMediaSpecificParameters)
    )
  ]
  applyMediaSpecificParameters(
    viewportElement,
    () => getDocumentClientWidth(document),
    mediaSpecificParametersList[0],
    globalParameters
  )
}

export const getContent = (): Content =>
  MediaSpecificParametersModule.getContent(
    typeof window === 'undefined' ||
      typeof mediaSpecificParametersList[0] === 'undefined'
      ? createMediaSpecificParameters()
      : mediaSpecificParametersList[0]
  )

export const updateReference = (): void => {
  if (typeof window === 'undefined') return
  viewportElement = ensureViewportElement(document)
}

/**
 * - For compatibility with v1
 * @deprecated
 */
export default class ViewportExtra {
  constructor(
    partialContentOrContentMinWidth: Partial<Content> | ContentMinWidth
  ) {
    setContent(
      typeof partialContentOrContentMinWidth === 'number'
        ? createPartialContent(partialContentOrContentMinWidth)
        : partialContentOrContentMinWidth
    )
  }
  static setParameters = setParameters
  static setContent = setContent
  static getContent = getContent
  static updateReference = updateReference
}
