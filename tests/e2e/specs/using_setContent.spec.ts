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
      src="/assets/scripts/${format}/using_setContent.js"
    ></script>
  `
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    if (moduleFlag) {
      test.describe('using named export', () => {
        test.describe('setting no min-width and max-width', () => {
          test(
            'viewport content is not updated',
            createTestBody(expect, {
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: {},
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: { minWidth: { name: 'sm' } },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                parametersScript: ({ minWidth }) => `
                  <script
                    data-min-width="${minWidth}"
                  ></script>
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: { maxWidth: { name: 'lg' } },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                parametersScript: ({ maxWidth }) => `
                  <script
                    data-max-width="${maxWidth}"
                  ></script>
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: {
                minWidth: { name: 'sm' },
                maxWidth: { name: 'lg' }
              },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                parametersScript: ({ minWidth, maxWidth }) => `
                  <script
                    data-min-width="${minWidth}"
                    data-max-width="${maxWidth}"
                  ></script>
                `,
                assetScript: assetScriptHtml
              },
              actualValueProvider,
              expectedValueProvider
            })
          )
        })
      })

      test.describe('using default export', () => {
        test.describe('setting no min-width and max-width', () => {
          test(
            'viewport content is not updated',
            createTestBody(expect, {
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: {},
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
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

        test.describe('setting only min-width', () => {
          test(
            'viewport content is updated to correct values',
            createTestBody(expect, {
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: { minWidth: { name: 'sm' } },
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
                    data-min-width="${minWidth}"
                  ></script>
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: { maxWidth: { name: 'lg' } },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                parametersScript: ({ maxWidth }) => `
                  <script
                    data-using-default-export
                    data-max-width="${maxWidth}"
                  ></script>
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: {
                minWidth: { name: 'sm' },
                maxWidth: { name: 'lg' }
              },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                parametersScript: ({ minWidth, maxWidth }) => `
                  <script
                    data-using-default-export
                    data-min-width="${minWidth}"
                    data-max-width="${maxWidth}"
                  ></script>
                `,
                assetScript: assetScriptHtml
              },
              actualValueProvider,
              expectedValueProvider
            })
          )
        })
      })
    } else {
      const libraryScriptHtml = `
        <script
          src="/${format}/viewport-extra${minified ? '.min' : ''}.js"
        ></script>
      `
      test.describe('using global variable', () => {
        test.describe('setting no min-width and max-width', () => {
          test(
            'viewport content is not updated',
            createTestBody(expect, {
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: { minWidth: { name: 'sm' } },
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
                    data-min-width="${minWidth}"
                  ></script>
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: { maxWidth: { name: 'lg' } },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                libraryScript: libraryScriptHtml,
                parametersScript: ({ maxWidth }) => `
                  <script
                    data-max-width="${maxWidth}"
                  ></script>
                `,
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
              initialViewportContent: {
                width: 'device-width',
                initialScale: 1
              },
              thresholdProjects: {
                minWidth: { name: 'sm' },
                maxWidth: { name: 'lg' }
              },
              html: {
                meta: ({ width, initialScale }) => `
                  <meta
                    name="viewport"
                    content="width=${width},initial-scale=${initialScale}"
                  />
                `,
                libraryScript: libraryScriptHtml,
                parametersScript: ({ minWidth, maxWidth }) => `
                  <script
                    data-min-width="${minWidth}"
                    data-max-width="${maxWidth}"
                  ></script>
                `,
                assetScript: assetScriptHtml
              },
              actualValueProvider,
              expectedValueProvider
            })
          )
        })
      })
    }
  })
})
