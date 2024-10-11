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
  const assetScriptHtml = `
    <script
      type="module"
      src="/assets/scripts/${format}/using_updateReference.js"
    ></script>
  `
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    if (moduleFlag) {
      test.describe('using named export', () => {
        test(
          'reference to viewport meta element is updated',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { minWidth: { name: 'xl', offset: 1 } },
            html: {
              meta: ({ width, initialScale }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
              `,
              parametersScript: ({ minWidth }) => `
                <script
                  data-min-width-after-update-reference="${minWidth}"
                ></script>
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
          'reference to viewport meta element is updated',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { minWidth: { name: 'xl', offset: 1 } },
            html: {
              meta: ({ width, initialScale }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
              `,
              parametersScript: ({ minWidth }) => `
                <script
                  data-using-default-export
                  data-min-width-after-update-reference="${minWidth}"
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
          'reference to viewport meta element is updated',
          createTestBody(expect, {
            initialViewportContent: { width: 'device-width', initialScale: 1 },
            thresholdProjects: { minWidth: { name: 'xl', offset: 1 } },
            html: {
              meta: ({ width, initialScale }) => `
                <meta
                  name="viewport"
                  content="width=${width},initial-scale=${initialScale}"
                />
              `,
              libraryScript: libraryScriptHtml,
              parametersScript: ({ minWidth }) => `
                <script
                  data-min-width-after-update-reference="${minWidth}"
                ></script>
              `,
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
