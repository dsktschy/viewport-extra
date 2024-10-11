import { expect, test } from '@playwright/test'
import { createTestBody } from '../modules/PlaywrightExpect.js'
import { convertToViewportContentString } from '../modules/StringRecord.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
})

const actualValueProvider: Parameters<
  typeof createTestBody
>[1]['actualValueProvider'] = async page =>
  await page.evaluate(
    ({ document }) =>
      document.querySelector('meta[name="viewport"]')?.getAttribute('content'),
    await page.evaluateHandle<Window>('window')
  )

const expectedValueProvider: Parameters<
  typeof createTestBody
>[1]['expectedValueProvider'] = (viewport, { minWidth, maxWidth }) =>
  viewport.width < minWidth
    ? convertToViewportContentString({
        width: `${minWidth}`,
        'initial-scale': `${viewport.width / minWidth}`
      })
    : viewport.width > maxWidth
      ? convertToViewportContentString({
          width: `${maxWidth}`,
          'initial-scale': `${viewport.width / maxWidth}`
        })
      : convertToViewportContentString({
          width: 'device-width',
          'initial-scale': '1'
        })

;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }) => {
  const libraryScriptHtml = moduleFlag
    ? ''
    : `
        <script
          src="/${format}/viewport-extra${minified ? '.min' : ''}.js"
          async
        ></script>
      `
  const assetScriptHtml = moduleFlag
    ? `
        <script
          type="module"
          src="/assets/scripts/${format}/first_run.js"
        ></script>
      `
    : ''
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    test.describe('putting no viewport and viewport-extra meta elements', () => {
      test(
        'viewport meta element is created',
        createTestBody(expect, {
          initialViewportContent: { width: 'device-width', initialScale: 1 },
          thresholdProjects: {},
          html: {
            meta: () => '',
            libraryScript: libraryScriptHtml,
            assetScript: assetScriptHtml
          },
          actualValueProvider,
          expectedValueProvider
        })
      )
    })

    test.describe('putting only viewport meta element', () => {
      test.describe('setting no min-width and max-width', () => {
        test(
          'viewport content is not updated',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: {},
            html: {
              meta: ({ width, initialScale }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting only min-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { minWidth: { name: 'sm' } },
            html: {
              meta: ({ width, initialScale, minWidth }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                  data-extra-content="min-width=${minWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting only max-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { maxWidth: { name: 'lg' } },
            html: {
              meta: ({ width, initialScale, maxWidth }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                  data-extra-content="max-width=${maxWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting min-width and max-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: {
              minWidth: { name: 'sm' },
              maxWidth: { name: 'lg' }
            },
            html: {
              meta: ({ width, initialScale, minWidth, maxWidth }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                  data-extra-content="min-width=${minWidth},max-width=${maxWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })
    })

    test.describe('putting only viewport-extra meta element', () => {
      test.describe('setting no min-width and max-width', () => {
        test(
          'viewport content is not updated',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: {},
            html: {
              meta: ({ width, initialScale }) => `
                <meta
                  name="viewport-extra"
                  content="width=${width},initial-scale=${initialScale}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting only min-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { minWidth: { name: 'sm' } },
            html: {
              meta: ({ width, initialScale, minWidth }) => `
                <meta
                  name="viewport-extra"
                  content="width=${width},initial-scale=${initialScale},min-width=${minWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting only max-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { maxWidth: { name: 'lg' } },
            html: {
              meta: ({ width, initialScale, maxWidth }) => `
                <meta
                  name="viewport-extra"
                  content="width=${width},initial-scale=${initialScale},max-width=${maxWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting min-width and max-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: {
              minWidth: { name: 'sm' },
              maxWidth: { name: 'lg' }
            },
            html: {
              meta: ({ width, initialScale, minWidth, maxWidth }) => `
                <meta
                  name="viewport-extra"
                  content="width=${width},initial-scale=${initialScale},min-width=${minWidth},max-width=${maxWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })
    })

    test.describe('putting viewport and viewport-extra meta elements', () => {
      test.describe('setting only min-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { minWidth: { name: 'sm' } },
            html: {
              meta: ({ width, initialScale, minWidth }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
                <meta
                  name="viewport-extra"
                  content="min-width=${minWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting only max-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { maxWidth: { name: 'lg' } },
            html: {
              meta: ({ width, initialScale, maxWidth }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
                <meta
                  name="viewport-extra"
                  content="max-width=${maxWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('setting min-width and max-width', () => {
        test(
          'viewport content is updated to correct values',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: {
              minWidth: { name: 'sm' },
              maxWidth: { name: 'lg' }
            },
            html: {
              meta: ({ width, initialScale, minWidth, maxWidth }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
                <meta
                  name="viewport-extra"
                  content="min-width=${minWidth},max-width=${maxWidth}"
                />
              `,
              libraryScript: libraryScriptHtml,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })
    })
  })
})
