import { expect, test } from '@playwright/test'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'
import { getGetContentResultString } from '../modules/PlaywrightPage.js'
;[
  {
    format: 'es',
    moduleFlag: true,
    minified: false,
    usingDefaultExport: false
  },
  { format: 'es', moduleFlag: true, minified: false, usingDefaultExport: true },
  {
    format: 'cjs',
    moduleFlag: true,
    minified: false,
    usingDefaultExport: false
  },
  {
    format: 'cjs',
    moduleFlag: true,
    minified: false,
    usingDefaultExport: true
  },
  {
    format: 'iife',
    moduleFlag: false,
    minified: false,
    usingDefaultExport: false
  },
  {
    format: 'iife',
    moduleFlag: false,
    minified: true,
    usingDefaultExport: false
  }
].forEach(({ format, moduleFlag, minified, usingDefaultExport }) => {
  test.describe(`using ${usingDefaultExport ? 'default export of' : ''} ${(minified ? 'minified ' : '') + format} output`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
    })

    test('current content object is gotten', async ({ page }, {
      config: { projects }
    }) => {
      const minWidth = getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
      const maxWidth =
        getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
      await page.setContent(`
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Document</title>
            <meta name="viewport" content="width=device-width,initial-scale=1" data-extra-content="min-width=${minWidth},max-width=${maxWidth}" />
            ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
          </head>
          <body>
            ${usingDefaultExport ? `<script data-using-default-export></script>` : ''}
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
})
