import * as ContentModule from './Content.js'
import {
  type Content,
  createContent,
  mergeOptionalPartialContent
} from './Content.js'
import { type ContentAttribute } from './ContentAttribute.js'
import { type DeepPartial } from './DeepPartial.js'

export interface MediaSpecificParameters {
  content: Content
}

export const createMediaSpecificParameters = (
  partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> = {}
): MediaSpecificParameters => ({
  content: createContent(partialMediaSpecificParameters.content)
})

export const mergePartialMediaSpecificParameters = (
  {
    content: precedingOptionalPartialContent
  }: DeepPartial<MediaSpecificParameters>,
  {
    content: followingOptionalPartialContent
  }: DeepPartial<MediaSpecificParameters>
): DeepPartial<MediaSpecificParameters> => {
  const partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> =
    {}
  const optionalPartialContent = mergeOptionalPartialContent(
    precedingOptionalPartialContent,
    followingOptionalPartialContent
  )
  if (optionalPartialContent)
    partialMediaSpecificParameters.content = optionalPartialContent
  return partialMediaSpecificParameters
}

export const createContentAttribute = (
  { content }: MediaSpecificParameters,
  documentClientWidth: number
): ContentAttribute =>
  ContentModule.createContentAttribute(content, documentClientWidth)

export const setOptionalPartialContent = (
  partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>,
  optionalPartialContent: Partial<Content> | undefined
): void => {
  if (!optionalPartialContent) return
  partialMediaSpecificParameters.content = optionalPartialContent
}
