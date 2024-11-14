import { describe, it, expect } from 'vitest'
import {
  createMediaSpecificParameters,
  mergePartialMediaSpecificParameters
} from './MediaSpecificParameters.js'

describe('createMediaSpecificParameters', () => {
  describe('case where argument object has content property', () => {
    it('should return object with content property complete', () => {
      expect(
        createMediaSpecificParameters({
          content: {
            width: 'device-width',
            minWidth: 414
          }
        })
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: 414,
          maxWidth: Infinity
        }
      })
    })
  })

  describe('case where argument object does not have content property', () => {
    it('should return object with content property set to default value', () => {
      expect(createMediaSpecificParameters({})).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: 0,
          maxWidth: Infinity
        }
      })
    })
  })
})

describe('mergePartialMediaSpecificParameters', () => {
  describe('case where properties in content property exist in both preceding and following argument objects', () => {
    it('should return object whose content property has values of following argument object', () => {
      expect(
        mergePartialMediaSpecificParameters(
          {
            content: {
              width: 1280,
              initialScale: 1,
              minWidth: 0,
              maxWidth: Infinity
            }
          },
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768
            }
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768
        }
      })
    })
  })

  describe('case where properties in content property exist in only preceding argument object', () => {
    it('should return object whose content property has values of preceding argument object', () => {
      expect(
        mergePartialMediaSpecificParameters(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768
            }
          },
          {
            content: {}
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768
        }
      })
    })
  })

  describe('case where properties in content property do not exist in both preceding and following argument objects', () => {
    it('should return object whose content property has no value', () => {
      expect(
        mergePartialMediaSpecificParameters(
          {
            content: {}
          },
          {
            content: {}
          }
        )
      ).toStrictEqual({
        content: {}
      })
    })
  })
})
