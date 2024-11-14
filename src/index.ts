import * as HTMLMetaElementModule from './lib/HTMLMetaElement.js'
import { applyMediaSpecificParameters } from './lib/HTMLMetaElement.js'
import * as ContentModule from './lib/Content.js'
import { type Content, type ContentMinWidth } from './lib/Content.js'
import {
  type MediaSpecificParameters,
  createMediaSpecificParameters,
  mergePartialMediaSpecificParameters
} from './lib/MediaSpecificParameters.js'
import {
  ensureViewportElement,
  getViewportExtraElementList
} from './lib/Document.js'
import { createPartialContent } from './lib/number.js'

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElementList: HTMLMetaElement[] = []
let mediaSpecificParametersList: MediaSpecificParameters[] = []

if (typeof window !== 'undefined') {
  viewportElement = ensureViewportElement(document)
  viewportExtraElementList = getViewportExtraElementList(document)
  mediaSpecificParametersList = [
    createMediaSpecificParameters({}), // For unscaled computing
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

  // Apply default attributes to viewport meta element
  // in order to get width of viewport by document.documentElement.clientWidth
  // even if viewport meta element has no content attribute
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
  if (typeof window === 'undefined' || !viewportElement) return
  mediaSpecificParametersList = [
    mediaSpecificParametersList[0],
    createMediaSpecificParameters(
      [
        mediaSpecificParametersList[1],
        ContentModule.createPartialMediaSpecificParameters(partialContent)
      ].reduce(mergePartialMediaSpecificParameters)
    )
  ]
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
  static setContent = setContent
  static getContent = getContent
  static updateReference = updateReference
}
