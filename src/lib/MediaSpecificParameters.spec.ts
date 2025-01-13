import { describe, expect, it, test } from 'vitest'
import {
  assignOptionalMedia,
  assignOptionalPartialContent,
  createContentAttribute,
  createMediaSpecificParameters,
  createPartialMediaSpecificParametersMerger,
  getContent,
  mergePartialMediaSpecificParameters
} from './MediaSpecificParameters.js'

describe('createMediaSpecificParameters', () => {
  describe('case where argument has properties', () => {
    it('should return object that deeply inherits properties of argument', () => {
      expect(
        createMediaSpecificParameters({
          content: {
            width: 'device-width',
            initialScale: 1,
            minWidth: 1024,
            maxWidth: Infinity,
            interactiveWidget: 'resizes-content'
          },
          media: '(min-width: 768px)'
        })
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: 1024,
          maxWidth: Infinity,
          interactiveWidget: 'resizes-content'
        },
        media: '(min-width: 768px)'
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
        },
        media: ''
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
        },
        media: ''
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
              minWidth: 768,
              maxWidth: 1024,
              interactiveWidget: 'resizes-content'
            },
            media: '(min-width: 640px)'
          },
          {}
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 768,
          maxWidth: 1024,
          interactiveWidget: 'resizes-content'
        },
        media: '(min-width: 640px)'
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
              minWidth: 768,
              maxWidth: 1024,
              interactiveWidget: 'resizes-content'
            },
            media: '(min-width: 640px)'
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 768,
          maxWidth: 1024,
          interactiveWidget: 'resizes-content'
        },
        media: '(min-width: 640px)'
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
              minWidth: 768,
              maxWidth: 1024
            },
            media: '(min-width: 640px)'
          }
        )
      ).toStrictEqual({
        content: {
          width: 1280,
          initialScale: 2,
          interactiveWidget: 'resizes-content',
          minWidth: 768,
          maxWidth: 1024
        },
        media: '(min-width: 640px)'
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
              },
              media: '(min-width: 768px)'
            },
            {
              content: {
                width: 1280,
                initialScale: 2,
                minWidth: 414,
                maxWidth: 768,
                interactiveWidget: 'overlays-content'
              },
              media: '(min-width: 640px)'
            }
          )
        ).toStrictEqual({
          content: {
            width: 1280,
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'overlays-content'
          },
          media: '(min-width: 640px)'
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
  describe('case where all arguments are undefined', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in default value of Content type', () => {
      expect(createContentAttribute()).toBe(
        'initial-scale=1,width=device-width'
      )
    })
  })

  describe('case where second argument is greater than minWidth and less than maxWidth in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument, and ignore media property in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 640,
              maxWidth: 1024,
              interactiveWidget: 'resizes-content'
            },
            media: '(min-width: 768px)'
          },
          720,
          Infinity
        )
      ).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=device-width'
      )
    })
  })

  describe('case where second argument is less than minWidth in first argument', () => {
    it('should compute width and initialScale from first and second argument to fit minimum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth, return it, and ignore media property in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 640,
              maxWidth: 1024,
              interactiveWidget: 'resizes-content'
            },
            media: '(min-width: 768px)'
          },
          414,
          Infinity
        )
      ).toBe(
        'initial-scale=1.29375,interactive-widget=resizes-content,width=640'
      )
    })
  })

  describe('case where second argument is greater than maxWidth in first argument', () => {
    it('should compute width and initialScale from first and second argument to fit maximum width into viewport, create string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth, return it, and ignore media property in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 640,
              maxWidth: 1024,
              interactiveWidget: 'resizes-content'
            },
            media: '(max-width: 1200px)'
          },
          1280,
          Infinity
        )
      ).toBe('initial-scale=2.5,interactive-widget=resizes-content,width=1024')
    })
  })

  describe('case where minWidth is greater than maxWidth in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument, and ignore media property in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 2,
              minWidth: 1024,
              maxWidth: 640,
              interactiveWidget: 'resizes-content'
            },
            media: '(min-width: 768px)'
          },
          414,
          Infinity
        )
      ).toBe(
        'initial-scale=2,interactive-widget=resizes-content,width=device-width'
      )
    })
  })

  describe('case where width is number in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument, and ignore media property in first argument', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 1280,
              initialScale: 2,
              minWidth: 640,
              maxWidth: 1024,
              interactiveWidget: 'resizes-content'
            },
            media: '(max-width: 1200px)'
          },
          1280,
          Infinity
        )
      ).toBe('initial-scale=2,interactive-widget=resizes-content,width=1280')
    })
  })

  describe('case where third argument is finite number', () => {
    it('should truncate numbers in returned value to decimal places specified as third argument when converting to string after computing', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 1.123456789,
              minWidth: 414,
              maxWidth: Infinity,
              minimumScale: 0.123456789
            },
            media: ''
          },
          375,
          6
        )
      ).toBe('initial-scale=1.017623,minimum-scale=0.123456,width=414')
    })
  })

  describe('case where third argument is Infinity', () => {
    it('should not truncate numbers in return value', () => {
      expect(
        createContentAttribute(
          {
            content: {
              width: 'device-width',
              initialScale: 1.123456789,
              minWidth: 414,
              maxWidth: Infinity,
              minimumScale: 0.123456789
            },
            media: ''
          },
          375,
          Infinity
        )
      ).toBe(
        'initial-scale=1.0176239030797103,minimum-scale=0.123456789,width=414'
      )
    })
  })
})

