import { describe, it, expect } from 'vitest'
import {
  createMediaSpecificParameters,
  mergePartialMediaSpecificParameters,
  createContentAttribute,
  setOptionalPartialContent
} from './MediaSpecificParameters.js'

describe('createMediaSpecificParameters', () => {
  describe('case where argument has properties', () => {
    it('should return object that deeply inherits properties of argument', () => {
      expect(
        createMediaSpecificParameters({
          content: {
            width: 'device-width',
            initialScale: 1,
            minWidth: 414,
            maxWidth: Infinity,
            interactiveWidget: 'resizes-content'
          }
        })
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: 414,
          maxWidth: Infinity,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where argument has missing properties of MediaSpecificParameters type', () => {
    it('should return object with missing properties set to default value deeply', () => {
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

  describe('case where argument is undefined', () => {
    it('should return object with all properties that have default value', () => {
      expect(createMediaSpecificParameters()).toStrictEqual({
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
  describe('case where properties exist in only first argument', () => {
    it('should return object that has properties in first argument', () => {
      expect(
        mergePartialMediaSpecificParameters(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768,
              interactiveWidget: 'resizes-content'
            }
          },
          {}
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where properties exist in only second argument', () => {
    it('should return object that has properties in second argument', () => {
      expect(
        mergePartialMediaSpecificParameters(
          {},
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768,
              interactiveWidget: 'resizes-content'
            }
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where properties exist in both first and second arguments deeply', () => {
    it('should return object that properties in first and second arguments are merged deeply', () => {
      expect(
        mergePartialMediaSpecificParameters(
          {
            content: {
              width: 1280,
              initialScale: 2,
              interactiveWidget: 'resizes-content'
            }
          },
          {
            content: {
              minWidth: 414,
              maxWidth: 768
            }
          }
        )
      ).toStrictEqual({
        content: {
          width: 1280,
          initialScale: 2,
          interactiveWidget: 'resizes-content',
          minWidth: 414,
          maxWidth: 768
        }
      })
    })

    describe('case where first and second arguments have same properties deeply', () => {
      it('should return object that values of second argument are used', () => {
        expect(
          mergePartialMediaSpecificParameters(
            {
              content: {
                width: 'device-width',
                initialScale: 1,
                minWidth: 0,
                maxWidth: Infinity,
                interactiveWidget: 'resizes-content'
              }
            },
            {
              content: {
                width: 1280,
                initialScale: 2,
                minWidth: 414,
                maxWidth: 768,
                interactiveWidget: 'overlays-content'
              }
            }
          )
        ).toStrictEqual({
          content: {
            width: 1280,
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'overlays-content'
          }
        })
      })
    })
  })

  describe('case where properties do not exist in both first and second arguments', () => {
    it('should return empty object', () => {
      expect(mergePartialMediaSpecificParameters({}, {})).toStrictEqual({})
    })
  })
})

describe('createContentAttribute', () => {
  describe('case where second argument is greater than minWidth and less than maxWidth in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768,
              interactiveWidget: 'resizes-content'
            }
          },
          640
        )
      ).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=device-width'
      )
    })
  })

  describe('case where second argument is less than minWidth in first argument', () => {
    it('should compute width and initialScale from first and second argument to fit minimum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth, and return it', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768,
              interactiveWidget: 'resizes-content'
            }
          },
          375
        )
      ).toBe(
        'initial-scale=1.8115942028985508,interactive-widget=resizes-content,width=414'
      )
    })
  })

  describe('case where second argument is greater than maxWidth in first argument', () => {
    it('should compute width and initialScale from first and second argument to fit maximum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth, and return it', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768,
              interactiveWidget: 'resizes-content'
            }
          },
          1024
        )
      ).toBe(
        'initial-scale=2.6666666666666665,interactive-widget=resizes-content,width=768'
      )
    })
  })

  describe('case where minWidth is greater than maxWidth in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 768,
              maxWidth: 414,
              interactiveWidget: 'resizes-content'
            }
          },
          375
        )
      ).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=device-width'
      )
    })
  })

  describe('case where width is number in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 1024,
              initialScale: 2,
              minWidth: 414,
              maxWidth: 768,
              interactiveWidget: 'resizes-content'
            }
          },
          1024
        )
      ).toBe('initial-scale=2,interactive-widget=resizes-content,width=1024')
    })
  })
})

describe('setOptionalPartialContent', () => {
  describe('case where second argument is not undefined', () => {
    it('should set second argument to content property of first argument', () => {
      const mediaSpecificParameters = {}
      setOptionalPartialContent(mediaSpecificParameters, {
        width: 'device-width',
        minWidth: 414,
        interactiveWidget: 'resizes-content'
      })
      expect(mediaSpecificParameters).toStrictEqual({
        content: {
          width: 'device-width',
          minWidth: 414,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where second argument is undefined', () => {
    it('should do nothing', () => {
      const mediaSpecificParameters = {}
      setOptionalPartialContent(mediaSpecificParameters, undefined)
      expect(mediaSpecificParameters).toStrictEqual({})
    })
  })
})
