import { expect, test } from '@playwright/test'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'
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
].forEach(
  ({ format, moduleFlag, minified, usingDefaultExport }, formatIndex) => {
    test.describe(`using ${usingDefaultExport ? 'default export of' : ''} ${(minified ? 'minified ' : '') + format} output`, () => {
      test.describe('updating content attribute of viewport meta element', () => {
        test.beforeEach(async ({ page }) => {
          await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
        })

        test.describe('case where minWidth property is set in argument', () => {
          test('width is updated to minimum width and initial-scale is updated to value that fits minimum width into viewport, on browser whose viewport width is less than minimum width', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const minWidth =
              getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
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
                  <script data-content='{ "minWidth": ${minWidth} }'></script>
                  <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
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

        test.describe('case where maxWidth property is set in argument', () => {
          test('width is updated to maximum width and initial-scale is updated to value that fits maximum width into viewport, on browser whose viewport width is greater than maximum width', async ({
            page,
            viewport
          }, { config: { projects } }) => {
            const maxWidth =
              getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
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
                  <script data-content='{ "maxWidth": ${maxWidth} }'></script>
                  <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                </body>
              </html>
            `)
            expect(await getViewportContentString(page)).toBe(
              documentClientWidth && maxWidth < Infinity
                ? documentClientWidth > maxWidth
                  ? `initial-scale=${(documentClientWidth / maxWidth) * 1},width=${maxWidth}`
                  : 'initial-scale=1,width=device-width'
                : ''
            )
          })
        })
      })

      // Following cases cannot be tested with vitest
      // Because vitest does not update size of document element when viewport element is updated
      // Run only in minimal formats and viewports because they replace unit tests of src/index.spec.ts
      test.describe('comparison with minWidth and maxWidth, and computation of output initial-scale', () => {
        test.beforeEach(async ({ page }, testInfo) => {
          testInfo.skip(formatIndex !== 0)
          testInfo.skip(!['xs', 'xl'].includes(testInfo.project.name))
          await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
        })

        test.describe('case where unscaledComputing property in globalParameters object is false', () => {
          // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
          test.describe('case where initial scale before running setContent is 1 or less', () => {
            test('width of viewport is used for comparison, and initialScale property merged from current mediaSpecificParametersList variable and argument is applied to output initial-scale', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) /
                0.5
              const maxWidth =
                (getViewportSize(projects, 'lg')?.use.viewport?.width ??
                  Infinity) / 0.5
              const documentClientWidth = viewport
                ? viewport.width / 0.5
                : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" />
                    ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                  </head>
                  <body>
                    ${usingDefaultExport ? `<script data-using-default-export></script>` : ''}
                    <script data-content='{ "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} }'></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : documentClientWidth > maxWidth
                      ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                      : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })

          // When initial scale is greater than 1, document.documentElement.clientWidth is not equal to viewport width
          test.describe('case where initial scale before running setContent is greater than 1', () => {
            test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property merged from current mediaSpecificParametersList variable and argument is applied to output initial-scale', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=2" />
                    ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                  </head>
                  <body>
                    ${usingDefaultExport ? `<script data-using-default-export></script>` : ''}
                    <script data-content='{ "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} }'></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                    : documentClientWidth > maxWidth
                      ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                      : 'initial-scale=0.5,width=device-width'
                  : ''
              )
            })
          })
        })

        test.describe('case where unscaledComputing property in globalParameters object is true', () => {
          test.describe('case where initial scale before running setContent is 1 or less', () => {
            test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property merged from current mediaSpecificParametersList variable and argument is applied to output initial-scale', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=0.5" data-extra-unscaled-computing />
                    ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                  </head>
                  <body>
                    ${usingDefaultExport ? `<script data-using-default-export></script>` : ''}
                    <script data-content='{ "initialScale": 2, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} }'></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 2},width=${minWidth}`
                    : documentClientWidth > maxWidth
                      ? `initial-scale=${(documentClientWidth / maxWidth) * 2},width=${maxWidth}`
                      : 'initial-scale=2,width=device-width'
                  : ''
              )
            })
          })

          test.describe('case where initial scale before running setContent is greater than 1', () => {
            test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property merged from current mediaSpecificParametersList variable and argument is applied to output initial-scale', async ({
              page,
              viewport
            }, { config: { projects } }) => {
              const minWidth =
                getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0
              const maxWidth =
                getViewportSize(projects, 'lg')?.use.viewport?.width ?? Infinity
              const documentClientWidth = viewport ? viewport.width : undefined
              await page.setContent(`
                <!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <title>Document</title>
                    <meta name="viewport" content="width=device-width,initial-scale=2" data-extra-unscaled-computing />
                    ${moduleFlag ? '' : `<script src="/${format}/viewport-extra${minified ? '.min' : ''}.js"></script>`}
                  </head>
                  <body>
                    ${usingDefaultExport ? `<script data-using-default-export></script>` : ''}
                    <script data-content='{ "initialScale": 0.5, "minWidth": ${minWidth}, "maxWidth": ${maxWidth} }'></script>
                    <script src="/assets/scripts/${format}/using_setContent.js" type="module"></script>
                  </body>
                </html>
              `)
              expect(await getViewportContentString(page)).toBe(
                documentClientWidth && minWidth > 0 && maxWidth < Infinity
                  ? documentClientWidth < minWidth
                    ? `initial-scale=${(documentClientWidth / minWidth) * 0.5},width=${minWidth}`
                    : documentClientWidth > maxWidth
                      ? `initial-scale=${(documentClientWidth / maxWidth) * 0.5},width=${maxWidth}`
                      : 'initial-scale=0.5,width=device-width'
                  : ''
              )
            })
          })
        })
      })
    })
  }
)
