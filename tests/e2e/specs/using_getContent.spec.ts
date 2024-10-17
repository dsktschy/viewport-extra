import { expect, test } from '@playwright/test'
import { convertToJsonString } from '../modules/NumberStringRecord.js'
import { getGetContentResultString } from '../modules/PlaywrightPage.js'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
})
;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }) => {
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    if (moduleFlag) {
      test.describe('using named export', () => {
        test('correct content values are gotten', async ({ page }, {
          config: { projects }
        }) => {
          const width = 'device-width'
          const initialScale = 0.5
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
              </head>
              <body>
                <script data-get-content-result></script>
                <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getGetContentResultString(page)).toBe(
            convertToJsonString({
              width,
              initialScale,
              minWidth,
              maxWidth
            })
          )
        })
      })

      test.describe('using default export', () => {
        test('correct content values are gotten', async ({ page }, {
          config: { projects }
        }) => {
          const width = 'device-width'
          const initialScale = 0.5
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
              </head>
              <body>
                <script data-using-default-export data-get-content-result></script>
                <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getGetContentResultString(page)).toBe(
            convertToJsonString({
              width,
              initialScale,
              minWidth,
              maxWidth
            })
          )
        })
      })
    } else {
      test.describe('using global variable', () => {
        test('correct content values are gotten', async ({ page }, {
          config: { projects }
        }) => {
          const width = 'device-width'
          const initialScale = 0.5
          const minWidth =
            getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
          const maxWidth =
            getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=${width},initial-scale=${initialScale}" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
                <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
              </head>
              <body>
                <script data-get-content-result></script>
                <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getGetContentResultString(page)).toBe(
            convertToJsonString({
              width,
              initialScale,
              minWidth,
              maxWidth
            })
          )
        })
      })
    }
  })
})
