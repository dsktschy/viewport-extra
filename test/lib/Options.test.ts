import { isOptions, parse } from '../../src/lib/Options'

describe('about src/lib/Options.ts', () => {
  test('`isOptions` determines number to be Options', () => {
    const maybeOptions = 375
    expect(isOptions(maybeOptions)).toBe(true)
  })

  test('`isOptions` determines OptionsMap object to be Options', () => {
    const maybeOptions = { minWidth: 375 }
    expect(isOptions(maybeOptions)).toBe(true)
  })

  test('`isOptions` determines non-OptionsMap object not to be Options', () => {
    const maybeOptions = { invalid: true }
    expect(isOptions(maybeOptions)).toBe(false)
  })

  test('`parse` returns correct ContentMap with number', () => {
    const options = 375
    expect(parse(options)).toStrictEqual({ 'min-width': '375' })
  })

  test('`parse` returns correct ContentMap with OptionsMap object', () => {
    const options = { minWidth: 375, maxWidth: 414, invalid: true }
    expect(parse(options)).toStrictEqual({
      'min-width': '375',
      'max-width': '414'
    })
  })
})
