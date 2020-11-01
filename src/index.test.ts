import ViewportExtra from './index'

test('exported object contains version property', () => {
  expect(typeof ViewportExtra.version === 'string').toBe(true)
})
