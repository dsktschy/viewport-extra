import { describe, it, expect } from 'vitest'
import { camelizeKebabCaseString, kebabizeCamelCaseString } from './string.js'

describe('camelizeKebabCaseString', () => {
  it('should camelize kebab case', () => {
    expect(camelizeKebabCaseString('foo-bar-foo')).toBe('fooBarFoo')
  })

  it('should ignore whitespaces', () => {
    expect(camelizeKebabCaseString('foo bar   -   foo')).toBe('foobarFoo')
  })
})

describe('kebabizeCamelCaseString', () => {
  it('should kebabize camel case', () => {
    expect(kebabizeCamelCaseString('fooBarFoo')).toBe('foo-bar-foo')
  })

  it('should ignore whitespaces', () => {
    expect(kebabizeCamelCaseString('foo bar   Foo')).toBe('foobar-foo')
  })
})
