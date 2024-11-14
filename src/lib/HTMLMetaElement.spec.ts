import { describe, it, test, expect, vi } from 'vitest'
import {
  createPartialContent,
  createPartialMediaSpecificParameters,
  applyContent,
  applyMediaSpecificParameters
} from './HTMLMetaElement.js'

describe('createPartialMediaSpecificParameters', () => {
  describe('case where argument element has content attribute', () => {
    it('should return object that has content property matching all key-value pairs content attribute has', () => {
      const width = 'device-width'
      const initialScale = 1
      const minWidth = 414
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        `width=${width},initial-scale=${initialScale},min-width=${minWidth}`
      )
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: { width, initialScale, minWidth }
      })
    })
  })

  describe('case where argument element has content and data-extra-content attribute', () => {
    it('should return object that has content property matching all key-value pairs content and data-extra-content attributes have', () => {
      const width = 'device-width'
      const initialScale = 1
      const minWidth = 414
      const htmlMetaElement = document.createElement('meta')
      htmlMetaElement.setAttribute(
        'content',
        `width=${width},initial-scale=${initialScale}`
      )
      htmlMetaElement.setAttribute(
        'data-extra-content',
        `min-width=${minWidth}`
      )
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: { width, initialScale, minWidth }
      })
    })
  })

  describe('case where argument element does not have content and data-extra-content attribute', () => {
    it('should return object that has content property that is empty object', () => {
      const htmlMetaElement = document.createElement('meta')
      expect(
        createPartialMediaSpecificParameters(htmlMetaElement)
      ).toStrictEqual({
        content: {}
      })
    })
  })
})

describe('applyMediaSpecificParameters', () => {
  it('updates content attribute of argument viewport meta element with value computed from content property of argument MediaSpecificParameters and argument width of viewport', () => {
    const htmlMetaElement = document.createElement('meta')
    const minWidth = 414
    const documentClientWidth = 320
    applyMediaSpecificParameters(
      htmlMetaElement,
      {
        content: {
          width: 'device-width',
          initialScale: 1,
          minWidth: minWidth,
          maxWidth: Infinity
        }
      },
      documentClientWidth
    )
    expect(htmlMetaElement.getAttribute('content')).toBe(
      `initial-scale=${documentClientWidth / minWidth},width=${minWidth}`
    )
  })
})

describe('about src/lib/HTMLMetaElement.ts', () => {
  test("whether `createPartialContent` returns correct Partial<Content> with HTMLMetaElement has following attributes. content: `''`, data-extra-content: `''`", () => {
    const htmlMetaElement = document.createElement('meta')
    expect(createPartialContent(htmlMetaElement)).toStrictEqual({})
  })

  test("whether `createPartialContent` returns correct Partial<Content> with HTMLMetaElement has following attributes. content: `'width=device-width,initial-scale=1, foo = bar ,=foo,bar=,===,'`, data-extra-content: `'min-width=375,max-width=414'`", () => {
    const htmlMetaElement = document.createElement('meta')
    htmlMetaElement.setAttribute(
      'content',
      'width=device-width,initial-scale=1, foo = bar ,=foo,bar=,===,'
    )
    expect(createPartialContent(htmlMetaElement)).toStrictEqual({
      width: 'device-width',
      initialScale: 1,
      foo: 'bar'
    })
  })

  test("whether `createPartialContent` returns correct Partial<Content> with HTMLMetaElement has following attributes. content: `'width=device-width,initial-scale=1,min-width=375,max-width=414'`, data-extra-content: `'width=375,initial-scale=2,min-width=0,max-width=Infinity'`", () => {
    const htmlMetaElement = document.createElement('meta')
    htmlMetaElement.setAttribute(
      'content',
      'width=device-width,initial-scale=1,min-width=375,max-width=414'
    )
    htmlMetaElement.setAttribute(
      'data-extra-content',
      'width=375,min-width=Infinity,max-width=0'
    )
    // Before passing through type guard functions, Partial<Content> may have invalid number
    expect(createPartialContent(htmlMetaElement)).toStrictEqual({
      width: 375,
      initialScale: 1,
      minWidth: Infinity,
      maxWidth: 0
    })
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 414, maxWidth: 375 }`, documentClientWidth: `320`", () => {
    // Don't show warnings on console
    vi.spyOn(console, 'warn').mockImplementation(vi.fn())
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    // minWidth and maxWidth will be ignored
    const minWidth = 414
    const maxWidth = 375
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 320
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test('whether `applyContent` sets correct content attribute with following params. content: `{ width: 390, initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `320`', () => {
    // Don't show warnings on console
    vi.spyOn(console, 'warn').mockImplementation(vi.fn())
    const htmlMetaElement = document.createElement('meta')
    const width = 390
    const initialScale = 1
    // minWidth and maxWidth will be ignored
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 320
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `374`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 374
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / minWidth) * initialScale
    },width=${minWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `375`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 375
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `414`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 414
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `415`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 415
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / maxWidth) * initialScale
    },width=${maxWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 390, maxWidth: 390 }`, documentClientWidth: `389`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 390
    const maxWidth = 390
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 389
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / minWidth) * initialScale
    },width=${minWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 390, maxWidth: 390 }`, documentClientWidth: `390`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 390
    const maxWidth = 390
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 390
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 1, minWidth: 390, maxWidth: 390 }`, documentClientWidth: `391`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 1
    const minWidth = 390
    const maxWidth = 390
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 391
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / maxWidth) * initialScale
    },width=${maxWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `374`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 374
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / minWidth) * initialScale
    },width=${minWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `375`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 375
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `414`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 414
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 375, maxWidth: 414 }`, documentClientWidth: `415`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 375
    const maxWidth = 414
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 415
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / maxWidth) * initialScale
    },width=${maxWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 390, maxWidth: 390 }`, documentClientWidth: `389`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 390
    const maxWidth = 390
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 389
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / minWidth) * initialScale
    },width=${minWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 390, maxWidth: 390 }`, documentClientWidth: `390`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 390
    const maxWidth = 390
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 390
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${initialScale},width=${width}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })

  test("whether `applyContent` sets correct content attribute with following params. content: `{ width: 'device-width', initialScale: 2, minWidth: 390, maxWidth: 390 }`, documentClientWidth: `391`", () => {
    const htmlMetaElement = document.createElement('meta')
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const width = 'device-width' as const
    const initialScale = 2
    const minWidth = 390
    const maxWidth = 390
    const content = { width, initialScale, minWidth, maxWidth }
    const documentClientWidth = 391
    applyContent(htmlMetaElement, content, documentClientWidth)
    const expectedString = `initial-scale=${
      (documentClientWidth / maxWidth) * initialScale
    },width=${maxWidth}`
    expect(htmlMetaElement.getAttribute('content')).toBe(expectedString)
  })
})
