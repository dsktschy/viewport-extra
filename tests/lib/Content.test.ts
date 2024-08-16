import { describe, test, expect, vi } from 'vitest'
import {
  isContentWidth,
  isContentInitialScale,
  isContentMinWidth,
  isContentMaxWidth,
  defaultProps,
  create
} from '../../src/lib/Content'

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

  test('whether `create` returns correct Content with following params. `{}`', () => {
    const partialContent = {}
    expect(create(partialContent)).toStrictEqual(defaultProps)
  })

  test('whether `create` returns correct Content with following params. `{ width: 390, initialScale: 2, minWidth: 375, maxWidth: 414 }`', () => {
    const partialContent = {
      width: 390,
      initialScale: 2,
      minWidth: 375,
      maxWidth: 414
    }
    expect(create(partialContent)).toStrictEqual(partialContent)
  })

  test("whether `create` returns correct Content with following params. `{ width: '390', initialScale: '2', minWidth: Infinity, maxWidth: 0 }`", () => {
    // Don't show warnings on console
    vi.spyOn(console, 'warn').mockImplementation(vi.fn())
    const partialContent = {
      width: 0,
      initialScale: -1,
      minWidth: Infinity,
      maxWidth: 0
    }
    expect(create(partialContent)).toStrictEqual(defaultProps)
  })
})
