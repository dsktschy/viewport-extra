import { parse } from './ContentString'

describe('about src/lib/ContentString.ts', () => {
  test('parse', () => {
    const contentMap = parse('width=device-width,initial-width=1')
    expect(contentMap).toStrictEqual({
      width: 'device-width',
      'initial-width': '1'
    })
  })
})
