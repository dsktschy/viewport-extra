import { type Content, createContent } from './Content.js'
import { type DeepPartial } from './DeepPartial.js'

export interface MediaSpecificParameters {
  content: Content
}

export const createMediaSpecificParameters = ({
  content: partialContent
}: DeepPartial<MediaSpecificParameters>): MediaSpecificParameters => ({
  content: createContent(partialContent ?? {})
})

export const mergePartialMediaSpecificParameters = (
  precedingPartialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>,
  followingPartialMediaSpecificParameters: DeepPartial<MediaSpecificParameters>
): DeepPartial<MediaSpecificParameters> => ({
  content: {
    ...(precedingPartialMediaSpecificParameters.content ?? {}),
    ...(followingPartialMediaSpecificParameters.content ?? {})
  }
})
