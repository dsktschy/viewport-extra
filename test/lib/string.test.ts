import { camelize, kebabize } from '../../src/lib/string'

describe('about src/lib/string.ts', () => {
  test("whether `camelize` returns correct string with following string. `'foo-bar foo   -bar'`", () => {
    expect(camelize('foo-bar foo   -bar')).toBe('fooBarfooBar')
  })

  test("whether `kebabize` returns correct string with following string. `'fooBar foo   Bar'`", () => {
    expect(kebabize('fooBar foo   Bar')).toBe('foo-barfoo-bar')
  })
})
