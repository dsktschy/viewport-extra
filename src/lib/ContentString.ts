import { ContentMap } from './ContentMap'

export type ContentString = string

export const parse = (contentString: ContentString): ContentMap => {
  const contentList = contentString.split(',')
  const contentMap: ContentMap = {}
  for (const content of contentList) {
    const [key, value] = content.split('=')
    contentMap[key] = value
  }
  return contentMap
}
