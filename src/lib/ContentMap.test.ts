import {
  ContentMap,
  defaultViewportProps,
  forcedViewportProps,
  defaultViewportExtraProps,
  forcedViewportExtraProps,
  initializeViewportProps,
  initializeViewportExtraProps,
  stringify,
  createAppliedContentMap
} from './ContentMap'
import {
  NonnumericInitialScaleError,
  NoOptionsError,
  NonnumericMinWidthError,
  NonnumericMaxWidthError,
  ReversedOptionsError
} from './Error'

describe('about src/lib/ContentMap.ts', () => {
  test('initializeViewportProps applys initial props', () => {
    const viewportContentMap = initializeViewportProps({})
    expect(viewportContentMap).toStrictEqual({
      ...defaultViewportProps,
      ...forcedViewportProps
    })
  })

  test('initializeViewportProps overrides forced props and input props overrides default props', () => {
    const inputViewportContentMap: ContentMap = {
      ...defaultViewportProps,
      ...forcedViewportProps
    }
    for (const [key, value] of Object.entries(inputViewportContentMap)) {
      inputViewportContentMap[key] = `${value}foobar`
    }
    const expectedViewportContentMap: ContentMap = forcedViewportProps
    for (const key of Object.keys(defaultViewportProps)) {
      expectedViewportContentMap[key] = inputViewportContentMap[key]
    }
    const viewportContentMap = initializeViewportProps(inputViewportContentMap)
    expect(viewportContentMap).toStrictEqual(expectedViewportContentMap)
  })

  test('initializeViewportExtraProps applys initial props', () => {
    const viewportExtraContentMap = initializeViewportExtraProps({})
    expect(viewportExtraContentMap).toStrictEqual({
      ...defaultViewportExtraProps,
      ...forcedViewportExtraProps
    })
  })

  test('initializeViewportExtraProps overrides forced props and input props overrides default props', () => {
    const inputViewportExtraContentMap: ContentMap = {
      ...defaultViewportExtraProps,
      ...forcedViewportExtraProps
    }
    for (const [key, value] of Object.entries(inputViewportExtraContentMap)) {
      inputViewportExtraContentMap[key] = `${value}foobar`
    }
    const expectedViewportExtraContentMap: ContentMap = forcedViewportExtraProps
    for (const key of Object.keys(defaultViewportExtraProps)) {
      expectedViewportExtraContentMap[key] = inputViewportExtraContentMap[key]
    }
    const viewportExtraContentMap = initializeViewportExtraProps(
      inputViewportExtraContentMap
    )
    expect(viewportExtraContentMap).toStrictEqual(
      expectedViewportExtraContentMap
    )
  })

  test('createAppliedContentMap throws error when receiving initial-scale that is not numeric string', () => {
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': 'foobar'
    }
    const viewportExtraContentMap = {
      'min-width': '375',
      'max-width': '414'
    }
    const documentClientWidth = 390
    const bindedCreateAppliedContentMap = createAppliedContentMap.bind(
      null,
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(bindedCreateAppliedContentMap).toThrowError(
      NonnumericInitialScaleError
    )
  })

  test('createAppliedContentMap throws error when not receiving min-width and max-width', () => {
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': '1'
    }
    const viewportExtraContentMap = {}
    const documentClientWidth = 390
    const bindedCreateAppliedContentMap = createAppliedContentMap.bind(
      null,
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(bindedCreateAppliedContentMap).toThrowError(NoOptionsError)
  })

  test('createAppliedContentMap throws error when receiving min-width that is not numeric string', () => {
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': '1'
    }
    const viewportExtraContentMap = {
      'min-width': 'foobar',
      'max-width': '414'
    }
    const documentClientWidth = 390
    const bindedCreateAppliedContentMap = createAppliedContentMap.bind(
      null,
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(bindedCreateAppliedContentMap).toThrowError(NonnumericMinWidthError)
  })

  test('createAppliedContentMap throws error when receiving max-width that is not numeric string', () => {
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': '1'
    }
    const viewportExtraContentMap = {
      'min-width': '375',
      'max-width': 'foobar'
    }
    const documentClientWidth = 390
    const bindedCreateAppliedContentMap = createAppliedContentMap.bind(
      null,
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(bindedCreateAppliedContentMap).toThrowError(NonnumericMaxWidthError)
  })

  test('createAppliedContentMap throws error when receiving max-width that is less than min-width', () => {
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': '1'
    }
    const viewportExtraContentMap = {
      'min-width': '414',
      'max-width': '375'
    }
    const documentClientWidth = 390
    const bindedCreateAppliedContentMap = createAppliedContentMap.bind(
      null,
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(bindedCreateAppliedContentMap).toThrowError(ReversedOptionsError)
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 375, documentClientWidth: 374', () => {
    const initialScale = '1'
    const minWidth = '375'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth
    }
    const documentClientWidth = 374
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual({
      width: minWidth,
      'initial-scale': `${(documentClientWidth / +minWidth) * +initialScale}`
    })
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 375, documentClientWidth: 375', () => {
    const initialScale = '1'
    const minWidth = '375'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth
    }
    const documentClientWidth = 375
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual(viewportContentMap)
  })

  test('createAppliedContentMap with following params. initial-scale: 1, max-width: 414, documentClientWidth: 414', () => {
    const initialScale = '1'
    const maxWidth = '414'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'max-width': maxWidth
    }
    const documentClientWidth = 414
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual(viewportContentMap)
  })

  test('createAppliedContentMap with following params. initial-scale: 1, max-width: 414, documentClientWidth: 415', () => {
    const initialScale = '1'
    const maxWidth = '414'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'max-width': maxWidth
    }
    const documentClientWidth = 415
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual({
      width: maxWidth,
      'initial-scale': `${(documentClientWidth / +maxWidth) * +initialScale}`
    })
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 375, max-width: 414, documentClientWidth: 374', () => {
    const initialScale = '1'
    const minWidth = '375'
    const maxWidth = '414'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 374
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual({
      width: minWidth,
      'initial-scale': `${(documentClientWidth / +minWidth) * +initialScale}`
    })
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 375, max-width: 414, documentClientWidth: 375', () => {
    const initialScale = '1'
    const minWidth = '375'
    const maxWidth = '414'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 375
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual(viewportContentMap)
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 375, max-width: 414, documentClientWidth: 414', () => {
    const initialScale = '1'
    const minWidth = '375'
    const maxWidth = '414'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 414
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual(viewportContentMap)
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 375, max-width: 414, documentClientWidth: 415', () => {
    const initialScale = '1'
    const minWidth = '375'
    const maxWidth = '414'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 415
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual({
      width: maxWidth,
      'initial-scale': `${(documentClientWidth / +maxWidth) * +initialScale}`
    })
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 390, max-width: 390, documentClientWidth: 389', () => {
    const initialScale = '1'
    const minWidth = '390'
    const maxWidth = '390'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 389
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual({
      width: minWidth,
      'initial-scale': `${(documentClientWidth / +minWidth) * +initialScale}`
    })
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 390, max-width: 390, documentClientWidth: 390', () => {
    const initialScale = '1'
    const minWidth = '390'
    const maxWidth = '390'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 390
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual(viewportContentMap)
  })

  test('createAppliedContentMap with following params. initial-scale: 1, min-width: 390, max-width: 390, documentClientWidth: 391', () => {
    const initialScale = '1'
    const minWidth = '390'
    const maxWidth = '390'
    const viewportContentMap = {
      width: 'device-width',
      'initial-scale': initialScale
    }
    const viewportExtraContentMap = {
      'min-width': minWidth,
      'max-width': maxWidth
    }
    const documentClientWidth = 391
    const contentMap = createAppliedContentMap(
      viewportContentMap,
      viewportExtraContentMap,
      documentClientWidth
    )
    expect(contentMap).toStrictEqual({
      width: maxWidth,
      'initial-scale': `${(documentClientWidth / +maxWidth) * +initialScale}`
    })
  })

  test('stringify', () => {
    const contentString = stringify({
      width: 'device-width',
      'initial-width': '1'
    })
    expect(contentString).toBe('width=device-width,initial-width=1')
  })
})
