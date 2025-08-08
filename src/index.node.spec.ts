import { describe, expect, it } from 'vitest'

describe('side effects', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      await expect(import('./index.js')).resolves.not.toThrowError()
    })
  })
})

describe('setParameters', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { setParameters } = await import('./index.js')
      expect(() => {
        setParameters([{ content: { minWidth: 412 } }])
      }).not.toThrowError()
    })
  })
})

describe('setContent', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { setContent } = await import('./index.js')
      expect(() => {
        setContent({ minWidth: 412 })
      }).not.toThrowError()
    })
  })
})

describe('getContent', () => {
  describe('running in environments where no window object exists', () => {
    it('returns default Content object', async () => {
      const { getContent } = await import('./index.js')
      expect(getContent()).toStrictEqual({
        width: 'device-width',
        initialScale: 1,
        minWidth: 0,
        maxWidth: Infinity
      })
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
        new ViewportExtra(412)
      }).not.toThrowError()
    })
  })
})

describe('setParameters method of ViewportExtra class', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { default: ViewportExtra } = await import('./index.js')
      expect(() => {
        ViewportExtra.setParameters([{ content: { minWidth: 412 } }])
      }).not.toThrowError()
    })
  })
})

describe('setContent method of ViewportExtra class', () => {
  describe('running in environments where no window object exists', () => {
    it('does not throw error', async () => {
      const { default: ViewportExtra } = await import('./index.js')
      expect(() => {
        ViewportExtra.setContent({ minWidth: 412 })
      }).not.toThrowError()
    })
  })
})

describe('getContent method of ViewportExtra class', () => {
  describe('running in environments where no window object exists', () => {
    it('returns default Content object', async () => {
      const { default: ViewportExtra } = await import('./index.js')
      expect(ViewportExtra.getContent()).toStrictEqual({
        width: 'device-width',
        initialScale: 1,
        minWidth: 0,
        maxWidth: Infinity
      })
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
