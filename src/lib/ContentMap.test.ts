import {
  stringifyContentMap,
  isValidAsViewportExtraContentMap
} from './ContentMap'

describe('about src/lib/ContentMap.ts', () => {
  test('stringifyContentMap', () => {
    const contentString = stringifyContentMap({
      width: 'device-width',
      'initial-width': '1'
    })
    expect(contentString).toBe('width=device-width,initial-width=1')
  })

  test('isValidAsViewportExtraContentMap returns true when receiving min-width and max-width, and they are numeric strings and min-width <= max-width', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'min-width': '375',
      'max-width': '414'
    })
    expect(viewportExtraContentMapValid).toBe(true)
  })

  test('isValidAsViewportExtraContentMap returns false when receiving min-width and max-width, but min-width > max-width', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'min-width': '414',
      'max-width': '375'
    })
    expect(viewportExtraContentMapValid).toBe(false)
  })

  test('isValidAsViewportExtraContentMap returns false when receiving min-width and max-width, but min-width is not numeric string', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'min-width': 'foobar',
      'max-width': '414'
    })
    expect(viewportExtraContentMapValid).toBe(false)
  })

  test('isValidAsViewportExtraContentMap returns false when receiving min-width and max-width, but max-width is not numeric string', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'min-width': '375',
      'max-width': 'foobar'
    })
    expect(viewportExtraContentMapValid).toBe(false)
  })

  test('isValidAsViewportExtraContentMap returns true when receiving min-width, and it is numeric string', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'min-width': '375'
    })
    expect(viewportExtraContentMapValid).toBe(true)
  })

  test('isValidAsViewportExtraContentMap returns false when receiving min-width, and it is not numeric string', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'min-width': 'foobar'
    })
    expect(viewportExtraContentMapValid).toBe(false)
  })

  test('isValidAsViewportExtraContentMap returns true when receiving max-width, and it is numeric string', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'max-width': '414'
    })
    expect(viewportExtraContentMapValid).toBe(true)
  })

  test('isValidAsViewportExtraContentMap returns false when receiving max-width, and it is not numeric string', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({
      'max-width': 'foobar'
    })
    expect(viewportExtraContentMapValid).toBe(false)
  })

  test('isValidAsViewportExtraContentMap returns false when not receiving both of min-width and max-width', () => {
    const viewportExtraContentMapValid = isValidAsViewportExtraContentMap({})
    expect(viewportExtraContentMapValid).toBe(false)
  })
})
