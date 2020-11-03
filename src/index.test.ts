import ViewportExtra from './index'

describe('about src/index.ts', () => {
  test('exported class contains version property', () => {
    expect(typeof ViewportExtra.version === 'string').toBe(true)
  })
})
