import { describe, expect, it } from 'vitest'
import {
  applyMediaSpecificParameters,
  createPartialGlobalParameters,
  createPartialMediaSpecificParameters,
  getNullableContentAttribute,
  getNullableMediaAttribute,
  getNullableUnscaledComputingAttribute,
  setContentAttribute
} from './HTMLMetaElement.js'

describe('getNullableUnscaledComputingAttribute', () => {
  describe('case where argument has only data-unscaled-computing attribute', () => {
    it('should return value of data-unscaled-computing attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-unscaled-computing', '')
      expect(getNullableUnscaledComputingAttribute(htmlMetaElement)).toBe('')
    })
  })

  describe('case where argument has only data-extra-unscaled-computing attribute', () => {
    it('should return value of data-extra-unscaled-computing attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-extra-unscaled-computing', '')
      expect(getNullableUnscaledComputingAttribute(htmlMetaElement)).toBe('')
    })
  })

  describe('case where argument has both data-unscaled-computing and data-extra-unscaled-computing attributes', () => {
    it('should return value of data-extra-unscaled-computing attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-unscaled-computing', 'foo')
      htmlMetaElement.setAttribute('data-extra-unscaled-computing', '')
      expect(getNullableUnscaledComputingAttribute(htmlMetaElement)).toBe('')
    })
  })

  describe('case where argument does not have both data-unscaled-computing and data-extra-unscaled-computing attributes', () => {
    it('should return null', () => {
      expect(getNullableContentAttribute(document.createElement('meta'))).toBe(
        null
      )
    })
  })
})

describe('createPartialGlobalParameters', () => {
  describe('case where argument has only data-unscaled-computing attribute', () => {
    it('should return object whose unscaledComputing property is true', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-unscaled-computing', '')
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where argument has only data-extra-unscaled-computing attribute', () => {
    it('should return object whose unscaledComputing property is true', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-extra-unscaled-computing', '')
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where argument has both data-unscaled-computing and data-extra-unscaled-computing attributes', () => {
    it('should return object whose unscaledComputing property is true', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-unscaled-computing', '')
      htmlMetaElement.setAttribute('data-extra-unscaled-computing', '')
      expect(createPartialGlobalParameters(htmlMetaElement)).toStrictEqual({
        unscaledComputing: true
      })
    })
  })

  describe('case where argument does not have both data-unscaled-computing and data-extra-unscaled-computing attributes', () => {
    it('should return object that does not have unscaledComputing property', () => {
      expect(
        createPartialGlobalParameters(document.createElement('meta'))
      ).toStrictEqual({})
    })
  })
})

describe('getNullableContentAttribute', () => {
  describe('case where argument has only content attribute', () => {
    it('should return value of content attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        'width=device-width,initial-scale=1,interactive-widget=resizes-content'
      )
      expect(getNullableContentAttribute(htmlMetaElement)).toBe(
        'width=device-width,initial-scale=1,interactive-widget=resizes-content'
      )
    })
  })

  describe('case where argument has only data-extra-content attribute', () => {
    it('should return value of data-extra-content attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'data-extra-content',
        'min-width=414,max-width=768'
      )
      expect(getNullableContentAttribute(htmlMetaElement)).toBe(
        'min-width=414,max-width=768'
      )
    })
  })

  describe('case where argument has both content and data-extra-content attributes', () => {
    it('should return string that values of content and data-extra-content attributes are joined with comma', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        'width=device-width,initial-scale=1,interactive-widget=resizes-content'
      )
      htmlMetaElement.setAttribute(
        'data-extra-content',
        'min-width=414,max-width=768'
      )
      expect(getNullableContentAttribute(htmlMetaElement)).toBe(
        'width=device-width,initial-scale=1,interactive-widget=resizes-content,min-width=414,max-width=768'
      )
    })
  })

  describe('case where argument does not have both content and data-extra-content attributes', () => {
    it('should return null', () => {
      expect(getNullableContentAttribute(document.createElement('meta'))).toBe(
        null
      )
    })
  })
})

describe('getNullableMediaAttribute', () => {
  describe('case where argument has only data-media attribute', () => {
    it('should return value of data-media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-media', '(min-width: 768px)')
      expect(getNullableMediaAttribute(htmlMetaElement)).toBe(
        '(min-width: 768px)'
      )
    })
  })

  describe('case where argument has only data-extra-media attribute', () => {
    it('should return value of data-extra-media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-extra-media', '(min-width: 768px)')
      expect(getNullableMediaAttribute(htmlMetaElement)).toBe(
        '(min-width: 768px)'
      )
    })
  })

  describe('case where argument has both data-media and data-extra-media attributes', () => {
    it('should return value of data-extra-media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-media', '(min-width: 768px)')
      htmlMetaElement.setAttribute('data-extra-media', '(min-width: 1024px)')
      expect(getNullableMediaAttribute(htmlMetaElement)).toBe(
        '(min-width: 1024px)'
      )
    })
  })

  describe('case where argument does not have both data-media and data-extra-media attributes', () => {
    it('should return null', () => {
      expect(getNullableMediaAttribute(document.createElement('meta'))).toBe(
        null
      )
    })
  })
})

