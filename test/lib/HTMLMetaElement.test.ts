import {
  createViewportContentMap,
  createViewportExtraContentMap,
  applyContentMap
} from '../../src/lib/HTMLMetaElement'

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

  test('`createViewportContentMap` returns correct ContentMap with meta[name="viewport"] element', () => {
    const viewportContentMap = createViewportContentMap(viewportElement)
    expect(viewportContentMap).toStrictEqual({
      width: 'device-width',
      'initial-scale': '1'
    })
  })

  test('`createViewportContentMap` returns correct ContentMap with meta[name="viewport-extra"] element', () => {
    const viewportContentMap = createViewportContentMap(viewportExtraElement)
    expect(viewportContentMap).toStrictEqual({
      width: 'device-width',
      'initial-scale': '1'
    })
  })

  test('`createViewportContentMap` returns empty ContentMap with meta element that has name attribute whose value is neither viewport or viewport-extra', () => {
    const viewportContentMap = createViewportContentMap(descriptionElement)
    expect(viewportContentMap).toStrictEqual({})
  })

  test('`createViewportContentMap` returns empty ContentMap with meta element that is neither meta[name="viewport"] or meta[name="viewport-extra"]', () => {
    const viewportContentMap = createViewportContentMap(charsetElement)
    expect(viewportContentMap).toStrictEqual({})
  })

  test('`createViewportExtraContentMap` returns correct ContentMap with meta[name="viewport"] element', () => {
    const viewportExtraContentMap = createViewportExtraContentMap(
      viewportElement
    )
    expect(viewportExtraContentMap).toStrictEqual({
      'min-width': '375',
      'max-width': '414'
    })
  })

  test('`createViewportExtraContentMap` returns correct ContentMap with meta[name="viewport-extra"] element', () => {
    const viewportExtraContentMap = createViewportExtraContentMap(
      viewportExtraElement
    )
    expect(viewportExtraContentMap).toStrictEqual({
      'min-width': '375',
      'max-width': '414'
    })
  })

  test('`createViewportExtraContentMap` returns empty ContentMap with meta element that has name attribute whose value is neither viewport or viewport-extra', () => {
    const viewportExtraContentMap = createViewportExtraContentMap(
      descriptionElement
    )
    expect(viewportExtraContentMap).toStrictEqual({})
  })

  test('`createViewportExtraContentMap` returns empty ContentMap with meta element that is neither meta[name="viewport"] or meta[name="viewport-extra"]', () => {
    const viewportExtraContentMap = createViewportExtraContentMap(
      charsetElement
    )
    expect(viewportExtraContentMap).toStrictEqual({})
  })

  test('`applyContentMap` applys ContentMap to meta[name="viewport"] element', () => {
    applyContentMap(viewportElement, { width: '375' })
    const contentString = viewportElement.getAttribute('content')
    expect(contentString).toBe('width=375')
  })

  test('`applyContentMap` does not apply ContentMap to meta[name="viewport-extra"] element', () => {
    applyContentMap(viewportExtraElement, { width: '375' })
    const contentString = viewportExtraElement.getAttribute('content')
    expect(contentString).not.toBe('width=375')
  })

  test('`applyContentMap` does not apply ContentMap to meta[name="description"] element', () => {
    applyContentMap(descriptionElement, { width: '375' })
    const contentString = descriptionElement.getAttribute('content')
    expect(contentString).not.toBe('width=375')
  })

  test('`applyContentMap` does not apply ContentMap to meta[charset="utf-8"] element', () => {
    applyContentMap(charsetElement, { width: '375' })
    const contentString = charsetElement.getAttribute('content')
    expect(contentString).not.toBe('width=375')
  })
})
