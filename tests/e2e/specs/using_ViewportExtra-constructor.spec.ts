import { expect, test } from '@playwright/test'
import { getViewportContentString } from '../modules/PlaywrightPage.js'
import { getViewportSize } from '../modules/PlaywrightFullProjectList.js'

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/e2e/__fixtures__/src/dummy.html')
})
;[
  { format: 'es', moduleFlag: true, minified: false },
  { format: 'cjs', moduleFlag: true, minified: false },
  { format: 'iife', moduleFlag: false, minified: false },
  { format: 'iife', moduleFlag: false, minified: true }
].forEach(({ format, moduleFlag, minified }, formatIndex) => {
  test.describe(`using ${(minified ? 'minified ' : '') + format} output`, () => {
    test.describe('updating content attribute of viewport meta element', () => {
      test.describe('case where minimum width is provided as argument number', () => {
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
                <script data-using-number-argument data-min-width="${minWidth}"></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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

      test.describe('case where minWidth property is set in argument object', () => {
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
                <script data-min-width="${minWidth}"></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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

      test.describe('case where maxWidth property is set in argument object', () => {
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
                <script data-max-width="${maxWidth}"></script>
                <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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
    // Run in only one format because purpose is to check library behavior, not to verify bundled code
    test.describe('comparison with minimum and maximum width, and computation of output initial scale', () => {
      test.describe('case where unscaledComputing property in globalParameters object is false', () => {
        // When initial scale is 1 or less, document.documentElement.clientWidth is equal to viewport width
        test.describe('case where initial scale before running ViewportExtra constructor is 1 or less', () => {
          test('width of viewport is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
            page,
            viewport
          }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            const { config, project } = testInfo
            testInfo.skip(!['xs', 'xl'].includes(project.name))
            const { projects } = config
            const minWidth =
              (getViewportSize(projects, 'sm')?.use.viewport?.width ?? 0) / 0.5
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
                  <script data-initial-scale="2" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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
        test.describe('case where initial scale before running ViewportExtra constructor is greater than 1', () => {
          test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
            page,
            viewport
          }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            const { config, project } = testInfo
            testInfo.skip(!['xs', 'xl'].includes(project.name))
            const { projects } = config
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
                  <script data-initial-scale="0.5" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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
        test.describe('case where initial scale before running ViewportExtra constructor is 1 or less', () => {
          test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
            page,
            viewport
          }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            const { config, project } = testInfo
            testInfo.skip(!['xs', 'xl'].includes(project.name))
            const { projects } = config
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
                  <script data-initial-scale="2" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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

        test.describe('case where initial scale before running ViewportExtra constructor is greater than 1', () => {
          test('width of window without scroll bars when scale is 1 is used for comparison, and initialScale property in argument is applied to output initial scale', async ({
            page,
            viewport
          }, testInfo) => {
            testInfo.skip(formatIndex !== 0)
            const { config, project } = testInfo
            testInfo.skip(!['xs', 'xl'].includes(project.name))
            const { projects } = config
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
                  <script data-initial-scale="0.5" data-min-width="${minWidth}" data-max-width="${maxWidth}"></script>
                  <script src="/assets/scripts/${format}/using_ViewportExtra-constructor.js" type="module"></script>
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
})
