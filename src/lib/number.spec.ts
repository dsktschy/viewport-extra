import { describe, expect, it } from 'vitest'
import { createPartialContent } from './number.js'

describe('createPartialContent', () => {
  it('should return object whose min-width property is argument value', () => {
    expect(createPartialContent(414)).toStrictEqual({ minWidth: 414 })
  })
})
