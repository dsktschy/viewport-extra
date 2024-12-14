import { expect, test } from '@playwright/test'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
import { getMaximumWidthViewportSize } from '../modules/PlaywrightFullProjectList.js'

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
        test('reference to viewport meta element is updated', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const maximumWidthViewportSize = getMaximumWidthViewportSize(projects)
          const minWidth = maximumWidthViewportSize.width
            ? maximumWidthViewportSize.width + 1
            : 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-min-width-after-update-reference="${minWidth}"></script>
                <script src="/assets/scripts/${format}/using_updateReference.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && minWidth > 0
              ? documentClientWidth < minWidth
                ? `initial-scale=${(documentClientWidth / minWidth) * 1},width=${minWidth}`
                : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })

      test.describe('using default export', () => {
        test('reference to viewport meta element is updated', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const maximumWidthViewportSize = getMaximumWidthViewportSize(projects)
          const minWidth = maximumWidthViewportSize.width
            ? maximumWidthViewportSize.width + 1
            : 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
              </head>
              <body>
                <script data-using-default-export data-min-width-after-update-reference="${minWidth}"></script>
                <script src="/assets/scripts/${format}/using_updateReference.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && minWidth > 0
              ? documentClientWidth < minWidth
                ? `initial-scale=${(documentClientWidth / minWidth) * 1},width=${minWidth}`
                : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })
    } else {
      test.describe('using global variable', () => {
        test('reference to viewport meta element is updated', async ({
          page,
          viewport
        }, { config: { projects } }) => {
          const maximumWidthViewportSize = getMaximumWidthViewportSize(projects)
          const minWidth = maximumWidthViewportSize.width
            ? maximumWidthViewportSize.width + 1
            : 0
          const documentClientWidth = viewport ? viewport.width : undefined
          await page.setContent(`
            <!doctype html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Document</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
              </head>
              <body>
                <script data-min-width-after-update-reference="${minWidth}"></script>
                <script src="/assets/scripts/${format}/using_updateReference.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getViewportContentString(page)).toBe(
            documentClientWidth && minWidth > 0
              ? documentClientWidth < minWidth
                ? `initial-scale=${(documentClientWidth / minWidth) * 1},width=${minWidth}`
                : 'initial-scale=1,width=device-width'
              : ''
          )
        })
      })
    }
  })
})
