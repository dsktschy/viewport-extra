import * as ContentModule from './Content.js'
import {
  type Content,
  createContent,
  mergeOptionalPartialContent
} from './Content.js'
import { type ContentAttribute } from './ContentAttribute.js'
import { type DecimalPlaces } from './DecimalPlaces.js'
import { type DeepPartial } from './DeepPartial.js'
import { type Media, createMedia, mergeOptionalMedia } from './Media.js'

export interface MediaSpecificParameters {
  content: Content
  media: Media
}

export const createMediaSpecificParameters = (
  partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> = {}
): MediaSpecificParameters => ({
  content: createContent(partialMediaSpecificParameters.content),
  media: createMedia(partialMediaSpecificParameters.media)
})

export const mergePartialMediaSpecificParameters = (
  precedingPartialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>,
  followingPartialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>
): DeepPartial<MediaSpecificParameters> => {
  const partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> =
    {}
  const optionalPartialContent = mergeOptionalPartialContent(
    precedingPartialMediaSpecificParameters.content,
    followingPartialMediaSpecificParameters.content
  )
  const optionalMedia = mergeOptionalMedia(
    precedingPartialMediaSpecificParameters.media,
    followingPartialMediaSpecificParameters.media
  )
  if (optionalPartialContent)
    partialMediaSpecificParameters.content = optionalPartialContent
  if (typeof optionalMedia !== 'undefined')
    partialMediaSpecificParameters.media = optionalMedia
  return partialMediaSpecificParameters
}

export function createContentAttribute(
  optionalMediaSpecificParameters: MediaSpecificParameters,
  optionalDocumentClientWidth: number,
  optionalDecimalPlaces: DecimalPlaces
): ContentAttribute
export function createContentAttribute(): ContentAttribute
export function createContentAttribute(
  optionalMediaSpecificParameters?: MediaSpecificParameters,
  optionalDocumentClientWidth?: number,
  optionalDecimalPlaces?: DecimalPlaces
): ContentAttribute {
  return optionalMediaSpecificParameters &&
    typeof optionalDocumentClientWidth !== 'undefined' &&
    typeof optionalDecimalPlaces !== 'undefined'
    ? ContentModule.createContentAttribute(
        optionalMediaSpecificParameters.content,
        optionalDocumentClientWidth,
        optionalDecimalPlaces
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

export const assignOptionalMedia = (
  partialMediaSpecificParameters: DeepPartial<MediaSpecificParameters> = {},
  optionalMedia: Media | undefined
): DeepPartial<MediaSpecificParameters> =>
  typeof optionalMedia !== 'undefined'
    ? { ...partialMediaSpecificParameters, media: optionalMedia }
    : partialMediaSpecificParameters

export const getContent = (
  mediaSpecificParameters: MediaSpecificParameters
): Content => mediaSpecificParameters.content

export const createPartialMediaSpecificParametersMerger =
  (isMatchingCurrentViewport: (media?: Media) => boolean) =>
  (
    precedingPartialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>,
    followingPartialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>
  ): DeepPartial<MediaSpecificParameters> =>
    isMatchingCurrentViewport(followingPartialMediaSpecificParameters.media)
      ? mergePartialMediaSpecificParameters(
          precedingPartialMediaSpecificParameters,
          followingPartialMediaSpecificParameters
        )
      : precedingPartialMediaSpecificParameters
