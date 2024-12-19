import * as HTMLMetaElementModule from './lib/HTMLMetaElement.js'
import {
  createPartialGlobalParameters,
  applyMediaSpecificParameters
} from './lib/HTMLMetaElement.js'
import {
  type GlobalParameters,
  createGlobalParameters,
  mergePartialGlobalParameters
} from './lib/GlobalParameters.js'
import {
  type MediaSpecificParameters,
  createMediaSpecificParameters,
  mergePartialMediaSpecificParameters
} from './lib/MediaSpecificParameters.js'
import { DeepPartial } from './lib/DeepPartial.js'
import * as ContentModule from './lib/Content.js'
import { type Content, type ContentMinWidth } from './lib/Content.js'
import {
  ensureViewportElement,
  getViewportExtraElementList
} from './lib/Document.js'
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
    createMediaSpecificParameters(), // For unscaled computing
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
  // side effects force unscaled computing regardless of globalParameters
  // It's so that document.documentElement.clientWidth can work
  // in the case where viewport meta element does not exist
  applyMediaSpecificParameters(
    viewportElement,
    mediaSpecificParametersList[0],
    0
  )

  applyMediaSpecificParameters(
    viewportElement,
    mediaSpecificParametersList[1],
    document.documentElement.clientWidth
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
    mediaSpecificParametersList[0],
    createMediaSpecificParameters(
      [
        mediaSpecificParametersList[1],
        ...partialMediaSpecificParametersList
      ].reduce(mergePartialMediaSpecificParameters)
    )
  ]
  if (globalParameters.unscaledComputing)
    applyMediaSpecificParameters(
      viewportElement,
      mediaSpecificParametersList[0],
      0
    )
  applyMediaSpecificParameters(
    viewportElement,
    mediaSpecificParametersList[1],
    document.documentElement.clientWidth
  )
}

export const setContent = (partialContent: Partial<Content>): void => {
  if (typeof window === 'undefined' || !viewportElement || !globalParameters)
    return
  mediaSpecificParametersList = [
    mediaSpecificParametersList[0],
    createMediaSpecificParameters(
      [
        mediaSpecificParametersList[1],
        ContentModule.createPartialMediaSpecificParameters(partialContent)
      ].reduce(mergePartialMediaSpecificParameters)
    )
  ]
  if (globalParameters.unscaledComputing)
    applyMediaSpecificParameters(
      viewportElement,
      mediaSpecificParametersList[0],
      0
    )
  applyMediaSpecificParameters(
    viewportElement,
    mediaSpecificParametersList[1],
    document.documentElement.clientWidth
  )
}

export const getContent = (): Content => mediaSpecificParametersList[1].content

export const updateReference = (): void => {
  if (typeof window === 'undefined') return
  viewportElement = ensureViewportElement(document)
}

// For compatibility with v1
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
