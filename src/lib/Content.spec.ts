import { describe, test, it, expect } from 'vitest'
import {
  isContentWidth,
  isContentInitialScale,
  isContentMinWidth,
  isContentMaxWidth,
  defaultContent,
  createContent,
  createPartialMediaSpecificParameters,
  mergeOptionalPartialContent,
  createContentAttribute
} from './Content.js'

describe('about src/lib/Content.ts', () => {
  test('whether `isContentWidth` determines `375` to be ContentWidth', () => {
    expect(isContentWidth(375)).toBe(true)
  })

  test("whether `isContentWidth` determines `'device-width'` to be ContentWidth", () => {
    expect(isContentWidth('device-width')).toBe(true)
  })

  test('whether `isContentWidth` determines `0` not to be ContentWidth', () => {
    expect(isContentWidth(0)).toBe(false)
  })

  test('whether `isContentWidth` determines `Infinity` not to be ContentWidth', () => {
    expect(isContentWidth(Infinity)).toBe(false)
  })

  test("whether `isContentWidth` determines `'375'` not to be ContentWidth", () => {
    expect(isContentWidth('375')).toBe(false)
  })

  test('whether `isContentInitialScale` determines `0` to be ContentInitialScale', () => {
    expect(isContentInitialScale(0)).toBe(true)
  })

  test('whether `isContentInitialScale` determines `10` to be ContentInitialScale', () => {
    expect(isContentInitialScale(10)).toBe(true)
  })

  test('whether `isContentInitialScale` determines `-1` not to be ContentInitialScale', () => {
    expect(isContentInitialScale(-1)).toBe(false)
  })

  test('whether `isContentInitialScale` determines `11` not to be ContentInitialScale', () => {
    expect(isContentInitialScale(11)).toBe(false)
  })

  test("whether `isContentInitialScale` determines `'1'` not to be ContentInitialScale", () => {
    expect(isContentInitialScale('1')).toBe(false)
  })

  test('whether `isContentMinWidth` determines `0` to be ContentMinWidth', () => {
    expect(isContentMinWidth(0)).toBe(true)
  })

  test('whether `isContentMinWidth` determines `Infinity` not to be ContentMinWidth', () => {
    expect(isContentMinWidth(Infinity)).toBe(false)
  })

  test("whether `isContentMinWidth` determines `'375'` not to be ContentMinWidth", () => {
    expect(isContentMinWidth('375')).toBe(false)
  })

  test('whether `isContentMaxWidth` determines `Infinity` to be ContentMaxWidth', () => {
    expect(isContentMaxWidth(Infinity)).toBe(true)
  })

  test('whether `isContentMaxWidth` determines `0` not to be ContentMaxWidth', () => {
    expect(isContentMaxWidth(0)).toBe(false)
  })

  test("whether `isContentMaxWidth` determines `'375'` not to be ContentMaxWidth", () => {
    expect(isContentMaxWidth('375')).toBe(false)
  })
})

describe('createContent', () => {
  describe('case where properties of argument have valid values as Content type', () => {
    it('should return object that inherits properties of argument have valid values as Content type', () => {
      expect(
        createContent({
          width: 'device-width',
          initialScale: 1,
          minWidth: 414,
          maxWidth: 768,
          interactiveWidget: 'resizes-content'
        })
      ).toStrictEqual({
        width: 'device-width',
        initialScale: 1,
        minWidth: 414,
        maxWidth: 768,
        interactiveWidget: 'resizes-content'
      })
    })
  })

  describe('case where properties of argument have invalid values as Content type', () => {
    it('should return object with default values of Content type instead of properties of argument have invalid values as Content type', () => {
      expect(
        createContent({
          width: 0,
          initialScale: -1,
          minWidth: Infinity,
          maxWidth: 0
        })
      ).toStrictEqual({
        width: defaultContent.width,
        initialScale: defaultContent.initialScale,
        minWidth: defaultContent.minWidth,
        maxWidth: defaultContent.maxWidth
      })
    })
  })

  describe('case where argument is missing properties as Content type', () => {
    it('should return object with default values for missing properties as Content type', () => {
      expect(createContent({})).toStrictEqual(defaultContent)
    })
  })

  describe('case where argument is undefined', () => {
    it('should return object with default values of Content type', () => {
      expect(createContent()).toStrictEqual(defaultContent)
    })
  })
})

describe('mergeOptionalPartialContent', () => {
  describe('case where only first argument is not undefined', () => {
    it('should return first argument', () => {
      expect(
        mergeOptionalPartialContent(
          {
            width: 'device-width',
            minWidth: 414,
            interactiveWidget: 'resizes-content'
          },
          undefined
        )
      ).toStrictEqual({
        width: 'device-width',
        minWidth: 414,
        interactiveWidget: 'resizes-content'
      })
    })
  })

  describe('case where only second argument is not undefined', () => {
    it('should return second argument', () => {
      expect(
        mergeOptionalPartialContent(undefined, {
          width: 'device-width',
          minWidth: 414,
          interactiveWidget: 'resizes-content'
        })
      ).toStrictEqual({
        width: 'device-width',
        minWidth: 414,
        interactiveWidget: 'resizes-content'
      })
    })
  })

  describe('case where first and second arguments are not undefined', () => {
    it('should return object that first and second arguments are merged', () => {
      expect(
        mergeOptionalPartialContent(
          {
            width: 'device-width',
            initialScale: 1
          },
          {
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
          }
        )
      ).toStrictEqual({
        width: 'device-width',
        initialScale: 1,
        minWidth: 414,
        maxWidth: 768,
        interactiveWidget: 'resizes-content'
      })
    })

    describe('case where first and second arguments have same properties', () => {
      it('should return object that values of second argument are used', () => {
        expect(
          mergeOptionalPartialContent(
            {
              width: 'device-width',
              initialScale: 1,
              interactiveWidget: 'resizes-content'
            },
            {
              width: 414,
              initialScale: 2,
              interactiveWidget: 'overlays-content'
            }
          )
        ).toStrictEqual({
          width: 414,
          initialScale: 2,
          interactiveWidget: 'overlays-content'
        })
      })
    })
  })

  describe('case where first and second arguments are undefined', () => {
    it('should return undefined', () => {
      expect(mergeOptionalPartialContent(undefined, undefined)).toBe(undefined)
    })
  })
})

describe('createPartialMediaSpecificParameters', () => {
  it('should return object with argument value as content property', () => {
    expect(
      createPartialMediaSpecificParameters({ minWidth: 414 })
    ).toStrictEqual({ content: { minWidth: 414 } })
  })
})

describe('createContentAttribute', () => {
  describe('case where second argument is greater than minWidth and less than maxWidth in first argument', () => {
    it('should return string where keys and values are connected with equals and properties are connected with commas for properties other than minWidth and maxWidth in first argument', () => {
      expect(
        createContentAttribute(
          {
            width: 'device-width',
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
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
            width: 'device-width',
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
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
            width: 'device-width',
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
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
            width: 'device-width',
            initialScale: 2,
            minWidth: 768,
            maxWidth: 414,
            interactiveWidget: 'resizes-content'
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
            width: 1024,
            initialScale: 2,
            minWidth: 414,
            maxWidth: 768,
            interactiveWidget: 'resizes-content'
          },
          1024
        )
      ).toBe('initial-scale=2,interactive-widget=resizes-content,width=1024')
    })
  })
})
