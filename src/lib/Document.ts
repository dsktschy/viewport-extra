export const ensureViewportElement = (document: Document): HTMLMetaElement => {
  let viewportElement = document.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]'
  )
  if (!viewportElement) {
    viewportElement = document.createElement('meta')
    viewportElement.setAttribute('name', 'viewport')
    viewportElement.setAttribute(
      'content',
      'width=device-width,initial-scale=1'
    )
    document.head.appendChild(viewportElement)
  }
  return viewportElement
}

export const getViewportExtraElement = (
  document: Document
): HTMLMetaElement | null => {
  return document.querySelector<HTMLMetaElement>('meta[name="viewport-extra"]')
}
