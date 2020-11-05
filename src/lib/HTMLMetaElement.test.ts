import {
  getViewportContentMap,
  getViewportExtraContentMap
} from './HTMLMetaElement'

describe('about src/lib/HTMLMetaElement.ts', () => {
  const viewportElement = document.createElement('meta')
  viewportElement.setAttribute('name', 'viewport')
  viewportElement.setAttribute(
    'content',
    'width=device-width,initial-scale=1,min-width=0,max-width=9999'
  )
  viewportElement.setAttribute(
    'data-extra-content',
    'width=0,initial-scale=10,min-width=375,max-width=414'
  )

  const viewportExtraElement = document.createElement('meta')
  viewportExtraElement.setAttribute('name', 'viewport-extra')
  viewportExtraElement.setAttribute(
    'content',
    'width=device-width,initial-scale=1,min-width=375,max-width=414'
  )
  viewportExtraElement.setAttribute(
    'data-extra-content',
    'width=0,initial-scale=10,min-width=0,max-width=9999'
  )

  const descriptionElement = document.createElement('meta')
  descriptionElement.setAttribute('name', 'description')
  descriptionElement.setAttribute('content', 'This is a test page.')
  descriptionElement.setAttribute(
    'data-extra-content',
    'width=0,initial-scale=10,min-width=0,max-width=9999'
  )

  const charsetElement = document.createElement('meta')
  charsetElement.setAttribute('charset', 'utf-8')
  charsetElement.setAttribute(
    'data-extra-content',
    'width=0,initial-scale=10,min-width=0,max-width=9999'
  )

  test('getViewportContentMap returns correct ContentMap with meta[name="viewport"] element', () => {
    const viewportContentMap = getViewportContentMap(viewportElement)
    expect(viewportContentMap).toStrictEqual({
      width: 'device-width',
      'initial-scale': '1'
    })
  })

  test('getViewportContentMap returns correct ContentMap with meta[name="viewport-extra"] element', () => {
    const viewportContentMap = getViewportContentMap(viewportExtraElement)
    expect(viewportContentMap).toStrictEqual({
      width: 'device-width',
      'initial-scale': '1'
    })
  })

  test('getViewportContentMap returns empty ContentMap with meta element that has name attribute whose value is neither viewport or viewport-extra', () => {
    const viewportContentMap = getViewportContentMap(descriptionElement)
    expect(viewportContentMap).toStrictEqual({})
  })

  test('getViewportContentMap returns empty ContentMap with meta element that is neither meta[name="viewport"] or meta[name="viewport-extra"]', () => {
    const viewportContentMap = getViewportContentMap(charsetElement)
    expect(viewportContentMap).toStrictEqual({})
  })

  test('getViewportExtraContentMap returns correct ContentMap with meta[name="viewport"] element', () => {
    const viewportExtraContentMap = getViewportExtraContentMap(viewportElement)
    expect(viewportExtraContentMap).toStrictEqual({
      'min-width': '375',
      'max-width': '414'
    })
  })

  test('getViewportExtraContentMap returns correct ContentMap with meta[name="viewport-extra"] element', () => {
    const viewportExtraContentMap = getViewportExtraContentMap(
      viewportExtraElement
    )
    expect(viewportExtraContentMap).toStrictEqual({
      'min-width': '375',
      'max-width': '414'
    })
  })

  test('getViewportExtraContentMap returns empty ContentMap with meta element that has name attribute whose value is neither viewport or viewport-extra', () => {
    const viewportExtraContentMap = getViewportExtraContentMap(
      descriptionElement
    )
    expect(viewportExtraContentMap).toStrictEqual({})
  })

  test('getViewportExtraContentMap returns empty ContentMap with meta element that is neither meta[name="viewport"] or meta[name="viewport-extra"]', () => {
    const viewportExtraContentMap = getViewportExtraContentMap(charsetElement)
    expect(viewportExtraContentMap).toStrictEqual({})
  })
})
