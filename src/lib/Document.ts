export const ensureViewportElement = (doc: Document): HTMLMetaElement => {
  const viewportElement = doc.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]'
  )
  if (viewportElement) return viewportElement
  const metaElement = doc.createElement('meta')
  metaElement.setAttribute('name', 'viewport')
  doc.head.appendChild(metaElement)
  return metaElement
}

export const getViewportExtraElementList = (
  doc: Document
): HTMLMetaElement[] => {
  const arrayFrom = <T>(arrayLike: ArrayLike<T>): T[] =>
    (Array.prototype as T[]).slice.call(arrayLike)
  return arrayFrom(
    doc.querySelectorAll<HTMLMetaElement>('meta[name="viewport-extra"]')
  )
}

export const getDocumentClientWidth = (doc: Document): number =>
  doc.documentElement.clientWidth
