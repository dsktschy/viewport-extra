import { expect, test } from '@playwright/test'
import { getGetContentResultString } from '../modules/PlaywrightPage.js'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'
;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }) => {
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
    })

    if (moduleFlag) {
      test.describe('using named export', () => {
        test('current content object is gotten', async ({ page }, {
          config: { projects }
        }) => {
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
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
              </head>
              <body>
                <script data-get-content-result></script>
                <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getGetContentResultString(page)).toBe(
            `{"initialScale":1,"maxWidth":${maxWidth},"minWidth":${minWidth},"width":"device-width"}`
          )
        })
      })

      test.describe('using default export', () => {
        test('current content object is gotten', async ({ page }, {
          config: { projects }
        }) => {
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
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
              </head>
              <body>
                <script data-using-default-export data-get-content-result></script>
                <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getGetContentResultString(page)).toBe(
            `{"initialScale":1,"maxWidth":${maxWidth},"minWidth":${minWidth},"width":"device-width"}`
          )
        })
      })
    } else {
      test.describe('using global variable', () => {
        test('current content object is gotten', async ({ page }, {
          config: { projects }
        }) => {
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
                <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
                <script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>
              </head>
              <body>
                <script data-get-content-result></script>
                <script src="/assets/scripts/${format}/using_getContent.js" type="module"></script>
              </body>
            </html>
          `)
          expect(await getGetContentResultString(page)).toBe(
            `{"initialScale":1,"maxWidth":${maxWidth},"minWidth":${minWidth},"width":"device-width"}`
          )
        })
      })
    }
  })
})
