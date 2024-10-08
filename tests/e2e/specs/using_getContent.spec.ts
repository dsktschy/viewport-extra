import { expect, test } from '@playwright/test'
import { createTestBody } from '../modules/PlaywrightExpect.js'
import { convertToJsonString } from '../modules/SeriarizableRecord.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
})

const actualValueProvider: Parameters<
  typeof createTestBody
>[1]['actualValueProvider'] = async page =>
  await page.evaluate(
    ({ document }) =>
      document
        .querySelector('[data-get-content-result]')
        ?.getAttribute('data-get-content-result'),
    await page.evaluateHandle<Window>('window')
  )

const expectedValueProvider: Parameters<
  typeof createTestBody
>[1]['expectedValueProvider'] = (_, viewportExtraContent) =>
  convertToJsonString(viewportExtraContent)

;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }) => {
  const assetScriptHtml = `
    <script
      type="module"
      src="/assets/scripts/${format}/using_getContent.js"
    ></script>
  `
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    if (moduleFlag) {
      test.describe('using named export', () => {
        test(
          'correct content values are gotten',
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
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })

      test.describe('using default export', () => {
        test(
          'correct content values are gotten',
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
              parametersScript: () => `
                <script
                  data-using-default-export
                ></script>
              `,
              assetScript: assetScriptHtml
            },
            actualValueProvider,
            expectedValueProvider
          })
        )
      })
    } else {
      const libraryScriptHtml = `
        <script
          src="/${format}/viewport-extra${minified ? '.min' : ''}.js"
        ></script>
      `
      test.describe('using global variable', () => {
        test(
          'correct content values are gotten',
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
    }
  })
})
