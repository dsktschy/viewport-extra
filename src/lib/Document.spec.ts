import { describe, expect, it } from 'vitest'
import {
  ensureViewportElement,
  getDocumentClientWidth,
  getViewportExtraElementList
} from './Document.js'

describe('ensureViewportElement', () => {
  describe('case where viewport meta element exists', () => {
    it('should return existing viewport meta element', () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=414,initial-scale=2" />
      `
      expect(ensureViewportElement(document)).toBe(
        document.querySelector('meta[name="viewport"]')
      )
    })
  })

  describe('case where viewport meta element does not exist', () => {
    it('should append viewport meta element to HTML and returns appended viewport meta element', () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
      `
      const returnedViewportElement = ensureViewportElement(document)
      const selectedViewportElement = document.querySelector(
        'meta[name="viewport"]'
      )
      expect(selectedViewportElement).not.toBe(null)
      expect(returnedViewportElement).toBe(selectedViewportElement)
    })
  })
})

describe('getViewportExtraElementList', () => {
  describe('case where viewport meta elements exist', () => {
    it('should return existing viewport-extra meta elements without viewport meta element', () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="viewport-extra" content="min-width=414" />
        <meta name="viewport-extra" content="max-width=768" />
      `
      const selectedViewportElementList = document.querySelectorAll(
        'meta[name="viewport-extra"]'
      )
      getViewportExtraElementList(document).forEach(
        (returnedViewportExtraElement, index) => {
          expect(returnedViewportExtraElement).toBe(
            selectedViewportElementList[index]
          )
        }
      )
    })
  })

  describe('case where viewport meta elements do not exist', () => {
    it('should return empty array', () => {
      document.head.innerHTML = `
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      `
      expect(getViewportExtraElementList(document).length).toBe(0)
    })
  })
})

describe('getDocumentClientWidth', () => {
  it('should return document.documentElement.clientWidth', () => {
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 414,
      configurable: true
    })
    expect(getDocumentClientWidth(document)).toBe(414)
  })
})
