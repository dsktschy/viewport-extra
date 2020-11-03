import ViewportExtra, { version } from './index'

describe('about src/index.ts', () => {
  test('whether to export version property', () => {
    expect(typeof version === 'string').toBe(true)
  })

  test('whether to export class containing version property', () => {
    expect(typeof ViewportExtra.version === 'string').toBe(true)
  })
})
