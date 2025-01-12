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

export function createContentAttribute(
  optionalMediaSpecificParameters: MediaSpecificParameters,
  optionalDocumentClientWidth: number
): ContentAttribute
export function createContentAttribute(): ContentAttribute
export function createContentAttribute(
  optionalMediaSpecificParameters?: MediaSpecificParameters,
  optionalDocumentClientWidth?: number
): ContentAttribute {
  return optionalMediaSpecificParameters &&
    typeof optionalDocumentClientWidth === 'number'
    ? ContentModule.createContentAttribute(
        optionalMediaSpecificParameters.content,
        optionalDocumentClientWidth
      )
    : ContentModule.createContentAttribute()
}

export const assignOptionalPartialContent = (
  partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> = {},
  optionalPartialContent: Partial<Content> | undefined
): DeepPartial<MediaSpecificParameters> =>
  optionalPartialContent
    ? { ...partialMediaSpecificParameters, content: optionalPartialContent }
    : partialMediaSpecificParameters

export const getContent = (
  mediaSpecificParameters: MediaSpecificParameters
): Content => mediaSpecificParameters.content
