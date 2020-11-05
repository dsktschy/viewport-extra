import { ContentMap } from './ContentMap'
import { parseContentString } from './ContentString'

export const getViewportContentMap = (
  htmlMetaElement: HTMLMetaElement
): ContentMap => {
  const name = htmlMetaElement.getAttribute('name') || ''
  if (name !== 'viewport' && name !== 'viewport-extra') return {}

  const contentString = htmlMetaElement.getAttribute('content') || ''
  const contentMap = parseContentString(contentString)
  const filteredContentMap: ContentMap = {}
  for (const [key, value] of Object.entries(contentMap)) {
    if (key === 'min-width' || key === 'max-width') continue
    filteredContentMap[key] = value
  }
  return filteredContentMap
}

export const getViewportExtraContentMap = (
  htmlMetaElement: HTMLMetaElement
): ContentMap => {
  const name = htmlMetaElement.getAttribute('name') || ''
  let attributeName = ''
  if (name === 'viewport') attributeName = 'data-extra-content'
  else if (name === 'viewport-extra') attributeName = 'content'
  else return {}

  const contentString = htmlMetaElement.getAttribute(attributeName) || ''
  const contentMap = parseContentString(contentString)
  const filteredContentMap: ContentMap = {}
  for (const [key, value] of Object.entries(contentMap)) {
    if (key !== 'min-width' && key !== 'max-width') continue
    filteredContentMap[key] = value
  }
  return filteredContentMap
}
