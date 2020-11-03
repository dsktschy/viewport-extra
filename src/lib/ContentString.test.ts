import { parseContentString } from './ContentString'

describe('about src/lib/ContentString.ts', () => {
  test('parseContentString', () => {
    const contentMap = parseContentString('width=device-width,initial-width=1')
    expect(contentMap).toStrictEqual({
      width: 'device-width',
      'initial-width': '1'
    })
  })
})
