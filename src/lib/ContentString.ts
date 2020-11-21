import { ContentMap } from './ContentMap'

export type ContentString = string

export const parse = (contentString: ContentString): ContentMap => {
  const contentList = contentString.split(',')
  const contentMap: ContentMap = {}
  for (const content of contentList) {
    const [key, value] = content.split('=')
    const trimmedKey = key.trim()
    if (!trimmedKey) continue
    const trimmedValue = value.trim()
    if (!trimmedValue) continue
    contentMap[trimmedKey] = trimmedValue
  }
  return contentMap
}
