import * as packageJson from '../package.json'
import {
  ensureViewportElement,
  getViewportExtraElement,
  getClientWidth
} from './lib/Document'
import {
  ContentMap,
  initializeViewportProps,
  initializeViewportExtraProps,
  applyViewportExtraPropsToViewportProps
} from './lib/ContentMap'
import {
  createViewportContentMap,
  createViewportExtraContentMap,
  applyContentMap
} from './lib/HTMLMetaElement'
import { isOptions, parse } from './lib/Options'

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElement: HTMLMetaElement | null = null
let viewportContentMap: ContentMap = initializeViewportProps({})
let viewportExtraContentMap: ContentMap = initializeViewportExtraProps({})
let originalViewportContentMap: ContentMap = { ...viewportContentMap }

if (typeof window !== 'undefined') {
  viewportElement = ensureViewportElement(document, viewportContentMap)
  viewportExtraElement = getViewportExtraElement(document)
  viewportContentMap = {
    ...viewportContentMap,
    ...createViewportContentMap(viewportElement)
  }
  viewportExtraContentMap = {
    ...viewportExtraContentMap,
    ...createViewportExtraContentMap(viewportElement)
  }
  originalViewportContentMap = { ...viewportContentMap }
  if (viewportExtraElement) {
    viewportContentMap = {
      ...viewportContentMap,
      ...createViewportContentMap(viewportExtraElement)
    }
    viewportExtraContentMap = {
      ...viewportExtraContentMap,
      ...createViewportExtraContentMap(viewportExtraElement)
    }
  }
  try {
    viewportContentMap = applyViewportExtraPropsToViewportProps(
      viewportContentMap,
      viewportExtraContentMap,
      originalViewportContentMap,
      getClientWidth(document)
    )
  } catch (error) {
    // Avoid throwing when initial running
  }
  applyContentMap(viewportElement, viewportContentMap)
}

export const setOptions = (maybeOptions: unknown): void => {
  if (!viewportElement) return
  if (isOptions(maybeOptions))
    viewportExtraContentMap = {
      ...viewportExtraContentMap,
      ...parse(maybeOptions)
    }
  viewportContentMap = applyViewportExtraPropsToViewportProps(
    viewportContentMap,
    viewportExtraContentMap,
    originalViewportContentMap,
    getClientWidth(document)
  )
  applyContentMap(viewportElement, viewportContentMap)
}

export const restore = (): void => {
  if (!viewportElement) return
  applyContentMap(viewportElement, originalViewportContentMap)
}

export const version = packageJson.version

export default class ViewportExtra {
  constructor(maybeOptions: unknown) {
    setOptions(maybeOptions)
  }
  static setOptions = setOptions
  static restore = restore
  static version = version
}