describe('createPartialMediaSpecificParameters', () => {
  describe('case where argument has only content attribute', () => {
    it('should return object that has content property matching all key-value pairs in content attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        `width=device-width,min-width=414,interactive-widget=resizes-content`
      )
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: {
          width: 'device-width',
          minWidth: 414,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where argument has only data-extra-content attribute', () => {
    it('should return object that has content property matching all key-value pairs in data-extra-content attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'data-extra-content',
        `width=device-width,min-width=414,interactive-widget=resizes-content`
      )
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: {
          width: 'device-width',
          minWidth: 414,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where argument has both content and data-extra-content attributes', () => {
    it('should return object that has content property matching all key-value pairs in content and data-extra-content attributes', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        `width=device-width,initial-scale=1,interactive-widget=resizes-content`
      )
      htmlMetaElement.setAttribute(
        'data-extra-content',
        `min-width=414,max-width=768`
      )
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          interactiveWidget: 'resizes-content',
          minWidth: 414,
          maxWidth: 768
        }
      })
    })

    describe('case where same keys exist in content and data-extra-content attributes', () => {
      it('should return object that values of data-extra-content attribute are used', () => {
        const htmlMetaElement = document.createElement('meta')
        htmlMetaElement.setAttribute(
          'content',
          `width=device-width,min-width=414,interactive-widget=resizes-content`
        )
        htmlMetaElement.setAttribute(
          'data-extra-content',
          `width=1024,min-width=375,interactive-widget=overlays-content`
        )
        expect(
          createPartialMediaSpecificParameters(htmlMetaElement)
        ).toStrictEqual({
          content: {
            width: 1024,
            minWidth: 375,
            interactiveWidget: 'overlays-content'
          }
        })
      })
    })
  })

  describe('case where argument has only data-media attribute', () => {
    it('should return object that has media property equal to data-media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-media', '(min-width: 768px)')
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        media: '(min-width: 768px)'
      })
    })
  })

  describe('case where argument has only data-extra-media attribute', () => {
    it('should return object that has media property equal to data-extra-media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-extra-media', '(min-width: 768px)')
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        media: '(min-width: 768px)'
      })
    })
  })

  describe('case where argument has both data-media and data-extra-media attributes', () => {
    it('should return object that has media property equal to data-extra-media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute('data-media', '(min-width: 768px)')
      htmlMetaElement.setAttribute('data-extra-media', '(min-width: 1024px)')
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        media: '(min-width: 1024px)'
      })
    })
  })

  describe('case where argument has both (data-extra-)content and data-(extra-)media attributes', () => {
    it('should return object that has content property matching all key-value pairs in (data-extra-)content attribute and media property equal to data-(extra-)media attribute', () => {
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        `width=device-width,min-width=1024,interactive-widget=resizes-content`
      )
      htmlMetaElement.setAttribute('data-media', '(min-width: 768px)')
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: {
          width: 'device-width',
          minWidth: 1024,
          interactiveWidget: 'resizes-content'
        },
        media: '(min-width: 768px)'
      })
    })
  })

  describe('case where argument has no attributes', () => {
    it('should return object that has no properties', () => {
      const htmlMetaElement = document.createElement('meta')
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({})
    })
  })
})

describe('setContentAttribute', () => {
  it('should update content attribute of first argument with second argument', () => {
    const htmlMetaElement = document.createElement('meta')
    setContentAttribute(
      htmlMetaElement,
      'width=device-width,initial-scale=1,interactive-widget=resizes-content'
    )
    expect(htmlMetaElement.getAttribute('content')).toBe(
      'width=device-width,initial-scale=1,interactive-widget=resizes-content'
    )
  })
})

describe('applyMediaSpecificParameters', () => {
  describe('case where third argument is greater than minWidth and less than maxWidth in second argument', () => {
    it('should create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in second argument, and set it to first argument', () => {
      const htmlMetaElement = document.createElement('meta')
      applyMediaSpecificParameters(
        htmlMetaElement,
        {
          content: {
            width: 'device-width',
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
          },
          media: ''
        },
        640
      )
      expect(htmlMetaElement.getAttribute('content')).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=device-width'
      )
    })
  })

  describe('case where third argument is less than minWidth in second argument', () => {
    it('should compute width and initialScale from first and third argument to fit minimum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth, and set it to first argument', () => {
      const htmlMetaElement = document.createElement('meta')
      applyMediaSpecificParameters(
        htmlMetaElement,
        {
          content: {
            width: 'device-width',
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
          },
          media: ''
        },
        375
      )
      expect(htmlMetaElement.getAttribute('content')).toBe(
        'initial-scale=1.8115942028985508,interactive-widget=resizes-content,width=414'
      )
    })
  })

  describe('case where third argument is greater than maxWidth in second argument', () => {
    it('should compute width and initialScale from first and third argument to fit maximum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth, and set it to first argument', () => {
      const htmlMetaElement = document.createElement('meta')
      applyMediaSpecificParameters(
        htmlMetaElement,
        {
          content: {
            width: 'device-width',
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
          },
          media: ''
        },
        1024
      )
      expect(htmlMetaElement.getAttribute('content')).toBe(
        'initial-scale=2.6666666666666665,interactive-widget=resizes-content,width=768'
      )
    })
  })

  describe('case where minWidth is greater than maxWidth in second argument', () => {
    it('should create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in second argument, and set it to first argument', () => {
      const htmlMetaElement = document.createElement('meta')
      applyMediaSpecificParameters(
        htmlMetaElement,
        {
          content: {
            width: 'device-width',
            initialScale: 2,
            minWidth: 768,
            maxWidth: 414,
            interactiveWidget: 'resizes-content'
          },
          media: ''
        },
        375
      )
      expect(htmlMetaElement.getAttribute('content')).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=device-width'
      )
    })
  })

  describe('case where width is number in second argument', () => {
    it('should create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in second argument, and set it to first argument', () => {
      const htmlMetaElement = document.createElement('meta')
      applyMediaSpecificParameters(
        htmlMetaElement,
        {
          content: {
            width: 1024,
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
          },
          media: ''
        },
        1024
      )
      expect(htmlMetaElement.getAttribute('content')).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=1024'
      )
    })
  })
})
