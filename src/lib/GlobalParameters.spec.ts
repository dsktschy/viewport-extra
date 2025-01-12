import { describe, expect, it } from 'vitest'
import {
  assignOptionalUnscaledComputing,
  createGlobalParameters,
  getUnscaledComputing,
  mergePartialGlobalParameters
} from './GlobalParameters.js'

describe('createGlobalParameters', () => {
  describe('case where argument has properties', () => {
    it('should return object that deeply inherits properties of argument', () => {
      expect(
        createGlobalParameters({
          unscaledComputing: true
        })
      ).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where argument has missing properties of GlobalParameters type', () => {
    it('should return object with missing properties set to default value deeply', () => {
      expect(createGlobalParameters({})).toStrictEqual({
        unscaledComputing: false
      })
    })
  })

  describe('case where argument is undefined', () => {
    it('should return object with all properties that have default value', () => {
      expect(createGlobalParameters()).toStrictEqual({
        unscaledComputing: false
      })
    })
  })
})

describe('mergePartialGlobalParameters', () => {
  describe('case where properties exist in only first argument', () => {
    it('should return object that has properties in first argument', () => {
      expect(
        mergePartialGlobalParameters(
          {
            unscaledComputing: true
          },
          {}
        )
      ).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where properties exist in only second argument', () => {
    it('should return object that has properties in second argument', () => {
      expect(
        mergePartialGlobalParameters(
          {},
          {
            unscaledComputing: true
          }
        )
      ).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where properties exist in both first and second arguments deeply', () => {
    describe('case where first and second arguments have same properties deeply', () => {
      it('should return object that values of second argument are used', () => {
        expect(
          mergePartialGlobalParameters(
            {
              unscaledComputing: true
            },
            {
              unscaledComputing: false
            }
          )
        ).toStrictEqual({
          unscaledComputing: false
        })
      })
    })
  })

  describe('case where properties do not exist in both first and second arguments', () => {
    it('should return empty object', () => {
      expect(mergePartialGlobalParameters({}, {})).toStrictEqual({})
    })
  })
})

describe('assignOptionalUnscaledComputing', () => {
  describe('case where first and second arguments are not undefined', () => {
    it('should return object that second argument is set to unscaledComputing property of first argument', () => {
      expect(assignOptionalUnscaledComputing({}, true)).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where first argument is undefined', () => {
    it('should return object that second argument is set to unscaledComputing property', () => {
      expect(assignOptionalUnscaledComputing(undefined, true)).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where second argument is undefined', () => {
    it('should do nothing', () => {
      expect(assignOptionalUnscaledComputing({}, undefined)).toStrictEqual({})
    })
  })
})

describe('getUnscaledComputing', () => {
  it('should return unscaledComputing property', () => {
    expect(
      getUnscaledComputing({
        unscaledComputing: true
      })
    ).toBe(true)
  })
})
