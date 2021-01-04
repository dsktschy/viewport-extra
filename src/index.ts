import { getHTMLMetaElement, getClientWidth } from './lib/Document'
import { createPartialContent, applyContent } from './lib/HTMLMetaElement'
import { Content, create } from './lib/Content'

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElement: HTMLMetaElement | null = null
let content: Content = create({})

if (document) {
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

// For compatibility with v1
export default class ViewportExtra {
  constructor(partialContent: Partial<Content>) {
    setContent(partialContent)
  }
  static setContent = setContent
  static getContent = getContent
}
