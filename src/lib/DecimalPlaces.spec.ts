import { describe, expect, it } from 'vitest'
import {
  createDecimalPlaces,
  mergeOptionalDecimalPlaces
} from './DecimalPlaces.js'

describe('createDecimalPlaces', () => {
  describe('case where argument is not undefined', () => {
    it('should return argument', () => {
      expect(createDecimalPlaces(6)).toBe(6)
    })
  })

  describe('case where argument is undefined', () => {
    it('should return default value', () => {
      expect(createDecimalPlaces(undefined)).toBe(Infinity)
    })
  })
})

describe('mergeOptionalDecimalPlaces', () => {
  describe('case where only first argument is not undefined', () => {
    it('should return first argument', () => {
      expect(mergeOptionalDecimalPlaces(6, undefined)).toBe(6)
    })
  })

  describe('case where only second argument is not undefined', () => {
    it('should return second argument', () => {
      expect(mergeOptionalDecimalPlaces(undefined, 6)).toBe(6)
    })
  })

  describe('case where first and second arguments are not undefined', () => {
    it('should return second argument', () => {
      expect(mergeOptionalDecimalPlaces(6, 0)).toBe(0)
    })
  })

  describe('case where first and second arguments are undefined', () => {
    it('should return undefined', () => {
      expect(mergeOptionalDecimalPlaces(undefined, undefined)).toBe(undefined)
    })
  })
})
