import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      path.resolve(import.meta.dirname, 'src/**/*.{test,spec}.?(c|m)[jt]s')
    ],
    environmentMatchGlobs: [
      ['**/*.node.{test,spec}.?(c|m)[jt]s', 'node'],
      ['**/*.{test,spec}.?(c|m)[jt]s', 'jsdom']
    ],
    passWithNoTests: true
  }
})
