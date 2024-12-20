import { describe, expect, it } from 'vitest'
import {
  createGlobalParameters,
  mergePartialGlobalParameters,
  setOptionalUnscaledComputing
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

describe('setOptionalUnscaledComputing', () => {
  describe('case where second argument is not undefined', () => {
    it('should set second argument to unscaledComputing property of first argument', () => {
      const globalParameters = {}
      setOptionalUnscaledComputing(globalParameters, true)
      expect(globalParameters).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where second argument is undefined', () => {
    it('should do nothing', () => {
      const globalParameters = {}
      setOptionalUnscaledComputing(globalParameters, undefined)
      expect(globalParameters).toStrictEqual({})
    })
  })
})
