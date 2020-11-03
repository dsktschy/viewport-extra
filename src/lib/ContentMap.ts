import { ContentString } from './ContentString'

export interface ContentMap {
  [key: string]: string
}

export const stringifyContentMap = (contentMap: ContentMap): ContentString => {
  return Object.entries(contentMap)
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
}
