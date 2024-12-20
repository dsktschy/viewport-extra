import { describe, expect, it } from 'vitest'
import {
  createUnscaledComputing,
  mergeOptionalUnscaledComputing
} from './UnscaledComputing.js'

describe('createUnscaledComputing', () => {
  describe('case where argument is not undefined', () => {
    it('should return argument', () => {
      expect(createUnscaledComputing(true)).toBe(true)
    })
  })

  describe('case where argument is undefined', () => {
    it('should return default value', () => {
      expect(createUnscaledComputing(undefined)).toBe(false)
    })
  })
})

describe('mergeOptionalUnscaledComputing', () => {
  describe('case where only first argument is not undefined', () => {
    it('should return first argument', () => {
      expect(mergeOptionalUnscaledComputing(true, undefined)).toBe(true)
    })
  })

  describe('case where only second argument is not undefined', () => {
    it('should return second argument', () => {
      expect(mergeOptionalUnscaledComputing(undefined, true)).toBe(true)
    })
  })

  describe('case where first and second arguments are not undefined', () => {
    it('should return second argument', () => {
      expect(mergeOptionalUnscaledComputing(true, false)).toBe(false)
    })
  })

  describe('case where first and second arguments are undefined', () => {
    it('should return undefined', () => {
      expect(mergeOptionalUnscaledComputing(undefined, undefined)).toBe(
        undefined
      )
    })
  })
})
