import { describe, expect, it } from 'vitest'

describe('side effects', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      await expect(import('./index.js')).resolves.not.toThrowError()
    })
  })
})

describe('setContent', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { setContent } = await import('./index.js')
      expect(() => {
        setContent({ minWidth: 414 })
      }).not.toThrowError()
    })
  })
})

describe('updateReference', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { updateReference } = await import('./index.js')
      expect(() => {
        updateReference()
      }).not.toThrowError()
    })
  })
})

describe('constructor of ViewportExtra class', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { default: ViewportExtra } = await import('./index.js')
      expect(() => {
        new ViewportExtra(414)
      }).not.toThrowError()
    })
  })
})

describe('setContent method of ViewportExtra class', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { default: ViewportExtra } = await import('./index.js')
      expect(() => {
        ViewportExtra.setContent({ minWidth: 414 })
      }).not.toThrowError()
    })
  })
})

describe('updateReference method of ViewportExtra class', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { default: ViewportExtra } = await import('./index.js')
      expect(() => {
        ViewportExtra.updateReference()
      }).not.toThrowError()
    })
  })
})
