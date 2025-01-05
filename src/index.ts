import * as ContentModule from './lib/Content.js'
import { type Content, type ContentMinWidth } from './lib/Content.js'
import { DeepPartial } from './lib/DeepPartial.js'
import {
  ensureViewportElement,
  getViewportExtraElementList
} from './lib/Document.js'
import {
  type GlobalParameters,
  createGlobalParameters,
  mergePartialGlobalParameters
} from './lib/GlobalParameters.js'
import * as HTMLMetaElementModule from './lib/HTMLMetaElement.js'
import {
  applyMediaSpecificParameters,
  createPartialGlobalParameters
} from './lib/HTMLMetaElement.js'
import { createMatchMediaPredicate } from './lib/MatchMedia.js'
import {
  type MediaSpecificParameters,
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
  mergePartialMediaSpecificParameters
} from './lib/MediaSpecificParameters.js'
import { createPartialContent } from './lib/number.js'

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElementList: HTMLMetaElement[] = []
let globalParameters: GlobalParameters | null = null
let internalPartialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[] =
  []

if (typeof window !== 'undefined') {
  viewportElement = ensureViewportElement(document)
  viewportExtraElementList = getViewportExtraElementList(document)
  globalParameters = createGlobalParameters(
    [
      createPartialGlobalParameters(viewportElement),
      ...viewportExtraElementList.map(createPartialGlobalParameters)
    ].reduce(mergePartialGlobalParameters)
  )
  internalPartialMediaSpecificParametersList = [
    HTMLMetaElementModule.createPartialMediaSpecificParameters(viewportElement),
    ...viewportExtraElementList.map(
      HTMLMetaElementModule.createPartialMediaSpecificParameters
    )
  ]
  const defaultMediaSpecificParameters = createMediaSpecificParameters()

  // For backward compatibility,
  // side effects force unscaled computing regardless of globalParameters
  // It's so that document.documentElement.clientWidth can work
  // in the case where viewport meta element does not exist
  applyMediaSpecificParameters(
    viewportElement,
    defaultMediaSpecificParameters,
    0
  )

  applyMediaSpecificParameters(
    viewportElement,
    createMediaSpecificParameters(
      internalPartialMediaSpecificParametersList.reduce(
        createPartialMediaSpecificParametersMerger(
          createMatchMediaPredicate(matchMedia)
        ),
        // Value that does not need to check matching current viewport
        defaultMediaSpecificParameters
      )
    ),
    document.documentElement.clientWidth
  )
}

export const setParameters = (
  partialMediaSpecificParametersList: DeepPartial<MediaSpecificParameters>[],
  partialGlobalParameters: Partial<GlobalParameters> = {}
): void => {
  if (typeof window === 'undefined' || !viewportElement || !globalParameters)
    return
  globalParameters = createGlobalParameters(
    [globalParameters, partialGlobalParameters].reduce(
      mergePartialGlobalParameters
    )
  )
  internalPartialMediaSpecificParametersList = [
    ...internalPartialMediaSpecificParametersList,
    ...partialMediaSpecificParametersList
  ]
  const defaultMediaSpecificParameters = createMediaSpecificParameters()
  if (globalParameters.unscaledComputing)
    applyMediaSpecificParameters(
      viewportElement,
      defaultMediaSpecificParameters,
      0
    )
  applyMediaSpecificParameters(
    viewportElement,
    createMediaSpecificParameters(
      internalPartialMediaSpecificParametersList.reduce(
        createPartialMediaSpecificParametersMerger(
          createMatchMediaPredicate(matchMedia)
        ),
        // Value that does not need to check matching current viewport
        defaultMediaSpecificParameters
      )
    ),
    document.documentElement.clientWidth
  )
}

export const setContent = (partialContent: Partial<Content>): void => {
  if (typeof window === 'undefined' || !viewportElement || !globalParameters)
    return
  internalPartialMediaSpecificParametersList = [
    ...internalPartialMediaSpecificParametersList,
    ContentModule.createPartialMediaSpecificParameters(partialContent)
  ]
  const defaultMediaSpecificParameters = createMediaSpecificParameters()
  if (globalParameters.unscaledComputing)
    applyMediaSpecificParameters(
      viewportElement,
      defaultMediaSpecificParameters,
      0
    )
  applyMediaSpecificParameters(
    viewportElement,
    createMediaSpecificParameters(
      internalPartialMediaSpecificParametersList.reduce(
        createPartialMediaSpecificParametersMerger(
          createMatchMediaPredicate(matchMedia)
        ),
        // Value that does not need to check matching current viewport
        defaultMediaSpecificParameters
      )
    ),
    document.documentElement.clientWidth
  )
}

/**
 * - Merge content properties of all objects in internalPartialMediaSpecificParametersList variable and return it
 * - Feature assuming that media properties are not used
 * @deprecated
 * */
export const getContent = (): Content =>
  createMediaSpecificParameters(
    internalPartialMediaSpecificParametersList.reduce(
      mergePartialMediaSpecificParameters,
      // For environments where no window object exists
      createMediaSpecificParameters()
    )
  ).content

export const updateReference = (): void => {
  if (typeof window === 'undefined') return
  viewportElement = ensureViewportElement(document)
}

/**
 * - For compatibility with v1
 * @deprecated
 */
export default class ViewportExtra {
  constructor(
    partialContentOrContentMinWidth: Partial<Content> | ContentMinWidth
  ) {
    setContent(
      typeof partialContentOrContentMinWidth === 'number'
        ? createPartialContent(partialContentOrContentMinWidth)
        : partialContentOrContentMinWidth
    )
  }
  static setParameters = setParameters
  static setContent = setContent
  static getContent = getContent
  static updateReference = updateReference
}
