import { ContentMap, stringify } from './ContentMap'
import { parse } from './ContentString'

export const createViewportContentMap = (
  htmlMetaElement: HTMLMetaElement
): ContentMap => {
  const name = htmlMetaElement.getAttribute('name') || ''
  if (name !== 'viewport' && name !== 'viewport-extra') return {}

  const contentString = htmlMetaElement.getAttribute('content') || ''
  const contentMap = parse(contentString)
  const filteredContentMap: ContentMap = {}
  for (const key of Object.keys(contentMap)) {
    if (key === 'min-width' || key === 'max-width') continue
    filteredContentMap[key] = contentMap[key]
  }
  return filteredContentMap
}

export const createViewportExtraContentMap = (
  htmlMetaElement: HTMLMetaElement
): ContentMap => {
  const name = htmlMetaElement.getAttribute('name') || ''
  let attributeName = ''
  if (name === 'viewport') attributeName = 'data-extra-content'
  else if (name === 'viewport-extra') attributeName = 'content'
  else return {}

  const contentString = htmlMetaElement.getAttribute(attributeName) || ''
  const contentMap = parse(contentString)
  const filteredContentMap: ContentMap = {}
  for (const key of Object.keys(contentMap)) {
    if (key !== 'min-width' && key !== 'max-width') continue
    filteredContentMap[key] = contentMap[key]
  }
  return filteredContentMap
}

export const applyContentMap = (
  htmlMetaElement: HTMLMetaElement,
  contentMap: ContentMap
): HTMLMetaElement => {
  const name = htmlMetaElement.getAttribute('name') || ''
  if (name !== 'viewport') return htmlMetaElement

  const contentString = stringify(contentMap)
  htmlMetaElement.setAttribute('content', contentString)
  return htmlMetaElement
}
