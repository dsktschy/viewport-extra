import { stringifyContentMap } from './ContentMap'

describe('about src/lib/ContentMap.ts', () => {
  test('stringifyContentMap', () => {
    const contentString = stringifyContentMap({
      width: 'device-width',
      'initial-width': '1'
    })
    expect(contentString).toBe('width=device-width,initial-width=1')
  })
})
