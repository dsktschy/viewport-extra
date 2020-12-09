import { isGeneralObject } from '../../src/lib/GeneralObject'

describe('about src/lib/GeneralObject.ts', () => {
  test('`isGeneralObject` determines object including props to be GeneralObject', () => {
    const maybeGeneralObject = { minWidth: 375 }
    expect(isGeneralObject(maybeGeneralObject)).toBe(true)
  })

  test('`isGeneralObject` determines null not to be GeneralObject', () => {
    const maybeGeneralObject = null
    expect(isGeneralObject(maybeGeneralObject)).toBe(false)
  })
})
