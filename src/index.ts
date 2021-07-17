import { getHTMLMetaElement, getClientWidth } from './lib/Document'
import { createPartialContent, applyContent } from './lib/HTMLMetaElement'
import { Content, ContentMinWidth, create } from './lib/Content'

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElement: HTMLMetaElement | null = null
let content: Content = create({})

if (typeof document !== 'undefined') {
  viewportElement = getHTMLMetaElement(document, 'viewport', true)
  viewportExtraElement = getHTMLMetaElement(document, 'viewport-extra', false)

  // Create content object in advance
  // before default content is applied to viewport meta element
  const partialContent = {
    ...createPartialContent(viewportElement),
    ...createPartialContent(viewportExtraElement)
  }

  // Apply default content to viewport meta element
  // in order to calcurate correct value by getClientWidth
  // even if viewport meta element has no content attribute
  applyContent(viewportElement, content, 0)

  content = create(partialContent)
  applyContent(viewportElement, content, getClientWidth(document))
}

export const setContent = (partialContent: Partial<Content>): void => {
  content = create({ ...content, ...partialContent })
  if (!viewportElement) return
  applyContent(viewportElement, content, getClientWidth(document))
}

export const getContent = (): Content => content

export const updateReference = (): void => {
  viewportElement = getHTMLMetaElement(document, 'viewport', true)
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
