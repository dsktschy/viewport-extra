import { ContentMap, stringify } from './ContentMap'

export const ensureViewportElement = (
  document: Document,
  defaultContentMap: ContentMap
): HTMLMetaElement => {
  let viewportElement = document.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]'
  )
  if (!viewportElement) {
    viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute('content', stringify(defaultContentMap))
    document.head.appendChild(viewportElement)
  }
  return viewportElement
}

export const getViewportExtraElement = (
  document: Document
): HTMLMetaElement | null => {
  return document.querySelector<HTMLMetaElement>('meta[name="viewport-extra"]')
}

export const getClientWidth = (document: Document): number => {
  return document.documentElement.clientWidth
}