describe('assignOptionalPartialContent', () => {
  describe('case where first and second arguments are not undefined', () => {
    it('should return object that second argument is set to content property of first argument', () => {
      expect(
        assignOptionalPartialContent(
          {},
          {
            width: 'device-width',
            minWidth: 414,
            interactiveWidget: 'resizes-content'
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          minWidth: 414,
          interactiveWidget: 'resizes-content'
        }
      })
    })
  })

  describe('case where first argument is undefined', () => {
    it('should return object that second argument is set to content property', () => {
      expect(
        assignOptionalPartialContent(undefined, {
          width: 'device-width',
          minWidth: 414,
          interactiveWidget: 'resizes-content'
        })
      ).toStrictEqual({
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
      expect(assignOptionalPartialContent({}, undefined)).toStrictEqual({})
    })
  })
})

describe('assignOptionalMedia', () => {
  describe('case where first and second arguments are not undefined', () => {
    it('should return object that second argument is set to media property of first argument', () => {
      expect(assignOptionalMedia({}, '(min-width: 768px)')).toStrictEqual({
        media: '(min-width: 768px)'
      })
    })
  })

  describe('case where first argument is undefined', () => {
    it('should return object that second argument is set to media property', () => {
      expect(
        assignOptionalMedia(undefined, '(min-width: 768px)')
      ).toStrictEqual({
        media: '(min-width: 768px)'
      })
    })
  })

  describe('case where second argument is undefined', () => {
    it('should do nothing', () => {
      expect(assignOptionalMedia({}, undefined)).toStrictEqual({})
    })
  })
})

describe('getContent', () => {
  it('should return content property of argument', () => {
    expect(
      getContent({
        content: {
          width: 'device-width',
          initialScale: 2,
          minWidth: 414,
          maxWidth: 768,
          interactiveWidget: 'resizes-content'
        },
        media: ''
      })
    ).toStrictEqual({
      width: 'device-width',
      initialScale: 2,
      minWidth: 414,
      maxWidth: 768,
      interactiveWidget: 'resizes-content'
    })
  })
})

describe('createPartialMediaSpecificParametersMerger', () => {
  describe('case where second argument of created function has media property value that matches current viewport', () => {
    test('created function should merge first and second arguments deeply', () => {
      expect(
        createPartialMediaSpecificParametersMerger(() => true)(
          {
            content: {
              width: 'device-width',
              initialScale: 1,
              minWidth: 414
            }
          },
          {
            content: {
              minWidth: 768
            },
            media: '(min-width: 640px)'
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: 768
        },
        media: '(min-width: 640px)'
      })
    })
  })

  describe('case where second argument of created function has media property value that does not match current viewport', () => {
    test('created function should return first argument', () => {
      expect(
        createPartialMediaSpecificParametersMerger(() => false)(
          {
            content: {
              width: 'device-width',
              initialScale: 1,
              minWidth: 414
            }
          },
          {
            content: {
              minWidth: 768
            },
            media: '(min-width: 640px)'
          }
        )
      ).toStrictEqual({
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: 414
        }
      })
    })
  })
})
