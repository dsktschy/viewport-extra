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

let viewportElement: HTMLMetaElement | null = null
let viewportExtraElement: HTMLMetaElement | null = null
let viewportContentMap: ContentMap = initializeViewportProps({})
let viewportExtraContentMap: ContentMap = initializeViewportExtraProps({})

if (typeof window !== 'undefined') {
  // Keep elements
  viewportElement = ensureViewportElement(document)
  viewportExtraElement = getViewportExtraElement(document)
  // Keep attributes
  viewportContentMap = {
    ...viewportContentMap,
    ...createViewportContentMap(viewportElement)
  }
  viewportExtraContentMap = {
    ...viewportExtraContentMap,
    ...createViewportExtraContentMap(viewportElement)
  }
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
  // Apply viewportExtraContentMap to viewportContentMap
  try {
    viewportContentMap = applyViewportExtraPropsToViewportProps(
      viewportContentMap,
      viewportExtraContentMap,
      getClientWidth(document)
    )
  } catch (error) {
    // Avoid throwing when initial running
  }
  // Apply viewportContentMap to viewportElement
  applyContentMap(viewportElement, viewportContentMap)
}

export const version = packageJson.version

const ViewportExtra = {
  version: packageJson.version
}
export default ViewportExtra
