import { isOptionsMap } from './OptionsMap'

describe('about src/lib/OptionsMap.ts', () => {
  test('isOptionsMap determines object including only minWidth to be OptionsMap', () => {
    const maybeOptionsMap = { minWidth: 375 }
    expect(isOptionsMap(maybeOptionsMap)).toBe(true)
  })

  test('isOptionsMap determines object including only maxWidth to be OptionsMap', () => {
    const maybeOptionsMap = { maxWidth: 414 }
    expect(isOptionsMap(maybeOptionsMap)).toBe(true)
  })

  test('isOptionsMap determines object including both of minWidth and maxWidth to be OptionsMap', () => {
    const maybeOptionsMap = { minWidth: 375, maxWidth: 414 }
    expect(isOptionsMap(maybeOptionsMap)).toBe(true)
  })

  test('isOptionsMap determines object including both of valid minWidth and invalid maxWidth to be OptionsMap', () => {
    const maybeOptionsMap = { minWidth: 375, maxWidth: 'invalid' }
    expect(isOptionsMap(maybeOptionsMap)).toBe(true)
  })

  test('isOptionsMap determines object including both of invalid minWidth and valid maxWidth to be OptionsMap', () => {
    const maybeOptionsMap = { minWidth: 'invalid', maxWidth: 414 }
    expect(isOptionsMap(maybeOptionsMap)).toBe(true)
  })

  test('isOptionsMap determines object including both of minWidth, maxWidth, and other props to be OptionsMap', () => {
    const maybeOptionsMap = { minWidth: 375, maxWidth: 414, invalid: true }
    expect(isOptionsMap(maybeOptionsMap)).toBe(true)
  })

  test('isOptionsMap determines empty object not to be OptionsMap', () => {
    const maybeOptionsMap = {}
    expect(isOptionsMap(maybeOptionsMap)).toBe(false)
  })

  test('isOptionsMap determines object including only invalid props not to be OptionsMap', () => {
    const maybeOptionsMap = { invalid: true }
    expect(isOptionsMap(maybeOptionsMap)).toBe(false)
  })
})
