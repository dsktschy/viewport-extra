import { expect, test } from '@playwright/test'
import { getMaximumWidthViewportSize } from '../modules/PlaywrightFullProjectList.js'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
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
            ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
          </head>
          <body>
            ${usingDefaultExport ? `<script data-using-default-export></script>` : ''}
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
})
