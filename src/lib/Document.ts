export const getHTMLMetaElement = (
  document: Document,
  name: string,
  ensuring: boolean
): HTMLMetaElement => {
  const selector = `meta[name="${name}"]`
  let htmlMetaElement = document.querySelector<HTMLMetaElement>(selector)
  if (!htmlMetaElement) {
    htmlMetaElement = document.createElement('meta')
    htmlMetaElement.setAttribute('name', name)
    if (ensuring) document.head.appendChild(htmlMetaElement)
  }
  return htmlMetaElement
}

export const getClientWidth = (document: Document): number => {
  return document.documentElement.clientWidth
}
