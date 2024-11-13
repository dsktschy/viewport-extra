import { describe, it, expect } from 'vitest'

describe('side effects', () => {
  describe('updating content attribute of viewport meta element', () => {
    describe('checking if environment is runnable', () => {
      describe('case where window object does not exist', () => {
        it('does not throw error', async () => {
          await expect(import('./index.js')).resolves.not.toThrowError()
        })
      })
    })
  })
})

describe('setContent', () => {
  describe('updating content attribute of viewport meta element', () => {
    describe('checking if environment is runnable', () => {
      describe('case where window object does not exist', () => {
        it('does not throw error', async () => {
          await expect(import('./index.js')).resolves.not.toThrowError()
        })
      })
    })
  })
})

describe('updateReference', () => {
  describe('updating reference to viewport meta element', () => {
    describe('checking if environment is runnable', () => {
      describe('case where window object does not exist', () => {
        it('does not throw error', async () => {
          await expect(import('./index.js')).resolves.not.toThrowError()
        })
      })
    })
  })
})

describe('constructor of ViewportExtra class', () => {
  describe('updating content attribute of viewport meta element', () => {
    describe('checking if environment is runnable', () => {
      describe('case where window object does not exist', () => {
        it('does not throw error', async () => {
          await expect(import('./index.js')).resolves.not.toThrowError()
        })
      })
    })
  })
})

describe('setContent method of ViewportExtra class', () => {
  describe('updating content attribute of viewport meta element', () => {
    describe('checking if environment is runnable', () => {
      describe('case where window object does not exist', () => {
        it('does not throw error', async () => {
          await expect(import('./index.js')).resolves.not.toThrowError()
        })
      })
    })
  })
})

describe('updateReference method of ViewportExtra class', () => {
  describe('updating reference to viewport meta element', () => {
    describe('checking if environment is runnable', () => {
      describe('case where window object does not exist', () => {
        it('does not throw error', async () => {
          await expect(import('./index.js')).resolves.not.toThrowError()
        })
      })
    })
  })
})
