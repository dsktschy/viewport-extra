import {
  createPartialMediaSpecificParameters,
  applyMediaSpecificParameters
} from './lib/HTMLMetaElement.js'
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

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElementList: HTMLMetaElement[] = []
let mediaSpecificParametersList: MediaSpecificParameters[] = []

if (typeof window !== 'undefined') {
  viewportElement = ensureViewportElement(document)
  viewportExtraElementList = getViewportExtraElementList(document)
  mediaSpecificParametersList = [createMediaSpecificParameters({})]

  // Get attributes before default attributes are applied to viewport meta element
  const partialMediaSpecificParameters =
    createPartialMediaSpecificParameters(viewportElement)
  const partialMediaSpecificParametersList = viewportExtraElementList.map(
    createPartialMediaSpecificParameters
  )
  mediaSpecificParametersList = [
    ...mediaSpecificParametersList,
    createMediaSpecificParameters(
      [
        partialMediaSpecificParameters,
        ...partialMediaSpecificParametersList
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
  const { content } = mediaSpecificParametersList[1]
  mediaSpecificParametersList = [
    mediaSpecificParametersList[0],
    createMediaSpecificParameters({
      content: { ...content, ...partialContent }
    })
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
    const partialContent =
      typeof partialContentOrContentMinWidth === 'number'
        ? { minWidth: partialContentOrContentMinWidth }
        : partialContentOrContentMinWidth
    setContent(partialContent)
  }
  static setContent = setContent
  static getContent = getContent
  static updateReference = updateReference
}
